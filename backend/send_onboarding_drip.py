#!/usr/bin/env python3
"""
Onboarding Drip Email Runner for ZeroBounce AI
================================================
Sends conversion-focused drip emails to free users based on their signup date.

Usage (inside Docker on VPS):
    # Preview what would be sent
    python send_onboarding_drip.py --dry-run

    # Send drip email #1 to all eligible free users
    python send_onboarding_drip.py --email-number 1

    # Auto-detect which drip each user should get
    python send_onboarding_drip.py --auto

    # Test with a specific email address
    python send_onboarding_drip.py --test-email you@example.com --email-number 1

    # Send ALL 5 drip emails to a test address (for previewing)
    python send_onboarding_drip.py --test-email you@example.com --all
"""

import argparse
import sys
import os
from datetime import datetime, timedelta

# Ensure app package is importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.models import User, Transaction
from app.services.email_service import email_service


# Drip schedule: (email_number, min_days_since_signup, max_days_since_signup)
DRIP_SCHEDULE = [
    (1, 0, 0),    # Day 0 — immediate welcome
    (2, 1, 2),    # Day 1-2 — feature showcase
    (3, 3, 4),    # Day 3-4 — social proof
    (4, 5, 6),    # Day 5-6 — limited offer
    (5, 7, 90),   # Day 7-90 — final nudge (wide window to catch existing users)
]

DRIP_METHODS = {
    1: "send_drip_1_welcome_quickwin",
    2: "send_drip_2_feature_showcase",
    3: "send_drip_3_social_proof",
    4: "send_drip_4_limited_offer",
    5: "send_drip_5_final_nudge",
}

DRIP_NAMES = {
    1: "Welcome + Quick Win",
    2: "Feature Showcase",
    3: "Social Proof + ROI",
    4: "Founding Member Offer (30% off)",
    5: "Final Nudge / Breakup",
}


def get_free_users(db):
    """Get all users who have never made a purchase (free users)."""
    # Subquery: user IDs that have any credit purchase transaction
    paying_user_ids = (
        db.query(Transaction.user_id)
        .filter(Transaction.type == "credit")
        .filter(Transaction.source.in_(["stripe", "crypto"]))
        .distinct()
        .subquery()
    )

    free_users = (
        db.query(User)
        .filter(User.is_active == True)
        .filter(User.is_admin == False)
        .filter(~User.id.in_(paying_user_ids))
        .all()
    )

    return free_users


def determine_drip_number(user_created_at):
    """Based on signup date, determine which drip email the user should receive."""
    now = datetime.utcnow()
    days_since_signup = (now - user_created_at).days

    for email_num, min_days, max_days in DRIP_SCHEDULE:
        if min_days <= days_since_signup <= max_days:
            return email_num

    return None  # User is past the drip window


def send_drip(to: str, name: str, email_number: int, dry_run: bool = False):
    """Send a specific drip email."""
    method_name = DRIP_METHODS.get(email_number)
    if not method_name:
        print(f"  ❌ Invalid email number: {email_number}")
        return False

    drip_name = DRIP_NAMES[email_number]

    if dry_run:
        print(f"  📧 [DRY RUN] Would send Drip #{email_number} ({drip_name}) to {to}")
        return True

    method = getattr(email_service, method_name)
    result = method(to=to, name=name)

    if result.get("success"):
        print(f"  ✅ Sent Drip #{email_number} ({drip_name}) to {to}")
        return True
    else:
        print(f"  ❌ Failed Drip #{email_number} to {to}: {result.get('error', 'Unknown error')}")
        return False


def run_auto(dry_run: bool = False):
    """Auto-detect and send the appropriate drip email to each free user."""
    db = SessionLocal()
    try:
        users = get_free_users(db)
        print(f"\n🔍 Found {len(users)} free (non-paying) users\n")

        sent = 0
        skipped = 0
        failed = 0

        for user in users:
            email_num = determine_drip_number(user.created_at)
            if email_num is None:
                print(f"  ⏭️  Skipping {user.email} (signed up {(datetime.utcnow() - user.created_at).days} days ago, past drip window)")
                skipped += 1
                continue

            # Extract name from email if not available
            name = user.email.split("@")[0].replace(".", " ").title()

            success = send_drip(user.email, name, email_num, dry_run)
            if success:
                sent += 1
            else:
                failed += 1

        print(f"\n{'📋 DRY RUN ' if dry_run else ''}Summary:")
        print(f"  ✅ Sent: {sent}")
        print(f"  ⏭️  Skipped: {skipped}")
        print(f"  ❌ Failed: {failed}")
        print(f"  📊 Total free users: {len(users)}")

    finally:
        db.close()


def run_specific(email_number: int, dry_run: bool = False):
    """Send a specific drip email number to all eligible free users."""
    db = SessionLocal()
    try:
        users = get_free_users(db)
        print(f"\n🔍 Found {len(users)} free (non-paying) users")
        print(f"📧 Sending Drip #{email_number} ({DRIP_NAMES[email_number]}) to all\n")

        sent = 0
        failed = 0

        for user in users:
            name = user.email.split("@")[0].replace(".", " ").title()
            success = send_drip(user.email, name, email_number, dry_run)
            if success:
                sent += 1
            else:
                failed += 1

        print(f"\n{'📋 DRY RUN ' if dry_run else ''}Summary:")
        print(f"  ✅ Sent: {sent}")
        print(f"  ❌ Failed: {failed}")
        print(f"  📊 Total: {len(users)}")

    finally:
        db.close()


def run_test(test_email: str, email_number: int = None, send_all: bool = False):
    """Send test drip email(s) to a specific address."""
    if send_all:
        print(f"\n📧 Sending ALL 5 drip emails to {test_email}\n")
        for num in range(1, 6):
            send_drip(test_email, "Test User", num)
        print("\n✅ All 5 drip emails sent! Check your inbox.")
    elif email_number:
        print(f"\n📧 Sending test Drip #{email_number} to {test_email}\n")
        send_drip(test_email, "Test User", email_number)
    else:
        print("❌ Specify --email-number N or --all with --test-email")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="ZeroBounce AI Onboarding Drip Email Runner",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python send_onboarding_drip.py --dry-run              Preview auto drip
  python send_onboarding_drip.py --auto                  Send based on signup date
  python send_onboarding_drip.py --email-number 1        Send drip #1 to all free users
  python send_onboarding_drip.py --test-email me@x.com --email-number 1
  python send_onboarding_drip.py --test-email me@x.com --all
        """
    )

    parser.add_argument("--dry-run", action="store_true", help="Preview without sending")
    parser.add_argument("--auto", action="store_true", help="Auto-detect drip based on signup date")
    parser.add_argument("--email-number", type=int, choices=[1, 2, 3, 4, 5],
                        help="Send a specific drip email (1-5)")
    parser.add_argument("--test-email", type=str, help="Send test to a specific email address")
    parser.add_argument("--all", action="store_true", help="Send all 5 drip emails (use with --test-email)")

    args = parser.parse_args()

    print("=" * 50)
    print("  ZeroBounce AI — Onboarding Drip Runner")
    print("=" * 50)

    if args.test_email:
        run_test(args.test_email, args.email_number, args.all)
    elif args.auto or args.dry_run:
        run_auto(dry_run=args.dry_run or False)
    elif args.email_number:
        run_specific(args.email_number, dry_run=False)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
