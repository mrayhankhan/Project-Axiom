"""
Storage for analytics data.
Simple JSON-based storage (can be upgraded to PostgreSQL).
"""
import json
from pathlib import Path
from typing import List
from config import settings
from analytics.metrics import QuestionMetrics, AnalyticsTracker


class AnalyticsStorage:
    """Persists analytics data to disk."""
    
    def __init__(self, storage_path: Path = None):
        """Initialize storage."""
        self.storage_path = storage_path or settings.ANALYTICS_DIR / "analytics.json"
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
    
    def save(self, tracker: AnalyticsTracker):
        """Save analytics data."""
        data = {
            "questions": [q.model_dump() for q in tracker.questions],
            "risk_categories": dict(tracker.risk_categories),
            "confidence_bins": dict(tracker.confidence_bins)
        }
        
        with open(self.storage_path, 'w') as f:
            json.dump(data, f, indent=2)
    
    def load(self, tracker: AnalyticsTracker):
        """Load analytics data."""
        if not self.storage_path.exists():
            return
        
        with open(self.storage_path, 'r') as f:
            data = json.load(f)
        
        # Restore questions
        tracker.questions = [
            QuestionMetrics(**q) for q in data.get("questions", [])
        ]
        
        # Restore counters
        tracker.risk_categories.update(data.get("risk_categories", {}))
        tracker.confidence_bins.update(data.get("confidence_bins", {}))


# Global storage instance
_analytics_storage = None


def get_analytics_storage() -> AnalyticsStorage:
    """Get or create the global analytics storage instance."""
    global _analytics_storage
    if _analytics_storage is None:
        _analytics_storage = AnalyticsStorage()
    return _analytics_storage
