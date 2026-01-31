"""
Enhanced Email Domain Sorting Service with MX Record Detection
Supports: Office 365, G Suite, Titan Email, and other providers
"""

from typing import List, Dict, Tuple
import dns.resolver


class EmailSorterService:
    """
    Sorts emails by domain provider type using MX record analysis
    - Office 365 / Microsoft 365
    - G Suite / Google Workspace
    - Titan Email
    - Other providers
    """
    
    # Known consumer domains (instant detection)
    OFFICE365_CONSUMER_DOMAINS = {
        'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
        'office365.com', 'onmicrosoft.com'
    }
    
    GSUITE_CONSUMER_DOMAINS = {
        'gmail.com', 'googlemail.com'
    }
    
    # MX record patterns for provider detection
    PROVIDER_MX_PATTERNS = {
        'office365': [
            '.mail.protection.outlook.com',
            '.onmicrosoft.com',
            'outlook.com'
        ],
        'gsuite': [
            'google.com',
            'googlemail.com',
            'aspmx.l.google.com',
            'aspmx2.googlemail.com',
            'aspmx3.googlemail.com'
        ],
        'titan': [
            'titan.email',
            'flock.email',
            'mx1.titan.email',
            'mx2.titan.email'
        ],
        'zoho': [
            'zoho.com',
            'zoho.eu',
            'mx.zoho.com'
        ],
        'protonmail': [
            'protonmail.ch',
            'mail.protonmail.ch'
        ],
        'yahoo': [
            'yahoodns.net',
            'mta5.am0.yahoodns.net',
            'mta6.am0.yahoodns.net',
            'mta7.am0.yahoodns.net'
        ]
    }
    
    def __init__(self):
        self.mx_cache = {}
        # Configure custom DNS resolver with public DNS servers
        self.resolver = dns.resolver.Resolver()
        self.resolver.nameservers = ['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']
        self.resolver.timeout = 5
        self.resolver.lifetime = 10
    
    def sort_emails(self, emails: List[str]) -> Dict:
        """
        Sort emails into categories based on MX records
        """
        office365 = []
        gsuite = []
        titan = []
        other = []
        
        for email in emails:
            result = self.categorize_email(email)
            
            category = result['category']
            if category == 'office365':
                office365.append(result)
            elif category == 'gsuite':
                gsuite.append(result)
            elif category == 'titan':
                titan.append(result)
            else:
                other.append(result)
        
        return {
            'office365': office365,
            'gsuite': gsuite,
            'titan': titan,
            'other': other,
            'total': len(emails),
            'credits_used': self._calculate_credits(len(emails))
        }
    
    def categorize_email(self, email: str) -> Dict:
        """
        Categorize a single email by provider using MX records
        """
        try:
            local, domain = email.lower().split('@')
            tld = domain.split('.')[-1]
            
            # Check known consumer domains first (no MX lookup needed)
            if domain in self.OFFICE365_CONSUMER_DOMAINS:
                return self._create_result(
                    email, domain, tld, 'office365',
                    'Microsoft 365', 'known_domain'
                )
            
            if domain in self.GSUITE_CONSUMER_DOMAINS:
                return self._create_result(
                    email, domain, tld, 'gsuite',
                    'Google Workspace', 'known_domain'
                )
            
            # For custom domains, check MX records
            category, provider, method, mx_host = self._check_mx_records(domain)
            
            return self._create_result(
                email, domain, tld, category, provider, method, mx_host
            )
            
        except Exception as e:
            return self._create_result(
                email,
                email.split('@')[1] if '@' in email else 'unknown',
                'UNKNOWN',
                'other',
                'Unknown',
                'error',
                error=str(e)
            )
    
    def _check_mx_records(self, domain: str) -> Tuple[str, str, str, str]:
        """
        Check MX records to determine email provider
        Returns (category, provider, detection_method, mx_host)
        """
        # Check cache first
        if domain in self.mx_cache:
            return self.mx_cache[domain]
        
        try:
            # Query MX records using custom resolver with public DNS
            mx_records = self.resolver.resolve(domain, 'MX')
            mx_hosts = [str(r.exchange).lower().rstrip('.') for r in mx_records]
            
            if not mx_hosts:
                result = ('other', 'No MX Records', 'no_mx', '')
                self.mx_cache[domain] = result
                return result
            
            primary_mx = mx_hosts[0]
            
            # Check each provider pattern
            for provider, patterns in self.PROVIDER_MX_PATTERNS.items():
                for pattern in patterns:
                    for mx_host in mx_hosts:
                        if pattern in mx_host:
                            provider_name = self._get_provider_name(provider)
                            result = (provider, provider_name, 'mx_records', primary_mx)
                            self.mx_cache[domain] = result
                            return result
            
            # No known provider matched
            result = ('other', f'Custom Mail Server', 'mx_records', primary_mx)
            self.mx_cache[domain] = result
            return result
            
        except dns.resolver.NXDOMAIN:
            result = ('other', 'Domain Not Found', 'dns_error', '')
            self.mx_cache[domain] = result
            return result
        except dns.resolver.NoAnswer:
            result = ('other', 'No MX Records', 'no_mx', '')
            self.mx_cache[domain] = result
            return result
        except Exception as e:
            result = ('other', 'DNS Lookup Failed', 'error', '')
            self.mx_cache[domain] = result
            return result
    
    def _get_provider_name(self, provider_key: str) -> str:
        """Get friendly provider name"""
        provider_names = {
            'office365': 'Microsoft 365 (Custom Domain)',
            'gsuite': 'Google Workspace (Custom Domain)',
            'titan': 'Titan Email',
            'zoho': 'Zoho Mail',
            'protonmail': 'ProtonMail',
            'yahoo': 'Yahoo Mail'
        }
        return provider_names.get(provider_key, 'Unknown Provider')
    
    def _create_result(
        self,
        email: str,
        domain: str,
        tld: str,
        category: str,
        provider: str,
        method: str,
        mx_host: str = '',
        error: str = None
    ) -> Dict:
        """Create standardized result dictionary"""
        result = {
            'email': email,
            'domain': domain,
            'category': category,
            'provider': provider,
            'tld': tld.upper(),
            'detection_method': method
        }
        
        if mx_host:
            result['mx_host'] = mx_host
        
        if error:
            result['error'] = error
        
        return result
    
    def _calculate_credits(self, count: int) -> int:
        """
        Calculate credits used for sorting
        0.5 credits per email
        """
        return max(1, int(count * 0.5))
    
    def get_provider_stats(self, results: Dict) -> Dict:
        """
        Get statistics about provider distribution
        """
        total = results['total']
        
        stats = {}
        for category in ['office365', 'gsuite', 'titan', 'other']:
            count = len(results.get(category, []))
            stats[category] = {
                'count': count,
                'percentage': (count / total * 100) if total > 0 else 0
            }
        
        stats['total'] = total
        stats['credits_used'] = results['credits_used']
        
        return stats


# Singleton instance
email_sorter = EmailSorterService()


# Test function
if __name__ == "__main__":
    # Test with penniesuntouched.com
    test_emails = [
        'support@penniesuntouched.com',
        'test@gmail.com',
        'user@outlook.com',
        'admin@company.com'
    ]
    
    sorter = EmailSorterService()
    results = sorter.sort_emails(test_emails)
    
    print("Sorting Results:")
    print(f"Office 365: {len(results['office365'])}")
    print(f"G Suite: {len(results['gsuite'])}")
    print(f"Titan: {len(results['titan'])}")
    print(f"Other: {len(results['other'])}")
    
    # Check penniesuntouched.com specifically
    for email_result in results['titan'] + results['other']:
        if 'penniesuntouched' in email_result['email']:
            print(f"\nPenniesUntouched Detection:")
            print(f"  Category: {email_result['category']}")
            print(f"  Provider: {email_result['provider']}")
            print(f"  MX Host: {email_result.get('mx_host', 'N/A')}")
