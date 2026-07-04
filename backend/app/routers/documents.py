import os
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_current_user, require_roles
from ..config import get_settings
from ..database import get_db
from ..models import Document, DocumentChunk, User
from ..schemas import ChunkOut, DocumentOut
from ..services.ingestion import process_document

router = APIRouter(prefix="/api/documents", tags=["documents"])

MAX_UPLOAD_BYTES = 25 * 1024 * 1024
ALLOWED_EXTENSIONS = (".pdf", ".docx", ".txt", ".md")

# Students cannot upload; teachers and admins can.
uploader = require_roles("teacher", "org_admin", "super_admin")


@router.post("", response_model=DocumentOut, status_code=201)
async def upload_document(
    file: UploadFile,
    background: BackgroundTasks,
    user: User = Depends(uploader),
    db: Session = Depends(get_db),
):
    filename = file.filename or "upload"
    if not filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )
    data = await file.read()
    if len(data) > MAX_UPLOAD_BYTES:
        raise HTTPException(status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, "File exceeds 25 MB limit")
    if not data:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "File is empty")

    settings = get_settings()
    org_dir = os.path.join(settings.upload_dir, user.org_id)
    os.makedirs(org_dir, exist_ok=True)
    storage_path = os.path.join(org_dir, f"{uuid.uuid4().hex}_{os.path.basename(filename)}")
    with open(storage_path, "wb") as f:
        f.write(data)

    doc = Document(
        org_id=user.org_id,
        uploaded_by=user.id,
        filename=filename,
        content_type=file.content_type or "application/octet-stream",
        storage_path=storage_path,
        status="processing",
    )
    db.add(doc)
    db.commit()

    # Ingestion (extract → chunk → embed) runs off the request path.
    background.add_task(process_document, doc.id, data)
    return doc


@router.get("", response_model=list[DocumentOut])
def list_documents(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        select(Document)
        .where(Document.org_id == user.org_id)
        .order_by(Document.created_at.desc())
    )
    return db.execute(stmt).scalars().all()


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    doc = db.get(Document, document_id)
    if doc is None or doc.org_id != user.org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return doc


@router.get("/chunks/{chunk_id}", response_model=ChunkOut)
def get_chunk(
    chunk_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Fetch a single chunk — used by the citation viewer to show the exact
    cited passage in its source document."""
    chunk = db.get(DocumentChunk, chunk_id)
    if chunk is None or chunk.org_id != user.org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Citation source not found")
    return chunk


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: str,
    user: User = Depends(uploader),
    db: Session = Depends(get_db),
):
    doc = db.get(Document, document_id)
    if doc is None or doc.org_id != user.org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    try:
        if doc.storage_path and os.path.exists(doc.storage_path):
            os.remove(doc.storage_path)
    except OSError:
        pass
    db.delete(doc)
    db.commit()
