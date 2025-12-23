"""
Analytics and metrics tracking for Axiom.
Tracks question accuracy, evidence coverage, and risk categories.
"""
from typing import Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel
from collections import defaultdict
import numpy as np


class QuestionMetrics(BaseModel):
    """Metrics for a single question."""
    question_id: str
    question: str
    timestamp: str
    risk_category: str
    confidence_score: float
    evidence_coverage: float
    retrieved_chunks: int
    processing_time: Optional[float] = None


class SystemMetrics(BaseModel):
    """Aggregated system metrics."""
    total_questions: int
    avg_confidence: float
    avg_evidence_coverage: float
    risk_category_distribution: Dict[str, int]
    confidence_distribution: Dict[str, int]  # Binned
    questions_per_day: Dict[str, int]


class AnalyticsTracker:
    """Tracks analytics for the RAG system."""
    
    def __init__(self):
        """Initialize analytics tracker."""
        self.questions: List[QuestionMetrics] = []
        self.risk_categories = defaultdict(int)
        self.confidence_bins = defaultdict(int)
    
    def track_question(
        self,
        question_id: str,
        question: str,
        risk_category: str,
        confidence_score: float,
        evidence_coverage: float,
        retrieved_chunks: int,
        processing_time: Optional[float] = None
    ):
        """Track a question and its metrics."""
        metrics = QuestionMetrics(
            question_id=question_id,
            question=question,
            timestamp=datetime.now().isoformat(),
            risk_category=risk_category,
            confidence_score=confidence_score,
            evidence_coverage=evidence_coverage,
            retrieved_chunks=retrieved_chunks,
            processing_time=processing_time
        )
        
        self.questions.append(metrics)
        self.risk_categories[risk_category] += 1
        
        # Bin confidence score
        confidence_bin = self._get_confidence_bin(confidence_score)
        self.confidence_bins[confidence_bin] += 1
    
    def _get_confidence_bin(self, score: float) -> str:
        """Get confidence bin label."""
        if score >= 0.8:
            return "high (0.8-1.0)"
        elif score >= 0.6:
            return "medium (0.6-0.8)"
        elif score >= 0.4:
            return "low (0.4-0.6)"
        else:
            return "very low (0.0-0.4)"
    
    def get_system_metrics(self) -> SystemMetrics:
        """Get aggregated system metrics."""
        if not self.questions:
            return SystemMetrics(
                total_questions=0,
                avg_confidence=0.0,
                avg_evidence_coverage=0.0,
                risk_category_distribution={},
                confidence_distribution={},
                questions_per_day={}
            )
        
        # Calculate averages
        confidences = [q.confidence_score for q in self.questions]
        coverages = [q.evidence_coverage for q in self.questions]
        
        avg_confidence = np.mean(confidences)
        avg_coverage = np.mean(coverages)
        
        # Questions per day
        questions_per_day = defaultdict(int)
        for q in self.questions:
            date = q.timestamp.split('T')[0]
            questions_per_day[date] += 1
        
        return SystemMetrics(
            total_questions=len(self.questions),
            avg_confidence=float(avg_confidence),
            avg_evidence_coverage=float(avg_coverage),
            risk_category_distribution=dict(self.risk_categories),
            confidence_distribution=dict(self.confidence_bins),
            questions_per_day=dict(questions_per_day)
        )
    
    def get_recent_questions(self, limit: int = 10) -> List[QuestionMetrics]:
        """Get recent questions."""
        return self.questions[-limit:]
    
    def get_questions_by_category(self, category: str) -> List[QuestionMetrics]:
        """Get all questions for a specific risk category."""
        return [q for q in self.questions if q.risk_category == category]
    
    def get_confidence_vs_coverage_stats(self) -> Dict:
        """Analyze relationship between confidence and evidence coverage."""
        if not self.questions:
            return {
                "correlation": 0.0,
                "high_confidence_high_coverage": 0,
                "low_confidence_low_coverage": 0
            }
        
        confidences = [q.confidence_score for q in self.questions]
        coverages = [q.evidence_coverage for q in self.questions]
        
        # Calculate correlation
        correlation = np.corrcoef(confidences, coverages)[0, 1]
        
        # Count quadrants
        high_conf_high_cov = sum(
            1 for q in self.questions
            if q.confidence_score >= 0.7 and q.evidence_coverage >= 0.7
        )
        
        low_conf_low_cov = sum(
            1 for q in self.questions
            if q.confidence_score < 0.5 and q.evidence_coverage < 0.5
        )
        
        return {
            "correlation": float(correlation) if not np.isnan(correlation) else 0.0,
            "high_confidence_high_coverage": high_conf_high_cov,
            "low_confidence_low_coverage": low_conf_low_cov,
            "total_questions": len(self.questions)
        }


# Global analytics tracker
_analytics_tracker = None


def get_analytics_tracker() -> AnalyticsTracker:
    """Get or create the global analytics tracker instance."""
    global _analytics_tracker
    if _analytics_tracker is None:
        _analytics_tracker = AnalyticsTracker()
    return _analytics_tracker
