"""Onboarding: a short guided interview that builds the user's niche profile.

The answers are sent to the model, which writes a personal profile document
(About You / Strengths & Assets / Your Niche / Next Steps) plus a one-line
niche summary. Both are stored and injected into future chats so Bermi AI
understands the person it is talking to. Onboarding is always skippable and
can be redone at any time.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_current_user
from ..database import get_db
from ..models import User, UserProfile
from ..schemas import OnboardingSubmit, ProfileOut
from ..services.model_router import model_router
from ..services.prompts import build_onboarding_system

router = APIRouter(prefix="/api/onboarding", tags=["onboarding"])

NICHE_MARKER = "NICHE_SUMMARY:"


def get_profile(db: Session, user_id: str) -> UserProfile | None:
    return db.execute(
        select(UserProfile).where(UserProfile.user_id == user_id)
    ).scalar_one_or_none()


def _to_out(profile: UserProfile | None) -> ProfileOut:
    if profile is None:
        return ProfileOut(status="pending")
    return ProfileOut(
        status=profile.status,
        profile_markdown=profile.profile_markdown,
        niche_summary=profile.niche_summary,
    )


@router.get("", response_model=ProfileOut)
def read_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _to_out(get_profile(db, user.id))


@router.post("/skip", response_model=ProfileOut)
def skip_onboarding(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = get_profile(db, user.id)
    if profile is None:
        profile = UserProfile(user_id=user.id, status="skipped")
        db.add(profile)
    elif profile.status != "completed":
        profile.status = "skipped"
    db.commit()
    return _to_out(profile)


@router.post("", response_model=ProfileOut)
async def submit_onboarding(
    body: OnboardingSubmit,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    answered = {q: a.strip() for q, a in body.answers.items() if a.strip()}
    if not answered:
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Answer at least one question")

    qa_text = "\n\n".join(f"Q: {q}\nA: {a}" for q, a in answered.items())
    output = await model_router.complete(
        [
            {"role": "system", "content": build_onboarding_system(user.name)},
            {"role": "user", "content": f"My onboarding answers:\n\n{qa_text}"},
        ],
        task="chat",
        max_tokens=2048,
    )

    niche_summary = None
    profile_markdown = output.strip()
    if NICHE_MARKER in output:
        profile_markdown, _, tail = output.rpartition(NICHE_MARKER)
        profile_markdown = profile_markdown.strip()
        niche_summary = tail.strip().splitlines()[0].strip() if tail.strip() else None

    profile = get_profile(db, user.id)
    if profile is None:
        profile = UserProfile(user_id=user.id)
        db.add(profile)
    profile.status = "completed"
    profile.answers = answered
    profile.profile_markdown = profile_markdown
    profile.niche_summary = niche_summary
    db.commit()
    return _to_out(profile)
