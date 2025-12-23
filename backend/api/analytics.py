"""
Analytics API endpoints.
"""
from fastapi import APIRouter, HTTPException

from analytics import get_analytics_tracker

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.get("/metrics")
async def get_system_metrics():
    """Get aggregated system metrics."""
    try:
        tracker = get_analytics_tracker()
        metrics = tracker.get_system_metrics()
        
        return {
            "status": "success",
            "metrics": metrics.model_dump()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/confidence-coverage")
async def get_confidence_coverage_stats():
    """Get confidence vs coverage correlation statistics."""
    try:
        tracker = get_analytics_tracker()
        stats = tracker.get_confidence_vs_coverage_stats()
        
        return {
            "status": "success",
            "stats": stats
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/risk-distribution")
async def get_risk_distribution():
    """Get distribution of questions by risk category."""
    try:
        tracker = get_analytics_tracker()
        metrics = tracker.get_system_metrics()
        
        return {
            "status": "success",
            "distribution": metrics.risk_category_distribution
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/confidence-distribution")
async def get_confidence_distribution():
    """Get distribution of confidence scores."""
    try:
        tracker = get_analytics_tracker()
        metrics = tracker.get_system_metrics()
        
        return {
            "status": "success",
            "distribution": metrics.confidence_distribution
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
