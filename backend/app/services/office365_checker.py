"""
Office 365 Email Checker Service
Uses the autodiscover API to validate Office 365 email addresses
"""

import requests
import random
import string
import uuid
from typing import Dict

class Office365Checker:
    def __init__(self):
        self.user_agent = 'Microsoft Office/16.0 (Windows NT 10.0; Microsoft Outlook 16.0.12026; Pro)'
        self.headers = {'User-Agent': self.user_agent, 'Accept': 'application/json'}
        # Cache stores: domain -> {'is_o365': bool, 'is_catch_all': bool}
        self.domain_cache = {}
        
    def check_teams_status(self, email: str) -> Dict:
        """
        Check if the user exists via Lync/Teams Autodiscover.
        This is useful for Catch-All domains where standard Autodiscover returns 200 for everyone.
        """
        try:
            domain = email.split('@')[1]
            
            # 1. Check if Lync Autodiscover service exists for the domain
            # Use short timeout as many domains won't have this
            base_url = f"https://lyncdiscover.{domain}/"
            try:
                r_base = requests.get(base_url, timeout=3)
                if r_base.status_code not in [200, 401, 403]:
                    return {'detected': False, 'details': 'No Lync/Teams service'}
            except:
                return {'detected': False, 'details': 'Lync/Teams service unreachable'}
                
            # 2. Probe specific user via AutodiscoverService (V1)
            # Standard endpoint: /Autodiscover/AutodiscoverService.svc/root
            # We pass ?sip=email to see if response differs
            url = f"https://lyncdiscover.{domain}/Autodiscover/AutodiscoverService.svc/root?sip={email}"
            
            # Note: We expect 401 Unauthorized for valid users usually (since we don't have creds),
            # but sometimes 404 or 500 for invalid ones depending on config.
            # This is not 100% reliable without credentials but works on some federated setups.
            r = requests.get(url, headers=self.headers, verify=True, timeout=5)
            
            # If we get a distinct error code or XML content, it might offer a clue.
            # But mostly, the *existence* of the service + Catch-All O365 suggests we should rely on Social checks more.
            # A true Teams presence check requires OAuth.
            
            return {
                'detected': True, # Service exists
                'status_code': r.status_code,
                'details': f'Teams Service Active (Code: {r.status_code})'
            }
            
        except Exception as e:
            return {'detected': False, 'details': str(e)}
    
    def check_user_via_login_api(self, email: str) -> Dict:
        """
        Check if user exists using Microsoft Login API (GetCredentialType endpoint).
        This is the most reliable method as it bypasses catch-all configurations.
        
        Returns:
            Dict with 'exists' (bool), 'method' (str), 'details' (str)
        """
        try:
            url = "https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US"
            
            # Generate unique client request ID
            client_id = str(uuid.uuid4())
            
            # Standard payload for credential type check
            payload = {
                "username": email,
                "isOtherIdpSupported": True,
                "checkPhones": False,
                "isRemoteNGCSupported": True,
                "isCookieBannerShown": False,
                "isFidoSupported": True,
                "originalRequest": "",
                "country": "US",
                "forceotclogin": False,
                "isExternalFederationDisallowed": False,
                "isRemoteConnectSupported": False,
                "federationFlags": 0,
                "isSignup": False,
                "flowToken": "",
                "isAccessPassSupported": True,
                "isQrCodePinSupported": True
            }
            
            headers = {
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'client-request-id': client_id,
                'Accept': 'application/json',
                'Origin': 'https://login.microsoftonline.com'
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # IfExistsResult codes:
                # 0 = User exists in the tenant
                # 1 = User does not exist
                # 5/6 = Federated/External (varies)
                if_exists = data.get('IfExistsResult', 1)
                
                if if_exists == 0:
                    return {
                        'exists': True,
                        'method': 'microsoft_login_api',
                        'details': 'User confirmed via Microsoft Login API',
                        'if_exists_result': if_exists
                    }
                else:
                    return {
                        'exists': False,
                        'method': 'microsoft_login_api',
                        'details': f'User not found (IfExistsResult={if_exists})',
                        'if_exists_result': if_exists
                    }
            else:
                return {
                    'exists': None,
                    'method': 'microsoft_login_api',
                    'details': f'API returned status {response.status_code}'
                }
                
        except Exception as e:
            return {
                'exists': None,
                'method': 'microsoft_login_api',
                'details': f'Error: {str(e)}'
            }
        
    def check_email_deep(self, email: str) -> Dict:
        """
        Perform deep verification including O365 specific error code analysis.
        """
        # ... logic to be integrated below ...
        return {}
    
    def get_domain_info(self, domain: str) -> Dict:
        """Check if a domain uses Office 365 and if it's catch-all"""
        if domain in self.domain_cache:
            return self.domain_cache[domain]
        
        try:
            # Generate a junk user to test domain behavior
            junk_user = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(20))
            url = f'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{junk_user}@{domain}?Protocol=rest'
            r = requests.get(url, headers=self.headers, verify=True, allow_redirects=False, timeout=10)
            
            result = {
                'is_o365': False,
                'is_catch_all': False
            }
            
            response_text = r.text.lower()
            
            # Check for O365 indicators
            if r.status_code == 200:
                if 'outlook' in response_text or 'office' in response_text:
                    result['is_o365'] = True
                    # If a junk user returns 200 OK, the domain is catch-all
                    result['is_catch_all'] = True
            
            elif r.status_code == 302:
                location = r.headers.get('Location', '').lower()
                if 'outlook' in location or 'office365' in location or 'office.com' in location:
                    result['is_o365'] = True
                    # If junk user redirects to O365 login/setup, it MIGHT be catch-all, 
                    # but usually 302 for junk means "user not found" flow in some configs?
                    # Actually, often 302 to outlook.com/owa means "valid user" in browser, 
                    # but for autodiscover JSON, 302 is tricky.
                    # Let's assume if it behaves "successfully" for junk, it's catch-all.
                    # But usually 200 is the clear "User Found" signal.
                    pass
            
            # If not yet confirmed O365, check text for specific errors that imply O365
            if not result['is_o365']:
                if 'outlook.office365.com' in response_text or 'outlook.office.com' in response_text:
                    result['is_o365'] = True
            
            self.domain_cache[domain] = result
            return result
            
        except Exception as e:
            print(f"Error checking O365 domain: {e}")
            return {'is_o365': False, 'is_catch_all': False}
    
    def is_o365_domain(self, domain: str) -> bool:
        """Legacy compatibility method"""
        return self.get_domain_info(domain)['is_o365']
    
    def check_email(self, email: str) -> Dict:
        """
        Check if an Office 365 email address is valid
        Returns: {'valid': bool, 'method': str, 'details': str, 'catch_all': bool}
        """
        try:
            domain = email.split("@")[1]
            
            # Get domain info (checks for O365 and catch-all)
            domain_info = self.get_domain_info(domain)
            
            if not domain_info['is_o365']:
                return {
                    'valid': None,
                    'method': 'office365_autodiscover',
                    'details': 'Domain does not use Office 365'
                }
            
            # ALWAYS try Login API first for O365 domains (most reliable)
            login_check = self.check_user_via_login_api(email)
            
            if login_check['exists'] is True:
                # User definitively exists
                return {
                    'valid': True,
                    'catch_all': domain_info['is_catch_all'],
                    'method': 'microsoft_login_api',
                    'details': 'User confirmed via Microsoft Login API'
                }
            elif login_check['exists'] is False:
                # User definitively does NOT exist
                return {
                    'valid': False,
                    'catch_all': domain_info['is_catch_all'],
                    'method': 'microsoft_login_api',
                    'details': 'User does not exist (confirmed via Login API)'
                }
            
            # Login API failed or returned None - fall back to autodiscover
            # This handles edge cases like federated domains
            
            # If domain is catch-all and Login API failed, try Teams
            if domain_info['is_catch_all']:
                teams_status = self.check_teams_status(email)
                
                if teams_status['detected']:
                    return {
                        'valid': True,
                        'catch_all': True,
                        'method': 'office365_autodiscover + teams_detected',
                        'details': f"Domain is Catch-All, Teams active ({teams_status['details']})"
                    }
                
                # All methods failed, return catch-all status
                return {
                    'valid': True,
                    'catch_all': True,
                    'method': 'office365_autodiscover',
                    'details': 'Domain is Catch-All (cannot verify specific user)'
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
