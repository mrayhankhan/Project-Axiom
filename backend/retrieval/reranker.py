"""
Reranking module for improving retrieval relevance.
Uses semantic similarity and diversity-aware scoring.
"""
from typing import List
from pydantic import BaseModel
from retrieval.vector_store import RetrievalResult


class RerankedResult(BaseModel):
    """Reranked retrieval result with explanation."""
    chunk_id: str
    text: str
    original_score: float
    reranked_score: float
    metadata: dict
    section_title: str
    rank_explanation: str


class Reranker:
    """Reranks retrieval results for improved relevance."""
    
    def __init__(self):
        pass
    
    def rerank(
        self,
        query: str,
        results: List[RetrievalResult],
        top_k: int = 5
    ) -> List[RerankedResult]:
        """
        Rerank retrieval results.
        
        Args:
            query: Original query text
            results: Initial retrieval results
            top_k: Number of results to return
            
        Returns:
            Reranked results with explanations
        """
        if not results:
            return []
        
        reranked = []
        query_lower = query.lower()
        
        for result in results:
            # Calculate reranking score based on multiple factors
            score = result.score
            
            # Boost score if query terms appear in text
            query_terms = set(query_lower.split())
            text_lower = result.text.lower()
            matching_terms = sum(1 for term in query_terms if term in text_lower)
            term_boost = matching_terms / len(query_terms) if query_terms else 0
            
            # Boost score based on section relevance
            section_boost = 0.0
            section_lower = result.section_title.lower()
            if any(term in section_lower for term in query_terms):
                section_boost = 0.1
            
            # Calculate final reranked score
            reranked_score = score * (1.0 + term_boost * 0.2 + section_boost)
            
            # Generate explanation
            explanation = self._generate_explanation(
                result,
                term_boost,
                section_boost
            )
            
            reranked_result = RerankedResult(
                chunk_id=result.chunk_id,
                text=result.text,
                original_score=result.score,
                reranked_score=reranked_score,
                metadata=result.metadata,
                section_title=result.section_title,
                rank_explanation=explanation
            )
            reranked.append(reranked_result)
        
        # Sort by reranked score
        reranked.sort(key=lambda x: x.reranked_score, reverse=True)
        
        # Apply diversity filter to avoid too many chunks from same document
        diverse_results = self._apply_diversity(reranked, top_k)
        
        return diverse_results[:top_k]
    
    def _generate_explanation(
        self,
        result: RetrievalResult,
        term_boost: float,
        section_boost: float
    ) -> str:
        """Generate explanation for ranking decision."""
        reasons = []
        
        if result.score > 0.8:
            reasons.append("high semantic similarity")
        elif result.score > 0.6:
            reasons.append("moderate semantic similarity")
        
        if term_boost > 0.5:
            reasons.append("strong query term match")
        elif term_boost > 0:
            reasons.append("partial query term match")
        
        if section_boost > 0:
            reasons.append("relevant section title")
        
        if result.metadata.get("doc_type"):
            reasons.append(f"{result.metadata['doc_type']} document")
        
        return "; ".join(reasons) if reasons else "retrieved by vector similarity"
    
    def _apply_diversity(
        self,
        results: List[RerankedResult],
        top_k: int
    ) -> List[RerankedResult]:
        """
        Apply diversity filter to avoid too many chunks from same document.
        Ensures variety in retrieved documents.
        """
        diverse = []
        doc_counts = {}
        max_per_doc = max(2, top_k // 3)  # At most 1/3 from same document
        
        for result in results:
            filename = result.metadata.get("filename", "unknown")
            count = doc_counts.get(filename, 0)
            
            # Add if under limit or if we don't have enough results yet
            if count < max_per_doc or len(diverse) < top_k:
                diverse.append(result)
                doc_counts[filename] = count + 1
        
        return diverse


# Global reranker instance
_reranker = None


def get_reranker() -> Reranker:
    """Get or create the global reranker instance."""
    global _reranker
    if _reranker is None:
        _reranker = Reranker()
    return _reranker
