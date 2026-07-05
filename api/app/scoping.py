"""Ownership scoping that works with or without an organisation.

An account may belong to an organisation (team) or be a solo individual
(org_id is NULL). This module centralises "what content can this user see":

- Team members share their organisation's knowledge base.
- Individuals see only their own uploaded documents.
- Everyone (except restricted students) also draws on the system-wide
  policy library.

Conversations are always per-user, so they are scoped by user_id directly.
"""

from sqlalchemy import and_, or_

from .models import Document
from .models import User


def document_own_filter(user: User):
    """SQLAlchemy filter for the documents this user personally owns/shares
    (excludes the system policy library — add that separately when wanted)."""
    if user.org_id is not None:
        return and_(Document.org_id == user.org_id, Document.scope == "org")
    return and_(
        Document.uploaded_by == user.id,
        Document.org_id.is_(None),
        Document.scope == "org",
    )


def document_visible_filter(user: User, include_system: bool = True):
    own = document_own_filter(user)
    if include_system:
        return or_(own, Document.scope == "system")
    return own


def can_access_document(doc: Document | None, user: User) -> bool:
    if doc is None:
        return False
    if doc.scope == "system":
        return True
    if user.org_id is not None:
        return doc.org_id == user.org_id
    return doc.uploaded_by == user.id and doc.org_id is None
