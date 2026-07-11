"""FastAPI server: serves the Jarvis UI and the chat / voice / control endpoints."""
from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI, Request, UploadFile
from fastapi.responses import FileResponse, Response, StreamingResponse
from fastapi.staticfiles import StaticFiles

from . import agent, stt, tts
from .config import settings

STATIC = Path(__file__).parent / "static"
app = FastAPI(title="Bermi Desktop")


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(STATIC / "index.html")


@app.get("/api/config")
async def config() -> dict:
    return {
        "assistant_name": settings.assistant_name,
        "model": settings.bermi_model,
        "tts_engine": settings.tts_engine,
        "require_confirmation": settings.require_confirmation,
        "has_key": bool(settings.openrouter_api_key and "xxxx" not in settings.openrouter_api_key),
    }


@app.post("/api/chat")
async def chat(request: Request) -> StreamingResponse:
    body = await request.json()
    history = body.get("messages", [])

    async def event_stream():
        async for evt in agent.run(history):
            yield f"data: {json.dumps(evt)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/api/approve")
async def approve(request: Request) -> dict:
    body = await request.json()
    ok = agent.resolve_confirmation(body.get("id", ""), bool(body.get("approved")))
    return {"ok": ok}


@app.post("/api/stt")
async def speech_to_text(audio: UploadFile) -> dict:
    data = await audio.read()
    suffix = "." + (audio.filename or "a.webm").split(".")[-1]
    text = await _to_thread(stt.transcribe, data, suffix)
    return {"text": text}


@app.post("/api/tts")
async def text_to_speech(request: Request) -> Response:
    body = await request.json()
    data, mime = await tts.synthesize(body.get("text", ""))
    return Response(content=data, media_type=mime)


async def _to_thread(fn, *args):
    import asyncio

    return await asyncio.to_thread(fn, *args)


# Static assets (css/js) — mounted last so it doesn't shadow the routes above.
app.mount("/static", StaticFiles(directory=STATIC), name="static")
