"""
Document management API endpoints.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
from typing import List
import uuid
import shutil

from config import settings
from ingestion import (
    DocumentProcessor,
    SemanticChunker,
    get_embedding_generator
)
from retrieval import get_vector_store

router = APIRouter(prefix="/api/documents", tags=["documents"])

# Initialize components
doc_processor = DocumentProcessor()
chunker = SemanticChunker(
    chunk_size=settings.CHUNK_SIZE,
    overlap=settings.CHUNK_OVERLAP
)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and process a governance document.
    
    Returns document metadata and processing status.
    """
    try:
        # Validate file type
        allowed_extensions = {".pdf", ".docx", ".md", ".txt"}
        file_ext = Path(file.filename).suffix.lower()
        
        if file_ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed: {allowed_extensions}"
            )
        
        # Save uploaded file
        file_id = str(uuid.uuid4())
        file_path = settings.UPLOAD_DIR / f"{file_id}_{file.filename}"
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process document
        processed_doc = doc_processor.process_file(file_path)
        
        # Chunk document
        chunks = chunker.chunk_with_context(
            processed_doc.sections,
            processed_doc.metadata.model_dump()
        )
        
        # Generate embeddings
        embedding_gen = get_embedding_generator()
        texts = [chunk.text for chunk in chunks]
        embeddings = embedding_gen.generate_embeddings(texts)
        
        # Store in vector database
        vector_store = get_vector_store()
        chunk_data = [
            {
                "chunk_id": chunk.chunk_id,
                "text": chunk.text,
                "section_title": chunk.section_title
            }
            for chunk in chunks
        ]
        metadata_list = [chunk.metadata for chunk in chunks]
        
        vector_store.add_documents(embeddings, chunk_data, metadata_list)
        vector_store.save()
        
        return {
            "status": "success",
            "file_id": file_id,
            "filename": file.filename,
            "metadata": processed_doc.metadata.model_dump(),
            "chunks_created": len(chunks),
            "message": "Document processed and indexed successfully"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
async def list_documents():
    """List all uploaded documents."""
    try:
        documents = []
        
        for file_path in settings.UPLOAD_DIR.glob("*"):
            if file_path.is_file():
                # Extract file_id and original filename
                parts = file_path.name.split("_", 1)
                if len(parts) == 2:
                    file_id, filename = parts
                else:
                    file_id = "unknown"
                    filename = file_path.name
                
                documents.append({
                    "file_id": file_id,
                    "filename": filename,
                    "size": file_path.stat().st_size,
                    "uploaded_at": file_path.stat().st_mtime
                })
        
        # Sort by upload time (newest first)
        documents.sort(key=lambda x: x["uploaded_at"], reverse=True)
        
        return {
            "total": len(documents),
            "documents": documents
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_document_stats():
    """Get statistics about indexed documents."""
    try:
        vector_store = get_vector_store()
        stats = vector_store.get_stats()
        
        return {
            "status": "success",
            "stats": stats
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{file_id}")
async def delete_document(file_id: str):
    """Delete a document (note: doesn't remove from vector store)."""
    try:
        # Find and delete file
        deleted = False
        for file_path in settings.UPLOAD_DIR.glob(f"{file_id}_*"):
            file_path.unlink()
            deleted = True
        
        if not deleted:
            raise HTTPException(status_code=404, detail="Document not found")
        
        return {
            "status": "success",
            "message": "Document deleted",
            "note": "Vector embeddings remain in index"
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
