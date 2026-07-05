import os
import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import UPLOADER_ROLES, get_current_user, require_roles
from ..config import get_settings
from ..database import get_db
from ..models import Document, DocumentChunk, User
from ..schemas import ChunkOut, DocumentOut
from ..scoping import can_access_document, document_own_filter
from ..services.ingestion import _process, process_document

router = APIRouter(prefix="/api/documents", tags=["documents"])

MAX_UPLOAD_BYTES = 25 * 1024 * 1024
ALLOWED_EXTENSIONS = (".pdf", ".docx", ".txt", ".md")

# Students cannot upload; individuals, teachers, and admins can.
uploader = require_roles(*UPLOADER_ROLES)


@router.post("", response_model=DocumentOut, status_code=201)
async def upload_document(
    file: UploadFile,
    background: BackgroundTasks,
    scope: str = Form("org"),
    user: User = Depends(uploader),
    db: Session = Depends(get_db),
):
    # "system" scope = the private policy library (e.g. Tanzania Vision 2050):
    # informs answers for every organisation but is never listed publicly.
    if scope not in ("org", "system"):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "scope must be org or system")
    if scope == "system" and user.role != "super_admin":
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Only super admins manage the system policy library"
        )
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
    if scope == "system":
        subdir = "system"
    elif user.org_id:
        subdir = user.org_id
    else:
        subdir = f"user_{user.id}"  # solo individual's private space
    org_dir = os.path.join(settings.upload_dir, subdir)
    os.makedirs(org_dir, exist_ok=True)
    storage_path = os.path.join(org_dir, f"{uuid.uuid4().hex}_{os.path.basename(filename)}")
    with open(storage_path, "wb") as f:
        f.write(data)

    doc = Document(
        org_id=None if scope == "system" else user.org_id,
        scope=scope,
        uploaded_by=user.id,
        filename=filename,
        content_type=file.content_type or "application/octet-stream",
        storage_path=storage_path,
        status="processing",
    )
    db.add(doc)
    db.commit()

    if os.environ.get("VERCEL"):
        # Serverless: background work isn't guaranteed to run after the
        # response, so ingest synchronously within the request.
        await _process(doc.id, data)
        db.refresh(doc)
    else:
        # Ingestion (extract → chunk → embed) runs off the request path.
        background.add_task(process_document, doc.id, data)
    return doc


@router.get("", response_model=list[DocumentOut])
def list_documents(
    scope: str = "org",
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # The system policy library is only listed for super admins — for everyone
    # else it silently informs answers (with citations) but is never shown.
    if scope == "system":
        if user.role != "super_admin":
            raise HTTPException(status.HTTP_403_FORBIDDEN, "Insufficient permissions")
        where = Document.scope == "system"
    else:
        where = document_own_filter(user)
    stmt = select(Document).where(where).order_by(Document.created_at.desc())
    return db.execute(stmt).scalars().all()


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(
    document_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    doc = db.get(Document, document_id)
    if not can_access_document(doc, user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    return doc


@router.get("/chunks/{chunk_id}", response_model=ChunkOut)
def get_chunk(
    chunk_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Fetch a single chunk — used by the citation viewer to show the exact
    cited passage. Access is checked against the parent document so a user can
    only view passages from documents in their own scope or the policy library."""
    chunk = db.get(DocumentChunk, chunk_id)
    if chunk is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Citation source not found")
    doc = db.get(Document, chunk.document_id)
    if not can_access_document(doc, user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Citation source not found")
    return chunk


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: str,
    user: User = Depends(uploader),
    db: Session = Depends(get_db),
):
    doc = db.get(Document, document_id)
    if doc is None or (doc.scope == "system" and user.role != "super_admin") or (
        doc.scope != "system" and not can_access_document(doc, user)
    ):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Document not found")
    try:
        if doc.storage_path and os.path.exists(doc.storage_path):
            os.remove(doc.storage_path)
    except OSError:
        pass
    db.delete(doc)
    db.commit()
