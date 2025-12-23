"""
FAISS vector store for document retrieval.
Supports metadata filtering and persistence.
"""
from typing import List, Dict, Optional, Tuple
import json
import pickle
from pathlib import Path
import numpy as np
import faiss
from pydantic import BaseModel
from config import settings


class RetrievalResult(BaseModel):
    """Result from vector retrieval."""
    chunk_id: str
    text: str
    score: float
    metadata: Dict
    section_title: str


class VectorStore:
    """FAISS-based vector store with metadata support."""
    
    def __init__(self, dimension: int = None):
        """
        Initialize vector store.
        
        Args:
            dimension: Dimension of embedding vectors
        """
        self.dimension = dimension or settings.VECTOR_DIMENSION
        self.index = None
        self.chunks = []  # Store chunk data
        self.metadata = []  # Store metadata for each chunk
        self._initialize_index()
    
    def _initialize_index(self):
        """Initialize FAISS index."""
        # Use IndexFlatL2 for exact search (can upgrade to IndexIVFFlat for large scale)
        self.index = faiss.IndexFlatL2(self.dimension)
        print(f"Initialized FAISS index with dimension {self.dimension}")
    
    def add_documents(
        self,
        embeddings: List[List[float]],
        chunks: List[Dict],
        metadata: List[Dict]
    ):
        """
        Add documents to the vector store.
        
        Args:
            embeddings: List of embedding vectors
            chunks: List of chunk data (text, chunk_id, section_title)
            metadata: List of metadata dicts for each chunk
        """
        if not embeddings:
            return
        
        # Convert to numpy array
        embeddings_array = np.array(embeddings, dtype=np.float32)
        
        # Add to FAISS index
        self.index.add(embeddings_array)
        
        # Store chunks and metadata
        self.chunks.extend(chunks)
        self.metadata.extend(metadata)
        
        print(f"Added {len(embeddings)} documents to vector store. Total: {self.index.ntotal}")
    
    def search(
        self,
        query_embedding: List[float],
        top_k: int = None,
        filters: Optional[Dict] = None
    ) -> List[RetrievalResult]:
        """
        Search for similar documents.
        
        Args:
            query_embedding: Query embedding vector
            top_k: Number of results to return
            filters: Optional metadata filters (e.g., {"doc_type": "bias"})
            
        Returns:
            List of retrieval results
        """
        if self.index.ntotal == 0:
            return []
        
        top_k = top_k or settings.TOP_K_RETRIEVAL
        
        # Convert query to numpy array
        query_array = np.array([query_embedding], dtype=np.float32)
        
        # Search in FAISS
        # Get more results if filtering is needed
        search_k = top_k * 3 if filters else top_k
        distances, indices = self.index.search(query_array, min(search_k, self.index.ntotal))
        
        # Convert to results
        results = []
        for dist, idx in zip(distances[0], indices[0]):
            if idx == -1:  # FAISS returns -1 for empty slots
                continue
            
            chunk = self.chunks[idx]
            meta = self.metadata[idx]
            
            # Apply filters if provided
            if filters:
                if not self._matches_filters(meta, filters):
                    continue
            
            # Convert L2 distance to similarity score (inverse)
            # Normalize to 0-1 range
            score = 1.0 / (1.0 + dist)
            
            result = RetrievalResult(
                chunk_id=chunk["chunk_id"],
                text=chunk["text"],
                score=float(score),
                metadata=meta,
                section_title=chunk["section_title"]
            )
            results.append(result)
            
            # Stop if we have enough results after filtering
            if len(results) >= top_k:
                break
        
        return results
    
    def _matches_filters(self, metadata: Dict, filters: Dict) -> bool:
        """Check if metadata matches all filters."""
        for key, value in filters.items():
            if key not in metadata or metadata[key] != value:
                return False
        return True
    
    def save(self, path: Path = None):
        """Save vector store to disk."""
        path = path or settings.VECTOR_STORE_DIR / "vector_store.pkl"
        path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save FAISS index
        index_path = path.parent / "faiss.index"
        faiss.write_index(self.index, str(index_path))
        
        # Save chunks and metadata
        data = {
            "chunks": self.chunks,
            "metadata": self.metadata,
            "dimension": self.dimension
        }
        
        with open(path, 'wb') as f:
            pickle.dump(data, f)
        
        print(f"Saved vector store to {path}")
    
    def load(self, path: Path = None) -> bool:
        """
        Load vector store from disk.
        
        Returns:
            True if loaded successfully, False otherwise
        """
        path = path or settings.VECTOR_STORE_DIR / "vector_store.pkl"
        index_path = path.parent / "faiss.index"
        
        if not path.exists() or not index_path.exists():
            print("No saved vector store found")
            return False
        
        # Load FAISS index
        self.index = faiss.read_index(str(index_path))
        
        # Load chunks and metadata
        with open(path, 'rb') as f:
            data = pickle.load(f)
        
        self.chunks = data["chunks"]
        self.metadata = data["metadata"]
        self.dimension = data["dimension"]
        
        print(f"Loaded vector store with {self.index.ntotal} documents")
        return True
    
    def get_stats(self) -> Dict:
        """Get statistics about the vector store."""
        doc_types = {}
        for meta in self.metadata:
            doc_type = meta.get("doc_type", "unknown")
            doc_types[doc_type] = doc_types.get(doc_type, 0) + 1
        
        return {
            "total_chunks": self.index.ntotal,
            "dimension": self.dimension,
            "doc_types": doc_types
        }


# Global vector store instance
_vector_store = None


def get_vector_store() -> VectorStore:
    """Get or create the global vector store instance."""
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStore()
        _vector_store.load()  # Try to load existing store
    return _vector_store
