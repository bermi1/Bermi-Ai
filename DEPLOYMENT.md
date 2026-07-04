# Deploying Bermi AI (go live — free tier)

The whole trial stack runs at **$0/month**:

| Piece | Host | Plan |
|---|---|---|
| Database (Postgres + pgvector) | Supabase | Free |
| Backend (FastAPI) | Render | Free |
| Frontend (Next.js PWA) | Vercel | Hobby (free) |

Total setup time: about 15 minutes.

## Step 1 — Database on Supabase (free, 5 min)

1. Go to https://supabase.com → sign in with GitHub → **New project**.
   - Name: `bermi-ai` · Region: pick the closest (e.g. Frankfurt or Mumbai for Tanzania).
   - Save the database password you choose — you need it in a moment.
2. Enable the vector extension: in the project, open **Database → Extensions**,
   search for `vector`, and switch it on. (The app also runs
   `CREATE EXTENSION IF NOT EXISTS vector` on startup as a backup.)
3. Get the connection string: click **Connect** (top bar) → choose
   **Session pooler** → copy the URI. It looks like:
   `postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
   Replace `[YOUR-PASSWORD]` with your database password.

   Use the **Session pooler** string (port **5432**) — it works everywhere.
   (The app also supports the transaction pooler on port 6543 automatically,
   but session mode is the simplest.)

## Step 2 — Backend on Render (free, 5 min)

1. Go to https://render.com → sign in with GitHub → **New → Blueprint** →
   select this repository. Render reads `render.yaml` automatically.
2. When prompted for environment variables, paste:
   - `DATABASE_URL` — the Supabase connection string from Step 1.
   - `LLM_API_KEY` — your OpenRouter key (never commit it to the repository).
   - `SUPER_ADMIN_EMAILS` — your email (this makes you super admin).
   - `CORS_ORIGINS` — leave blank for now; set it after Step 3.
3. Deploy, then note the backend URL, e.g. `https://bermi-ai-backend.onrender.com`.
   Check it's alive: open `<backend-url>/api/health` → `{"status":"ok"}`.

## Step 3 — Frontend on Vercel (free, 5 min)

1. Go to https://vercel.com → **Add New → Project** → import this repository.
2. Set **Root Directory** to `frontend` (Next.js is auto-detected).
3. Add one environment variable:
   - `NEXT_PUBLIC_API_URL` = your Render backend URL (no trailing slash).
4. Deploy. Your app is live at `https://<project>.vercel.app`.

## Step 4 — Connect the two

1. In Render, set the backend's `CORS_ORIGINS` to your Vercel URL
   (e.g. `https://bermi-ai.vercel.app`) and let it redeploy.
2. Open the Vercel URL, register your account — your email in
   `SUPER_ADMIN_EMAILS` is promoted to super admin on sign-in.

## Step 5 — Load the private policy library

As super admin, open **Knowledge base → 🔒 Policy library** in the app and upload
Tanzania Development Vision 2050 and other strategic documents — they inform
answers for every organisation with citations, without being publicly listed.

## Custom domain

Add your domain (e.g. `ai.bemri.co.tz`) in Vercel → Project → Settings → Domains,
then update `CORS_ORIGINS` on Render to match.

## Free-tier limits to know

- **Render free** sleeps after ~15 min idle; the first request after that takes
  ~30 s. It also has no persistent disk: original uploaded files and generated
  .docx downloads are lost on restart — but everything that matters (accounts,
  chats, indexed document text, embeddings, citations, profiles) lives in
  Supabase and is safe. Upgrade to the `starter` plan + a disk to keep files.
- **Supabase free** gives 500 MB of database storage and pauses projects after
  ~1 week of no traffic (one click to resume in the dashboard).
- Keys live only in the hosting dashboards. If a key has ever been shared in
  chat or committed, rotate it at the provider.
