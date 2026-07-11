"""Runtime configuration, loaded from environment / .env."""
from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    # OpenRouter
    openrouter_api_key: str = ""
    bermi_model: str = "anthropic/claude-3.7-sonnet"
    openrouter_base_url: str = "https://openrouter.ai/api/v1"

    # Whisper (STT)
    whisper_model: str = "base"
    whisper_device: str = "cpu"
    whisper_compute: str = "int8"

    # TTS
    tts_engine: str = "edge"          # edge | pyttsx3 | off
    tts_voice: str = "en-GB-RyanNeural"

    # Safety
    require_confirmation: bool = True
    blocked_commands: str = "rm -rf /,mkfs,shutdown -h now,dd if="

    # Server / persona
    host: str = "127.0.0.1"
    port: int = 8787
    assistant_name: str = "Bermi"

    @property
    def blocked_list(self) -> list[str]:
        return [c.strip() for c in self.blocked_commands.split(",") if c.strip()]


settings = Settings()
