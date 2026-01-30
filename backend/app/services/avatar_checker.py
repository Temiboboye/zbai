import requests
import hashlib
import logging
from typing import Dict, Optional

logger = logging.getLogger(__name__)

class AvatarChecker:
    """
    Checks for presence of avatars on social platforms (Gravatar, etc.)
    A valid avatar strongly implies the email is real.
    """
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
    def check_gravatar(self, email: str) -> Dict:
        """
        Check if email has a Gravatar profile.
        Returns: {'found': bool, 'url': str, 'platform': 'gravatar'}
        """
        try:
            # Gravatar uses MD5 hash of lowercase email
            email_hash = hashlib.md5(email.lower().strip().encode('utf-8')).hexdigest()
            url = f"https://www.gravatar.com/avatar/{email_hash}?d=404"
            
            response = requests.head(url, headers=self.headers, timeout=5)
            
            if response.status_code == 200:
                return {
                    'found': True,
                    'url': url,
                    'platform': 'gravatar',
                    'details': 'Gravatar profile found'
                }
            
            return {'found': False}
            
        except Exception as e:
            logger.warning(f"Gravatar check error: {e}")
            return {'found': False, 'error': str(e)}

    def check_google_avatar(self, email: str) -> Dict:
        """
        Check if email has a Google Avatar (via public album archive or similar public endpoints).
        Note: This is an unauthenticated check and may change.
        """
        # This is a placeholder for a more complex Google check if we want to implement it later.
        # Simple Google Calendar already does a good job for existence.
        return {'found': False}

    async def check_social_presence(self, email: str) -> Dict:
        """
        Aggregate check for social presence.
        """
        # 1. Check Gravatar (Fastest, most public)
        gravatar = self.check_gravatar(email)
        if gravatar['found']:
            return {
                'has_social': True,
                'platform': 'Gravatar',
                'details': 'Gravatar profile found',
                'avatar_url': gravatar['url']
            }
            
        return {'has_social': False}

avatar_checker = AvatarChecker()
