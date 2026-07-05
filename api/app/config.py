import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql+psycopg://bermi:bermi@localhost:5432/bermi_ai"

    # Auth
    jwt_secret: str = "dev-secret-do-not-use-in-prod"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 10080  # 7 days

    # Model router — swappable via config, never hardcoded in call sites.
    llm_api_base: str = "https://openrouter.ai/api/v1"
    llm_api_key: str = ""
    llm_chat_model: str = "qwen/qwen3-32b"
    llm_light_model: str = "meta-llama/llama-3.1-8b-instruct"
    # Public-facing model identity. The assistant introduces itself with this
    # name and never reveals the underlying provider or model.
    model_display_name: str = "Bermi AI v1"

    # Comma-separated emails that are promoted to super_admin on login/register.
    # Super admins manage the private system-wide policy library.
    super_admin_emails: str = ""

    # Google integration (Calendar) — leave empty until OAuth credentials exist.
    google_client_id: str = ""
    google_client_secret: str = ""

    # Embeddings (OpenAI-compatible /embeddings endpoint)
    embeddings_api_base: str = "https://openrouter.ai/api/v1"
    embeddings_api_key: str = ""
    embeddings_model: str = "baai/bge-m3"
    embeddings_dimensions: int = 1024

    # Storage
    # On Vercel the filesystem is read-only except /tmp.
    upload_dir: str = "/tmp/uploads" if os.environ.get("VERCEL") else "./uploads"

    # CORS
    cors_origins: str = "http://localhost:3000"

    # RAG
    rag_top_k: int = 6
    chunk_size: int = 1400
    chunk_overlap: int = 200

    # Public demo chat — messages a guest may send per IP per day.
    demo_daily_limit: int = 6

    # Email (branded verification / reset). When SMTP is unset, email sending
    # is disabled and accounts are active immediately (login is never gated).
    require_email_verification: bool = False
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    email_from: str = "Bermi AI <no-reply@bermitechs.com>"
    app_base_url: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def super_admin_email_list(self) -> list[str]:
        return [e.strip().lower() for e in self.super_admin_emails.split(",") if e.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
