"""
Send credit top-up notification email to Karen @ Resonate Marketing
Run on production: docker exec zerobounce_backend python send_karen_email.py
Or locally with RESEND_API_KEY set.
"""

import os
import requests
from datetime import datetime

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "ZeroBounce AI <noreply@notify.zerobounceai.com>")
APP_URL = "https://zerobounceai.com"

TO_EMAIL = "karen@resonatemarketing.co.nz"
CUSTOMER_NAME = "Karen"
CREDITS_ADDED = 2400

def send_email(to: str, subject: str, html: str, text: str = ""):
    """Send email via Resend API"""
    if not RESEND_API_KEY:
        print("ERROR: RESEND_API_KEY not set")
        return

    resp = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": FROM_EMAIL,
            "to": [to],
            "subject": subject,
            "html": html,
            "text": text,
        },
        timeout=10,
    )

    if resp.status_code == 200:
        print(f"✅ Email sent to {to} — ID: {resp.json().get('id')}")
    else:
        print(f"❌ Failed ({resp.status_code}): {resp.text}")


# ── Email 1: Credit Top-Up Confirmation ──────────────────────────────

subject_1 = f"Your {CREDITS_ADDED:,} Credits Are Ready! ✅"

html_1 = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #B9FF66, #8BC34A); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
        .header h1 {{ color: #191A23; margin: 0; font-size: 24px; }}
        .content {{ background: #f9f9f9; padding: 30px; }}
        .highlight-box {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #B9FF66; }}
        .credits-badge {{ background: #191A23; color: #B9FF66; padding: 15px 25px; border-radius: 8px; display: inline-block; font-size: 22px; font-weight: bold; margin: 10px 0; }}
        .button {{ display: inline-block; background: #B9FF66; color: #191A23; padding: 14px 36px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }}
        .footer {{ background: #191A23; color: #fff; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 13px; }}
        .footer a {{ color: #B9FF66; text-decoration: none; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Your Credits Are Ready!</h1>
        </div>
        <div class="content">
            <h2>Hi {CUSTOMER_NAME},</h2>
            <p>Thank you for your recent purchase — we truly appreciate your support! 🎉</p>

            <p>Your credits have been successfully added to your account — and as a thank you for being one of our earliest customers, we've included a <strong>20% bonus</strong> on top of your purchase! 🎁</p>

            <center>
                <div class="credits-badge">{CREDITS_ADDED:,} Credits Added</div>
            </center>

            <div class="highlight-box">
                <h3 style="margin-top:0;">What you can do with your credits:</h3>
                <ul style="padding-left: 20px;">
                    <li><strong>Email Verification</strong> — Validate email addresses in real-time</li>
                    <li><strong>Bulk Verification</strong> — Upload and process entire email lists</li>
                    <li><strong>Email Finder</strong> — Discover email addresses for your prospects</li>
                    <li><strong>Microsoft 365 Checker</strong> — Check if emails are valid Microsoft accounts</li>
                </ul>
            </div>

            <center>
                <a href="{APP_URL}/dashboard" class="button">Go to Your Dashboard →</a>
            </center>

            <p>If you run into any issues or have any questions at all, please don't hesitate to reach out — we're here to help!</p>

            <p>Just reply to this email or contact us at <a href="mailto:support@zerobounceai.com" style="color: #191A23; font-weight: bold;">support@zerobounceai.com</a>.</p>

            <p>Thanks again for choosing ZeroBounce AI!<br>
            <strong>— The ZeroBounce AI Team</strong></p>
        </div>
        <div class="footer">
            <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
            <p><a href="{APP_URL}">zerobounceai.com</a></p>
        </div>
    </div>
</body>
</html>
"""

text_1 = f"""
Hi {CUSTOMER_NAME},

Thank you for your recent purchase — we truly appreciate your support!

Your credits have been successfully added to your account — and as a thank you for being one of our earliest customers, we've included a 20% bonus on top of your purchase! 🎁
→ {CREDITS_ADDED:,} Credits Added

What you can do with your credits:
- Email Verification — Validate email addresses in real-time
- Bulk Verification — Upload and process entire email lists
- Email Finder — Discover email addresses for your prospects
- Microsoft 365 Checker — Check if emails are valid Microsoft accounts

Go to your dashboard: {APP_URL}/dashboard

If you run into any issues or have any questions at all, please don't hesitate to reach out — we're here to help!

Just reply to this email or contact us at support@zerobounceai.com.

Thanks again for choosing ZeroBounce AI!
— The ZeroBounce AI Team
"""


if __name__ == "__main__":
    print(f"📧 Sending credit top-up notification to {TO_EMAIL}...")
    print(f"   Credits: {CREDITS_ADDED:,}")
    print()
    send_email(TO_EMAIL, subject_1, html_1, text_1)
