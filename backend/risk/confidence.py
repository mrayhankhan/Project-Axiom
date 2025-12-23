"""
Confidence calibration and uncertainty detection.
Provides calibrated confidence scores for RAG responses.
"""
from typing import List
import numpy as np
from config import settings


class ConfidenceCalibrator:
    """Calibrates confidence scores for RAG responses."""
    
    def __init__(self):
        """Initialize confidence calibrator."""
        pass
    
    def calculate_confidence(
        self,
        question: str,
        answer: str,
        retrieved_chunks: List,
        risk_category: str
    ) -> float:
        """
        Calculate calibrated confidence score.
        
        Args:
            question: User question
            answer: Generated answer
            retrieved_chunks: Retrieved evidence chunks
            risk_category: Classified risk category
            
        Returns:
            Confidence score between 0.0 and 1.0
        """
        # Multiple factors contribute to confidence
        
        # 1. Retrieval quality score
        retrieval_score = self._calculate_retrieval_score(retrieved_chunks)
        
        # 2. Evidence coverage score
        coverage_score = self._calculate_coverage_score(
            question,
            retrieved_chunks
        )
        
        # 3. Answer quality score
        answer_score = self._calculate_answer_score(answer)
        
        # 4. Consistency score
        consistency_score = self._calculate_consistency_score(
            retrieved_chunks,
            answer
        )
        
        # Weighted combination
        confidence = (
            0.3 * retrieval_score +
            0.3 * coverage_score +
            0.2 * answer_score +
            0.2 * consistency_score
        )
        
        # Apply uncertainty penalty if needed
        uncertainty_penalty = self._detect_uncertainty(answer)
        confidence = confidence * (1.0 - uncertainty_penalty)
        
        # Ensure in valid range
        confidence = max(0.0, min(1.0, confidence))
        
        return confidence
    
    def _calculate_retrieval_score(self, chunks: List) -> float:
        """Calculate score based on retrieval quality."""
        if not chunks:
            return 0.0
        
        # Average of reranked scores
        scores = [chunk.reranked_score for chunk in chunks]
        avg_score = np.mean(scores)
        
        # Penalize if we have very few chunks
        chunk_penalty = min(1.0, len(chunks) / settings.MIN_EVIDENCE_CHUNKS)
        
        return avg_score * chunk_penalty
    
    def _calculate_coverage_score(
        self,
        question: str,
        chunks: List
    ) -> float:
        """Calculate how well chunks cover the question."""
        if not chunks:
            return 0.0
        
        question_terms = set(question.lower().split())
        
        # Check how many question terms appear in retrieved chunks
        covered_terms = set()
        for chunk in chunks:
            chunk_text = chunk.text.lower()
            for term in question_terms:
                if term in chunk_text:
                    covered_terms.add(term)
        
        # Calculate coverage ratio
        coverage = len(covered_terms) / len(question_terms) if question_terms else 0.0
        
        return coverage
    
    def _calculate_answer_score(self, answer: str) -> float:
        """Calculate score based on answer quality indicators."""
        score = 0.5  # Base score
        
        # Positive indicators
        if len(answer) > 50:  # Substantial answer
            score += 0.2
        
        if any(word in answer.lower() for word in ["evidence", "based on", "according to"]):
            score += 0.15
        
        # Negative indicators
        if "insufficient evidence" in answer.lower():
            score -= 0.4
        
        if "don't know" in answer.lower() or "cannot answer" in answer.lower():
            score -= 0.3
        
        return max(0.0, min(1.0, score))
    
    def _calculate_consistency_score(
        self,
        chunks: List,
        answer: str
    ) -> float:
        """Calculate consistency between answer and evidence."""
        if not chunks:
            return 0.0
        
        # Simple heuristic: check if answer contains terms from evidence
        answer_lower = answer.lower()
        
        # Extract key terms from chunks (excluding common words)
        common_words = {"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for"}
        chunk_terms = set()
        
        for chunk in chunks:
            terms = chunk.text.lower().split()
            chunk_terms.update(t for t in terms if t not in common_words and len(t) > 3)
        
        # Count how many chunk terms appear in answer
        matching_terms = sum(1 for term in chunk_terms if term in answer_lower)
        
        # Normalize
        consistency = min(1.0, matching_terms / max(1, len(chunk_terms) * 0.3))
        
        return consistency
    
    def _detect_uncertainty(self, answer: str) -> float:
        """
        Detect uncertainty indicators in the answer.
        
        Returns:
            Penalty factor between 0.0 and 0.5
        """
        answer_lower = answer.lower()
        
        # Uncertainty indicators
        uncertainty_phrases = [
            "may", "might", "could", "possibly", "perhaps",
            "unclear", "uncertain", "not sure", "appears to",
            "seems to", "likely", "probably"
        ]
        
        count = sum(1 for phrase in uncertainty_phrases if phrase in answer_lower)
        
        # Penalty increases with number of uncertainty indicators
        penalty = min(0.5, count * 0.1)
        
        return penalty
    
    def calibrate_batch(
        self,
        predictions: List[dict],
        ground_truth: List[bool] = None
    ) -> List[float]:
        """
        Calibrate confidence scores for a batch of predictions.
        Useful for offline evaluation and calibration.
        
        Args:
            predictions: List of prediction dicts with confidence scores
            ground_truth: Optional list of correctness labels
            
        Returns:
            Calibrated confidence scores
        """
        if not ground_truth:
            # Without ground truth, just return original scores
            return [p.get("confidence", 0.5) for p in predictions]
        
        # Simple calibration: adjust based on accuracy
        # In production, use more sophisticated methods like Platt scaling
        
        scores = [p.get("confidence", 0.5) for p in predictions]
        accuracy = sum(ground_truth) / len(ground_truth)
        
        # Adjust scores to match accuracy
        calibrated = [s * accuracy / np.mean(scores) if np.mean(scores) > 0 else s 
                     for s in scores]
        
        return [max(0.0, min(1.0, s)) for s in calibrated]


# Global calibrator instance
_confidence_calibrator = None


def get_confidence_calibrator() -> ConfidenceCalibrator:
    """Get or create the global confidence calibrator instance."""
    global _confidence_calibrator
    if _confidence_calibrator is None:
        _confidence_calibrator = ConfidenceCalibrator()
    return _confidence_calibrator
