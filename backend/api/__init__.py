"""Init file for API module."""
from .documents import router as documents_router
from .questions import router as questions_router
from .analytics import router as analytics_router

__all__ = [
    "documents_router",
    "questions_router",
    "analytics_router"
]
