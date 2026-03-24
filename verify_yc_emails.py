"""
YC Founder Email Finder + Verifier
-----------------------------------
Uses ZeroBounce AI's email finder to generate patterns,
then verifies each candidate via the full verification engine
to find the correct founder email.

Run on VPS: python3 verify_yc_emails.py
"""

import csv
import asyncio
import sys
import os
import time
import json

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.services.email_finder import EmailFinderService
from app.services.email_verifier import EmailVerificationService


async def verify_and_find_emails():
    verifier = EmailVerificationService()
    finder = EmailFinderService(email_verifier=verifier)
    
    # Read the original YC data
    input_file = 'yc_founder_emails.csv'
    output_file = 'yc_verified_emails.csv'
    progress_file = 'yc_verify_progress.json'
    
    print(f"📂 Reading {input_file}...")
    
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
    
    total = len(rows)
    print(f"📊 Total entries: {total}")
    
    # Load progress if resuming
    processed = {}
    if os.path.exists(progress_file):
        with open(progress_file, 'r') as f:
            processed = json.load(f)
        print(f"🔄 Resuming from {len(processed)} already processed")
    
    results = []
    valid_count = 0
    invalid_count = 0
    catch_all_count = 0
    
    for i, row in enumerate(rows):
        company = row['company_name']
        founder = row['founder_name']
        domain = row['domain']
        original_email = row['email']
        
        # Skip if already processed
        if original_email in processed:
            result = processed[original_email]
            results.append({**row, **result})
            if result.get('verified_status') in ['valid_safe', 'valid_risky']:
                valid_count += 1
            elif result.get('verified_status') == 'catch_all':
                catch_all_count += 1
            else:
                invalid_count += 1
            continue
        
        print(f"\n[{i+1}/{total}] {founder} @ {company} ({domain})")
        
        try:
            # Step 1: Verify the pattern-guessed email first
            print(f"  🔍 Verifying {original_email}...")
            result = await verifier.verify_email(original_email)
            
            final_status = result.get('final_status', 'unknown')
            safety_score = result.get('safety_score', 0)
            smtp_provider = result.get('smtp_provider', '')
            is_catch_all = result.get('catch_all', False)
            
            print(f"  📊 Status: {final_status} | Score: {safety_score} | Provider: {smtp_provider} | Catch-all: {is_catch_all}")
            
            verified_email = original_email
            verified_status = final_status
            verified_score = safety_score
            
            # Step 2: If the original email is invalid, try other patterns
            if final_status in ['invalid', 'user_not_found', 'invalid_domain', 'no_mx_records', 'invalid_syntax', 'rejected']:
                print(f"  ❌ Original email invalid. Trying other patterns...")
                
                # Generate alternative patterns
                name_parts = finder.clean_name(founder)
                if name_parts and domain:
                    patterns = finder.generate_email_patterns(
                        name_parts['first'], 
                        name_parts.get('last', ''), 
                        domain
                    )
                    
                    # Remove the original since we already checked it
                    patterns = [p for p in patterns if p != original_email]
                    
                    for pattern_email in patterns[:5]:  # Try top 5 alternatives
                        print(f"  🔍 Trying {pattern_email}...")
                        alt_result = await verifier.verify_email(pattern_email)
                        alt_status = alt_result.get('final_status', 'unknown')
                        alt_score = alt_result.get('safety_score', 0)
                        
                        if alt_status in ['valid_safe', 'valid_risky'] and alt_score >= 70:
                            print(f"  ✅ Found valid: {pattern_email} (score: {alt_score})")
                            verified_email = pattern_email
                            verified_status = alt_status
                            verified_score = alt_score
                            is_catch_all = alt_result.get('catch_all', False)
                            smtp_provider = alt_result.get('smtp_provider', '')
                            break
                        
                        await asyncio.sleep(0.2)  # Small delay between checks
            
            # Save progress
            progress_data = {
                'verified_email': verified_email,
                'verified_status': verified_status,
                'verified_score': verified_score,
                'is_catch_all': is_catch_all,
                'smtp_provider': smtp_provider or '',
            }
            processed[original_email] = progress_data
            
            results.append({
                **row,
                'verified_email': verified_email,
                'verified_status': verified_status,
                'verified_score': verified_score,
                'is_catch_all': is_catch_all,
                'smtp_provider': smtp_provider or '',
            })
            
            if verified_status in ['valid_safe', 'valid_risky']:
                valid_count += 1
            elif is_catch_all:
                catch_all_count += 1
            else:
                invalid_count += 1
            
            # Save progress every 10 entries
            if (i + 1) % 10 == 0:
                with open(progress_file, 'w') as f:
                    json.dump(processed, f)
                print(f"\n  💾 Progress saved. Valid: {valid_count} | Invalid: {invalid_count} | Catch-all: {catch_all_count}")
            
            # Rate limit: ~1 check per second
            await asyncio.sleep(0.5)
            
        except Exception as e:
            print(f"  ⚠️ Error: {e}")
            results.append({
                **row,
                'verified_email': original_email,
                'verified_status': 'error',
                'verified_score': 0,
                'is_catch_all': False,
                'smtp_provider': '',
            })
            invalid_count += 1
    
    # Save final results
    with open(progress_file, 'w') as f:
        json.dump(processed, f)
    
    # Write output CSV
    fieldnames = list(rows[0].keys()) + ['verified_email', 'verified_status', 'verified_score', 'is_catch_all', 'smtp_provider']
    # Deduplicate fieldnames  
    seen = set()
    unique_fieldnames = []
    for fn in fieldnames:
        if fn not in seen:
            seen.add(fn)
            unique_fieldnames.append(fn)
    
    with open(output_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=unique_fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\n{'='*60}")
    print(f"✅ VERIFICATION COMPLETE")
    print(f"{'='*60}")
    print(f"Total processed: {total}")
    print(f"  ✅ Valid (safe to send): {valid_count}")
    print(f"  ⚠️  Catch-all domains:   {catch_all_count}")
    print(f"  ❌ Invalid / Error:      {invalid_count}")
    print(f"\nOutput: {output_file}")
    print(f"{'='*60}")


if __name__ == '__main__':
    asyncio.run(verify_and_find_emails())
