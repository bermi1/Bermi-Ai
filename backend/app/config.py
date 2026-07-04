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

    # Embeddings (OpenAI-compatible /embeddings endpoint)
    embeddings_api_base: str = "https://openrouter.ai/api/v1"
    embeddings_api_key: str = ""
    embeddings_model: str = "baai/bge-m3"
    embeddings_dimensions: int = 1024

    # Storage
    upload_dir: str = "./uploads"

    # CORS
    cors_origins: str = "http://localhost:3000"

    # RAG
    rag_top_k: int = 6
    chunk_size: int = 1400
    chunk_overlap: int = 200

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
