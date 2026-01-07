"""
Gmail/GSuite Email Checker Service
Uses Google Calendar API to validate Gmail and GSuite email addresses
Enhanced with catch-all detection
"""

import requests
import random
import string
from typing import Dict

class GmailChecker:
    def check_email(self, email: str) -> Dict:
        """
        Check if a Gmail/GSuite email address is valid using calendar URL
        Returns: {'valid': bool, 'method': str, 'details': str, 'catch_all': bool}
        """
        try:
            # Check the actual email
            url = f"https://calendar.google.com/calendar/ical/{email}/public/basic.ics"
            response = requests.head(url, timeout=10)
            
            x_frame_options = response.headers.get('X-Frame-Options', '').upper()
            
            # If email doesn't exist, return early
            if not x_frame_options:
                return {
                    'valid': False,
                    'method': 'gmail_calendar',
                    'details': 'Email address does not exist',
                    'catch_all': False
                }
            
            # Email appears valid, now check for catch-all
            is_catch_all = self._check_catch_all(email)
            
            if x_frame_options == 'SAMEORIGIN':
                return {
                    'valid': True,
                    'method': 'gmail_calendar',
                    'details': 'Email address is valid' + (' (catch-all domain)' if is_catch_all else ''),
                    'catch_all': is_catch_all
                }
            else:
                return {
                    'valid': True,
                    'method': 'gmail_calendar',
                    'details': 'Email is valid but calendar is not public' + (' (catch-all domain)' if is_catch_all else ''),
                    'catch_all': is_catch_all
                }
                
        except requests.RequestException as e:
            return {
                'valid': None,
                'method': 'gmail_calendar',
                'details': f'Error: {str(e)}',
                'catch_all': False
            }
    
    def _check_catch_all(self, email: str) -> bool:
        """
        Check if domain is catch-all by testing a random email
        """
        try:
            # Extract domain
            domain = email.split('@')[1]
            
            # Generate random email
            random_user = ''.join(random.choices(string.ascii_lowercase + string.digits, k=20))
            random_email = f"{random_user}@{domain}"
            
            # Check if random email also validates
            url = f"https://calendar.google.com/calendar/ical/{random_email}/public/basic.ics"
            response = requests.head(url, timeout=5)
            
            x_frame_options = response.headers.get('X-Frame-Options', '').upper()
            
            # If random email also has X-Frame-Options, it's likely catch-all
            return bool(x_frame_options)
            
        except Exception:
            # If check fails, assume not catch-all
            return False

# Singleton instance
gmail_checker = GmailChecker()
