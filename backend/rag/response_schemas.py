"""
Pydantic schemas for structured RAG responses.
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from enum import Enum


class RiskCategory(str, Enum):
    """Risk categories for ML governance."""
    BIAS = "bias"
    EXPLAINABILITY = "explainability"
    DATA = "data"
    DEPLOYMENT = "deployment"
    COMPLIANCE = "compliance"
    UNKNOWN = "unknown"


class Citation(BaseModel):
    """Citation for evidence source."""
    document: str = Field(description="Source document filename")
    section: str = Field(description="Section title within document")
    chunk_id: Optional[str] = Field(default=None, description="Chunk identifier")
    relevance_score: Optional[float] = Field(default=None, description="Relevance score")


class RAGResponse(BaseModel):
    """Structured response from RAG system."""
    answer: str = Field(description="Answer to the question based on evidence")
    risk_category: RiskCategory = Field(description="Primary risk category")
    confidence_score: float = Field(
        ge=0.0,
        le=1.0,
        description="Confidence score from 0.0 to 1.0"
    )
    citations: List[Citation] = Field(
        description="Evidence citations supporting the answer"
    )
    limitations: Optional[str] = Field(
        default=None,
        description="Limitations or uncertainties in the answer"
    )
    evidence_coverage: Optional[float] = Field(
        default=None,
        description="How well the evidence covers the question"
    )


class QuestionRequest(BaseModel):
    """Request schema for asking questions."""
    question: str = Field(description="Question about ML governance")
    filters: Optional[dict] = Field(
        default=None,
        description="Optional metadata filters for retrieval"
    )
    top_k: Optional[int] = Field(
        default=5,
        description="Number of chunks to retrieve"
    )


class QuestionResponse(BaseModel):
    """Response schema for question answering."""
    question: str
    response: RAGResponse
    retrieved_chunks: int
    processing_time: Optional[float] = None
