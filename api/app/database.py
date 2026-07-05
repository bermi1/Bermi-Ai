from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import NullPool

from .config import get_settings

settings = get_settings()


def _normalize_db_url(url: str) -> str:
    """Hosting providers (Supabase, Render, Railway, Heroku) hand out
    postgres:// or postgresql:// URLs; SQLAlchemy needs the psycopg driver
    spelled out."""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


def _engine_kwargs(url: str) -> dict:
    kwargs: dict = {"pool_pre_ping": True}
    # Supabase's transaction-mode pooler (port 6543) is PgBouncer-style:
    # server-side prepared statements and client pooling must be disabled.
    if ":6543" in url:
        kwargs["poolclass"] = NullPool
        kwargs["connect_args"] = {"prepare_threshold": None}
    return kwargs


_db_url = _normalize_db_url(settings.database_url)
engine = create_engine(_db_url, **_engine_kwargs(_db_url))
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Create the pgvector extension and all tables."""
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    from . import models  # noqa: F401  (register models with Base)

    Base.metadata.create_all(bind=engine)

    # Lightweight idempotent upgrades for databases created by earlier
    # versions (create_all does not alter existing tables).
    with engine.connect() as conn:
        for ddl in (
            "ALTER TABLE documents ADD COLUMN IF NOT EXISTS scope VARCHAR(16) DEFAULT 'org' NOT NULL",
            "ALTER TABLE documents ALTER COLUMN org_id DROP NOT NULL",
            "ALTER TABLE document_chunks ALTER COLUMN org_id DROP NOT NULL",
            # Organisations are now optional on accounts and their content.
            "ALTER TABLE users ALTER COLUMN org_id DROP NOT NULL",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT TRUE NOT NULL",
            "ALTER TABLE conversations ALTER COLUMN org_id DROP NOT NULL",
            "ALTER TABLE artifacts ALTER COLUMN org_id DROP NOT NULL",
        ):
            try:
                conn.execute(text(ddl))
            except Exception:
                conn.rollback()
        conn.commit()


def db_session() -> Session:
    """Plain session for background tasks (caller must close)."""
    return SessionLocal()
