"""
Blacklist Monitor Service
Checks if an IP or Domain is listed on major Real-time Blackhole Lists (RBLs)
"""

import dns.resolver
import socket
from typing import List, Dict, Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Major RBLs to check
RBLS = [
    'zen.spamhaus.org',
    'b.barracudacentral.org',
    'bl.spamcop.net',
    'dnsbl.sorbs.net',
    'ips.backscatterer.org',
    'bl.tiopan.com',
    'cbl.abuseat.org',
    'db.wpbl.info',
    'dnsbl-1.uceprotect.net',
    'dnsbl-2.uceprotect.net',
    'dnsbl-3.uceprotect.net',
    'spam.dnsbl.sorbs.net',
]

class BlacklistMonitor:
    def __init__(self):
        self.resolver = dns.resolver.Resolver()
        self.resolver.timeout = 2
        self.resolver.lifetime = 2

    def _get_ip_from_domain(self, domain: str) -> Optional[str]:
        """Resolve domain to IP address"""
        try:
            # Simple socket resolution
            return socket.gethostbyname(domain)
        except socket.gaierror:
            return None

    def _check_single_rbl(self, ip: str, rbl: str) -> Dict:
        """Check a single RBL for the given IP"""
        # Reverse the IP: 1.2.3.4 -> 4.3.2.1
        reversed_ip = '.'.join(reversed(ip.split('.')))
        query = f"{reversed_ip}.{rbl}"
        
        try:
            self.resolver.resolve(query, 'A')
            # If resolve succeeds, it is listed
            return {
                'rbl': rbl,
                'listed': True,
                'status': 'Listed 🚫'
            }
        except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer):
            # Not listed
            return {
                'rbl': rbl,
                'listed': False,
                'status': 'Clean ✅'
            }
        except Exception:
            # Timeout or other error
            return {
                'rbl': rbl,
                'listed': False,
                'status': 'Error ⚠️'
            }

    async def check_blacklist(self, target: str) -> Dict:
        """
        Check if target (IP or Domain) is blacklisted
        """
        # Determine if input is IP or Domain
        is_ip = False
        try:
            socket.inet_aton(target)
            is_ip = True
            ip = target
        except socket.error:
            # It's a domain, resolve it
            ip = self._get_ip_from_domain(target)
            
        if not ip:
            return {'error': 'Invalid domain or IP address'}

        results = []
        
        # Run checks in parallel
        loop = asyncio.get_event_loop()
        with ThreadPoolExecutor(max_workers=10) as executor:
            futures = [
                loop.run_in_executor(executor, self._check_single_rbl, ip, rbl)
                for rbl in RBLS
            ]
            results = await asyncio.gather(*futures)
            
        listed_count = sum(1 for r in results if r['listed'])
        
        return {
            'target': target,
            'resolved_ip': ip,
            'total_checks': len(results),
            'listed_count': listed_count,
            'is_clean': listed_count == 0,
            'results': results,
            'credits_used': 2  # Hardcoded cost for now
        }

blacklist_monitor = BlacklistMonitor()
