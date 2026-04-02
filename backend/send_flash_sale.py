import asyncio
import sys
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.models import User, Transaction
from app.services.email_service import email_service
import logging

logging.basicConfig(level=logging.INFO)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def send_flash_sale(dry_run=False):
    db: Session = next(get_db())
    # Find all users who are not paying users
    paying_user_ids = db.query(Transaction.user_id).filter(
        Transaction.type == 'credit', 
        Transaction.source.in_(['stripe', 'crypto'])
    ).distinct().subquery()
    free_users = db.query(User).filter(User.is_active == True, ~User.id.in_(paying_user_ids)).all()
    
    print(f"==================================================")
    print(f"  ZeroBounce AI — Flash Sale Broadcaster")
    print(f"==================================================")
    print(f"\n🔍 Found {len(free_users)} free (non-paying) users")

    if dry_run:
        print("\n📋 DRY RUN - No emails will be sent")
        return

    print("📧 Sending Flash Sale (Double Credits)...")
    success_count = 0
    fail_count = 0

    for user in free_users:
        name = user.email.split('@')[0].capitalize()
        try:
            subject = "🚨 Flash Sale: Double your email verification credits (24 hrs)"
            html_content = f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
                <p>Hey {name},</p>
                
                <p>If you're doing any kind of cold outreach right now, you already know the worst enemy of deliverability isn't spam filters—it's <strong>“Catch-All” domains</strong>.</p>
                
                <p>Most verification tools (like NeverBounce or Hunter) charge you a full credit to verify an email, only to shrug and say <em>"It's a Catch-All, send at your own risk."</em></p>
                
                <p>You end up paying for a guess. And when you guess wrong, your email bounces, your sender reputation tanks, and your open rates plummet.</p>
                
                <p><strong>ZeroBounce AI was built to solve exactly this.</strong></p>
                
                <p>Instead of a guessing game, our AI analyzes server patterns, historical domain reputation, and syntax logic to give you a definitive <strong>0-100 Confidence Score</strong> on every Catch-All address you upload.</p>
                <p>It tells you exactly which emails are safe to send to, and which ones will ruin your domain.</p>
                
                <p>Since you created an account but haven't upgraded yet, I want to give you a reason to stop guessing and start scaling your outreach <em>risk-free</em>.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-left: 5px solid #27c93f; margin: 25px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 16px;"><strong>For the next 24 hours, I'm running a Flash Sale for our free users: <span style="color: #27c93f;">Upgrade today, and I will strictly DOUBLE the credits of whatever plan you buy.</span></strong></p>
                </div>
                
                <p>If you buy 10,000 credits, I’ll manually bump your account to <strong>20,000</strong>.<br>
                If you buy 50,000 credits, you get <strong>100,000</strong>.</p>
                
                <p>There are no codes to enter. Just use the link below to checkout, and your account will be instantly credited with double the amount within exactly 5 minutes of your purchase.</p>
                
                <div style="text-align: center; margin: 35px 0;">
                    <a href="https://zerobounceai.com/#pricing" style="background-color: #27c93f; color: #191A23; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">Get Double Credits Now — 24 Hours Only</a>
                </div>
                
                <p>Don't let bad data burn your domain. Start verifying with AI.</p>
                
                <p>Talk soon,<br>
                <strong>Temi</strong><br>
                ZeroBounce AI</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 12px; color: #888; text-align: center;"><em>P.S. This isn't a fake timer. This double-credit offer expires exactly 24 hours from when you received this email. <a href="https://zerobounceai.com/#pricing" style="color: #27c93f;">Lock it in here.</a></em></p>
            </div>
            """
            
            text_content = f"""Hey {name},

If you're doing any kind of cold outreach right now, you already know the worst enemy of deliverability isn't spam filters—it's “Catch-All” domains.

Most verification tools charge you a full credit to verify an email, only to shrug and say "It's a Catch-All, send at your own risk."

You end up paying for a guess. And when you guess wrong, your email bounces, your sender reputation tanks, and your open rates plummet.

ZeroBounce AI was built to solve exactly this.

Instead of a guessing game, our AI analyzes server patterns, historical domain reputation, and syntax logic to give you a definitive 0-100 Confidence Score on every Catch-All address you upload.

Since you created an account but haven't upgraded yet, I want to give you a reason to stop guessing and start scaling your outreach risk-free.

*** For the next 24 hours, I'm running a Flash Sale for our free users: Upgrade today, and I will strictly DOUBLE the credits of whatever plan you buy. ***

If you buy 10,000 credits, I’ll manually bump your account to 20,000.
If you buy 50,000 credits, you get 100,000.

There are no codes to enter. Just use the link below to checkout, and your account will be instantly credited with double the amount within exactly 5 minutes of your purchase.

Get Double Credits Now — 24 Hours Only:
👉 https://zerobounceai.com/#pricing

Don't let bad data burn your domain. Start verifying with AI.

Talk soon,
Temi
ZeroBounce AI

P.S. This isn't a fake timer. This double-credit offer expires exactly 24 hours from when you received this email. Link: https://zerobounceai.com/#pricing
"""
            
            # Send the email
            email_service.send_email(
                to_email=user.email,
                subject=subject,
                html_content=html_content,
                text_content=text_content
            )
            print(f"  ✅ Sent Flash Sale to {user.email}")
            success_count += 1
            await asyncio.sleep(0.5)
            
        except Exception as e:
            print(f"  ❌ Failed for {user.email}: {e}")
            fail_count += 1

    print("\nSummary:")
    print(f"  ✅ Sent: {success_count}")
    print(f"  ❌ Failed: {fail_count}")

if __name__ == "__main__":
    dry_run = "--dry-run" in sys.argv
    asyncio.run(send_flash_sale(dry_run))
