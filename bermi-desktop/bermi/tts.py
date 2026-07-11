"""Text-to-speech. Default: edge-tts (natural, online). Fallback: pyttsx3 (offline)."""
from __future__ import annotations

from .config import settings


async def synthesize(text: str) -> tuple[bytes, str]:
    """Return (audio_bytes, mime_type). Empty bytes if TTS disabled/failed."""
    engine = settings.tts_engine.lower()
    if engine == "off" or not text.strip():
        return b"", "audio/mpeg"

    if engine == "edge":
        try:
            import edge_tts  # noqa: PLC0415

            communicate = edge_tts.Communicate(text, settings.tts_voice)
            chunks = bytearray()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    chunks.extend(chunk["data"])
            if chunks:
                return bytes(chunks), "audio/mpeg"
        except Exception:  # noqa: BLE001
            pass  # fall through to offline

    # Offline fallback
    try:
        import asyncio  # noqa: PLC0415
        import tempfile

        import pyttsx3  # noqa: PLC0415

        def _render() -> bytes:
            eng = pyttsx3.init()
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
                path = f.name
            eng.save_to_file(text, path)
            eng.runAndWait()
            with open(path, "rb") as fh:
                return fh.read()

        data = await asyncio.to_thread(_render)
        return data, "audio/wav"
    except Exception:  # noqa: BLE001
        return b"", "audio/mpeg"
