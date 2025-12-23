"""
RAG Question Answering Engine.
Implements evidence-grounded QA with confidence scoring and citations.
"""
from typing import List, Optional
import re
import time
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM
from config import settings
from ingestion.embeddings import get_embedding_generator
from retrieval.vector_store import get_vector_store
from retrieval.reranker import get_reranker
from rag.prompts import (
    SYSTEM_PROMPT,
    format_context,
    format_qa_prompt,
    format_refusal
)
from rag.response_schemas import (
    RAGResponse,
    Citation,
    RiskCategory,
    QuestionRequest,
    QuestionResponse
)
from risk.classifier import get_risk_classifier
from risk.confidence import get_confidence_calibrator


class QAEngine:
    """Question answering engine with RAG."""
    
    def __init__(self):
        """Initialize QA engine."""
        self.embedding_gen = get_embedding_generator()
        self.vector_store = get_vector_store()
        self.reranker = get_reranker()
        self.risk_classifier = get_risk_classifier()
        self.confidence_calibrator = get_confidence_calibrator()
        self.llm = None
        self.tokenizer = None
        self._load_llm()
    
    def _load_llm(self):
        """Load language model for generation."""
        if settings.USE_OPENAI:
            # OpenAI integration would go here
            print("OpenAI integration not implemented in this version")
            print("Falling back to local model")
        
        print(f"Loading LLM: {settings.LLM_MODEL}")
        self.tokenizer = AutoTokenizer.from_pretrained(settings.LLM_MODEL)
        model = AutoModelForSeq2SeqLM.from_pretrained(settings.LLM_MODEL)
        
        self.llm = pipeline(
            "text2text-generation",
            model=model,
            tokenizer=self.tokenizer,
            max_length=settings.MAX_TOKENS,
            temperature=settings.TEMPERATURE,
            do_sample=False
        )
        print("LLM loaded successfully")
    
    def answer_question(
        self,
        question: str,
        filters: Optional[dict] = None,
        top_k: int = 5
    ) -> QuestionResponse:
        """
        Answer a question using RAG.
        
        Args:
            question: Question to answer
            filters: Optional metadata filters for retrieval
            top_k: Number of chunks to retrieve
            
        Returns:
            Structured response with answer and metadata
        """
        start_time = time.time()
        
        # Step 1: Generate query embedding
        query_embedding = self.embedding_gen.generate_embedding(question)
        
        # Step 2: Retrieve relevant chunks
        retrieval_results = self.vector_store.search(
            query_embedding,
            top_k=top_k * 2,  # Get more for reranking
            filters=filters
        )
        
        # Step 3: Rerank results
        reranked_results = self.reranker.rerank(
            question,
            retrieval_results,
            top_k=top_k
        )
        
        # Step 4: Check if we have sufficient evidence
        if not reranked_results or len(reranked_results) < settings.MIN_EVIDENCE_CHUNKS:
            # Insufficient evidence - return refusal
            return self._create_refusal_response(question, reranked_results)
        
        # Step 5: Format context from retrieved chunks
        context = self._format_retrieved_context(reranked_results)
        
        # Step 6: Generate answer
        prompt = format_qa_prompt(question, context)
        answer = self._generate_answer(prompt)
        
        # Step 7: Classify risk category
        risk_category = self.risk_classifier.classify(question, answer, reranked_results)
        
        # Step 8: Calculate confidence score
        confidence = self.confidence_calibrator.calculate_confidence(
            question=question,
            answer=answer,
            retrieved_chunks=reranked_results,
            risk_category=risk_category
        )
        
        # Step 9: Extract citations
        citations = self._extract_citations(reranked_results)
        
        # Step 10: Extract limitations
        limitations = self._extract_limitations(answer)
        
        # Step 11: Calculate evidence coverage
        evidence_coverage = self._calculate_evidence_coverage(
            question,
            reranked_results
        )
        
        # Create response
        rag_response = RAGResponse(
            answer=answer,
            risk_category=risk_category,
            confidence_score=confidence,
            citations=citations,
            limitations=limitations,
            evidence_coverage=evidence_coverage
        )
        
        processing_time = time.time() - start_time
        
        return QuestionResponse(
            question=question,
            response=rag_response,
            retrieved_chunks=len(reranked_results),
            processing_time=processing_time
        )
    
    def _format_retrieved_context(self, results: List) -> str:
        """Format retrieved chunks into context string."""
        chunks = []
        for result in results:
            chunk = {
                "text": result.text,
                "section_title": result.section_title,
                "metadata": result.metadata
            }
            chunks.append(chunk)
        return format_context(chunks)
    
    def _generate_answer(self, prompt: str) -> str:
        """Generate answer using LLM."""
        # Truncate prompt if too long
        max_input_length = settings.MAX_CONTEXT_LENGTH
        if len(prompt) > max_input_length:
            prompt = prompt[:max_input_length]
        
        # Generate
        result = self.llm(prompt, max_length=settings.MAX_TOKENS)[0]
        answer = result["generated_text"].strip()
        
        return answer
    
    def _extract_citations(self, results: List) -> List[Citation]:
        """Extract citations from retrieval results."""
        citations = []
        seen = set()
        
        for result in results:
            filename = result.metadata.get("filename", "Unknown")
            section = result.section_title
            key = f"{filename}:{section}"
            
            # Avoid duplicate citations
            if key not in seen:
                citation = Citation(
                    document=filename,
                    section=section,
                    chunk_id=result.chunk_id,
                    relevance_score=result.reranked_score
                )
                citations.append(citation)
                seen.add(key)
        
        return citations
    
    def _extract_limitations(self, answer: str) -> Optional[str]:
        """Extract limitations mentioned in the answer."""
        # Look for limitation indicators
        limitation_patterns = [
            r"Limitations?:\s*(.+?)(?:\n\n|\Z)",
            r"(?:However|Note that|It should be noted)\s+(.+?)(?:\.|$)"
        ]
        
        for pattern in limitation_patterns:
            match = re.search(pattern, answer, re.IGNORECASE | re.DOTALL)
            if match:
                return match.group(1).strip()
        
        return None
    
    def _calculate_evidence_coverage(
        self,
        question: str,
        results: List
    ) -> float:
        """Calculate how well the evidence covers the question."""
        if not results:
            return 0.0
        
        # Simple heuristic: average of top result scores
        avg_score = sum(r.reranked_score for r in results) / len(results)
        
        # Normalize to 0-1 range
        coverage = min(1.0, avg_score)
        
        return coverage
    
    def _create_refusal_response(
        self,
        question: str,
        results: List
    ) -> QuestionResponse:
        """Create a refusal response when evidence is insufficient."""
        missing_info = [
            "Relevant governance documentation",
            "Model risk assessments",
            "Validation reports"
        ]
        
        refusal_text = format_refusal(question, missing_info)
        
        rag_response = RAGResponse(
            answer=refusal_text,
            risk_category=RiskCategory.UNKNOWN,
            confidence_score=0.0,
            citations=[],
            limitations="Insufficient evidence in knowledge base",
            evidence_coverage=0.0
        )
        
        return QuestionResponse(
            question=question,
            response=rag_response,
            retrieved_chunks=len(results)
        )


# Global QA engine instance
_qa_engine = None


def get_qa_engine() -> QAEngine:
    """Get or create the global QA engine instance."""
    global _qa_engine
    if _qa_engine is None:
        _qa_engine = QAEngine()
    return _qa_engine
