"""
Axiom Backend - FastAPI Application
Enterprise Model Risk & Explainability Intelligence Platform
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import settings
from api import documents_router, questions_router, analytics_router
from analytics import get_analytics_tracker, get_analytics_storage


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle management for the application."""
    # Startup
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Load analytics data
    tracker = get_analytics_tracker()
    storage = get_analytics_storage()
    storage.load(tracker)
    print("Analytics data loaded")
    
    yield
    
    # Shutdown
    print("Shutting down...")
    storage.save(tracker)
    print("Analytics data saved")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise Model Risk & Explainability Intelligence Platform",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(documents_router)
app.include_router(questions_router)
app.include_router(analytics_router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": "Enterprise Model Risk & Explainability Intelligence Platform",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    from retrieval import get_vector_store
    
    vector_store = get_vector_store()
    stats = vector_store.get_stats()
    
    return {
        "status": "healthy",
        "vector_store": {
            "total_chunks": stats["total_chunks"],
            "doc_types": stats["doc_types"]
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=settings.DEBUG
    )
