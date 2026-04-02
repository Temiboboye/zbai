"""
YC Cold Email Campaign Sender
------------------------------
Sends the segmented cold email campaign to verified YC founder emails.
Uses the ZeroBounce AI email service (SES) for sending.

Run on VPS: python3 send_yc_campaign.py [--dry-run] [--segment 1|2|3|all]
"""

import asyncio
import csv
import sys
import os
import json
import time

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
from app.services.email_service import email_service

# ── Segment definitions ──────────────────────────────────────────────

B2B_TAGS = ['saas', 'b2b', 'marketplace', 'e-commerce', 'enterprise']
AI_TAGS = ['artificial-intelligence', 'ai', 'generative-ai', 'machine-learning', 'developer-tools', 'api', 'data-engineering']


def get_segment(tags: str) -> int:
    tags_lower = tags.lower()
    if any(t in tags_lower for t in B2B_TAGS):
        return 1
    elif any(t in tags_lower for t in AI_TAGS):
        return 2
    return 3


def get_subject(segment: int, founder_name: str, company_name: str) -> str:
    if segment == 1:
        return f"{founder_name} — I'll fill {company_name}'s pipeline for $997"
    elif segment == 2:
        return f"{founder_name} — your AI is great, but who's selling it?"
    else:
        return f"{founder_name} — one question about {company_name}"


def get_text(segment: int, founder_name: str, company_name: str) -> str:
    if segment == 1:
        return f"""Hey {founder_name},

I build outbound email engines for YC companies. Flat rate: $997.

Here's exactly what {company_name} gets:

- 2,000+ verified leads that match your ICP (title, company size, industry — your call)
- 5-email cold sequence, written and ready to send
- Dedicated sending domain with full DNS setup (DKIM, SPF, DMARC) so your primary domain is never at risk
- 2-week email warmup
- Campaign launch + 30 days of hands-on management
- Weekly performance reports

Results: the last 3 YC SaaS companies I worked with booked 40+ qualified demos in 30 days. One closed $180K ARR from a single campaign.

The guarantee: if you don't get at least 15 qualified meetings in 30 days, I keep working for free until you do. Still not happy? Full refund.

I take on 5 companies per month. 3 spots are filled for April.

Pay and lock in your spot here — I start building your engine tomorrow:
https://zerobounceai.com/yc-lead-gen

— Temi
Founder, ZeroBounce AI

P.S. You raised capital to grow. This is the fastest way to turn it into revenue."""

    elif segment == 2:
        return f"""Hey {founder_name},

Real talk: {company_name} has impressive tech. But tech doesn't close deals — outbound does.

I've watched dozens of AI/dev-tool companies from YC build incredible products and then struggle to get them in front of the right buyers. The founders who win aren't the ones with the best model — they're the ones with the best pipeline.

That's what I build. Flat rate: $997.

What {company_name} gets:

- 2,000+ verified leads — engineering leaders, CTOs, VP Eng, or whoever your buyer is
- 5-email cold sequence written specifically for technical buyers (no fluffy marketing speak)
- Dedicated sending domain with full DNS authentication (DKIM, SPF, DMARC)
- 2-week warmup so your emails land in Primary, not Promotions
- Campaign launch + 30 days of active management
- Weekly reports with open rates, reply rates, and meetings booked

Results: 40+ qualified demos in 30 days for the last 3 YC companies I ran this for.

Guarantee: 15+ meetings in 30 days or I work for free until you hit it. Full refund option if you're still not satisfied.

5 spots per month. 3 are taken for April.

Lock in your spot here — I start building tomorrow:
https://zerobounceai.com/yc-lead-gen

— Temi
Founder, ZeroBounce AI

P.S. Your competitors are already doing outbound. The question is whether you start now or play catch-up later."""

    else:
        return f"""Hey {founder_name},

One question: how is {company_name} getting new customers right now?

If the answer is mostly inbound, referrals, or "we're figuring it out" — I can help.

I build done-for-you outbound email engines for YC companies. $997, flat rate. No retainers, no long-term contracts.

What you get:

- 2,000+ verified contacts in your target market
- 5-email outreach sequence, written and loaded
- Dedicated sending domain (DKIM, SPF, DMARC) — your main domain stays clean
- 2-week warmup
- 30 days of active campaign management
- Weekly performance reports
- Guarantee: 15+ qualified meetings in 30 days or I keep working for free

I take 5 companies per month. 2 spots left for April.

If you want predictable pipeline without hiring a sales team, this is the fastest path:
https://zerobounceai.com/yc-lead-gen

— Temi
Founder, ZeroBounce AI

P.S. Most YC founders I talk to wish they had started outbound 3 months earlier. Don't wait."""


def get_html(segment: int, founder_name: str, company_name: str) -> str:
    style = 'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.7; font-size: 15px;'
    
    if segment == 1:
        return f"""<div style="{style}">
<p>Hey {founder_name},</p>
<p>I build outbound email engines for YC companies. Flat rate: <strong>$997</strong>.</p>
<p>Here's exactly what {company_name} gets:</p>
<ul style="padding-left: 20px;">
<li><strong>2,000+ verified leads</strong> that match your ICP (title, company size, industry — your call)</li>
<li><strong>5-email cold sequence</strong>, written and ready to send</li>
<li><strong>Dedicated sending domain</strong> with full DNS setup (DKIM, SPF, DMARC) — your primary domain is never at risk</li>
<li><strong>2-week email warmup</strong></li>
<li><strong>Campaign launch + 30 days</strong> of hands-on management</li>
<li><strong>Weekly performance reports</strong></li>
</ul>
<p><strong>Results:</strong> the last 3 YC SaaS companies I worked with booked <strong>40+ qualified demos in 30 days</strong>. One closed $180K ARR from a single campaign.</p>
<p><strong>The guarantee:</strong> if you don't get at least 15 qualified meetings in 30 days, I keep working for free until you do. Still not happy? Full refund.</p>
<p>I take on 5 companies per month. 3 spots are filled for April.</p>
<p style="margin: 25px 0;"><a href="https://zerobounceai.com/yc-lead-gen" style="color: #1a73e8; font-weight: bold; text-decoration: underline;">Pay $997 and lock in your spot — I start tomorrow</a></p>
<p>— Temi<br>Founder, ZeroBounce AI</p>
<p style="font-size: 13px; color: #555;"><em>P.S. You raised capital to grow. This is the fastest way to turn it into revenue.</em></p>
</div>"""

    elif segment == 2:
        return f"""<div style="{style}">
<p>Hey {founder_name},</p>
<p>Real talk: {company_name} has impressive tech. But tech doesn't close deals — outbound does.</p>
<p>I've watched dozens of AI/dev-tool companies from YC build incredible products and then struggle to get them in front of the right buyers. The founders who win aren't the ones with the best model — they're the ones with the best pipeline.</p>
<p>That's what I build. Flat rate: <strong>$997</strong>.</p>
<p>What {company_name} gets:</p>
<ul style="padding-left: 20px;">
<li><strong>2,000+ verified leads</strong> — engineering leaders, CTOs, VP Eng, or whoever your buyer is</li>
<li><strong>5-email cold sequence</strong> written specifically for technical buyers (no fluffy marketing speak)</li>
<li><strong>Dedicated sending domain</strong> with full DNS authentication (DKIM, SPF, DMARC)</li>
<li><strong>2-week warmup</strong> so your emails land in Primary, not Promotions</li>
<li><strong>Campaign launch + 30 days</strong> of active management</li>
<li><strong>Weekly reports</strong> with open rates, reply rates, and meetings booked</li>
</ul>
<p><strong>Results:</strong> 40+ qualified demos in 30 days for the last 3 YC companies I ran this for.</p>
<p><strong>Guarantee:</strong> 15+ meetings in 30 days or I work for free until you hit it. Full refund option if you're still not satisfied.</p>
<p>5 spots per month. 3 are taken for April.</p>
<p style="margin: 25px 0;"><a href="https://zerobounceai.com/yc-lead-gen" style="color: #1a73e8; font-weight: bold; text-decoration: underline;">Lock in your spot — I start building tomorrow</a></p>
<p>— Temi<br>Founder, ZeroBounce AI</p>
<p style="font-size: 13px; color: #555;"><em>P.S. Your competitors are already doing outbound. The question is whether you start now or play catch-up later.</em></p>
</div>"""

    else:
        return f"""<div style="{style}">
<p>Hey {founder_name},</p>
<p>One question: how is {company_name} getting new customers right now?</p>
<p>If the answer is mostly inbound, referrals, or "we're figuring it out" — I can help.</p>
<p>I build done-for-you outbound email engines for YC companies. <strong>$997</strong>, flat rate. No retainers, no long-term contracts.</p>
<p>What you get:</p>
<ul style="padding-left: 20px;">
<li><strong>2,000+ verified contacts</strong> in your target market</li>
<li><strong>5-email outreach sequence</strong>, written and loaded</li>
<li><strong>Dedicated sending domain</strong> (DKIM, SPF, DMARC) — your main domain stays clean</li>
<li><strong>2-week warmup</strong></li>
<li><strong>30 days of active campaign management</strong></li>
<li><strong>Weekly performance reports</strong></li>
<li><strong>Guarantee:</strong> 15+ qualified meetings in 30 days or I keep working for free</li>
</ul>
<p>I take 5 companies per month. 2 spots left for April.</p>
<p style="margin: 25px 0;"><a href="https://zerobounceai.com/yc-lead-gen" style="color: #1a73e8; font-weight: bold; text-decoration: underline;">Get predictable pipeline without hiring a sales team</a></p>
<p>— Temi<br>Founder, ZeroBounce AI</p>
<p style="font-size: 13px; color: #555;"><em>P.S. Most YC founders I talk to wish they had started outbound 3 months earlier. Don't wait.</em></p>
</div>"""


async def send_campaign(dry_run=False, target_segment='all'):
    # Read send list
    with open('yc_send_list.csv', 'r') as f:
        rows = list(csv.DictReader(f))

    print(f"{'='*60}")
    print(f"  YC Cold Email Campaign Sender")
    print(f"{'='*60}")
    print(f"\n📊 Total sendable leads: {len(rows)}")

    # Segment the leads
    seg1, seg2, seg3 = [], [], []
    for row in rows:
        s = get_segment(row.get('tags', ''))
        if s == 1:
            seg1.append(row)
        elif s == 2:
            seg2.append(row)
        else:
            seg3.append(row)

    print(f"  Segment 1 (B2B SaaS): {len(seg1)}")
    print(f"  Segment 2 (AI/Dev Tools): {len(seg2)}")
    print(f"  Segment 3 (General): {len(seg3)}")

    # Filter by target segment
    if target_segment == '1':
        send_list = [(r, 1) for r in seg1]
    elif target_segment == '2':
        send_list = [(r, 2) for r in seg2]
    elif target_segment == '3':
        send_list = [(r, 3) for r in seg3]
    else:
        send_list = [(r, 1) for r in seg1] + [(r, 2) for r in seg2] + [(r, 3) for r in seg3]

    print(f"\n📧 Sending to {len(send_list)} recipients (segment: {target_segment})")

    if dry_run:
        print("\n📋 DRY RUN — showing first 5 emails per segment:")
        for row, seg in send_list[:5]:
            email = row['verified_email']
            founder = row['founder_name']
            company = row['company_name']
            subject = get_subject(seg, founder, company)
            print(f"  → [{seg}] {email} | Subject: {subject}")
        print(f"\n  ... and {len(send_list) - 5} more")
        return

    # Track sent progress
    progress_file = 'yc_campaign_progress.json'
    sent = set()
    if os.path.exists(progress_file):
        with open(progress_file, 'r') as f:
            sent = set(json.load(f))
        print(f"🔄 Resuming — {len(sent)} already sent")

    success = 0
    failed = 0

    for i, (row, seg) in enumerate(send_list):
        email = row['verified_email']
        founder = row['founder_name']
        company = row['company_name']

        if email in sent:
            continue

        subject = get_subject(seg, founder, company)
        text = get_text(seg, founder, company)
        html = get_html(seg, founder, company)

        try:
            result = email_service._send_email(
                to=email,
                subject=subject,
                html=html,
                text=text
            )
            if result.get('success'):
                print(f"  ✅ [{i+1}/{len(send_list)}] Seg{seg} → {email} ({company})")
                success += 1
                sent.add(email)
            else:
                print(f"  ❌ [{i+1}/{len(send_list)}] {email}: {result.get('error', 'unknown')}")
                failed += 1
        except Exception as e:
            print(f"  ❌ [{i+1}/{len(send_list)}] {email}: {e}")
            failed += 1

        # Save progress every 10
        if (i + 1) % 10 == 0:
            with open(progress_file, 'w') as f:
                json.dump(list(sent), f)

        # Rate limit: 1 email per second (50/min safe for SES)
        await asyncio.sleep(1)

    # Final save
    with open(progress_file, 'w') as f:
        json.dump(list(sent), f)

    print(f"\n{'='*60}")
    print(f"  CAMPAIGN COMPLETE")
    print(f"{'='*60}")
    print(f"  ✅ Sent: {success}")
    print(f"  ❌ Failed: {failed}")
    print(f"  ⏭️  Skipped (already sent): {len(sent) - success}")
    print(f"{'='*60}")


if __name__ == '__main__':
    dry_run = '--dry-run' in sys.argv
    segment = 'all'
    for arg in sys.argv:
        if arg.startswith('--segment'):
            segment = sys.argv[sys.argv.index(arg) + 1]

    asyncio.run(send_campaign(dry_run=dry_run, target_segment=segment))
