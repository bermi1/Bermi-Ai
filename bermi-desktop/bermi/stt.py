"""Local speech-to-text with faster-whisper (lazy-loaded, cached)."""
from __future__ import annotations

import tempfile
from functools import lru_cache

from .config import settings


@lru_cache(maxsize=1)
def _model():
    from faster_whisper import WhisperModel  # noqa: PLC0415

    return WhisperModel(
        settings.whisper_model,
        device=settings.whisper_device,
        compute_type=settings.whisper_compute,
    )


def transcribe(audio_bytes: bytes, suffix: str = ".webm") -> str:
    """Transcribe raw audio bytes (webm/opus, wav, mp3…) to text."""
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=True) as f:
        f.write(audio_bytes)
        f.flush()
        segments, _info = _model().transcribe(f.name, vad_filter=True, beam_size=5)
        return " ".join(seg.text for seg in segments).strip()
