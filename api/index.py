"""Vercel serverless entry point for the Bermi AI backend.

Vercel routes every /api/* request here (see vercel.json rewrites); the
FastAPI application in api/app handles the actual routing.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from app.main import app  # noqa: E402,F401
