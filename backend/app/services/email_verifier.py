"""
Comprehensive Email Verification Service
Integrates multiple validation methods including O365 autodiscover and Gmail calendar checking
Optimized with domain-level caching and parallel async checks
"""

import re
import dns.resolver
import smtplib
import socket
import requests
import random
import string
import asyncio
import logging
import time
from typing import Dict, Tuple, Optional
from email_validator import validate_email, EmailNotValidError
import aiosmtplib
from app.services.office365_checker import office365_checker
from app.services.gmail_checker import gmail_checker
from app.services.avatar_checker import avatar_checker


class DomainCache:
    """TTL-based domain cache for MX records, catch-all, and O365 status"""
    
    def __init__(self, ttl_seconds: int = 3600):
        self._cache: Dict[str, dict] = {}
        self._ttl = ttl_seconds
    
    def get(self, domain: str, key: str):
        entry = self._cache.get(f"{domain}:{key}")
        if entry and (time.time() - entry['ts']) < self._ttl:
            return entry['value']
        return None
    
    def set(self, domain: str, key: str, value):
        self._cache[f"{domain}:{key}"] = {'value': value, 'ts': time.time()}


class EmailVerificationService:
    """
    Comprehensive email verification service that performs:
    - Syntax validation
    - Domain validation
    - MX record lookup
    - SMTP verification
    - Office 365 detection
    - Disposable email detection
    - Role-based email detection
    - Catch-all detection
    - Spam trap identification
    - Social Profile Validation (Avatar)
    
    Optimized with:
    - Domain-level caching (MX, catch-all, O365, provider)
    - Parallel async checks where possible
    - Reduced timeouts
    """
    
    # Common role-based prefixes
    ROLE_BASED_PREFIXES = {
        'admin', 'administrator', 'info', 'support', 'sales', 'contact',
        'help', 'service', 'noreply', 'no-reply', 'postmaster', 'webmaster',
        'marketing', 'billing', 'abuse', 'security', 'privacy'
    }
    
    def __init__(self):
        self.user_agent = 'Microsoft Office/16.0 (Windows NT 10.0; Microsoft Outlook 16.0.12026; Pro)'
        self.headers = {'User-Agent': self.user_agent, 'Accept': 'application/json'}
        self.domain_cache_old = {}  # Legacy O365 cache
        self.cache = DomainCache(ttl_seconds=3600)  # 1-hour TTL
        
        # Load disposable domains from file (5000+ domains)
        self.disposable_domains = self._load_disposable_domains()
    
    def _load_disposable_domains(self) -> set:
        """Load disposable email domains from file"""
        import os
        
        file_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'disposable_domains.txt')
        
        try:
            with open(file_path, 'r') as f:
                domains = {line.strip().lower() for line in f if line.strip()}
            print(f"✅ Loaded {len(domains)} disposable email domains")
            return domains
        except FileNotFoundError:
            print(f"⚠️ Disposable domains file not found at {file_path}, using fallback list")
            return {
                'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
                'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
                'yopmail.com', 'fakeinbox.com', 'trashmail.com', 'sharklasers.com'
            }
        except Exception as e:
            print(f"⚠️ Error loading disposable domains: {e}")
            return set()
    
    async def verify_email(self, email: str) -> Dict:
        """
        Perform comprehensive email verification with caching and parallelism.
        Returns detailed validation results.
        """
        result = {
            'email': email,
            'syntax': 'unknown',
            'domain': 'unknown',
            'mx': 'unknown',
            'mx_records': [],
            'smtp': 'unknown',
            'smtp_provider': None,
            'catch_all': False,
            'disposable': False,
            'role_based': False,
            'is_o365': False,
            'spam_risk': 'unknown',
            'final_status': 'unknown',
            'safety_score': 0,
            'reason': None,
            'has_social': False,
            'social_platform': None,
            'details': {}
        }
        
        try:
            # ── Phase 1: Quick local checks (instant) ──────────────────
            syntax_valid, syntax_msg = self._validate_syntax(email)
            result['syntax'] = 'valid' if syntax_valid else 'invalid'
            result['details']['syntax'] = syntax_msg
            
            if not syntax_valid:
                result['final_status'] = 'invalid_syntax'
                result['safety_score'] = 0
                return result
            
            local, domain = email.split('@')
            
            # These are instant — run synchronously
            result['disposable'] = self._is_disposable(domain)
            result['role_based'] = self._is_role_based(local)
            
            if result['disposable']:
                result['spam_risk'] = 'high'
                result['safety_score'] = 20
            
            # ── Phase 2: Domain + MX (cached or parallel) ────────────
            domain_valid, domain_msg = self._validate_domain_cached(domain)
            result['domain'] = 'valid' if domain_valid else 'invalid'
            result['details']['domain'] = domain_msg
            
            if not domain_valid:
                result['final_status'] = 'invalid_domain'
                result['safety_score'] = 10
                return result
            
            mx_valid, mx_records = self._check_mx_cached(domain)
            result['mx'] = 'found' if mx_valid else 'not_found'
            result['mx_records'] = mx_records
            result['details']['mx_records'] = mx_records
            
            if mx_records:
                result['smtp_provider'] = self._extract_smtp_provider(mx_records[0])
            
            if not mx_valid:
                result['final_status'] = 'no_mx_records'
                result['safety_score'] = 15
                result['reason'] = 'No MX records found'
                return result
            
            # ── Phase 3: Provider-specific check (uses cache) ────────
            specialized_check_result = await self._use_specialized_checker(email, domain, mx_records)
            if specialized_check_result:
                result['details']['specialized_check'] = specialized_check_result
                
                is_catch_all = specialized_check_result.get('catch_all', False)
                if is_catch_all:
                    result['catch_all'] = True
                
                if specialized_check_result.get('valid') is not None:
                    result['smtp'] = 'valid' if specialized_check_result['valid'] else 'invalid'
                    result['details']['smtp'] = f"Verified via {specialized_check_result['method']}: {specialized_check_result['details']}"
                    
                    if specialized_check_result['valid']:
                        method = specialized_check_result.get('method', '')
                        
                        if 'microsoft_login_api' in method:
                            result['final_status'] = 'valid_safe'
                            result['safety_score'] = 90 if not result['role_based'] else 80
                            result['spam_risk'] = 'low'
                            result['reason'] = 'Confirmed via Microsoft Login API'
                        elif is_catch_all:
                            result['final_status'] = 'valid_risky'
                            result['safety_score'] = 60
                            result['spam_risk'] = 'medium'
                        else:
                            result['final_status'] = 'valid_safe'
                            result['safety_score'] = 95 if not result['role_based'] else 85
                            result['spam_risk'] = 'low'
                    else:
                        result['final_status'] = 'invalid'
                        result['safety_score'] = 10
                        result['spam_risk'] = 'high'
                    
                    if 'office365' in specialized_check_result['method']:
                        result['is_o365'] = True
                    
                    return result
            
            # ── Phase 4: SMTP + Catch-all + O365 + Social (parallel) ─
            mx_host = mx_records[0] if mx_records else None
            
            # Run SMTP, O365 check, and social check in parallel
            smtp_task = self._verify_smtp(email, mx_host)
            o365_task = self._check_o365_cached(email, domain)
            
            smtp_result, is_o365 = await asyncio.gather(smtp_task, o365_task)
            smtp_valid, smtp_msg = smtp_result
            
            result['smtp'] = smtp_msg
            result['details']['smtp'] = smtp_msg
            result['is_o365'] = is_o365
            
            # Catch-all check (uses cache)
            if smtp_valid:
                result['catch_all'] = await self._check_catch_all_cached(domain, mx_host)
            else:
                from app.services.catch_all_db import is_known_catch_all
                result['catch_all'] = is_known_catch_all(domain)
                if result['catch_all']:
                    result['details']['catch_all_source'] = 'known_database'
            
            # Social check for uncertain results
            if result['catch_all'] or result['final_status'] == 'unknown':
                social_result = await avatar_checker.check_social_presence(email)
                if social_result['has_social']:
                    result['has_social'] = True
                    result['social_platform'] = social_result['platform']
                    result['details']['social'] = social_result['details']
                    result['safety_score'] = max(result['safety_score'], 90)
                    result['final_status'] = 'valid_safe'
            
            # ── Phase 5: Final scoring ───────────────────────────────
            result['final_status'], result['safety_score'], result['reason'] = self._calculate_final_status(result)
            result['spam_risk'] = self._assess_spam_risk(result)
            
        except Exception as e:
            result['details']['error'] = str(e)
            result['final_status'] = 'error'
        
        return result
    
    # ── Cached domain lookups ──────────────────────────────────────────
    
    def _validate_domain_cached(self, domain: str) -> Tuple[bool, str]:
        """Validate domain with caching"""
        cached = self.cache.get(domain, 'domain_valid')
        if cached is not None:
            return cached
        result = self._validate_domain(domain)
        self.cache.set(domain, 'domain_valid', result)
        return result
    
    def _check_mx_cached(self, domain: str) -> Tuple[bool, list]:
        """Check MX records with caching"""
        cached = self.cache.get(domain, 'mx')
        if cached is not None:
            return cached
        result = self._check_mx_records(domain)
        self.cache.set(domain, 'mx', result)
        return result
    
    async def _check_o365_cached(self, email: str, domain: str) -> bool:
        """Check O365 with domain-level caching"""
        cached = self.cache.get(domain, 'is_o365_domain')
        if cached is False:
            return False
        result = await self._check_o365(email, domain)
        if not result:
            self.cache.set(domain, 'is_o365_domain', False)
        return result
    
    async def _check_catch_all_cached(self, domain: str, mx_host: Optional[str]) -> bool:
        """Check catch-all with domain-level caching"""
        cached = self.cache.get(domain, 'catch_all')
        if cached is not None:
            return cached
        result = await self._check_catch_all(domain, mx_host)
        self.cache.set(domain, 'catch_all', result)
        return result
    
    # ── Core checks ───────────────────────────────────────────────────
    
    def _validate_syntax(self, email: str) -> Tuple[bool, str]:
        """Validate email syntax using email-validator library"""
        try:
            validate_email(email, check_deliverability=False)
            return True, "Valid syntax"
        except EmailNotValidError as e:
            return False, str(e)
    
    def _validate_domain(self, domain: str) -> Tuple[bool, str]:
        """Validate domain exists and is reachable"""
        try:
            socket.gethostbyname(domain)
            return True, "Domain exists"
        except socket.gaierror:
            return False, "Domain does not exist"
    
    def _check_mx_records(self, domain: str) -> Tuple[bool, list]:
        """Check MX records for the domain"""
        try:
            resolver = dns.resolver.Resolver()
            resolver.nameservers = ['8.8.8.8', '8.8.4.4']
            resolver.timeout = 5   # Reduced from 10s
            resolver.lifetime = 5  # Reduced from 10s
            
            mx_records = resolver.resolve(domain, 'MX')
            mx_hosts = [str(r.exchange).rstrip('.') for r in mx_records]
            return True, mx_hosts
        except dns.exception.Timeout:
            print(f"DNS timeout for {domain}")
            return False, []
        except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers):
            return False, []
        except Exception as e:
            print(f"MX lookup error for {domain}: {e}")
            return False, []
    
    async def _use_specialized_checker(self, email: str, domain: str, mx_records: list) -> Optional[Dict]:
        """Route email to specialized checker based on provider"""
        # Match base domain names (without TLD) to cover international variants
        # e.g. hotmail.fr, hotmail.co.uk, outlook.de, live.co.uk, etc.
        o365_domain_bases = [
            'outlook', 'hotmail', 'live', 'msn', 'office365', 'microsoft'
        ]
        
        mx_is_o365 = any('outlook' in mx.lower() or 'microsoft' in mx.lower() for mx in mx_records)
        domain_base = domain.lower().split('.')[0]
        domain_is_o365 = domain_base in o365_domain_bases
        
        # Check SPF for O365 (cached at domain level)
        spf_is_o365 = False
        cached_spf = self.cache.get(domain, 'spf_o365')
        if cached_spf is not None:
            spf_is_o365 = cached_spf
        else:
            try:
                spf_records = dns.resolver.resolve(domain, 'TXT')
                for record in spf_records:
                    txt_value = str(record).lower()
                    if 'spf.protection.outlook.com' in txt_value:
                        spf_is_o365 = True
                        break
            except Exception:
                pass
            self.cache.set(domain, 'spf_o365', spf_is_o365)
        
        if mx_is_o365 or domain_is_o365 or spf_is_o365:
            result = office365_checker.check_email(email)
            return result
        
        gmail_indicators = ['gmail.com', 'googlemail.com']
        mx_is_google = any('google' in mx.lower() or 'gmail' in mx.lower() for mx in mx_records)
        domain_is_gmail = any(indicator in domain.lower() for indicator in gmail_indicators)
        
        if mx_is_google or domain_is_gmail:
            result = gmail_checker.check_email(email)
            return result
        
        return None
    
    async def _check_o365(self, email: str, domain: str) -> bool:
        """Check if email is on Office 365 using autodiscover API"""
        try:
            if domain in self.domain_cache_old:
                if not self.domain_cache_old[domain]:
                    return False
            else:
                junk_user = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(20))
                test_url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{junk_user}@{domain}?Protocol=rest'
                r = requests.get(test_url, headers=self.headers, verify=True, allow_redirects=False, timeout=3)
                
                if 'outlook.office365.com' in r.text:
                    self.domain_cache_old[domain] = True
                else:
                    self.domain_cache_old[domain] = False
                    return False
            
            url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{email}?Protocol=rest'
            r = requests.get(url, headers=self.headers, verify=True, allow_redirects=False, timeout=3)
            
            if r.status_code == 200:
                return True
            elif r.status_code == 302:
                if self.domain_cache_old.get(domain) and 'outlook.office365.com' not in r.text:
                    return True
            
            return False
        except Exception:
            return False
    
    async def _verify_smtp(self, email: str, mx_host: Optional[str]) -> Tuple[bool, str]:
        """Verify email via SMTP handshake (reduced timeout)"""
        if not mx_host:
            return False, "no_mx"
        
        try:
            smtp = aiosmtplib.SMTP(hostname=mx_host, port=25, timeout=5)  # Reduced from 10s
            await smtp.connect()
            await smtp.ehlo()
            
            code, message = await smtp.rcpt(email)
            await smtp.quit()
            
            message_str = message.decode() if isinstance(message, bytes) else str(message)
            message_lower = message_str.lower()
            
            if code == 250:
                return True, "responsive"
            elif code == 550:
                if 'mailbox full' in message_lower or 'quota' in message_lower or 'over quota' in message_lower:
                    return False, "mailbox_full"
                elif 'does not exist' in message_lower or 'user unknown' in message_lower or 'no such user' in message_lower:
                    return False, "user_not_found"
                elif 'disabled' in message_lower or 'suspended' in message_lower:
                    return False, "account_disabled"
                else:
                    return False, "rejected"
            elif code == 552:
                return False, "mailbox_full"
            elif code == 553:
                return False, "invalid_mailbox"
            elif code == 450 or code == 451:
                return False, "temporary_failure"
            else:
                return False, f"code_{code}"
                
        except Exception as e:
            return False, "unreachable"
    
    async def _check_catch_all(self, domain: str, mx_host: Optional[str]) -> bool:
        """Check if domain is catch-all by testing random email"""
        if not mx_host:
            return False
        
        try:
            random_email = f"{''.join(random.choices(string.ascii_lowercase, k=20))}@{domain}"
            smtp = aiosmtplib.SMTP(hostname=mx_host, port=25, timeout=5)  # Reduced from 10s
            await smtp.connect()
            await smtp.ehlo()
            
            code, _ = await smtp.rcpt(random_email)
            await smtp.quit()
            
            return code == 250
        except Exception:
            return False
    
    def _is_disposable(self, domain: str) -> bool:
        """Check if domain is a known disposable email provider"""
        return domain.lower() in self.disposable_domains
    
    def _is_role_based(self, local_part: str) -> bool:
        """Check if email is role-based"""
        return local_part.lower() in self.ROLE_BASED_PREFIXES
    
    def _extract_smtp_provider(self, mx_record: str) -> str:
        """Extract SMTP provider name from MX record"""
        mx_lower = mx_record.lower()
        
        if 'google' in mx_lower or 'gmail' in mx_lower:
            return 'Google Workspace'
        elif 'outlook' in mx_lower or 'microsoft' in mx_lower:
            return 'Microsoft 365'
        elif 'yahoo' in mx_lower:
            return 'Yahoo'
        elif 'protonmail' in mx_lower or 'proton' in mx_lower:
            return 'ProtonMail'
        elif 'zoho' in mx_lower:
            return 'Zoho Mail'
        elif 'titan' in mx_lower:
            return 'Titan'
        elif 'mailgun' in mx_lower:
            return 'Mailgun'
        elif 'sendgrid' in mx_lower:
            return 'SendGrid'
        else:
            return mx_record.split('.')[0] if '.' in mx_record else mx_record
    
    def _calculate_final_status(self, result: Dict) -> Tuple[str, int, str]:
        """Calculate final status, safety score, and reason"""
        score = 100
        
        if result['disposable']:
            score -= 70
            return 'disposable', score, 'Disposable email address'
        
        if result['syntax'] != 'valid':
            return 'invalid_syntax', 0, 'Invalid email syntax'
        
        if result['domain'] != 'valid':
            return 'invalid_domain', 10, 'Domain does not exist'
        
        if result['mx'] != 'found':
            return 'no_mx', 15, 'No MX records found'
        
        smtp_status = result['smtp']
        
        if smtp_status == 'mailbox_full':
            return 'mailbox_full', 40, 'Mailbox is full - cannot receive emails'
        
        if smtp_status == 'account_disabled':
            return 'account_disabled', 25, 'Account disabled or suspended'
        
        if smtp_status == 'user_not_found':
            return 'invalid', 20, 'User does not exist'
        
        if smtp_status == 'invalid_mailbox':
            return 'invalid', 15, 'Invalid mailbox name'
        
        if smtp_status == 'rejected':
            return 'invalid', 20, 'Email rejected by server'
        
        if smtp_status == 'temporary_failure':
            return 'temporary_failure', 60, 'Temporary server issue - try again later'
        
        if smtp_status == 'unreachable' and result['catch_all']:
            return 'risky', 50, 'ACCEPT ALL'
        
        if smtp_status == 'unreachable':
            score -= 30
        
        if result['catch_all']:
            score -= 20
        
        if result['role_based']:
            score -= 10
        
        if score >= 90:
            return 'valid_safe', score, 'Valid and safe to send'
        elif score >= 70:
            reason = 'Valid but risky'
            if result['catch_all']:
                reason = 'Catch-all domain - cannot verify specific mailbox'
            if result['role_based']:
                reason = 'Role-based email address'
            return 'valid_risky', score, reason
        elif score >= 50:
            return 'risky', score, 'Risky email address'
        else:
            return 'invalid', score, 'Invalid or unverifiable'
    
    def _assess_spam_risk(self, result: Dict) -> str:
        """Assess spam risk level"""
        if result['disposable']:
            return 'high'
        
        if result['safety_score'] >= 80:
            return 'low'
        elif result['safety_score'] >= 60:
            return 'medium'
        else:
            return 'high'


# Singleton instance
email_verifier = EmailVerificationService()
