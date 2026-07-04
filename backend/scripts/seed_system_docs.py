"""Seed the private, system-wide policy library.

Place official policy documents (PDF/DOCX/TXT) in a folder — e.g. Tanzania
Development Vision 2050, sector strategies, TRA/BRELA/NBAA guidance — and run:

    cd backend
    .venv/bin/python -m scripts.seed_system_docs /path/to/policy_folder

Each file is ingested with scope="system": it informs (and is cited in)
answers for every organisation, but is never listed in any organisation's
knowledge base. Only super admins see and manage the library.
"""

import asyncio
import os
import shutil
import sys
import uuid

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.config import get_settings  # noqa: E402
from app.database import db_session, init_db  # noqa: E402
from app.models import Document, User  # noqa: E402
from app.services.ingestion import _process  # noqa: E402

ALLOWED = (".pdf", ".docx", ".txt", ".md")


async def seed(folder: str) -> None:
    init_db()
    settings = get_settings()
    db = db_session()
    try:
        uploader = (
            db.query(User).filter(User.role == "super_admin").first()
            or db.query(User).first()
        )
        if uploader is None:
            print("No users exist yet — register an account first, then re-run.")
            return

        system_dir = os.path.join(settings.upload_dir, "system")
        os.makedirs(system_dir, exist_ok=True)

        files = [f for f in sorted(os.listdir(folder)) if f.lower().endswith(ALLOWED)]
        if not files:
            print(f"No {ALLOWED} files found in {folder}")
            return

        for name in files:
            src = os.path.join(folder, name)
            existing = (
                db.query(Document)
                .filter(Document.scope == "system", Document.filename == name)
                .first()
            )
            if existing is not None:
                print(f"skip (already seeded): {name}")
                continue
            dest = os.path.join(system_dir, f"{uuid.uuid4().hex}_{name}")
            shutil.copyfile(src, dest)
            doc = Document(
                org_id=None,
                scope="system",
                uploaded_by=uploader.id,
                filename=name,
                content_type="application/octet-stream",
                storage_path=dest,
                status="processing",
            )
            db.add(doc)
            db.commit()
            with open(src, "rb") as f:
                data = f.read()
            print(f"ingesting: {name} ({len(data) // 1024} KB)…")
            await _process(doc.id, data)
            db.refresh(doc)
            print(f"  -> {doc.status}, {doc.chunk_count} chunks")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    asyncio.run(seed(sys.argv[1]))
