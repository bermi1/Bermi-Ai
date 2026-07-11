"""Maps tool names to callables and exposes their OpenAI/OpenRouter schemas."""
from __future__ import annotations

from . import computer as C

# name -> callable
FUNCTIONS = {
    "run_shell": C.run_shell,
    "open_app": C.open_app,
    "open_url": C.open_url,
    "type_text": C.type_text,
    "press_keys": C.press_keys,
    "mouse_click": C.mouse_click,
    "screenshot": C.screenshot,
    "list_dir": C.list_dir,
    "read_file": C.read_file,
    "write_file": C.write_file,
    "system_info": C.system_info,
    "list_processes": C.list_processes,
    "set_volume": C.set_volume,
    "clipboard": C.clipboard,
}


def _t(name: str, desc: str, props: dict, required: list[str]) -> dict:
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": desc,
            "parameters": {"type": "object", "properties": props, "required": required},
        },
    }


S = {"type": "string"}
I = {"type": "integer"}

TOOL_SCHEMAS = [
    _t("run_shell", "Run a shell/terminal command on the user's computer and return its output.",
       {"command": S, "timeout": I}, ["command"]),
    _t("open_app", "Launch a desktop application by name (e.g. 'Spotify', 'Notes', 'chrome').",
       {"name": S}, ["name"]),
    _t("open_url", "Open a website URL in the default browser.", {"url": S}, ["url"]),
    _t("type_text", "Type text into the currently focused window/field.", {"text": S}, ["text"]),
    _t("press_keys", "Press a keyboard shortcut, e.g. 'ctrl+s', 'cmd+space', 'enter', 'alt+tab'.",
       {"keys": S}, ["keys"]),
    _t("mouse_click", "Click the mouse. Optionally provide x,y screen coords and button (left/right/middle).",
       {"x": I, "y": I, "button": S}, []),
    _t("screenshot", "Capture the current screen to a PNG file and return its path.", {"path": S}, []),
    _t("list_dir", "List files and folders at a path.", {"path": S}, []),
    _t("read_file", "Read the contents of a text file.", {"path": S}, ["path"]),
    _t("write_file", "Create or overwrite a text file with given content.",
       {"path": S, "content": S}, ["path", "content"]),
    _t("system_info", "Get OS, CPU, RAM and current-directory info.", {}, []),
    _t("list_processes", "List the top running processes by CPU usage.", {"limit": I}, []),
    _t("set_volume", "Set the system output volume (0-100).", {"level": I}, ["level"]),
    _t("clipboard", "Read or write the clipboard. action='get' or 'set' (with text).",
       {"action": S, "text": S}, []),
]
