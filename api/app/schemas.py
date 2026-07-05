from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=255)
    password: str = Field(min_length=8, max_length=128)
    # Either create a new organization…
    organization_name: str | None = None
    # …or join an existing one with its join code.
    join_code: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class OrganizationOut(BaseModel):
    id: str
    name: str
    vertical: str
    join_code: str | None = None  # only shown to org admins

    class Config:
        from_attributes = True


class UserOut(BaseModel):
    id: str
    email: str
    name: str
    role: str
    org_id: str | None = None
    organization: OrganizationOut | None = None
    onboarding_status: str = "pending"  # pending|completed|skipped

    class Config:
        from_attributes = True


# ── Conversations / chat ──────────────────────────────────────────────
class ConversationCreate(BaseModel):
    title: str | None = None
    mode: str = "general"


class ConversationOut(BaseModel):
    id: str
    title: str
    mode: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class SourceOut(BaseModel):
    index: int
    document_id: str
    document_name: str
    chunk_id: str
    page: int | None = None
    section: str | None = None
    snippet: str


class MessageOut(BaseModel):
    id: str
    role: str
    content: str
    sources: list[SourceOut] | None = None
    artifact_id: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    conversation_id: str | None = None
    content: str = Field(min_length=1)
    mode: str = "general"


class DemoChatRequest(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


# ── Onboarding / profile ──────────────────────────────────────────────
class OnboardingSubmit(BaseModel):
    answers: dict[str, str]


class ProfileOut(BaseModel):
    status: str  # pending|completed|skipped
    profile_markdown: str | None = None
    niche_summary: str | None = None


# ── Documents ─────────────────────────────────────────────────────────
class DocumentOut(BaseModel):
    id: str
    filename: str
    content_type: str
    status: str
    scope: str = "org"
    error: str | None = None
    page_count: int
    chunk_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class ChunkOut(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    text: str
    page: int | None = None
    section: str | None = None

    class Config:
        from_attributes = True


# ── Document generation / artifacts ───────────────────────────────────
class GenerateDocumentRequest(BaseModel):
    kind: str = "proposal"  # proposal|letter|report
    title: str | None = None
    brief: str = Field(min_length=1, description="What the document should cover")
    conversation_id: str | None = None
    use_knowledge_base: bool = True


class ArtifactOut(BaseModel):
    id: str
    title: str
    kind: str
    content_markdown: str
    has_docx: bool = False
    created_at: datetime

    class Config:
        from_attributes = True
