import logging
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import create_access_token, get_current_user, hash_password, verify_password
from ..config import get_settings
from ..database import get_db
from ..models import EmailVerificationToken, Organization, User, UserProfile
from ..schemas import LoginRequest, OrganizationOut, RegisterRequest, TokenResponse, UserOut
from ..services import email as email_service

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger("bermi.auth")


def _new_join_code() -> str:
    return secrets.token_hex(4).upper()


def _apply_super_admin(user: User, db: Session) -> None:
    """Emails listed in SUPER_ADMIN_EMAILS are promoted on register/login."""
    if user.email in get_settings().super_admin_email_list and user.role != "super_admin":
        user.role = "super_admin"
        db.commit()


def _issue_verification(user: User, db: Session) -> None:
    """Create a token and send the branded verification email (no-op if SMTP
    is not configured)."""
    settings = get_settings()
    token = EmailVerificationToken(
        user_id=user.id,
        token=secrets.token_urlsafe(32),
        purpose="verify",
        expires_at=datetime.now(timezone.utc) + timedelta(days=3),
    )
    db.add(token)
    db.commit()
    url = f"{settings.app_base_url.rstrip('/')}/verify?token={token.token}"
    subject, html = email_service.verification_email(user.name, url)
    email_service.send_email(user.email, subject, html)


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.execute(select(User).where(User.email == body.email.lower())).scalar_one_or_none()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    # Organisations are optional. Three paths:
    #   • join_code          → join an existing team (restricted member)
    #   • organization_name  → create a new team (you become its admin)
    #   • neither            → a solo individual account (full access, no org)
    if body.join_code:
        org = db.execute(
            select(Organization).where(Organization.join_code == body.join_code.strip().upper())
        ).scalar_one_or_none()
        if org is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Invalid join code")
        org_id = org.id
        role = "student"  # joining members start restricted; admins can promote later
    elif body.organization_name:
        org = Organization(name=body.organization_name.strip(), join_code=_new_join_code())
        db.add(org)
        db.flush()
        org_id = org.id
        role = "org_admin"
    else:
        org_id = None
        role = "individual"

    settings = get_settings()
    # Verification only gates login when explicitly enabled AND email can be
    # sent — otherwise accounts are active immediately so no one is locked out.
    gate = settings.require_email_verification and bool(settings.smtp_host)

    user = User(
        org_id=org_id,
        email=body.email.lower(),
        name=body.name.strip(),
        password_hash=hash_password(body.password),
        role=role,
        email_verified=not gate,
    )
    db.add(user)
    db.commit()
    _apply_super_admin(user, db)

    # Send the branded verification/welcome email (no-op if SMTP is unset).
    try:
        _issue_verification(user, db)
    except Exception:  # never fail sign-up because email failed
        logger.exception("Verification email failed for %s", user.email)

    if gate:
        # Account created but must verify before logging in.
        raise HTTPException(
            status.HTTP_202_ACCEPTED,
            "Account created. Check your email to confirm your address, then log in.",
        )
    return TokenResponse(access_token=create_access_token(user))


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.email == body.email.lower())).scalar_one_or_none()
    if user is None or not verify_password(body.password, user.password_hash):
        # Log the reason server-side; return a single generic message to clients.
        logger.info("Login failed for %s (%s)", body.email, "no user" if user is None else "bad password")
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    settings = get_settings()
    if settings.require_email_verification and settings.smtp_host and not user.email_verified:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "Please confirm your email address first — check your inbox for the link.",
        )
    _apply_super_admin(user, db)
    return TokenResponse(access_token=create_access_token(user))


@router.post("/verify", response_model=TokenResponse)
def verify_email(token: str, db: Session = Depends(get_db)):
    row = db.execute(
        select(EmailVerificationToken).where(EmailVerificationToken.token == token)
    ).scalar_one_or_none()
    now = datetime.now(timezone.utc)
    if row is None or row.used or row.purpose != "verify":
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This verification link is invalid.")
    if row.expires_at.replace(tzinfo=timezone.utc) < now:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This verification link has expired.")
    user = db.get(User, row.user_id)
    if user is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "This verification link is invalid.")
    user.email_verified = True
    row.used = True
    db.commit()
    return TokenResponse(access_token=create_access_token(user))


@router.post("/resend", status_code=202)
def resend_verification(body: LoginRequest, db: Session = Depends(get_db)):
    """Re-send the verification email (requires correct credentials)."""
    user = db.execute(select(User).where(User.email == body.email.lower())).scalar_one_or_none()
    if user and verify_password(body.password, user.password_hash) and not user.email_verified:
        try:
            _issue_verification(user, db)
        except Exception:
            logger.exception("Resend verification failed for %s", user.email)
    # Always 202 — don't reveal whether the account exists.
    return {"detail": "If that account needs verification, a new email is on its way."}


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = db.get(Organization, user.org_id) if user.org_id else None
    org_out = None
    if org:
        org_out = OrganizationOut(
            id=org.id,
            name=org.name,
            vertical=org.vertical,
            # Join code is only revealed to org admins.
            join_code=org.join_code if user.role in ("org_admin", "super_admin") else None,
        )
    profile = db.execute(
        select(UserProfile).where(UserProfile.user_id == user.id)
    ).scalar_one_or_none()
    return UserOut(
        id=user.id, email=user.email, name=user.name, role=user.role,
        org_id=user.org_id, organization=org_out,
        onboarding_status=profile.status if profile else "pending",
    )
