# Bermi AI

**The AI operating system for Tanzanian institutions, students, and professionals** — built on
open-source models, grounded in your organisation's documents, and designed to work the way
Tanzania actually works.

This repository contains the Phase 1 MVP described in the Bermi AI build specification:

- **Claude-style chat interface** — left sidebar with conversation history, calm neutral design,
  token-by-token streaming responses, light and dark mode, fully responsive down to low-end
  Android screens.
- **Document-grounded RAG with citations** — upload PDF/DOCX/TXT documents; they are extracted,
  chunked with structural metadata (page numbers, Article/Section/Chapter headings in English
  and Swahili), embedded, and stored in Postgres + pgvector. Answers drawn from documents carry
  clickable `[n]` citations that open the exact cited passage in a side panel.
- **Artifact panel + document generation** — `/proposal`, `/letter`, `/report` slash commands
  generate professional documents following the 6-part proposal structure (Who We Are → Who You
  Are → What We're Proposing → What You'll Gain → How We Work → Why Us), shown in a right-side
  artifact panel and downloadable as Word (.docx).
- **Multi-tenant organisations with roles** — every document, conversation, and chunk is scoped
  by `org_id`. Roles: `student`, `teacher`, `org_admin`, `super_admin`. Student accounts are
  restricted: they can only query their organisation's uploaded materials (no general-knowledge
  fallback), cannot upload documents, and cannot generate documents. Members join an
  organisation with its invite code.
- **Model router** — all LLM access goes through a single config-driven router (OpenRouter or
  any OpenAI-compatible API). Models are swapped via environment variables, never hardcoded.
  With no API key configured, the platform runs fully offline in dev mode with placeholder
  streaming so every flow remains testable.
- **Installable PWA** — web manifest, icons, and an offline-shell service worker; users can
  "Install Bermi AI" to their desktop or phone home screen.

## Architecture

```
frontend/   Next.js 14 + React + TypeScript + Tailwind (PWA)
backend/    FastAPI (Python) — auth, chat streaming (SSE), RAG, ingestion, docgen
            PostgreSQL + pgvector — users, orgs, conversations, chunks + embeddings
```

## Quick start (Docker)

```bash
cp .env.example .env          # add your OpenRouter key as LLM_API_KEY (optional)
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API + docs: http://localhost:8000/docs

## Quick start (local development)

Requirements: Python 3.11+, Node 20+, PostgreSQL 16 with the pgvector extension.

```bash
# Database (once)
createuser bermi -P            # password: bermi
createdb bermi_ai -O bermi
psql bermi_ai -c "CREATE EXTENSION vector"

# Backend
cd backend
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
DATABASE_URL=postgresql+psycopg://bermi:bermi@localhost:5432/bermi_ai \
  .venv/bin/uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev                    # http://localhost:3000
```

Tables and the pgvector extension are created automatically on backend startup.

## Configuration

All settings are environment variables — see `.env.example`. The important ones:

| Variable | Purpose |
|---|---|
| `LLM_API_KEY` | OpenRouter (or compatible) API key. Empty = offline dev mode. |
| `LLM_CHAT_MODEL` | Default chat model (e.g. `qwen/qwen3-32b`). |
| `LLM_LIGHT_MODEL` | Cheaper model used for restricted student accounts. |
| `EMBEDDINGS_API_KEY` | Embeddings API key. Empty = deterministic local dev embedder. |
| `EMBEDDINGS_MODEL` | Multilingual embedding model (e.g. `baai/bge-m3` — handles Swahili). |
| `EMBEDDINGS_DIMENSIONS` | Vector dimension; must match the embedding model (default 1024). |
| `JWT_SECRET` | Auth token secret — set a real one in production. |

Changing `EMBEDDINGS_DIMENSIONS` after documents have been ingested requires re-creating the
`document_chunks` table (the pgvector column has a fixed dimension).

## How the pieces map to the spec

| Spec item | Where |
|---|---|
| Model router | `backend/app/services/model_router.py` |
| Structure-aware chunking | `backend/app/services/ingestion.py` |
| Org-scoped retrieval + citation context | `backend/app/services/rag.py` |
| System prompts / restricted student mode | `backend/app/services/prompts.py` |
| 6-part proposal structure + .docx output | `backend/app/services/docgen.py`, `routers/generate.py` |
| Streaming chat (SSE) | `backend/app/routers/chat.py`, `frontend/lib/api.ts` |
| Artifact panel & citation viewer | `frontend/components/ArtifactPanel.tsx` |
| PWA shell | `frontend/public/manifest.webmanifest`, `frontend/public/sw.js` |

## Roadmap (later phases)

Phase 2: Education vertical (Bermi Study) · Phase 3: Legal + Audit verticals · Phase 4:
self-hosted open-source model infrastructure and the continuous fine-tuning loop · Phase 5:
app-builder mode. See the full build specification for details.
