"""Thin async OpenRouter client (OpenAI-compatible chat/completions)."""
from __future__ import annotations

import httpx

from .config import settings


class OpenRouter:
    def __init__(self) -> None:
        self._client = httpx.AsyncClient(
            base_url=settings.openrouter_base_url,
            timeout=httpx.Timeout(120.0),
            headers={
                "Authorization": f"Bearer {settings.openrouter_api_key}",
                "HTTP-Referer": "https://github.com/bermi1/bermi-ai",
                "X-Title": "Bermi Desktop",
            },
        )

    async def chat(self, messages: list[dict], tools: list[dict] | None = None) -> dict:
        payload: dict = {"model": settings.bermi_model, "messages": messages}
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"
        resp = await self._client.post("/chat/completions", json=payload)
        resp.raise_for_status()
        return resp.json()

    async def aclose(self) -> None:
        await self._client.aclose()
