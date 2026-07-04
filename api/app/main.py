from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_db
from .routers import auth, chat, conversations, documents, generate, integrations, onboarding

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Bermi AI",
    description="Tanzania-native AI assistant platform — chat, document-grounded "
    "retrieval with citations, and professional document generation.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(conversations.router)
app.include_router(chat.router)
app.include_router(documents.router)
app.include_router(generate.router)
app.include_router(onboarding.router)
app.include_router(integrations.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "bermi-ai"}
