import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from sqlalchemy import select

from ..auth import get_current_user, is_restricted
from ..database import get_db
from ..models import Artifact, Conversation, Message, User, UserProfile
from ..schemas import ArtifactOut, GenerateDocumentRequest
from ..services.docgen import extract_title, save_docx
from ..services.model_router import model_router
from ..services.prompts import build_docgen_system, build_profile_block
from ..services.rag import build_context_block, retrieve

router = APIRouter(prefix="/api", tags=["generate"])

KIND_LABELS = {"proposal": "proposal", "letter": "letter", "report": "report"}


def _can_access_artifact(artifact: Artifact | None, user: User) -> bool:
    if artifact is None:
        return False
    if user.org_id is not None:
        return artifact.org_id == user.org_id
    # Solo users: artifacts are private to their creator (both org_id NULL).
    return artifact.user_id == user.id


def _artifact_out(a: Artifact) -> ArtifactOut:
    return ArtifactOut(
        id=a.id,
        title=a.title,
        kind=a.kind,
        content_markdown=a.content_markdown,
        has_docx=bool(a.docx_path),
        created_at=a.created_at,
    )


@router.post("/generate/document", response_model=ArtifactOut, status_code=201)
async def generate_document(
    body: GenerateDocumentRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if is_restricted(user):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Student accounts cannot generate documents")
    kind = body.kind if body.kind in KIND_LABELS else "proposal"

    conversation = None
    if body.conversation_id:
        conversation = db.get(Conversation, body.conversation_id)
        if conversation is None or conversation.user_id != user.id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")

    context_block = None
    sources = []
    if body.use_knowledge_base:
        try:
            sources = await retrieve(db, user, body.brief)
            context_block = build_context_block(sources)
        except Exception:
            context_block = None  # generation still works without retrieval

    profile = db.execute(
        select(UserProfile).where(
            UserProfile.user_id == user.id, UserProfile.status == "completed"
        )
    ).scalar_one_or_none()
    profile_block = (
        build_profile_block(profile.profile_markdown, profile.niche_summary) if profile else None
    )

    system = build_docgen_system(kind, context_block, profile_block)
    title_hint = f' titled "{body.title}"' if body.title else ""
    prompt = f"Write a {KIND_LABELS[kind]}{title_hint} based on this brief:\n\n{body.brief}"

    markdown = await model_router.complete(
        [{"role": "system", "content": system}, {"role": "user", "content": prompt}],
        task="chat",
        max_tokens=4096,
    )
    if not markdown.strip():
        raise HTTPException(status.HTTP_502_BAD_GATEWAY, "The model returned an empty document")

    title = body.title or extract_title(markdown, f"Generated {KIND_LABELS[kind]}")
    docx_path = save_docx(markdown, title)

    artifact = Artifact(
        org_id=user.org_id,
        user_id=user.id,
        conversation_id=body.conversation_id,
        title=title,
        kind=kind,
        content_markdown=markdown,
        docx_path=docx_path,
    )
    db.add(artifact)
    db.flush()

    if conversation is not None:
        db.add(
            Message(
                conversation_id=conversation.id,
                role="user",
                content=f"/{kind} {body.brief}",
            )
        )
        db.add(
            Message(
                conversation_id=conversation.id,
                role="assistant",
                content=f"I've drafted **{title}** — it's open in the panel on the right, "
                "and you can download it as a Word document.",
                sources=[s.to_dict() for s in sources] or None,
                artifact_id=artifact.id,
            )
        )
    db.commit()
    return _artifact_out(artifact)


@router.get("/artifacts/{artifact_id}", response_model=ArtifactOut)
def get_artifact(
    artifact_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    artifact = db.get(Artifact, artifact_id)
    if not _can_access_artifact(artifact, user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Artifact not found")
    return _artifact_out(artifact)


@router.get("/artifacts/{artifact_id}/download")
def download_artifact(
    artifact_id: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    artifact = db.get(Artifact, artifact_id)
    if not _can_access_artifact(artifact, user):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Artifact not found")
    if not artifact.docx_path or not os.path.exists(artifact.docx_path):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No Word file available for this artifact")
    return FileResponse(
        artifact.docx_path,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        filename=f"{artifact.title}.docx",
    )
