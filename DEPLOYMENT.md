# Deploying Bermi AI (go live)

Bermi AI is two deployable pieces: the **backend** (FastAPI + Postgres/pgvector) and the
**frontend** (Next.js PWA on Vercel). Total time: about 15 minutes.

## Step 1 — Backend on Render (free/starter tier)

1. Go to https://render.com → sign in with GitHub.
2. Click **New → Blueprint** and select this repository. Render reads `render.yaml`
   and creates the backend service plus a Postgres 16 database automatically.
3. When prompted for environment variables, set:
   - `LLM_API_KEY` — your OpenRouter key (never commit it to the repository).
   - `SUPER_ADMIN_EMAILS` — your email, e.g. `basilrealestatecompany@gmail.com`.
   - `CORS_ORIGINS` — leave blank for now; you'll set it after Step 2.
4. Deploy. When it's live, note the backend URL, e.g. `https://bermi-ai-backend.onrender.com`.
5. Enable pgvector: open the database in Render → **Connect → External** → run
   `CREATE EXTENSION IF NOT EXISTS vector;` (Render Postgres supports pgvector).
   The app also attempts this automatically on startup.

## Step 2 — Frontend on Vercel

1. Go to https://vercel.com → **Add New → Project** → import this GitHub repository.
2. Set **Root Directory** to `frontend` (Framework: Next.js is auto-detected).
3. Add one environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL from Step 1
     (e.g. `https://bermi-ai-backend.onrender.com` — no trailing slash).
4. Deploy. Your app is live at `https://<project>.vercel.app`.

## Step 3 — Connect the two

1. Back in Render, set the backend's `CORS_ORIGINS` to your Vercel URL
   (e.g. `https://bermi-ai.vercel.app`) and redeploy.
2. Open the Vercel URL, register your account (it becomes the organisation admin;
   your email in `SUPER_ADMIN_EMAILS` is promoted to super admin on sign-in).

## Step 4 — Load the private policy library

As super admin, open **Knowledge base → 🔒 Policy library** in the app and upload
Tanzania Development Vision 2050 and other strategic documents — they will inform
answers for every organisation with citations, without being publicly listed.
(Bulk option: `backend/scripts/seed_system_docs.py`.)

## Custom domain

Add your domain (e.g. `ai.bemri.co.tz`) in Vercel → Project → Settings → Domains,
then update `CORS_ORIGINS` on Render to match.

## Notes

- Vercel hosts only the frontend — the Python backend and database cannot run on
  Vercel, which is why Render (or Railway/Fly.io, same idea) hosts them.
- The Render starter plan sleeps on the free tier after inactivity; the first
  request after idle takes ~30 s. Upgrade the plan to keep it always-on.
- Keys live only in the hosting dashboards. If a key has ever been shared in chat
  or committed, rotate it at the provider.
