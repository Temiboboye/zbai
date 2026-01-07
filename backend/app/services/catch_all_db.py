"""
Known catch-all domains database
For demo/testing purposes when SMTP port 25 is blocked
"""

# Known catch-all domains (verified externally)
KNOWN_CATCH_ALL_DOMAINS = {
    'penniesuntouched.com': {
        'is_catch_all': True,
        'verified_date': '2026-01-03',
        'notes': 'Confirmed catch-all domain - accepts all emails'
    },
    # Add more known catch-all domains here
}

def is_known_catch_all(domain: str) -> bool:
    """Check if domain is in known catch-all list"""
    return domain.lower() in KNOWN_CATCH_ALL_DOMAINS

def get_catch_all_info(domain: str) -> dict:
    """Get catch-all information for a domain"""
    return KNOWN_CATCH_ALL_DOMAINS.get(domain.lower(), {})
