"""Retrieval: query the org-scoped knowledge base and build a citation-ready
context block for the model."""

from dataclasses import dataclass

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..config import get_settings
from ..models import Document, DocumentChunk
from .embeddings import embed_query


@dataclass
class RetrievedSource:
    index: int
    document_id: str
    document_name: str
    chunk_id: str
    page: int | None
    section: str | None
    snippet: str
    text: str

    def to_dict(self) -> dict:
        return {
            "index": self.index,
            "document_id": self.document_id,
            "document_name": self.document_name,
            "chunk_id": self.chunk_id,
            "page": self.page,
            "section": self.section,
            "snippet": self.snippet,
        }


async def retrieve(
    db: Session,
    org_id: str,
    query: str,
    top_k: int | None = None,
    include_system: bool = True,
) -> list[RetrievedSource]:
    """Vector search over the organisation's chunks plus (optionally) the
    system-wide policy library. Never crosses into other organisations."""
    settings = get_settings()
    k = top_k or settings.rag_top_k

    query_embedding = await embed_query(query)

    scope_filter = DocumentChunk.org_id == org_id
    if include_system:
        scope_filter = or_(scope_filter, DocumentChunk.org_id.is_(None))

    stmt = (
        select(DocumentChunk, Document.filename)
        .join(Document, Document.id == DocumentChunk.document_id)
        .where(scope_filter, Document.status == "ready")
        .order_by(DocumentChunk.embedding.cosine_distance(query_embedding))
        .limit(k)
    )
    rows = db.execute(stmt).all()

    sources: list[RetrievedSource] = []
    for i, (chunk, filename) in enumerate(rows, start=1):
        sources.append(
            RetrievedSource(
                index=i,
                document_id=chunk.document_id,
                document_name=filename,
                chunk_id=chunk.id,
                page=chunk.page,
                section=chunk.section,
                snippet=chunk.text[:280],
                text=chunk.text,
            )
        )
    return sources


def build_context_block(sources: list[RetrievedSource]) -> str | None:
    if not sources:
        return None
    lines = ["\nRETRIEVED CONTEXT (numbered sources — cite as [n]):"]
    for s in sources:
        location = []
        if s.section:
            location.append(s.section)
        if s.page:
            location.append(f"p.{s.page}")
        loc = f", {', '.join(location)}" if location else ""
        lines.append(f"\n[{s.index}] ({s.document_name}{loc})\n{s.text}")
    return "\n".join(lines)
