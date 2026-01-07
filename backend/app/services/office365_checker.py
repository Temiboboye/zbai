"""
Office 365 Email Checker Service
Uses the autodiscover API to validate Office 365 email addresses
"""

import requests
import random
import string
from typing import Dict

class Office365Checker:
    def __init__(self):
        self.user_agent = 'Microsoft Office/16.0 (Windows NT 10.0; Microsoft Outlook 16.0.12026; Pro)'
        self.headers = {'User-Agent': self.user_agent, 'Accept': 'application/json'}
        self.domain_cache = {}
    
    def is_o365_domain(self, domain: str) -> bool:
        """Check if a domain uses Office 365"""
        if domain in self.domain_cache:
            return self.domain_cache[domain]
        
        try:
            junk_user = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(20))
            url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{junk_user}@{domain}?Protocol=rest'
            r = requests.get(url, headers=self.headers, verify=True, allow_redirects=False, timeout=10)
            
            is_o365 = 'outlook.office365.com' in r.text
            self.domain_cache[domain] = is_o365
            return is_o365
        except Exception as e:
            print(f"Error checking O365 domain: {e}")
            return False
    
    def check_email(self, email: str) -> Dict:
        """
        Check if an Office 365 email address is valid
        Returns: {'valid': bool, 'method': str, 'details': str}
        """
        try:
            domain = email.split("@")[1]
            
            # First check if domain uses O365
            if not self.is_o365_domain(domain):
                return {
                    'valid': None,  # Unknown, not O365
                    'method': 'office365_autodiscover',
                    'details': 'Domain does not use Office 365'
                }
            
            # Check the specific email
            url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{email}?Protocol=rest'
            r = requests.get(url, headers=self.headers, verify=True, allow_redirects=False, timeout=10)
            
            if r.status_code == 200:
                return {
                    'valid': True,
                    'method': 'office365_autodiscover',
                    'details': 'Email exists in Office 365'
                }
            elif r.status_code == 302:
                # Check if redirect is away from O365 (means valid)
                if 'outlook.office365.com' not in r.text:
                    return {
                        'valid': True,
                        'method': 'office365_autodiscover',
                        'details': 'Email exists (redirect detected)'
                    }
                else:
                    return {
                        'valid': False,
                        'method': 'office365_autodiscover',
                        'details': 'Email does not exist'
                    }
            else:
                return {
                    'valid': False,
                    'method': 'office365_autodiscover',
                    'details': f'Email does not exist (status: {r.status_code})'
                }
                
        except Exception as e:
            return {
                'valid': None,
                'method': 'office365_autodiscover',
                'details': f'Error: {str(e)}'
            }

# Singleton instance
office365_checker = Office365Checker()
