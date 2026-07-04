import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import create_access_token, get_current_user, hash_password, verify_password
from ..config import get_settings
from ..database import get_db
from ..models import Organization, User, UserProfile
from ..schemas import LoginRequest, OrganizationOut, RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/api/auth", tags=["auth"])


def _new_join_code() -> str:
    return secrets.token_hex(4).upper()


def _apply_super_admin(user: User, db: Session) -> None:
    """Emails listed in SUPER_ADMIN_EMAILS are promoted on register/login."""
    if user.email in get_settings().super_admin_email_list and user.role != "super_admin":
        user.role = "super_admin"
        db.commit()


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.execute(select(User).where(User.email == body.email.lower())).scalar_one_or_none()
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")

    if body.join_code:
        org = db.execute(
            select(Organization).where(Organization.join_code == body.join_code.strip().upper())
        ).scalar_one_or_none()
        if org is None:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Invalid join code")
        role = "student"  # joining members start restricted; admins can promote later
    elif body.organization_name:
        org = Organization(name=body.organization_name.strip(), join_code=_new_join_code())
        db.add(org)
        db.flush()
        role = "org_admin"
    else:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "Provide organization_name (create a new organisation) or join_code (join one)",
        )

    user = User(
        org_id=org.id,
        email=body.email.lower(),
        name=body.name.strip(),
        password_hash=hash_password(body.password),
        role=role,
    )
    db.add(user)
    db.commit()
    _apply_super_admin(user, db)
    return TokenResponse(access_token=create_access_token(user))


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.execute(select(User).where(User.email == body.email.lower())).scalar_one_or_none()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    _apply_super_admin(user, db)
    return TokenResponse(access_token=create_access_token(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    org = db.get(Organization, user.org_id)
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
