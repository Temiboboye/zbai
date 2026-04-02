#!/usr/bin/env python3
"""
YC Founder Email Finder + Verifier
===================================
Reads the YC companies CSV, finds founder emails using the Email Finder service,
verifies them through the email verifier, and outputs a clean CSV of verified emails.
"""

import asyncio
import csv
import json
import os
import sys
import time
import ast

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.email_finder import EmailFinderService
from app.services.email_verifier import EmailVerificationService

async def main():
    # Initialize services
    verifier = EmailVerificationService()
    finder = EmailFinderService(email_verifier=verifier)
    
    # Read CSV
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'ycombinator_companies.csv')
    if not os.path.exists(csv_path):
        csv_path = '/app/ycombinator_companies.csv'
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    # Filter active companies only
    active = [r for r in rows if r.get('status', '').strip() == 'Active']
    print(f"Total active YC companies: {len(active)}")
    
    # Prepare output
    output_rows = []
    found_count = 0
    verified_count = 0
    failed_count = 0
    
    # Process in batches
    batch_size = int(os.environ.get('BATCH_SIZE', '50'))
    start_from = int(os.environ.get('START_FROM', '0'))
    max_companies = int(os.environ.get('MAX_COMPANIES', str(len(active))))
    verify_emails = os.environ.get('VERIFY', 'false').lower() == 'true'
    
    companies_to_process = active[start_from:start_from + max_companies]
    print(f"Processing {len(companies_to_process)} companies (start={start_from}, verify={verify_emails})")
    print("=" * 60)
    
    for i, company in enumerate(companies_to_process):
        company_name = company.get('company_name', '').strip()
        website = company.get('website', '').strip()
        founders_str = company.get('founders_names', '').strip()
        tags = company.get('tags', '')
        
        if not website or not founders_str:
            continue
        
        # Parse founders list (it's stored as a Python list string like "['John Doe', 'Jane Smith']")
        try:
            founders = ast.literal_eval(founders_str)
            if isinstance(founders, str):
                founders = [founders]
        except:
            founders = [founders_str]
        
        # Extract domain from website
        domain = finder.extract_domain(website)
        if not domain:
            continue
        
        # Find email for first founder (most likely the CEO/primary contact)
        first_founder = founders[0] if founders else None
        if not first_founder:
            continue
        
        try:
            result = await finder.find_email(
                full_name=first_founder,
                domain_or_website=domain,
                verify=verify_emails,
                max_patterns=5
            )
            
            email = result.get('email')
            confidence = result.get('confidence', 'none')
            verified = result.get('verified', False)
            domain_valid = result.get('domain_valid', False)
            
            status_icon = "✅" if verified else ("📧" if domain_valid else "⚠️")
            
            if email:
                found_count += 1
                if verified:
                    verified_count += 1
                
                output_rows.append({
                    'company_name': company_name,
                    'founder_name': first_founder,
                    'email': email,
                    'domain': domain,
                    'confidence': confidence,
                    'verified': verified,
                    'domain_valid': domain_valid,
                    'website': website,
                    'tags': tags,
                    'all_founders': ', '.join(founders),
                    'short_description': company.get('short_description', ''),
                    'batch': company.get('batch', ''),
                    'team_size': company.get('team_size', ''),
                })
                
                if (i + 1) % 10 == 0 or i < 5:
                    print(f"  {status_icon} [{i+1}/{len(companies_to_process)}] {company_name} | {first_founder} -> {email} ({confidence})")
            else:
                failed_count += 1
                
        except Exception as e:
            failed_count += 1
            if (i + 1) % 50 == 0:
                print(f"  ❌ [{i+1}] {company_name}: {str(e)[:60]}")
        
        # Rate limit
        if verify_emails:
            await asyncio.sleep(0.3)
        else:
            await asyncio.sleep(0.05)
    
    # Write output CSV
    output_path = os.environ.get('OUTPUT_PATH', '/app/yc_founder_emails.csv')
    if output_rows:
        with open(output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=output_rows[0].keys())
            writer.writeheader()
            writer.writerows(output_rows)
    
    print("\n" + "=" * 60)
    print(f"RESULTS:")
    print(f"  📊 Processed: {len(companies_to_process)}")
    print(f"  📧 Emails found: {found_count}")
    print(f"  ✅ Verified: {verified_count}")
    print(f"  ❌ Failed: {failed_count}")
    print(f"  📁 Output saved to: {output_path}")

if __name__ == '__main__':
    asyncio.run(main())
