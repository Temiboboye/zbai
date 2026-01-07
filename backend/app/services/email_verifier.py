"""
Comprehensive Email Verification Service
Integrates multiple validation methods including O365 autodiscover and Gmail calendar checking
"""

import re
import dns.resolver
import smtplib
import socket
import requests
import random
import string
import asyncio
from typing import Dict, Tuple, Optional
from email_validator import validate_email, EmailNotValidError
import aiosmtplib
from app.services.office365_checker import office365_checker
from app.services.gmail_checker import gmail_checker


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
    """
    
    # Common disposable email domains
    DISPOSABLE_DOMAINS = {
        'tempmail.com', 'guerrillamail.com', '10minutemail.com', 'mailinator.com',
        'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc',
        'yopmail.com', 'fakeinbox.com', 'trashmail.com', 'sharklasers.com'
    }
    
    # Common role-based prefixes
    ROLE_BASED_PREFIXES = {
        'admin', 'administrator', 'info', 'support', 'sales', 'contact',
        'help', 'service', 'noreply', 'no-reply', 'postmaster', 'webmaster',
        'marketing', 'billing', 'abuse', 'security', 'privacy'
    }
    
    def __init__(self):
        self.user_agent = 'Microsoft Office/16.0 (Windows NT 10.0; Microsoft Outlook 16.0.12026; Pro)'
        self.headers = {'User-Agent': self.user_agent, 'Accept': 'application/json'}
        self.domain_cache = {}
    
    async def verify_email(self, email: str) -> Dict:
        """
        Perform comprehensive email verification
        Returns detailed validation results
        """
        result = {
            'email': email,
            'syntax': 'unknown',
            'domain': 'unknown',
            'mx': 'unknown',
            'mx_records': [],  # MX records list
            'smtp': 'unknown',
            'smtp_provider': None,  # SMTP provider name
            'catch_all': False,
            'disposable': False,
            'role_based': False,
            'is_o365': False,
            'spam_risk': 'unknown',
            'final_status': 'unknown',
            'safety_score': 0,
            'reason': None,  # Reason for the status
            'details': {}
        }
        
        try:
            # 1. Syntax Validation
            syntax_valid, syntax_msg = self._validate_syntax(email)
            result['syntax'] = 'valid' if syntax_valid else 'invalid'
            result['details']['syntax'] = syntax_msg
            
            if not syntax_valid:
                result['final_status'] = 'invalid_syntax'
                result['safety_score'] = 0
                return result
            
            # Extract domain
            local, domain = email.split('@')
            
            # 2. Disposable Email Check
            result['disposable'] = self._is_disposable(domain)
            if result['disposable']:
                result['spam_risk'] = 'high'
                result['safety_score'] = 20
            
            # 3. Role-Based Check
            result['role_based'] = self._is_role_based(local)
            
            # 4. Domain Validation
            domain_valid, domain_msg = self._validate_domain(domain)
            result['domain'] = 'valid' if domain_valid else 'invalid'
            result['details']['domain'] = domain_msg
            
            if not domain_valid:
                result['final_status'] = 'invalid_domain'
                result['safety_score'] = 10
                return result
            
            # 5. MX Record Lookup
            mx_valid, mx_records = self._check_mx_records(domain)
            result['mx'] = 'found' if mx_valid else 'not_found'
            result['mx_records'] = mx_records  # Add to top level
            result['details']['mx_records'] = mx_records
            
            # Extract SMTP provider from MX records
            if mx_records:
                result['smtp_provider'] = self._extract_smtp_provider(mx_records[0])
            
            if not mx_valid:
                result['final_status'] = 'no_mx_records'
                result['safety_score'] = 15
                result['reason'] = 'No MX records found'
                return result
            
            # 6. Specialized Provider Checking (Office 365 / Gmail)
            specialized_check_result = await self._use_specialized_checker(email, domain, mx_records)
            if specialized_check_result:
                result['details']['specialized_check'] = specialized_check_result
                
                # Check if specialized checker detected catch-all
                is_catch_all = specialized_check_result.get('catch_all', False)
                if is_catch_all:
                    result['catch_all'] = True
                
                # If specialized checker gave a definitive answer, use it
                if specialized_check_result.get('valid') is not None:
                    result['smtp'] = 'valid' if specialized_check_result['valid'] else 'invalid'
                    result['details']['smtp'] = f"Verified via {specialized_check_result['method']}: {specialized_check_result['details']}"
                    
                    # Handle valid emails
                    if specialized_check_result['valid']:
                        # If catch-all detected, mark as risky
                        if is_catch_all:
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
                    
                    # Still check for Office 365 flag
                    if 'office365' in specialized_check_result['method']:
                        result['is_o365'] = True
                    
                    return result
            
            # 7. Office 365 Detection (fallback if specialized check didn't run)
            result['is_o365'] = await self._check_o365(email, domain)
            
            # 8. SMTP Verification
            smtp_valid, smtp_msg = await self._verify_smtp(email, mx_records[0] if mx_records else None)
            result['smtp'] = smtp_msg
            result['details']['smtp'] = smtp_msg
            
            # 9. Catch-All Detection
            if smtp_valid:
                result['catch_all'] = await self._check_catch_all(domain, mx_records[0] if mx_records else None)
            else:
                # If SMTP is unreachable (port 25 blocked), check known catch-all database
                from app.services.catch_all_db import is_known_catch_all
                result['catch_all'] = is_known_catch_all(domain)
                if result['catch_all']:
                    result['details']['catch_all_source'] = 'known_database'
            
            # 10. Calculate Final Status and Safety Score
            result['final_status'], result['safety_score'], result['reason'] = self._calculate_final_status(result)
            
            # 11. Spam Risk Assessment
            result['spam_risk'] = self._assess_spam_risk(result)
            
        except Exception as e:
            result['details']['error'] = str(e)
            result['final_status'] = 'error'
        
        return result
    
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
            # Create resolver with longer timeout and Google DNS
            resolver = dns.resolver.Resolver()
            resolver.nameservers = ['8.8.8.8', '8.8.4.4']  # Google DNS
            resolver.timeout = 10
            resolver.lifetime = 10
            
            mx_records = resolver.resolve(domain, 'MX')
            mx_hosts = [str(r.exchange).rstrip('.') for r in mx_records]
            return True, mx_hosts
        except dns.exception.Timeout:
            # DNS timeout - might be network issue
            print(f"DNS timeout for {domain}")
            return False, []
        except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers):
            return False, []
        except Exception as e:
            print(f"MX lookup error for {domain}: {e}")
            return False, []
    
    async def _use_specialized_checker(self, email: str, domain: str, mx_records: list) -> Optional[Dict]:
        """
        Route email to specialized checker based on provider
        Returns None if no specialized checker applies
        """
        # Check if it's an Office 365 / Outlook domain
        o365_indicators = [
            'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
            'office365.com', 'microsoft.com'
        ]
        
        # Check MX records for Office 365
        mx_is_o365 = any('outlook' in mx.lower() or 'microsoft' in mx.lower() for mx in mx_records)
        domain_is_o365 = any(indicator in domain.lower() for indicator in o365_indicators)
        
        if mx_is_o365 or domain_is_o365:
            # Use Office 365 specialized checker
            result = office365_checker.check_email(email)
            return result
        
        # Check if it's a Gmail / GSuite domain
        gmail_indicators = ['gmail.com', 'googlemail.com']
        mx_is_google = any('google' in mx.lower() or 'gmail' in mx.lower() for mx in mx_records)
        domain_is_gmail = any(indicator in domain.lower() for indicator in gmail_indicators)
        
        if mx_is_google or domain_is_gmail:
            # Use Gmail specialized checker
            result = gmail_checker.check_email(email)
            return result
        
        return None
    
    async def _check_o365(self, email: str, domain: str) -> bool:
        """
        Check if email is on Office 365 using autodiscover API
        Based on the 365checker.py logic
        """
        try:
            # Check domain cache first
            if domain in self.domain_cache:
                if not self.domain_cache[domain]:
                    return False
            else:
                # Test with junk user to see if domain uses O365
                junk_user = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(20))
                test_url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{junk_user}@{domain}?Protocol=rest'
                r = requests.get(test_url, headers=self.headers, verify=True, allow_redirects=False, timeout=5)
                
                if 'outlook.office365.com' in r.text:
                    self.domain_cache[domain] = True
                else:
                    self.domain_cache[domain] = False
                    return False
            
            # Now check the actual email
            url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{email}?Protocol=rest'
            r = requests.get(url, headers=self.headers, verify=True, allow_redirects=False, timeout=5)
            
            if r.status_code == 200:
                return True
            elif r.status_code == 302:
                if self.domain_cache.get(domain) and 'outlook.office365.com' not in r.text:
                    return True
            
            return False
        except Exception:
            return False
    
    async def _verify_smtp(self, email: str, mx_host: Optional[str]) -> Tuple[bool, str]:
        """Verify email via SMTP handshake"""
        if not mx_host:
            return False, "no_mx"
        
        try:
            # Use aiosmtplib for async SMTP
            smtp = aiosmtplib.SMTP(hostname=mx_host, port=25, timeout=10)
            await smtp.connect()
            await smtp.ehlo()
            
            # Try RCPT TO command
            code, message = await smtp.rcpt(email)
            await smtp.quit()
            
            if code == 250:
                return True, "responsive"
            elif code == 550:
                return False, "rejected"
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
            smtp = aiosmtplib.SMTP(hostname=mx_host, port=25, timeout=10)
            await smtp.connect()
            await smtp.ehlo()
            
            code, _ = await smtp.rcpt(random_email)
            await smtp.quit()
            
            return code == 250
        except Exception:
            return False
    
    def _is_disposable(self, domain: str) -> bool:
        """Check if domain is a known disposable email provider"""
        return domain.lower() in self.DISPOSABLE_DOMAINS
    
    def _is_role_based(self, local_part: str) -> bool:
        """Check if email is role-based"""
        return local_part.lower() in self.ROLE_BASED_PREFIXES
    
    def _extract_smtp_provider(self, mx_record: str) -> str:
        """Extract SMTP provider name from MX record"""
        mx_lower = mx_record.lower()
        
        # Common providers
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
            # Return the domain part of MX record
            return mx_record.split('.')[0] if '.' in mx_record else mx_record
    
    def _calculate_final_status(self, result: Dict) -> Tuple[str, int, str]:
        """Calculate final status, safety score, and reason"""
        score = 100
        
        # Deduct points for issues
        if result['disposable']:
            score -= 70
            return 'disposable', score, 'Disposable email address'
        
        if result['syntax'] != 'valid':
            return 'invalid_syntax', 0, 'Invalid email syntax'
        
        if result['domain'] != 'valid':
            return 'invalid_domain', 10, 'Domain does not exist'
        
        if result['mx'] != 'found':
            return 'no_mx', 15, 'No MX records found'
        
        if result['smtp'] == 'rejected':
            return 'invalid', 20, 'Email rejected by server'
        
        # CRITICAL: Catch-all + Unreachable SMTP = Cannot verify = Risky
        if result['smtp'] == 'unreachable' and result['catch_all']:
            # Cannot verify if email exists on a catch-all domain with blocked SMTP
            return 'risky', 50, 'ACCEPT ALL'
        
        if result['smtp'] == 'unreachable':
            score -= 30
        
        if result['catch_all']:
            score -= 20
        
        if result['role_based']:
            score -= 10
        
        # Determine status and reason
        if score >= 90:
            return 'valid_safe', score, 'Valid and safe'
        elif score >= 70:
            reason = 'Valid but risky'
            if result['catch_all']:
                reason = 'Catch-all domain'
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
