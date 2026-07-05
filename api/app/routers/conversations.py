from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import Conversation, User
from ..schemas import ConversationCreate, ConversationOut, MessageOut

router = APIRouter(prefix="/api/conversations", tags=["conversations"])


def get_owned_conversation(conversation_id: str, user: User, db: Session) -> Conversation:
    # Conversations are private to the user who created them.
    conv = db.get(Conversation, conversation_id)
    if conv is None or conv.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")
    return conv


@router.get("", response_model=list[ConversationOut])
def list_conversations(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stmt = (
        select(Conversation)
        .where(Conversation.user_id == user.id)
        .order_by(Conversation.updated_at.desc())
        .limit(100)
    )
    return db.execute(stmt).scalars().all()


@router.post("", response_model=ConversationOut, status_code=201)
def create_conversation(
    body: ConversationCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = Conversation(
        org_id=user.org_id,
        user_id=user.id,
        title=body.title or "New conversation",
        mode=body.mode,
    )
    db.add(conv)
    db.commit()
    return conv


@router.get("/{conversation_id}/messages", response_model=list[MessageOut])
def list_messages(
    conversation_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = get_owned_conversation(conversation_id, user, db)
    return conv.messages


@router.delete("/{conversation_id}", status_code=204)
def delete_conversation(
    conversation_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = get_owned_conversation(conversation_id, user, db)
    db.delete(conv)
    db.commit()
