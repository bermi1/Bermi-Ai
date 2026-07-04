"""Embeddings service.

Uses any OpenAI-compatible /embeddings endpoint (configured via env).
Without an API key it falls back to a deterministic local hashing embedder
so development and tests work fully offline. The fallback is NOT suitable
for production retrieval quality — it exists to keep the pipeline runnable.
"""

import hashlib
import math
import re

import httpx

from ..config import get_settings

_WORD_RE = re.compile(r"[\w']+", re.UNICODE)


def _hash_embed(text: str, dim: int) -> list[float]:
    """Deterministic bag-of-hashed-ngrams embedding (offline dev fallback)."""
    vec = [0.0] * dim
    words = _WORD_RE.findall(text.lower())
    tokens = words + [" ".join(p) for p in zip(words, words[1:])]
    for token in tokens:
        h = int.from_bytes(hashlib.md5(token.encode()).digest()[:8], "big")
        vec[h % dim] += 1.0
    norm = math.sqrt(sum(v * v for v in vec)) or 1.0
    return [v / norm for v in vec]


async def embed_texts(texts: list[str]) -> list[list[float]]:
    settings = get_settings()
    if not settings.embeddings_api_key:
        return [_hash_embed(t, settings.embeddings_dimensions) for t in texts]

    url = f"{settings.embeddings_api_base.rstrip('/')}/embeddings"
    headers = {"Authorization": f"Bearer {settings.embeddings_api_key}"}
    results: list[list[float]] = []
    async with httpx.AsyncClient(timeout=60.0) as client:
        # Batch to keep request sizes reasonable.
        for i in range(0, len(texts), 32):
            batch = texts[i : i + 32]
            resp = await client.post(
                url,
                headers=headers,
                json={"model": settings.embeddings_model, "input": batch},
            )
            resp.raise_for_status()
            data = sorted(resp.json()["data"], key=lambda d: d["index"])
            results.extend(d["embedding"] for d in data)
    return results


async def embed_query(text: str) -> list[float]:
    return (await embed_texts([text]))[0]
