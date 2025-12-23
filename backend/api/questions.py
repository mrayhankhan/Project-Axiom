"""
Question answering API endpoints.
"""
from fastapi import APIRouter, HTTPException
from typing import Optional
import uuid

from rag import QuestionRequest, get_qa_engine
from analytics import get_analytics_tracker, get_analytics_storage

router = APIRouter(prefix="/api/questions", tags=["questions"])


@router.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Ask a governance question and get an evidence-based answer.
    
    Returns structured response with answer, citations, and confidence.
    """
    try:
        # Get QA engine
        qa_engine = get_qa_engine()
        
        # Answer question
        response = qa_engine.answer_question(
            question=request.question,
            filters=request.filters,
            top_k=request.top_k or 5
        )
        
        # Track analytics
        if response.response:
            tracker = get_analytics_tracker()
            question_id = str(uuid.uuid4())
            
            tracker.track_question(
                question_id=question_id,
                question=request.question,
                risk_category=response.response.risk_category.value,
                confidence_score=response.response.confidence_score,
                evidence_coverage=response.response.evidence_coverage or 0.0,
                retrieved_chunks=response.retrieved_chunks,
                processing_time=response.processing_time
            )
            
            # Save analytics
            storage = get_analytics_storage()
            storage.save(tracker)
        
        return {
            "status": "success",
            "question": response.question,
            "answer": response.response.answer,
            "risk_category": response.response.risk_category.value,
            "confidence_score": response.response.confidence_score,
            "citations": [c.model_dump() for c in response.response.citations],
            "limitations": response.response.limitations,
            "evidence_coverage": response.response.evidence_coverage,
            "retrieved_chunks": response.retrieved_chunks,
            "processing_time": response.processing_time
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_question_history(limit: int = 10):
    """Get recent question history."""
    try:
        tracker = get_analytics_tracker()
        recent = tracker.get_recent_questions(limit=limit)
        
        return {
            "status": "success",
            "total": len(recent),
            "questions": [q.model_dump() for q in recent]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/by-category/{category}")
async def get_questions_by_category(category: str):
    """Get all questions for a specific risk category."""
    try:
        tracker = get_analytics_tracker()
        questions = tracker.get_questions_by_category(category)
        
        return {
            "status": "success",
            "category": category,
            "total": len(questions),
            "questions": [q.model_dump() for q in questions]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
