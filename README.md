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
- **Niche-profile onboarding** — a skippable guided interview on first sign-in: Bermi AI asks
  what the user does, studies, and wants to achieve, then writes a personal profile document
  and identifies their niche. The profile is injected into every subsequent chat and generated
  document, so answers are personalised to the individual. Redo anytime from "My niche".
- **Private policy library** — a system-wide knowledge scope (e.g. Tanzania Development Vision
  2050, sector strategies, regulatory guidance) that informs answers for *every* organisation
  with precise citations, but is never listed in any organisation's knowledge base. Managed
  only by super admins (emails in `SUPER_ADMIN_EMAILS`), or seeded in bulk with
  `scripts/seed_system_docs.py`.
- **Bermi AI v1 identity** — the assistant always identifies as the Bermi AI v1 model built by
  Bemri Tech Company and never reveals third-party providers, regardless of what runs
  underneath (`MODEL_DISPLAY_NAME`).
- **Integrations framework** — groundwork for Bermi AI beyond chat; Google Calendar activates
  once `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` OAuth credentials are configured.

## Architecture

```
/           Next.js 14 + React + TypeScript + Tailwind (PWA frontend)
api/        FastAPI (Python) — auth, chat streaming (SSE), RAG, ingestion, docgen
            Deployed as a Vercel Python function; /api/* routes hit FastAPI
            PostgreSQL + pgvector (Supabase) — users, orgs, chunks + embeddings
```

Production runs entirely on **Vercel (frontend + backend together) + Supabase
(database)** — see `DEPLOYMENT.md`.

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
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd api && DATABASE_URL=postgresql+psycopg://bermi:bermi@localhost:5432/bermi_ai \
  ../.venv/bin/uvicorn app.main:app --reload --port 8000

# Frontend (repo root)
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
| `MODEL_DISPLAY_NAME` | Public model identity (default "Bermi AI v1"). |
| `SUPER_ADMIN_EMAILS` | Comma-separated emails promoted to super admin on sign-in. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth credentials for the Calendar integration. |

**Never commit API keys.** `LLM_API_KEY` belongs in the deployment environment or a local
`.env` (which is gitignored) — a key that has been shared in chat or committed should be
rotated at the provider.

Changing `EMBEDDINGS_DIMENSIONS` after documents have been ingested requires re-creating the
`document_chunks` table (the pgvector column has a fixed dimension).

## How the pieces map to the spec

| Spec item | Where |
|---|---|
| Model router | `api/app/services/model_router.py` |
| Structure-aware chunking | `api/app/services/ingestion.py` |
| Org-scoped retrieval + citation context | `api/app/services/rag.py` |
| System prompts / restricted student mode | `api/app/services/prompts.py` |
| 6-part proposal structure + .docx output | `api/app/services/docgen.py`, `routers/generate.py` |
| Streaming chat (SSE) | `api/app/routers/chat.py`, `lib/api.ts` |
| Artifact panel & citation viewer | `components/ArtifactPanel.tsx` |
| PWA shell | `public/manifest.webmanifest`, `public/sw.js` |

## Roadmap (later phases)

Phase 2: Education vertical (Bermi Study) · Phase 3: Legal + Audit verticals · Phase 4:
self-hosted open-source model infrastructure and the continuous fine-tuning loop · Phase 5:
app-builder mode. See the full build specification for details.
