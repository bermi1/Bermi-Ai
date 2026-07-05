"""Vercel serverless entry point for the Bermi AI backend.

Vercel routes every /api/* request here (see vercel.json rewrites); the
FastAPI application in api/app handles the actual routing.
"""

import logging
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.main import app  # noqa: E402,F401

# Ensure the schema exists at cold-start import time. Some serverless ASGI
# adapters do not fire FastAPI lifespan startup events, so we cannot rely on
# the lifespan hook alone to run migrations. init_db() is idempotent.
try:
    from app.database import init_db  # noqa: E402

    init_db()
except Exception:  # never crash the function on a transient DB hiccup
    logging.getLogger("bermi.startup").exception("init_db at import failed")
