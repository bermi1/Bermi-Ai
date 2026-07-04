from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from .config import get_settings

settings = get_settings()

engine = create_engine(settings.database_url, pool_pre_ping=True)
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
        ):
            conn.execute(text(ddl))
        conn.commit()


def db_session() -> Session:
    """Plain session for background tasks (caller must close)."""
    return SessionLocal()
