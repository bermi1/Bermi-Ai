"""Computer-control tools. Each function returns a short human-readable string.

These run on the machine where Bermi is launched. Anything that can modify the
system (shell, file writes, key presses) is routed through the confirmation gate
in the agent when REQUIRE_CONFIRMATION is on.
"""
from __future__ import annotations

import os
import platform
import shlex
import shutil
import subprocess
import webbrowser
from pathlib import Path

SYSTEM = platform.system()  # 'Windows' | 'Darwin' | 'Linux'


# --- lazy optional deps ------------------------------------------------------
def _pyautogui():
    import pyautogui  # noqa: PLC0415
    pyautogui.FAILSAFE = True
    return pyautogui


# --- shell -------------------------------------------------------------------
def run_shell(command: str, timeout: int = 60) -> str:
    """Run a shell command and return combined stdout/stderr (truncated)."""
    try:
        proc = subprocess.run(
            command, shell=True, capture_output=True, text=True, timeout=timeout
        )
    except subprocess.TimeoutExpired:
        return f"[timeout after {timeout}s] {command}"
    out = (proc.stdout or "") + (proc.stderr or "")
    out = out.strip() or "(no output)"
    if len(out) > 6000:
        out = out[:6000] + "\n… (truncated)"
    return f"exit={proc.returncode}\n{out}"


# --- apps --------------------------------------------------------------------
def open_app(name: str) -> str:
    """Launch an application by name (best-effort, per OS)."""
    try:
        if SYSTEM == "Darwin":
            subprocess.Popen(["open", "-a", name])
        elif SYSTEM == "Windows":
            subprocess.Popen(["cmd", "/c", "start", "", name], shell=True)
        else:  # Linux
            exe = shutil.which(name) or name
            subprocess.Popen([exe])
        return f"Launched {name}."
    except Exception as e:  # noqa: BLE001
        return f"Could not launch {name}: {e}"


def open_url(url: str) -> str:
    """Open a URL in the default browser."""
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    webbrowser.open(url)
    return f"Opened {url}"


# --- keyboard / mouse --------------------------------------------------------
def type_text(text: str, interval: float = 0.01) -> str:
    """Type text into the currently focused window."""
    _pyautogui().write(text, interval=interval)
    return f"Typed {len(text)} characters."


def press_keys(keys: str) -> str:
    """Press a hotkey combo, e.g. 'ctrl+s' or 'cmd+space' or 'enter'."""
    parts = [k.strip() for k in keys.replace("+", " ").split() if k.strip()]
    if len(parts) == 1:
        _pyautogui().press(parts[0])
    else:
        _pyautogui().hotkey(*parts)
    return f"Pressed {keys}."


def mouse_click(x: int | None = None, y: int | None = None, button: str = "left") -> str:
    """Click the mouse, optionally moving to (x, y) first."""
    pg = _pyautogui()
    if x is not None and y is not None:
        pg.click(x=x, y=y, button=button)
        return f"Clicked {button} at ({x}, {y})."
    pg.click(button=button)
    return f"Clicked {button}."


def screenshot(path: str | None = None) -> str:
    """Capture the screen to a PNG and return the file path."""
    pg = _pyautogui()
    out = Path(path) if path else Path.home() / ".bermi" / "screenshot.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    pg.screenshot(str(out))
    return f"Saved screenshot to {out}"


# --- files -------------------------------------------------------------------
def list_dir(path: str = ".") -> str:
    p = Path(path).expanduser()
    if not p.exists():
        return f"No such path: {p}"
    items = sorted(p.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
    lines = [f"{'📁' if i.is_dir() else '📄'} {i.name}" for i in items[:200]]
    return f"{p}\n" + "\n".join(lines) if lines else f"{p} (empty)"


def read_file(path: str, max_chars: int = 8000) -> str:
    p = Path(path).expanduser()
    if not p.exists():
        return f"No such file: {p}"
    text = p.read_text(errors="replace")
    return text[:max_chars] + ("\n… (truncated)" if len(text) > max_chars else "")


def write_file(path: str, content: str) -> str:
    p = Path(path).expanduser()
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(content)
    return f"Wrote {len(content)} chars to {p}"


# --- system info -------------------------------------------------------------
def system_info() -> str:
    import psutil  # noqa: PLC0415
    vm = psutil.virtual_memory()
    return (
        f"OS: {platform.platform()}\n"
        f"CPU: {psutil.cpu_percent(interval=0.3)}% across {psutil.cpu_count()} cores\n"
        f"RAM: {vm.percent}% used ({vm.used // 2**20} / {vm.total // 2**20} MB)\n"
        f"User: {os.getlogin() if hasattr(os, 'getlogin') else '?'}\n"
        f"CWD: {os.getcwd()}"
    )


def list_processes(limit: int = 15) -> str:
    import psutil  # noqa: PLC0415
    procs = []
    for pr in psutil.process_iter(["pid", "name", "cpu_percent"]):
        procs.append(pr.info)
    procs.sort(key=lambda x: x.get("cpu_percent") or 0, reverse=True)
    lines = [f"{p['pid']:>7}  {p.get('cpu_percent', 0):>5}%  {p['name']}" for p in procs[:limit]]
    return "   PID   CPU%  NAME\n" + "\n".join(lines)


def set_volume(level: int) -> str:
    """Set system volume 0-100 (best-effort per OS)."""
    level = max(0, min(100, int(level)))
    try:
        if SYSTEM == "Darwin":
            subprocess.run(["osascript", "-e", f"set volume output volume {level}"])
        elif SYSTEM == "Linux":
            subprocess.run(["amixer", "-D", "pulse", "sset", "Master", f"{level}%"])
        else:  # Windows
            return "Volume control on Windows needs a helper (e.g. nircmd). Skipped."
        return f"Volume set to {level}%."
    except Exception as e:  # noqa: BLE001
        return f"Could not set volume: {e}"


def clipboard(action: str = "get", text: str = "") -> str:
    import pyperclip  # noqa: PLC0415
    if action == "set":
        pyperclip.copy(text)
        return "Clipboard set."
    return f"Clipboard: {pyperclip.paste()}"


# Which tools are considered "sensitive" and go through the confirmation gate.
SENSITIVE = {"run_shell", "write_file", "press_keys", "type_text", "mouse_click", "set_volume"}
