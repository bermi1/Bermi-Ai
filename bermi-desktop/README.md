# Bermi Desktop — your local Jarvis 🛰️

A voice-driven AI assistant that runs **on your own computer** and can actually
control it: run terminal commands, open apps, type, click, take screenshots,
read/write files, check system stats, and talk back to you — all driven by an
OpenRouter model brain, local Whisper speech recognition, and a natural TTS
voice, wrapped in a Jarvis-style UI.

> **Why local?** Controlling your keyboard, mouse, shell and files can only
> happen on the machine you're sitting at. Bermi is a small local server you
> launch yourself; nothing about your computer leaves it except the text you
> send to the OpenRouter model.

---

## Features

- 🎙️ **Voice in** — hold **Space** (or the mic button) to talk; transcribed
  locally with [faster-whisper](https://github.com/SYSTRAN/faster-whisper).
- 🔊 **Voice out** — natural replies via `edge-tts` (offline `pyttsx3` fallback).
- 🧠 **Brain** — any model on [OpenRouter](https://openrouter.ai/models).
- 🖥️ **Computer control** — shell, launch apps, keyboard/mouse, screenshots,
  files, processes, volume, clipboard, web.
- 🛡️ **Safety gate** — sensitive actions pop a confirmation you must approve,
  and a blocklist hard-stops dangerous commands.
- ✨ **Jarvis UI** — animated arc-reactor orb, live mic waveform, conversation
  transcript and a system-activity console.

---

## Quick start

```bash
cd bermi-desktop

# 1) Install dependencies (Python 3.10+)
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 2) Configure
cp .env.example .env
#    → open .env and paste your OpenRouter key (get one at openrouter.ai/keys)

# 3) Launch — opens the UI in your browser
python -m bermi
```

Then click the orb (or hold **Space**) and say something like:

- “Open my browser and search for the weather.”
- “Take a screenshot.”
- “What's using the most CPU right now?”
- “Create a file called notes.txt on my desktop that says hello.”

### Platform notes
- **Linux**: `sudo apt-get install scrot python3-tk python3-dev ffmpeg` (needed
  by pyautogui + whisper audio decoding).
- **macOS**: grant your terminal **Accessibility** and **Screen Recording**
  permission (System Settings → Privacy) so Bermi can control the mouse/keyboard.
- **Windows**: works out of the box; volume control needs a helper like `nircmd`.
- **GPU**: set `WHISPER_DEVICE=cuda` and `WHISPER_COMPUTE=float16` in `.env`.

---

## Safety

Bermi can run real commands on your machine. Keep `REQUIRE_CONFIRMATION=true`
(the default) so shell/file/keyboard/mouse actions ask before executing. The
`BLOCKED_COMMANDS` list in `.env` is always refused. Review what you approve.

## Security

Your `.env` (with the API key) is **gitignored** and never committed. If you
ever paste a key into a chat or share it, rotate it at
[openrouter.ai/keys](https://openrouter.ai/keys).

## Architecture

```
python -m bermi ──► FastAPI (bermi/server.py) ──► static Jarvis UI
                         │
      ┌──────────────────┼───────────────────────┐
   agent.py            stt.py                    tts.py
 (OpenRouter loop)  (faster-whisper)         (edge-tts / pyttsx3)
      │
   tools/computer.py  ← shell · apps · keyboard · mouse · files · system
```
