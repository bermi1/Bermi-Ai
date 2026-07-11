"""Entry point: `python -m bermi` — starts the server and opens the UI."""
from __future__ import annotations

import threading
import time
import webbrowser

import uvicorn

from .config import settings


def _open_browser() -> None:
    time.sleep(1.2)
    webbrowser.open(f"http://{settings.host}:{settings.port}")


def main() -> None:
    banner = f"""
    ╔══════════════════════════════════════════════╗
       {settings.assistant_name.upper()}  ·  online
       model : {settings.bermi_model}
       voice : whisper[{settings.whisper_model}] → {settings.tts_engine}
       url   : http://{settings.host}:{settings.port}
    ╚══════════════════════════════════════════════╝
    """
    print(banner)
    threading.Thread(target=_open_browser, daemon=True).start()
    uvicorn.run("bermi.server:app", host=settings.host, port=settings.port, log_level="info")


if __name__ == "__main__":
    main()
