"""Streaming chat endpoint (Server-Sent Events over a POST fetch).

Flow per message: persist the user turn → retrieve org-scoped context →
stream model deltas token-by-token → persist the assistant turn with its
citation sources → emit a final `done` event carrying the sources.
"""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select

from ..auth import get_current_user, is_restricted
from ..database import db_session
from ..models import Conversation, Message, User, UserProfile
from ..schemas import ChatRequest
from ..services.model_router import model_router
from ..services.prompts import build_chat_system, build_profile_block
from ..services.rag import build_context_block, retrieve

router = APIRouter(prefix="/api/chat", tags=["chat"])

HISTORY_LIMIT = 20  # most recent turns sent to the model


def _sse(event: str, data) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@router.post("")
async def chat(body: ChatRequest, user: User = Depends(get_current_user)):
    # Validate/create the conversation up-front so errors are plain HTTP,
    # not mid-stream. The session is managed explicitly because the response
    # outlives the request-scoped dependency.
    db = db_session()
    try:
        if body.conversation_id:
            conv = db.get(Conversation, body.conversation_id)
            if conv is None or conv.user_id != user.id:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Conversation not found")
        else:
            conv = Conversation(
                org_id=user.org_id,
                user_id=user.id,
                title=body.content.strip()[:60] or "New conversation",
                mode=body.mode,
            )
            db.add(conv)
            db.flush()  # assign conv.id before the message references it

        user_msg = Message(conversation_id=conv.id, role="user", content=body.content)
        db.add(user_msg)
        db.commit()
        conversation_id = conv.id
        user_message_id = user_msg.id

        history_stmt = (
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.seq.desc())
            .limit(HISTORY_LIMIT)
        )
        history = list(reversed(db.execute(history_stmt).scalars().all()))

        profile = db.execute(
            select(UserProfile).where(
                UserProfile.user_id == user.id, UserProfile.status == "completed"
            )
        ).scalar_one_or_none()
        profile_block = (
            build_profile_block(profile.profile_markdown, profile.niche_summary)
            if profile
            else None
        )
    finally:
        db.close()

    restricted = is_restricted(user)

    async def event_stream():
        yield _sse("meta", {"conversation_id": conversation_id, "user_message_id": user_message_id})

        # Retrieval (scoped to the user / their organisation, always).
        db = db_session()
        try:
            # Students query only their organisation's materials; everyone
            # else also draws on the system-wide policy library.
            sources = await retrieve(db, user, body.content, include_system=not restricted)
        except Exception as exc:
            sources = []
            yield _sse("warning", {"message": f"Knowledge base retrieval failed: {exc}"})
        finally:
            db.close()

        source_dicts = [s.to_dict() for s in sources]
        if source_dicts:
            yield _sse("sources", source_dicts)

        system = build_chat_system(build_context_block(sources), restricted, profile_block)
        messages = [{"role": "system", "content": system}] + [
            {"role": m.role, "content": m.content} for m in history
        ]

        task = "light" if restricted else "chat"
        collected: list[str] = []
        try:
            async for delta in model_router.stream_chat(messages, task=task):
                collected.append(delta)
                yield _sse("delta", {"text": delta})
        except Exception as exc:
            yield _sse("error", {"message": f"Model request failed: {exc}"})
            return

        content = "".join(collected)
        db = db_session()
        try:
            assistant_msg = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=content,
                sources=source_dicts or None,
            )
            db.add(assistant_msg)
            # Touch the conversation so it sorts to the top of the sidebar.
            conv = db.get(Conversation, conversation_id)
            if conv is not None:
                conv.updated_at = func.now()
            db.commit()
            message_id = assistant_msg.id
        finally:
            db.close()

        yield _sse("done", {"message_id": message_id, "sources": source_dicts})

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
