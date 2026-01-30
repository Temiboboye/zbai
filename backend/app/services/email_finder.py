"""
Email Finder Service
--------------------
Finds email addresses based on name and domain using:
1. Email pattern generation based on names and company domains
2. DNS MX record validation
3. Optional SMTP verification using existing email verifier
"""

import re
import dns.resolver
from typing import List, Dict, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class EmailFinderService:
    """Find and validate email addresses based on name and domain."""
    
    def __init__(self, email_verifier=None):
        """
        Initialize EmailFinder.
        
        Args:
            email_verifier: Optional EmailVerificationService instance for full verification
        """
        self.email_verifier = email_verifier
    
    def extract_domain(self, website: str) -> Optional[str]:
        """Extract domain from website URL or domain string."""
        if not website:
            return None
        
        try:
            from urllib.parse import urlparse
            
            website = website.strip()
            
            # Clean up the URL
            if not website.startswith(('http://', 'https://')):
                website = 'https://' + website
            
            parsed = urlparse(website)
            domain = parsed.netloc or parsed.path
            
            # Remove www. prefix
            domain = re.sub(r'^www\.', '', domain)
            
            # Remove trailing slashes and paths
            domain = domain.split('/')[0]
            
            return domain.lower() if domain else None
        except Exception as e:
            logger.debug(f"Error extracting domain from {website}: {e}")
            return None
    
    def clean_name(self, name: str) -> Tuple[str, str, str]:
        """
        Extract first, middle, and last name from full name.
        
        Returns:
            Tuple of (first_name, middle_name, last_name)
        """
        if not name:
            return '', '', ''
        
        # Remove special characters (except - and ') and extra spaces
        # But keep dots for middle initials if needed, though we usually strip them later
        name = re.sub(r'[^\w\s\-\'.]', '', name)
        name = ' '.join(name.split())
        
        parts = name.split()
        
        if len(parts) == 0:
            return '', '', ''
        elif len(parts) == 1:
            return parts[0].lower(), '', ''
        elif len(parts) == 2:
            return parts[0].lower(), '', parts[1].lower()
        else:
            # First name is first, Last is last, everything else is middle
            # We'll just take the first part of the 'middle' as the middle name/initial
            middle = parts[1].lower().replace('.', '')
            return parts[0].lower(), middle, parts[-1].lower()
    
    def generate_email_patterns(self, first_name: str, last_name: str, domain: str, middle_name: str = '') -> List[str]:
        """
        Generate common email patterns.
        
        Args:
            first_name: First name
            last_name: Last name
            domain: Company domain
            middle_name: Middle name or initial (optional)
            
        Returns:
            List of possible email addresses ordered by likelihood
        """
        if not domain or not first_name:
            return []
        
        patterns = []
        
        # Most common patterns first
        if last_name:
            patterns.extend([
                f"{first_name}.{last_name}@{domain}",      # john.doe@
                f"{first_name}@{domain}",                  # john@
                f"{first_name}{last_name[0]}@{domain}",    # johnd@
                f"{first_name}{last_name}@{domain}",       # johndoe@
                f"{first_name[0]}{last_name}@{domain}",    # jdoe@
                f"{first_name[0]}.{last_name}@{domain}",   # j.doe@
            ])

            # Add middle name patterns if available
            if middle_name:
                patterns.extend([
                    f"{first_name}.{middle_name}.{last_name}@{domain}",  # john.j.doe@
                    f"{first_name}{middle_name}{last_name}@{domain}",    # johnjdoe@
                    f"{first_name}{middle_name}.{last_name}@{domain}",   # johnj.doe@
                    f"{first_name}.{middle_name}{last_name}@{domain}",   # john.jdoe@
                    f"{first_name[0]}{middle_name}{last_name}@{domain}", # jjdoe@
                    f"{first_name[0]}.{middle_name}.{last_name}@{domain}", # j.j.doe@
                ])
            
            # Add remaining standard patterns
            patterns.extend([
                f"{first_name}.{last_name[0]}@{domain}",   # john.d@
                f"{first_name}_{last_name}@{domain}",      # john_doe@
                f"{last_name}.{first_name}@{domain}",      # doe.john@
                f"{last_name}{first_name}@{domain}",       # doejohn@
                f"{last_name}@{domain}",                   # doe@
            ])
        else:
            patterns.append(f"{first_name}@{domain}")
        
        # Remove duplicates while preserving order
        seen = set()
        unique_patterns = []
        for pattern in patterns:
            if pattern.lower() not in seen:
                seen.add(pattern.lower())
                unique_patterns.append(pattern.lower())
        
        return unique_patterns
    
    def _get_resolver(self):
        """Get DNS resolver configured with Google public DNS for reliability."""
        resolver = dns.resolver.Resolver()
        resolver.nameservers = ['8.8.8.8', '8.8.4.4', '1.1.1.1']  # Google and Cloudflare DNS
        resolver.timeout = 3  # 3 second timeout
        resolver.lifetime = 5  # 5 second total lifetime
        return resolver
    
    def verify_domain_mx(self, domain: str) -> bool:
        """
        Verify domain has valid MX records.
        
        Args:
            domain: Domain to verify
            
        Returns:
            True if domain has valid MX records
        """
        try:
            resolver = self._get_resolver()
            resolver.resolve(domain, 'MX')
            return True
        except Exception as e:
            logger.debug(f"MX lookup failed for {domain}: {e}")
            return False
    
    def get_mx_records(self, domain: str) -> List[str]:
        """Get MX records for a domain."""
        try:
            resolver = self._get_resolver()
            answers = resolver.resolve(domain, 'MX')
            return [str(r.exchange).rstrip('.') for r in answers]
        except Exception as e:
            logger.debug(f"MX records lookup failed for {domain}: {e}")
            return []
    
    async def find_email(
        self, 
        full_name: str, 
        domain_or_website: str, 
        verify: bool = False,
        max_patterns: int = 5
    ) -> Dict:
        """
        Find email for a person at a company.
        
        Args:
            full_name: Full name of the person
            domain_or_website: Company domain or website URL
            verify: If True, verify the email using SMTP
            max_patterns: Maximum number of pattern candidates to return
            
        Returns:
            Dict with email findings
        """
        result = {
            'full_name': full_name,
            'domain': None,
            'email': None,
            'email_candidates': [],
            'confidence': 'none',
            'method': None,
            'domain_valid': False,
            'mx_records': [],
            'verified': False,
            'verification_details': None
        }
        
        # Extract domain
        domain = self.extract_domain(domain_or_website)
        if not domain:
            result['error'] = 'Could not extract valid domain'
            return result
        
        result['domain'] = domain
        
        # Clean name
        first_name, middle_name, last_name = self.clean_name(full_name)
        if not first_name:
            result['error'] = 'Could not parse name'
            return result
        
        result['first_name'] = first_name
        result['middle_name'] = middle_name
        result['last_name'] = last_name
        
        # Generate email patterns first (always do this)
        patterns = self.generate_email_patterns(first_name, last_name, domain, middle_name)
        result['email_candidates'] = patterns[:max_patterns]
        
        if not patterns:
            result['error'] = 'Could not generate email patterns'
            return result
        
        # Set primary email (most likely pattern)
        result['email'] = patterns[0]
        
        # Try to check domain MX records for confidence level
        try:
            mx_records = self.get_mx_records(domain)
            result['mx_records'] = mx_records
            result['domain_valid'] = len(mx_records) > 0
            
            if result['domain_valid']:
                result['confidence'] = 'medium'
                result['method'] = 'pattern_dns_verified'
            else:
                result['confidence'] = 'low'
                result['method'] = 'pattern_only'
        except Exception as e:
            # DNS lookup failed, but still return patterns
            logger.debug(f"DNS lookup failed for {domain}: {e}")
            result['domain_valid'] = False
            result['confidence'] = 'low'
            result['method'] = 'pattern_only'

        
        # Optionally verify with SMTP
        if verify and self.email_verifier and patterns:
            try:
                # 1. First, check if the domain is a Catch-All
                # We do this by checking a random invalid email
                import random
                import string
                random_user = ''.join(random.choices(string.ascii_lowercase, k=15))
                random_email = f"{random_user}@{domain}"
                
                logger.info(f"Checking for catch-all on {domain}...")
                catch_all_check = await self.email_verifier.verify_email(random_email)
                
                domain_is_catch_all = catch_all_check.get('catch_all') or \
                                      catch_all_check.get('final_status') in ['valid_safe', 'valid_risky']
                
                if domain_is_catch_all:
                    logger.info(f"Domain {domain} is catch-all. Cannot verify specific patterns via SMTP.")
                    result['verification_details'] = {
                        "error": "Domain is catch-all (accepts all emails). Cannot verify specific address.",
                        "is_catch_all": True
                    }
                    result['confidence'] = 'low'
                    result['method'] = 'pattern_guess_catch_all'
                    # We accept the most likely pattern (index 0) but can't verify it
                    
                else:
                    # Domain is NOT catch-all, so we can verify specific emails!
                    logger.info(f"Domain {domain} allows verification. Checking patterns...")
                    
                    found_verified = False
                    
                    # Check patterns up to max_patterns
                    for candidate in patterns[:max_patterns]:
                        logger.info(f"Verifying candidate: {candidate}")
                        verification = await self.email_verifier.verify_email(candidate)
                        
                        if verification.get('final_status') == 'valid_safe':
                            # Found the correct email!
                            result['email'] = candidate
                            result['verified'] = True
                            result['confidence'] = 'high'
                            result['method'] = 'verified'
                            result['verification_details'] = verification
                            found_verified = True
                            break
                        
                        # Use first verification as detail fallback
                        if not result['verification_details']:
                            result['verification_details'] = verification
                    
                    if not found_verified:
                        result['verification_error'] = "None of the likely patterns were accepted by the server."
                        result['confidence'] = 'low'

            except Exception as e:
                logger.error(f"Verification error: {e}")
                result['verification_error'] = str(e)
        
        return result
    
    async def find_emails_bulk(
        self, 
        entries: List[Dict],
        verify: bool = False,
        max_patterns: int = 5
    ) -> List[Dict]:
        """
        Find emails for multiple people.
        
        Args:
            entries: List of dicts with 'name' and 'domain' or 'website' keys
            verify: If True, verify emails using SMTP
            max_patterns: Maximum number of candidates per person
            
        Returns:
            List of email finding results
        """
        results = []
        
        for entry in entries:
            name = entry.get('name', entry.get('full_name', ''))
            domain = entry.get('domain', entry.get('website', entry.get('company_website', '')))
            
            if name and domain:
                result = await self.find_email(name, domain, verify=verify, max_patterns=max_patterns)
                # Add original entry data
                result['original'] = entry
                results.append(result)
            else:
                results.append({
                    'full_name': name,
                    'domain': domain,
                    'email': None,
                    'error': 'Missing name or domain',
                    'original': entry
                })
        
        return results


# Create singleton instance
email_finder = EmailFinderService()
