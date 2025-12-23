"""
Risk classification module.
Hybrid approach using rule-based and embedding-based classification.
"""
from typing import List
from rag.response_schemas import RiskCategory
from ingestion.embeddings import get_embedding_generator
import numpy as np


class RiskClassifier:
    """Classifies questions and answers into risk categories."""
    
    # Keywords for rule-based classification
    CATEGORY_KEYWORDS = {
        RiskCategory.BIAS: [
            "bias", "fairness", "discrimination", "disparity", "equity",
            "protected", "demographic", "parity", "disparate impact"
        ],
        RiskCategory.EXPLAINABILITY: [
            "explainability", "interpretability", "shap", "lime",
            "feature importance", "explain", "transparency", "black box"
        ],
        RiskCategory.DATA: [
            "data quality", "data drift", "distribution", "missing data",
            "outlier", "data validation", "feature", "dataset"
        ],
        RiskCategory.DEPLOYMENT: [
            "deployment", "production", "latency", "throughput", "scaling",
            "infrastructure", "monitoring", "performance", "assumption"
        ],
        RiskCategory.COMPLIANCE: [
            "compliance", "regulation", "gdpr", "privacy", "audit",
            "governance", "policy", "legal", "requirement"
        ]
    }
    
    def __init__(self):
        """Initialize risk classifier."""
        self.embedding_gen = get_embedding_generator()
        self._prepare_category_embeddings()
    
    def _prepare_category_embeddings(self):
        """Prepare embeddings for each risk category."""
        self.category_embeddings = {}
        
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            # Create a representative text for each category
            category_text = " ".join(keywords)
            embedding = self.embedding_gen.generate_embedding(category_text)
            self.category_embeddings[category] = embedding
    
    def classify(
        self,
        question: str,
        answer: str,
        retrieved_chunks: List = None
    ) -> RiskCategory:
        """
        Classify the risk category using hybrid approach.
        
        Args:
            question: User question
            answer: Generated answer
            retrieved_chunks: Retrieved evidence chunks
            
        Returns:
            Risk category
        """
        # Combine question and answer for classification
        combined_text = f"{question} {answer}".lower()
        
        # Rule-based classification
        rule_scores = self._rule_based_classification(combined_text)
        
        # Embedding-based classification
        embedding_scores = self._embedding_based_classification(combined_text)
        
        # Combine scores (weighted average)
        combined_scores = {}
        for category in RiskCategory:
            if category == RiskCategory.UNKNOWN:
                continue
            
            rule_score = rule_scores.get(category, 0.0)
            emb_score = embedding_scores.get(category, 0.0)
            
            # Weight: 60% rule-based, 40% embedding-based
            combined_scores[category] = 0.6 * rule_score + 0.4 * emb_score
        
        # Return category with highest score
        if combined_scores and max(combined_scores.values()) > 0.1:
            return max(combined_scores, key=combined_scores.get)
        
        return RiskCategory.UNKNOWN
    
    def _rule_based_classification(self, text: str) -> dict:
        """Rule-based classification using keyword matching."""
        scores = {}
        
        for category, keywords in self.CATEGORY_KEYWORDS.items():
            # Count keyword occurrences
            count = sum(1 for keyword in keywords if keyword in text)
            
            # Normalize by number of keywords
            score = count / len(keywords) if keywords else 0.0
            scores[category] = score
        
        # Normalize scores to sum to 1
        total = sum(scores.values())
        if total > 0:
            scores = {k: v / total for k, v in scores.items()}
        
        return scores
    
    def _embedding_based_classification(self, text: str) -> dict:
        """Embedding-based classification using semantic similarity."""
        # Generate embedding for input text
        text_embedding = self.embedding_gen.generate_embedding(text)
        
        scores = {}
        
        for category, category_embedding in self.category_embeddings.items():
            # Calculate cosine similarity
            similarity = self._cosine_similarity(text_embedding, category_embedding)
            scores[category] = max(0.0, similarity)  # Ensure non-negative
        
        # Normalize scores
        total = sum(scores.values())
        if total > 0:
            scores = {k: v / total for k, v in scores.items()}
        
        return scores
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    def classify_multi_label(
        self,
        question: str,
        answer: str,
        threshold: float = 0.2
    ) -> List[RiskCategory]:
        """
        Multi-label classification - return all categories above threshold.
        
        Args:
            question: User question
            answer: Generated answer
            threshold: Minimum score threshold
            
        Returns:
            List of risk categories
        """
        combined_text = f"{question} {answer}".lower()
        
        rule_scores = self._rule_based_classification(combined_text)
        embedding_scores = self._embedding_based_classification(combined_text)
        
        combined_scores = {}
        for category in RiskCategory:
            if category == RiskCategory.UNKNOWN:
                continue
            
            rule_score = rule_scores.get(category, 0.0)
            emb_score = embedding_scores.get(category, 0.0)
            combined_scores[category] = 0.6 * rule_score + 0.4 * emb_score
        
        # Return all categories above threshold
        categories = [
            cat for cat, score in combined_scores.items()
            if score >= threshold
        ]
        
        return categories if categories else [RiskCategory.UNKNOWN]


# Global classifier instance
_risk_classifier = None


def get_risk_classifier() -> RiskClassifier:
    """Get or create the global risk classifier instance."""
    global _risk_classifier
    if _risk_classifier is None:
        _risk_classifier = RiskClassifier()
    return _risk_classifier
