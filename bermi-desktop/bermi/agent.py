"""The Bermi agent: an OpenRouter tool-calling loop with a confirmation gate.

`run()` is an async generator that yields event dicts so the server can stream
them to the UI as they happen:
  {"type": "token",    "text": ...}          assistant prose
  {"type": "tool",     "name", "args"}       a tool is about to run
  {"type": "confirm",  "id", "name", "args"} sensitive action awaiting approval
  {"type": "result",   "name", "output"}     tool finished
  {"type": "done",     "text": ...}          final assistant answer
  {"type": "error",    "text": ...}
"""
from __future__ import annotations

import asyncio
import json
import platform

from .config import settings
from .llm import OpenRouter
from .tools import FUNCTIONS, TOOL_SCHEMAS
from .tools.computer import SENSITIVE

# id -> (asyncio.Event, {"approved": bool})
_PENDING: dict[str, tuple[asyncio.Event, dict]] = {}


def resolve_confirmation(confirm_id: str, approved: bool) -> bool:
    entry = _PENDING.get(confirm_id)
    if not entry:
        return False
    event, state = entry
    state["approved"] = approved
    event.set()
    return True


def _system_prompt() -> str:
    return (
        f"You are {settings.assistant_name}, a witty, capable AI assistant modeled on "
        f"Jarvis. You run locally on the user's {platform.system()} computer and can "
        "control it through your tools: shell commands, launching apps, keyboard and "
        "mouse, screenshots, reading/writing files, system info and more.\n\n"
        "Guidelines:\n"
        "- Be concise and natural — your replies are spoken aloud. Skip markdown and long lists.\n"
        "- When the user asks you to DO something on the computer, use your tools rather than "
        "explaining how they could do it themselves.\n"
        "- Chain tools as needed to complete multi-step tasks, then confirm what you did.\n"
        "- Prefer safe, reversible actions. Never run destructive commands unless explicitly asked.\n"
        f"- Address the user warmly; you may occasionally call them 'sir'/'boss' in Jarvis style."
    )


def _is_blocked(name: str, args: dict) -> str | None:
    if name == "run_shell":
        cmd = (args.get("command") or "").strip()
        for bad in settings.blocked_list:
            if bad and cmd.startswith(bad):
                return bad
    return None


async def _await_confirmation(confirm_id: str) -> bool:
    event = asyncio.Event()
    state = {"approved": False}
    _PENDING[confirm_id] = (event, state)
    try:
        await asyncio.wait_for(event.wait(), timeout=300)
    except asyncio.TimeoutError:
        return False
    finally:
        _PENDING.pop(confirm_id, None)
    return state["approved"]


async def run(history: list[dict]):
    """Drive the tool-calling loop. `history` is prior [{role, content}] turns."""
    if not settings.openrouter_api_key or "xxxx" in settings.openrouter_api_key:
        yield {"type": "error", "text": "No OpenRouter API key set. Add OPENROUTER_API_KEY to your .env."}
        return

    client = OpenRouter()
    messages = [{"role": "system", "content": _system_prompt()}, *history]
    counter = 0
    try:
        for _ in range(12):  # max tool-use rounds
            data = await client.chat(messages, tools=TOOL_SCHEMAS)
            choice = data["choices"][0]["message"]
            messages.append(choice)
            tool_calls = choice.get("tool_calls") or []

            if not tool_calls:
                yield {"type": "done", "text": choice.get("content") or ""}
                return

            if choice.get("content"):
                yield {"type": "token", "text": choice["content"]}

            for call in tool_calls:
                name = call["function"]["name"]
                try:
                    args = json.loads(call["function"].get("arguments") or "{}")
                except json.JSONDecodeError:
                    args = {}

                blocked = _is_blocked(name, args)
                if blocked:
                    out = f"BLOCKED by safety policy (matches '{blocked}'). Not executed."
                    yield {"type": "result", "name": name, "output": out}
                    messages.append({"role": "tool", "tool_call_id": call["id"], "content": out})
                    continue

                needs_ok = settings.require_confirmation and name in SENSITIVE
                if needs_ok:
                    counter += 1
                    cid = f"c{counter}"
                    yield {"type": "confirm", "id": cid, "name": name, "args": args}
                    approved = await _await_confirmation(cid)
                    if not approved:
                        out = "Declined by user."
                        yield {"type": "result", "name": name, "output": out}
                        messages.append({"role": "tool", "tool_call_id": call["id"], "content": out})
                        continue

                yield {"type": "tool", "name": name, "args": args}
                fn = FUNCTIONS.get(name)
                if not fn:
                    out = f"Unknown tool: {name}"
                else:
                    try:
                        out = await asyncio.to_thread(fn, **args)
                    except Exception as e:  # noqa: BLE001
                        out = f"Error running {name}: {e}"
                yield {"type": "result", "name": name, "output": out}
                messages.append({"role": "tool", "tool_call_id": call["id"], "content": str(out)})

        yield {"type": "done", "text": "Reached the maximum number of tool steps."}
    except Exception as e:  # noqa: BLE001
        yield {"type": "error", "text": f"Agent error: {e}"}
    finally:
        await client.aclose()
