"""Model router — the single place that talks to LLM providers.

All call sites request a *task type* ("chat", "light", "docgen") and the
router maps that to a concrete model from configuration, so the underlying
model is swappable via env/config and never hardcoded.

When no LLM_API_KEY is configured, the router runs in offline dev mode and
streams a deterministic, context-aware placeholder response so the whole
application remains usable without external services.
"""

import asyncio
import json
from collections.abc import AsyncIterator

import httpx

from ..config import get_settings


class ModelRouter:
    def __init__(self) -> None:
        self.settings = get_settings()

    def resolve_model(self, task: str = "chat") -> str:
        s = self.settings
        if task == "light":
            return s.llm_light_model or s.llm_chat_model
        return s.llm_chat_model

    @property
    def offline(self) -> bool:
        return not self.settings.llm_api_key

    async def stream_chat(
        self,
        messages: list[dict],
        task: str = "chat",
        temperature: float = 0.4,
        max_tokens: int = 2048,
    ) -> AsyncIterator[str]:
        """Yield response text deltas token-by-token."""
        if self.offline:
            async for delta in self._offline_stream(messages):
                yield delta
            return

        model = self.resolve_model(task)
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }
        headers = {
            "Authorization": f"Bearer {self.settings.llm_api_key}",
            "Content-Type": "application/json",
        }
        url = f"{self.settings.llm_api_base.rstrip('/')}/chat/completions"

        async with httpx.AsyncClient(timeout=httpx.Timeout(120.0, connect=15.0)) as client:
            async with client.stream("POST", url, json=payload, headers=headers) as resp:
                if resp.status_code != 200:
                    body = (await resp.aread()).decode(errors="replace")[:500]
                    raise RuntimeError(f"LLM provider error {resp.status_code}: {body}")
                async for line in resp.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    data = line[len("data:"):].strip()
                    if data == "[DONE]":
                        return
                    try:
                        event = json.loads(data)
                    except json.JSONDecodeError:
                        continue
                    delta = (
                        event.get("choices", [{}])[0].get("delta", {}).get("content")
                    )
                    if delta:
                        yield delta

    async def complete(
        self,
        messages: list[dict],
        task: str = "chat",
        temperature: float = 0.4,
        max_tokens: int = 4096,
    ) -> str:
        """Non-streaming completion (used for document generation)."""
        parts: list[str] = []
        async for delta in self.stream_chat(messages, task, temperature, max_tokens):
            parts.append(delta)
        return "".join(parts)

    async def _offline_stream(self, messages: list[dict]) -> AsyncIterator[str]:
        user_msg = next(
            (m["content"] for m in reversed(messages) if m["role"] == "user"), ""
        )
        has_context = any(
            "RETRIEVED CONTEXT" in m.get("content", "") for m in messages if m["role"] == "system"
        )
        text = (
            "**Bermi AI is running in offline development mode** — no LLM API key is "
            "configured, so this is a placeholder response.\n\n"
            f"You asked: *{user_msg[:300]}*\n\n"
        )
        if has_context:
            text += (
                "Relevant passages were retrieved from your organisation's knowledge "
                "base and would be cited here as [1], [2], … in a live deployment.\n\n"
            )
        text += (
            "Set `LLM_API_KEY` in the backend environment to receive real "
            "responses from the Bermi AI v1 model."
        )
        # Stream word-by-word so the frontend streaming path is exercised.
        for word in text.split(" "):
            yield word + " "
            await asyncio.sleep(0.01)


model_router = ModelRouter()
