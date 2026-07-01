import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from config import settings

logger = logging.getLogger(__name__)

EMAIL_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: 'Inter', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }}
    .container {{ max-width: 600px; margin: 32px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #0F766E, #064E3B); padding: 32px; text-align: center; }}
    .header h1 {{ color: white; margin: 0; font-size: 24px; }}
    .header p {{ color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }}
    .body {{ padding: 32px; }}
    .badge {{ display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }}
    .badge-donation {{ background: #FEF3C7; color: #92400E; }}
    .badge-volunteer {{ background: #D1FAE5; color: #065F46; }}
    .badge-contact {{ background: #DBEAFE; color: #1E40AF; }}
    h2 {{ color: #0F172A; font-size: 20px; margin: 0 0 16px; }}
    .detail-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }}
    .detail-label {{ color: #64748B; font-size: 14px; }}
    .detail-value {{ color: #0F172A; font-size: 14px; font-weight: 500; }}
    .footer {{ background: #f8fafc; padding: 24px; text-align: center; color: #94A3B8; font-size: 12px; }}
    .btn {{ display: inline-block; background: linear-gradient(135deg, #0F766E, #064E3B); color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; margin-top: 24px; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌿 Rah-E-Haq</h1>
      <p>Building Hope Together</p>
    </div>
    <div class="body">
      <span class="badge badge-{type}">{type_label}</span>
      <h2>{title}</h2>
      {details_html}
      <a href="http://localhost:3000/admin" class="btn">View in Admin Dashboard →</a>
    </div>
    <div class="footer">
      <p>Rah-E-Haq NGO · admin@rahehaq.org</p>
      <p>This is an automated notification. Do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
"""

def _build_details(details: dict) -> str:
    rows = ""
    for label, value in details.items():
        rows += f'<div class="detail-row"><span class="detail-label">{label}</span><span class="detail-value">{value}</span></div>'
    return rows


async def send_notification_email(notification_type: str, title: str, details: dict):
    """Send an HTML notification email to the admin. Non-blocking."""
    if not settings.GMAIL_USER or not settings.GMAIL_APP_PASSWORD:
        logger.info("Email not configured — skipping email notification.")
        return

    type_labels = {"donation": "New Donation", "volunteer": "New Volunteer", "contact": "New Message"}
    type_label = type_labels.get(notification_type, "Notification")

    details_html = _build_details(details)
    html_body = EMAIL_TEMPLATE.format(
        type=notification_type,
        type_label=type_label,
        title=title,
        details_html=details_html,
    )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Rah-E-Haq] {type_label}: {title}"
    msg["From"] = settings.GMAIL_USER
    msg["To"] = settings.ADMIN_EMAIL
    msg.attach(MIMEText(html_body, "html"))

    try:
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _send_sync, msg)
        logger.info(f"Email notification sent: {title}")
    except Exception as e:
        logger.error(f"Failed to send email: {e}")


def _send_sync(msg: MIMEMultipart):
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(settings.GMAIL_USER, settings.GMAIL_APP_PASSWORD)
        server.send_message(msg)
