"""
Semantic chunking strategies for document processing.
Implements section-aware chunking with overlap for context preservation.
"""
from typing import List, Dict
from pydantic import BaseModel


class Chunk(BaseModel):
    """A chunk of text with metadata."""
    text: str
    chunk_id: str
    section_title: str
    start_char: int
    end_char: int
    metadata: Dict


class SemanticChunker:
    """Creates semantically meaningful chunks from documents."""
    
    def __init__(self, chunk_size: int = 512, overlap: int = 50):
        """
        Initialize chunker.
        
        Args:
            chunk_size: Target size for each chunk in characters
            overlap: Number of characters to overlap between chunks
        """
        self.chunk_size = chunk_size
        self.overlap = overlap
    
    def chunk_document(
        self,
        sections: List[Dict[str, str]],
        metadata: Dict
    ) -> List[Chunk]:
        """
        Chunk a document by sections with overlap.
        
        Args:
            sections: List of sections with title and content
            metadata: Document metadata to attach to chunks
            
        Returns:
            List of chunks with metadata
        """
        chunks = []
        chunk_counter = 0
        
        for section in sections:
            section_title = section["title"]
            section_content = section["content"]
            
            # Skip empty sections
            if not section_content.strip():
                continue
            
            # If section is smaller than chunk size, keep it as one chunk
            if len(section_content) <= self.chunk_size:
                chunk = Chunk(
                    text=section_content,
                    chunk_id=f"{metadata.get('filename', 'doc')}_{chunk_counter}",
                    section_title=section_title,
                    start_char=0,
                    end_char=len(section_content),
                    metadata=metadata
                )
                chunks.append(chunk)
                chunk_counter += 1
            else:
                # Split section into overlapping chunks
                section_chunks = self._split_with_overlap(
                    section_content,
                    section_title,
                    metadata,
                    chunk_counter
                )
                chunks.extend(section_chunks)
                chunk_counter += len(section_chunks)
        
        return chunks
    
    def _split_with_overlap(
        self,
        text: str,
        section_title: str,
        metadata: Dict,
        start_id: int
    ) -> List[Chunk]:
        """Split text into overlapping chunks."""
        chunks = []
        start = 0
        chunk_id = start_id
        
        while start < len(text):
            # Calculate end position
            end = start + self.chunk_size
            
            # If not at the end, try to break at sentence boundary
            if end < len(text):
                # Look for sentence endings near the chunk boundary
                search_start = max(start, end - 100)
                search_end = min(len(text), end + 100)
                search_text = text[search_start:search_end]
                
                # Find last sentence ending
                for delimiter in ['. ', '.\n', '! ', '?\n']:
                    last_delim = search_text.rfind(delimiter)
                    if last_delim != -1:
                        end = search_start + last_delim + len(delimiter)
                        break
            
            # Create chunk
            chunk_text = text[start:end].strip()
            if chunk_text:  # Only add non-empty chunks
                chunk = Chunk(
                    text=chunk_text,
                    chunk_id=f"{metadata.get('filename', 'doc')}_{chunk_id}",
                    section_title=section_title,
                    start_char=start,
                    end_char=end,
                    metadata=metadata
                )
                chunks.append(chunk)
                chunk_id += 1
            
            # Move start position with overlap
            start = end - self.overlap
            
            # Prevent infinite loop
            if start >= len(text):
                break
        
        return chunks
    
    def chunk_with_context(
        self,
        sections: List[Dict[str, str]],
        metadata: Dict
    ) -> List[Chunk]:
        """
        Chunk document with section context prepended.
        Useful for maintaining context in embeddings.
        """
        chunks = self.chunk_document(sections, metadata)
        
        # Prepend section title to each chunk for context
        for chunk in chunks:
            if chunk.section_title and chunk.section_title != "Document":
                chunk.text = f"[{chunk.section_title}]\n{chunk.text}"
        
        return chunks
