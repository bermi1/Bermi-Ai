# Deploying Bermi AI (go live — Vercel + Supabase only)

The entire application runs on two free services:

| Piece | Host | Plan |
|---|---|---|
| Database (Postgres + pgvector) | Supabase | Free |
| Frontend + Backend (one deployment) | Vercel | Hobby (free) |

The Next.js frontend and the FastAPI backend deploy together as a single
Vercel project: the frontend is served statically and every `/api/*` request
runs the Python function in `api/index.py`. Same origin, no CORS setup.

## Step 1 — Supabase (database)

Already provisioned: project **bermi-ai** (`zhyorwmqyhkawlyowbxe`, eu-central-1)
with the full schema, pgvector, Row Level Security, and a dedicated backend
role. If you ever recreate it: create a free project, enable the `vector`
extension, and run the migrations in order (they are tracked in the project's
migration history).

## Step 2 — Vercel environment variables

In Vercel → project **bermi-ai** → Settings → Environment Variables, add
(for Production):

| Variable | Value |
|---|---|
| `DATABASE_URL` | the Supabase Session-pooler URI for the backend role (ask Bermi AI's maintainer, or build it from the dashboard's Connect dialog) |
| `JWT_SECRET` | a long random string (`python -c "import secrets; print(secrets.token_hex(32))"`) |
| `LLM_API_KEY` | your OpenRouter API key |
| `SUPER_ADMIN_EMAILS` | your email — grants super admin on sign-in |

Then **Deployments → ⋯ on the latest → Redeploy** so the variables take effect.

## Step 3 — Verify

- `https://<your-app>.vercel.app/api/health` → `{"status":"ok"}`
- Open `https://<your-app>.vercel.app`, register, and you're live.

## Step 4 — Load the private policy library

As super admin, open **Knowledge base → 🔒 Policy library** and upload
Tanzania Development Vision 2050 and other strategic documents — they inform
answers for every organisation with citations, without being listed publicly.

## Custom domain

Vercel → Project → Settings → Domains → add e.g. `ai.bemri.co.tz`.

## Platform notes

- **Serverless files are temporary**: original uploads and generated .docx
  files live in `/tmp` and vanish between invocations — but all indexed
  document text, embeddings, citations, accounts, chats, and profiles are in
  Supabase and permanent. Word downloads work right after generation.
- **Function limits (Hobby)**: 60 s max per request — fine for chat
  streaming and document uploads of normal size.
- **Supabase free** pauses after ~1 week of no traffic; one click resumes it.
- **Local development** still works the classic way:
  `docker compose up` (full stack), or `uvicorn app.main:app` from `api/`
  plus `npm run dev` at the root.
