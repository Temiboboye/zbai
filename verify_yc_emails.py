"""
YC Founder Email Finder + Verifier (v2)
----------------------------------------
Uses provider-specific verification:
  - Google Workspace: Calendar iCal check (HEAD request)
  - Microsoft 365: Office365 autodiscover API 
  - Other: Full SMTP verification

Run on VPS: python3 verify_yc_emails.py
"""

import csv
import asyncio
import sys
import os
import time
import json
import dns.resolver

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from app.services.email_finder import EmailFinderService
from app.services.email_verifier import EmailVerificationService
from app.services.gmail_checker import gmail_checker
from app.services.office365_checker import office365_checker


def detect_provider(domain: str) -> str:
    """Detect email provider from MX records."""
    try:
        resolver = dns.resolver.Resolver()
        resolver.nameservers = ['8.8.8.8', '8.8.4.4']
        resolver.timeout = 5
        resolver.lifetime = 5
        
        mx_records = resolver.resolve(domain, 'MX')
        mx_hosts = [str(r.exchange).rstrip('.').lower() for r in mx_records]
        
        for mx in mx_hosts:
            if 'google' in mx or 'gmail' in mx:
                return 'google'
            if 'outlook' in mx or 'microsoft' in mx:
                return 'microsoft'
        
        return 'other'
    except Exception:
        return 'unknown'


def verify_google(email: str) -> dict:
    """Verify email using Google Calendar method."""
    result = gmail_checker.check_email(email)
    return result


def verify_microsoft(email: str) -> dict:
    """Verify email using O365 autodiscover method."""
    result = office365_checker.check_email(email)
    return result


async def verify_smtp(verifier: EmailVerificationService, email: str) -> dict:
    """Verify email using full SMTP verification."""
    result = await verifier.verify_email(email)
    return {
        'valid': result.get('final_status') in ['valid_safe', 'valid_risky'],
        'method': 'smtp',
        'details': result.get('reason', ''),
        'catch_all': result.get('catch_all', False),
        'safety_score': result.get('safety_score', 0),
        'smtp_provider': result.get('smtp_provider', ''),
        'final_status': result.get('final_status', 'unknown'),
    }


def verify_email_by_provider(email: str, provider: str, verifier=None) -> dict:
    """Route verification to the right method based on provider."""
    if provider == 'google':
        result = verify_google(email)
        # Normalize result
        return {
            'valid': result.get('valid', False),
            'method': result.get('method', 'gmail_calendar'),
            'details': result.get('details', ''),
            'catch_all': result.get('catch_all', False),
            'safety_score': 90 if result.get('valid') else 10,
            'smtp_provider': 'Google Workspace',
            'final_status': 'valid_safe' if result.get('valid') and not result.get('catch_all') else 
                           'valid_risky' if result.get('valid') and result.get('catch_all') else 'invalid',
        }
    elif provider == 'microsoft':
        result = verify_microsoft(email)
        return {
            'valid': result.get('valid', False),
            'method': result.get('method', 'o365_autodiscover'),
            'details': result.get('details', ''),
            'catch_all': result.get('catch_all', False),
            'safety_score': 90 if result.get('valid') else 10,
            'smtp_provider': 'Microsoft 365',
            'final_status': 'valid_safe' if result.get('valid') and not result.get('catch_all') else 
                           'valid_risky' if result.get('valid') and result.get('catch_all') else 'invalid',
        }
    else:
        # For other providers, return None to indicate async SMTP needed
        return None


async def verify_and_find_emails():
    verifier = EmailVerificationService()
    finder = EmailFinderService(email_verifier=verifier)
    
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
    
    # Cache domain providers to avoid repeated DNS lookups
    domain_providers = {}
    
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
            elif result.get('is_catch_all'):
                catch_all_count += 1
            else:
                invalid_count += 1
            continue
        
        print(f"\n[{i+1}/{total}] {founder} @ {company} ({domain})")
        
        try:
            # Step 1: Detect provider (cached per domain)
            if domain not in domain_providers:
                domain_providers[domain] = detect_provider(domain)
            provider = domain_providers[domain]
            print(f"  📧 Provider: {provider}")
            
            # Step 2: Verify the original pattern-guessed email
            print(f"  🔍 Verifying {original_email}...")
            
            provider_result = verify_email_by_provider(original_email, provider, verifier)
            
            if provider_result is None:
                # SMTP fallback for non-Google/non-Microsoft
                provider_result = await verify_smtp(verifier, original_email)
            
            is_valid = provider_result.get('valid', False)
            final_status = provider_result.get('final_status', 'unknown')
            safety_score = provider_result.get('safety_score', 0)
            smtp_provider = provider_result.get('smtp_provider', '')
            is_catch_all = provider_result.get('catch_all', False)
            method = provider_result.get('method', '')
            
            print(f"  📊 Status: {final_status} | Score: {safety_score} | Method: {method} | Catch-all: {is_catch_all}")
            
            verified_email = original_email
            verified_status = final_status
            verified_score = safety_score
            
            # Step 3: If invalid, try alternative patterns
            if not is_valid and not is_catch_all:
                print(f"  ❌ Invalid. Trying alternative patterns...")
                
                name_result = finder.clean_name(founder)
                first_name, middle_name, last_name = name_result if name_result else ('', '', '')
                
                if first_name and domain:
                    patterns = finder.generate_email_patterns(first_name, last_name, domain, middle_name)
                    patterns = [p for p in patterns if p != original_email]
                    
                    for pattern_email in patterns[:8]:  # Try top 8 alternatives
                        print(f"  🔍 Trying {pattern_email}...")
                        
                        alt_result = verify_email_by_provider(pattern_email, provider, verifier)
                        if alt_result is None:
                            alt_result = await verify_smtp(verifier, pattern_email)
                        
                        if alt_result.get('valid'):
                            print(f"  ✅ FOUND: {pattern_email} (score: {alt_result.get('safety_score', 0)}, method: {alt_result.get('method', '')})")
                            verified_email = pattern_email
                            verified_status = alt_result.get('final_status', 'valid_safe')
                            verified_score = alt_result.get('safety_score', 90)
                            is_catch_all = alt_result.get('catch_all', False)
                            smtp_provider = alt_result.get('smtp_provider', '')
                            break
                        
                        time.sleep(0.3)  # Rate limit for Google/O365 API calls
            
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
                pct = round((i+1)/total*100, 1)
                print(f"\n  💾 [{pct}%] Valid: {valid_count} | Catch-all: {catch_all_count} | Invalid: {invalid_count}")
            
            time.sleep(0.3)  # Global rate limit
            
        except Exception as e:
            print(f"  ⚠️ Error: {e}")
            import traceback
            traceback.print_exc()
            results.append({
                **row,
                'verified_email': original_email,
                'verified_status': 'error',
                'verified_score': 0,
                'is_catch_all': False,
                'smtp_provider': '',
            })
            invalid_count += 1
    
    # Save final progress
    with open(progress_file, 'w') as f:
        json.dump(processed, f)
    
    # Write output CSV
    fieldnames = list(rows[0].keys()) + ['verified_email', 'verified_status', 'verified_score', 'is_catch_all', 'smtp_provider']
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
