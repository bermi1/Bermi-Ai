"""Branded transactional email for Bermi AI.

Sends via SMTP when configured (SMTP_HOST/USER/PASSWORD). When SMTP is not
configured this degrades gracefully: it logs the action and returns False, so
sign-up never fails just because email is not set up yet. Login is only gated
on verification when REQUIRE_EMAIL_VERIFICATION is enabled.
"""

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from ..config import get_settings

logger = logging.getLogger("bermi.email")

ACCENT = "#C15F3C"
BG = "#12110F"
CARD = "#1C1B18"


def _shell(title: str, body_html: str, cta_label: str, cta_url: str) -> str:
    return f"""\
<!doctype html>
<html>
  <body style="margin:0;background:{BG};padding:32px 0;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0"
               style="background:{CARD};border-radius:16px;overflow:hidden;border:1px solid #2a2925;">
          <tr><td style="padding:32px 36px 8px;">
            <div style="display:inline-block;width:40px;height:40px;border-radius:10px;
                        background:{ACCENT};color:#fff;font-weight:700;font-size:22px;
                        line-height:40px;text-align:center;font-family:Georgia,serif;">B</div>
            <span style="color:#f5f4f1;font-size:18px;font-weight:600;margin-left:10px;
                         vertical-align:middle;">Bermi AI</span>
          </td></tr>
          <tr><td style="padding:12px 36px 8px;">
            <h1 style="color:#f5f4f1;font-size:22px;margin:0 0 12px;">{title}</h1>
            <div style="color:#b7b3ac;font-size:15px;line-height:1.6;">{body_html}</div>
          </td></tr>
          <tr><td style="padding:24px 36px 32px;">
            <a href="{cta_url}"
               style="display:inline-block;background:{ACCENT};color:#fff;text-decoration:none;
                      font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">
              {cta_label}
            </a>
            <p style="color:#6f6b64;font-size:12px;margin:20px 0 0;">
              Or paste this link into your browser:<br>
              <span style="color:#8a857d;word-break:break-all;">{cta_url}</span>
            </p>
          </td></tr>
          <tr><td style="padding:18px 36px;border-top:1px solid #2a2925;">
            <p style="color:#6f6b64;font-size:12px;margin:0;">
              Bermi AI · built by Bemri Tech Company · Africa-first AI.<br>
              If you didn't request this, you can safely ignore this email.
            </p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>"""


def verification_email(name: str, url: str) -> tuple[str, str]:
    subject = "Confirm your Bermi AI account"
    html = _shell(
        f"Karibu, {name.split(' ')[0]} 👋",
        "Thanks for joining Bermi AI. Confirm your email address to activate "
        "your account and start building.",
        "Confirm my email",
        url,
    )
    return subject, html


def reset_email(name: str, url: str) -> tuple[str, str]:
    subject = "Reset your Bermi AI password"
    html = _shell(
        "Reset your password",
        "We received a request to reset your Bermi AI password. This link "
        "expires in one hour.",
        "Choose a new password",
        url,
    )
    return subject, html


def send_email(to_email: str, subject: str, html: str) -> bool:
    settings = get_settings()
    if not (settings.smtp_host and settings.smtp_user and settings.smtp_password):
        logger.info("SMTP not configured — skipping email '%s' to %s", subject, to_email)
        return False
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.email_from
    msg["To"] = to_email
    msg.attach(MIMEText(html, "html"))
    try:
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
            server.starttls()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.email_from, [to_email], msg.as_string())
        return True
    except Exception as exc:  # never fail sign-up because email failed
        logger.error("Failed to send email to %s: %s", to_email, exc)
        return False
