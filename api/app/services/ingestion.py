"""Document ingestion: extraction → structure-aware chunking → embeddings.

Structure awareness matters for the legal/curriculum use cases: page numbers
and Article/Section/Chapter headings are preserved as chunk metadata so
answers can cite "Article 12(2), p.4" and citations can jump back to the
exact location in the source document.
"""

import asyncio
import io
import re
from dataclasses import dataclass

from pypdf import PdfReader

from ..config import get_settings
from ..database import db_session
from ..models import Document, DocumentChunk
from .embeddings import embed_texts

# Headings we treat as section markers (English + Swahili legal/curriculum).
_SECTION_RE = re.compile(
    r"^\s*(?:"
    r"(?:ARTICLE|Article|SECTION|Section|CHAPTER|Chapter|PART|Part|CLAUSE|Clause"
    r"|IBARA|Ibara|SURA|Sura|SEHEMU|Sehemu|KIFUNGU|Kifungu)\s+[\dIVXLC]+[A-Za-z0-9().\-]*"
    r"|\d+(?:\.\d+)+\s+\S.*"
    r")",
    re.MULTILINE,
)


@dataclass
class ExtractedPage:
    page_number: int  # 1-based; 0 means "no page concept" (e.g. DOCX)
    text: str


def extract_pdf(data: bytes) -> list[ExtractedPage]:
    reader = PdfReader(io.BytesIO(data))
    pages = []
    for i, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""
        pages.append(ExtractedPage(page_number=i, text=text))
    return pages


def extract_docx(data: bytes) -> list[ExtractedPage]:
    from docx import Document as DocxDocument

    doc = DocxDocument(io.BytesIO(data))
    parts: list[str] = []
    for para in doc.paragraphs:
        text = para.text.strip()
        if not text:
            continue
        # Promote Word heading styles to detectable section lines.
        if para.style is not None and (para.style.name or "").startswith("Heading"):
            parts.append(f"\n{text}\n")
        else:
            parts.append(text)
    return [ExtractedPage(page_number=0, text="\n".join(parts))]


def extract_txt(data: bytes) -> list[ExtractedPage]:
    return [ExtractedPage(page_number=0, text=data.decode("utf-8", errors="replace"))]


def extract(filename: str, content_type: str, data: bytes) -> list[ExtractedPage]:
    name = filename.lower()
    if name.endswith(".pdf") or content_type == "application/pdf":
        return extract_pdf(data)
    if name.endswith(".docx") or "wordprocessingml" in content_type:
        return extract_docx(data)
    if name.endswith((".txt", ".md")) or content_type.startswith("text/"):
        return extract_txt(data)
    raise ValueError(f"Unsupported file type: {filename} ({content_type})")


@dataclass
class Chunk:
    text: str
    page: int | None
    section: str | None


def _current_section(text_so_far: str) -> str | None:
    """Return the most recent section heading seen in the text."""
    matches = _SECTION_RE.findall(text_so_far)
    if not matches:
        return None
    last = matches[-1].strip()
    return last[:250]


def chunk_pages(pages: list[ExtractedPage], chunk_size: int, overlap: int) -> list[Chunk]:
    chunks: list[Chunk] = []
    for page in pages:
        text = page.text.strip()
        if not text:
            continue
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            # Prefer to break on a paragraph/sentence boundary near the end.
            if end < len(text):
                window = text[start:end]
                for sep in ("\n\n", "\n", ". "):
                    idx = window.rfind(sep)
                    if idx > chunk_size // 2:
                        end = start + idx + len(sep)
                        break
            piece = text[start:end].strip()
            if piece:
                chunks.append(
                    Chunk(
                        text=piece,
                        page=page.page_number or None,
                        section=_current_section(text[: end]),
                    )
                )
            if end >= len(text):
                break
            start = max(end - overlap, start + 1)
    return chunks


async def _process(document_id: str, data: bytes) -> None:
    settings = get_settings()
    db = db_session()
    try:
        doc = db.get(Document, document_id)
        if doc is None:
            return
        try:
            pages = extract(doc.filename, doc.content_type, data)
            chunks = chunk_pages(pages, settings.chunk_size, settings.chunk_overlap)
            if not chunks:
                raise ValueError("No text could be extracted from this document")
            embeddings = await embed_texts([c.text for c in chunks])
            for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
                db.add(
                    DocumentChunk(
                        document_id=doc.id,
                        org_id=doc.org_id,
                        chunk_index=i,
                        text=chunk.text,
                        page=chunk.page,
                        section=chunk.section,
                        embedding=emb,
                    )
                )
            doc.page_count = max((p.page_number for p in pages), default=0)
            doc.chunk_count = len(chunks)
            doc.status = "ready"
            doc.error = None
        except Exception as exc:  # keep the failure on the record, not the request
            doc.status = "failed"
            doc.error = str(exc)[:2000]
        db.commit()
    finally:
        db.close()


def process_document(document_id: str, data: bytes) -> None:
    """Entry point for FastAPI BackgroundTasks (sync wrapper)."""
    asyncio.run(_process(document_id, data))
