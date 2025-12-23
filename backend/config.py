"""
Centralized configuration for Axiom backend using Pydantic Settings.
"""
from pydantic_settings import BaseSettings
from pathlib import Path
from typing import Optional


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Application
    APP_NAME: str = "Axiom"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://*.vercel.app"]
    
    # Paths
    BASE_DIR: Path = Path(__file__).parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    UPLOAD_DIR: Path = DATA_DIR / "uploads"
    VECTOR_STORE_DIR: Path = DATA_DIR / "vector_store"
    ANALYTICS_DIR: Path = DATA_DIR / "analytics"
    
    # Model Configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    LLM_MODEL: str = "google/flan-t5-base"  # Local model
    USE_OPENAI: bool = False
    OPENAI_API_KEY: Optional[str] = None
    
    # Vector Store
    VECTOR_DIMENSION: int = 384  # For all-MiniLM-L6-v2
    TOP_K_RETRIEVAL: int = 5
    SIMILARITY_THRESHOLD: float = 0.7
    
    # Chunking
    CHUNK_SIZE: int = 512
    CHUNK_OVERLAP: int = 50
    
    # RAG Configuration
    MAX_CONTEXT_LENGTH: int = 2048
    TEMPERATURE: float = 0.1
    MAX_TOKENS: int = 512
    
    # Risk Classification
    CONFIDENCE_THRESHOLD: float = 0.6
    MIN_EVIDENCE_CHUNKS: int = 2
    
    # Analytics
    ENABLE_ANALYTICS: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Global settings instance
settings = Settings()

# Ensure directories exist
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.VECTOR_STORE_DIR.mkdir(parents=True, exist_ok=True)
settings.ANALYTICS_DIR.mkdir(parents=True, exist_ok=True)
