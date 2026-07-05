"""Public, no-login demo chat — the landing-page conversion tool.

A guest can chat a limited number of times per day (per IP) to experience
Bermi AI's quality before signing up. No retrieval, no persistence beyond a
per-IP counter used for rate limiting.
"""

import json
from datetime import date, datetime, timedelta, timezone

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy import select

from ..config import get_settings
from ..database import db_session
from ..models import DemoUsage
from ..schemas import DemoChatRequest
from ..services.model_router import model_router

router = APIRouter(prefix="/api/demo", tags=["demo"])

DEMO_SYSTEM = (
    "You are Bermi AI, running the Bermi AI v1 model, built by Bemri Tech "
    "Company — an Africa-first AI assistant. You are fluent in English and "
    "Swahili and reply in the language the user writes in. This is a public "
    "demo: be genuinely helpful, warm, and impressively clear, and keep "
    "answers reasonably concise. Never mention any third-party AI provider."
)


def _client_ip(request: Request) -> str:
    # Vercel / proxies set X-Forwarded-For; take the first hop.
    fwd = request.headers.get("x-forwarded-for")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _get_usage(db, ip: str) -> DemoUsage:
    today = date.today()
    usage = db.execute(
        select(DemoUsage).where(DemoUsage.ip == ip, DemoUsage.day == today)
    ).scalar_one_or_none()
    if usage is None:
        usage = DemoUsage(ip=ip, day=today, count=0)
        db.add(usage)
        db.commit()
    return usage


@router.get("/status")
def demo_status(request: Request):
    limit = get_settings().demo_daily_limit
    db = db_session()
    try:
        usage = _get_usage(db, _client_ip(request))
        used = usage.count
    finally:
        db.close()
    return {"used": used, "limit": limit, "remaining": max(0, limit - used)}


@router.post("/chat")
async def demo_chat(body: DemoChatRequest, request: Request):
    settings = get_settings()
    limit = settings.demo_daily_limit
    ip = _client_ip(request)

    db = db_session()
    try:
        usage = _get_usage(db, ip)
        if usage.count >= limit:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "You've reached the demo limit. Sign up free to keep chatting.",
                    "remaining": 0,
                    "limit": limit,
                },
            )
        usage.count += 1
        db.commit()
        remaining = max(0, limit - usage.count)
    finally:
        db.close()

    # Keep the demo cheap and snappy with the light model.
    messages = [
        {"role": "system", "content": DEMO_SYSTEM},
        {"role": "user", "content": body.content},
    ]

    def sse(event: str, data) -> str:
        return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"

    async def stream():
        yield sse("meta", {"remaining": remaining, "limit": limit})
        try:
            async for delta in model_router.stream_chat(messages, task="light", max_tokens=700):
                yield sse("delta", {"text": delta})
        except Exception as exc:  # surface a real message, never a silent stall
            yield sse("error", {"message": f"Demo is briefly unavailable: {exc}"})
            return
        yield sse("done", {"remaining": remaining})

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# Housekeeping: callers may occasionally prune old rows to keep the table small.
def _prune_old(db, days: int = 30) -> None:
    cutoff = datetime.now(timezone.utc).date() - timedelta(days=days)
    db.query(DemoUsage).filter(DemoUsage.day < cutoff).delete()
    db.commit()
