#!/usr/bin/env python3
"""
Microsoft Login API Email Validator (Standalone)
Uses the GetCredentialType endpoint to validate ANY email address.
Works with all domains — not just Office 365.

Usage:
  python3 ms_checker.py emails.txt              # File input
  python3 ms_checker.py -                       # Paste mode (stdin)
  python3 ms_checker.py emails.txt -t 10 -v     # 10 threads, verbose
  python3 ms_checker.py emails.txt -p socks5://user:pass@host:port  # Single proxy
  python3 ms_checker.py emails.txt --free-proxies          # Auto-fetch free proxies
  python3 ms_checker.py emails.txt --proxy-file proxies.txt  # Load proxies from file

Requirements:
  pip install requests colorama pysocks

IfExistsResult codes:
  0 = User exists (valid account)
  1 = User does not exist
  2 = Throttled (too many requests)
  5 = Exists but in different identity provider
  6 = Exists in external directory
"""

import sys
import argparse
import queue
import threading
import time
import uuid
import requests
import os
import random
import re

try:
    import colorama
    from colorama import Fore, Style
    colorama.init()
except ImportError:
    # Fallback if colorama not installed
    class Fore:
        GREEN = RED = YELLOW = CYAN = WHITE = MAGENTA = ''
    class Style:
        RESET_ALL = BRIGHT = ''


# ─── Global state ────────────────────────────────────────────────────
email_queue = queue.Queue()
total_emails = 0
processed_emails = 0
valid_count = 0
invalid_count = 0
unknown_count = 0
progress_lock = threading.Lock()

# ─── Proxy pool ──────────────────────────────────────────────────────
proxy_pool = []          # All fetched proxies (no pre-validation)
proxy_pool_index = 0     # Round-robin index
proxy_lock = threading.Lock()


# ═══════════════════════════════════════════════════════════════════════
#  FREE PROXY SUPPORT
# ═══════════════════════════════════════════════════════════════════════

FREE_PROXY_SOURCES = [
    {
        'name': 'ProxyScrape (HTTP)',
        'url': 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000&country=all&ssl=yes&anonymity=all',
        'type': 'http',
    },
    {
        'name': 'ProxyScrape (SOCKS5)',
        'url': 'https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all',
        'type': 'socks5',
    },
    {
        'name': 'TheSpeedX HTTP',
        'url': 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
        'type': 'http',
    },
    {
        'name': 'TheSpeedX SOCKS5',
        'url': 'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt',
        'type': 'socks5',
    },
    {
        'name': 'monosans HTTP',
        'url': 'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt',
        'type': 'http',
    },
    {
        'name': 'monosans SOCKS5',
        'url': 'https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/socks5.txt',
        'type': 'socks5',
    },
    {
        'name': 'hookzof SOCKS5',
        'url': 'https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt',
        'type': 'socks5',
    },
]


def fetch_free_proxies():
    """Fetch proxies from multiple free public sources. No validation — just grab them."""
    all_proxies = []
    ip_port_re = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{2,5}$')

    print(f"\n{Fore.CYAN}🌐 Fetching free proxies...{Style.RESET_ALL}")

    for source in FREE_PROXY_SOURCES:
        try:
            r = requests.get(source['url'], timeout=10)
            if r.status_code == 200:
                lines = r.text.strip().split('\n')
                count = 0
                for line in lines:
                    line = line.strip()
                    if ip_port_re.match(line):
                        proxy_url = f"{source['type']}://{line}"
                        all_proxies.append(proxy_url)
                        count += 1
                print(f"  {Fore.GREEN}✓{Style.RESET_ALL} {source['name']}: {count} proxies")
            else:
                print(f"  {Fore.RED}✗{Style.RESET_ALL} {source['name']}: HTTP {r.status_code}")
        except Exception as e:
            print(f"  {Fore.RED}✗{Style.RESET_ALL} {source['name']}: {e}")

    # Deduplicate and shuffle
    unique = list(set(all_proxies))
    random.shuffle(unique)
    print(f"\n  {Fore.WHITE}Total: {len(all_proxies)} fetched → {len(unique)} unique (shuffled){Style.RESET_ALL}")
    return unique


def load_proxies_from_file(filepath):
    """Load proxies from a text file (one per line)."""
    proxies = []
    ip_port_re = re.compile(r'^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{2,5}$')

    try:
        with open(filepath, 'r') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                if line.startswith(('http://', 'https://', 'socks5://', 'socks4://')):
                    proxies.append(line)
                elif ip_port_re.match(line):
                    proxies.append(f'http://{line}')
    except FileNotFoundError:
        print(f"{Fore.RED}ERROR: Proxy file '{filepath}' not found{Style.RESET_ALL}")
        sys.exit(1)

    return proxies


def get_next_proxy():
    """Get the next proxy from the pool via round-robin. Returns None if pool is empty."""
    global proxy_pool_index
    if not proxy_pool:
        return None
    with proxy_lock:
        proxy = proxy_pool[proxy_pool_index % len(proxy_pool)]
        proxy_pool_index += 1
    return proxy


# ═══════════════════════════════════════════════════════════════════════
#  CORE CHECKER
# ═══════════════════════════════════════════════════════════════════════

def parse_args():
    parser = argparse.ArgumentParser(
        description="Validate ANY email address using Microsoft's GetCredentialType API. "
                    "Works with all domains, not just Office 365."
    )
    parser.add_argument(
        "file", nargs='?', default='-',
        help="Input file with one email per line, or '-' to paste emails (default: stdin)"
    )
    parser.add_argument("-v", "--verbose", action="store_true",
                        help="Show invalid and unknown results too (default: only valid)")
    parser.add_argument("-t", "--threads", type=int, default=20,
                        help="Number of threads (default: 20)")
    parser.add_argument("-o", "--output", help="Output file for valid emails")
    parser.add_argument("-p", "--proxy", help="Single proxy URL (e.g. http://127.0.0.1:8080)")
    parser.add_argument("-d", "--delay", type=float, default=0.05,
                        help="Delay between requests per thread in seconds (default: 0.05)")

    # Free proxy options
    proxy_group = parser.add_argument_group('Free Proxy Options')
    proxy_group.add_argument("--free-proxies", action="store_true",
                             help="Auto-fetch and rotate through free public proxies")
    proxy_group.add_argument("--proxy-file",
                             help="Load proxies from a text file (one per line)")
    proxy_group.add_argument("--max-proxy-retries", type=int, default=15,
                             help="Max proxy attempts per email before falling back to direct (default: 15)")

    return parser.parse_args()


def check_email_login_api(email, proxy=None, timeout=10):
    """
    Check if an email exists using Microsoft's GetCredentialType endpoint.
    
    Returns: (exists: bool|None, if_exists_code: int, details: str)
    
    Raises on connection/proxy/timeout errors so caller can rotate proxy.
    """
    url = "https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US"
    
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
                      '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'client-request-id': str(uuid.uuid4()),
        'Accept': 'application/json',
        'Origin': 'https://login.microsoftonline.com'
    }
    
    proxies = {}
    if proxy:
        proxies = {"http": proxy, "https": proxy}
    
    # Let connection/proxy/timeout errors bubble up — caller handles retry
    response = requests.post(url, json=payload, headers=headers, timeout=timeout, proxies=proxies)
    
    if response.status_code == 200:
        data = response.json()
        if_exists = data.get('IfExistsResult', -1)
        throttle_status = data.get('ThrottleStatus', 0)
        
        if throttle_status == 1:
            return None, 2, "Throttled by Microsoft"
        
        if if_exists == 0:
            return True, 0, "Valid - User exists"
        elif if_exists == 1:
            return False, 1, "Invalid - User not found"
        elif if_exists == 5:
            return True, 5, "Valid - Exists (external IdP)"
        elif if_exists == 6:
            return True, 6, "Valid - Exists (external directory)"
        else:
            return None, if_exists, f"Unknown result code: {if_exists}"
    else:
        return None, -1, f"HTTP {response.status_code}"


def check_email_with_rotation(email, args, use_proxy_pool=False):
    """
    Check a single email. If using proxy pool, rotate through proxies on failure.
    Guarantees a result — falls back to direct connection if all proxies fail.
    
    Returns: (exists: bool|None, code: int, details: str)
    """
    max_retries = args.max_proxy_retries if use_proxy_pool else 0
    
    # Try with proxies first
    for attempt in range(max_retries):
        proxy = get_next_proxy()
        if proxy is None:
            break  # No proxies available, fall through to direct
        
        try:
            exists, code, details = check_email_login_api(email, proxy=proxy, timeout=8)
            
            # If we got a real result (valid/invalid), return it
            if exists is not None:
                return exists, code, details
            
            # Throttled — this proxy's IP is burned, try another
            if code == 2:
                continue
            
            # Unknown result but got a response — return it
            return exists, code, details
            
        except (requests.exceptions.ProxyError,
                requests.exceptions.ConnectionError,
                requests.exceptions.Timeout,
                requests.exceptions.ChunkedEncodingError,
                ConnectionResetError,
                OSError):
            # Proxy is dead/slow — silently skip to next
            continue
        except Exception:
            # Unexpected error — skip proxy
            continue
    
    # All proxies failed or no proxies — fall back to direct connection
    try:
        exists, code, details = check_email_login_api(email, proxy=None, timeout=15)
        if use_proxy_pool:
            details += " (direct fallback)"
        return exists, code, details
    except requests.exceptions.ConnectionError:
        return None, -1, "Connection error (direct)"
    except requests.exceptions.Timeout:
        return None, -1, "Timeout (direct)"
    except Exception as e:
        return None, -1, f"Error: {e}"


output_lock = threading.Lock()


def thread_worker(args, use_proxy_pool=False):
    global processed_emails, valid_count, invalid_count, unknown_count
    
    while True:
        try:
            email = email_queue.get(False)
        except queue.Empty:
            return
        
        start_t = time.time()
        
        exists, code, details = check_email_with_rotation(email, args, use_proxy_pool)
        elapsed = time.time() - start_t
        
        # If throttled on direct connection, back off and re-queue
        if code == 2 and not use_proxy_pool:
            print(f"{Fore.MAGENTA}⚠ Throttled! Backing off 5s...{Style.RESET_ALL}")
            time.sleep(5)
            email_queue.put(email)
            continue
        
        # If throttled even after proxy rotation + direct fallback, re-queue with backoff
        if code == 2:
            print(f"{Fore.MAGENTA}⚠ Throttled on all proxies + direct. Backing off 10s for: {email}{Style.RESET_ALL}")
            time.sleep(10)
            email_queue.put(email)
            continue
        
        with progress_lock:
            processed_emails += 1
            progress = processed_emails
            
            if exists is True:
                valid_count += 1
            elif exists is False:
                invalid_count += 1
            else:
                unknown_count += 1
        
        tag = f"[{elapsed:.2f}s] ({progress}/{total_emails})"
        
        if exists is True:
            print(f"{Fore.GREEN}VALID: {email} {tag} — {details}{Style.RESET_ALL}")
            with output_lock:
                with open('valid.txt', 'a') as f:
                    f.write(email + '\n')
        elif exists is False:
            if args.verbose:
                print(f"{Fore.RED}INVALID: {email} {tag} — {details}{Style.RESET_ALL}")
        else:
            if args.verbose:
                print(f"{Fore.YELLOW}UNKNOWN: {email} {tag} — {details}{Style.RESET_ALL}")
        
        time.sleep(args.delay)


def read_emails(args):
    """Read emails from file or stdin (paste mode)"""
    emails = []
    
    if args.file == '-':
        print(f"{Fore.CYAN}📋 Paste emails below (one per line). Press Ctrl+D (Mac/Linux) or Ctrl+Z (Windows) when done:{Style.RESET_ALL}")
        print(f"{Fore.CYAN}{'─' * 50}{Style.RESET_ALL}")
        try:
            for line in sys.stdin:
                line = line.strip()
                if '@' in line:
                    emails.append(line)
        except EOFError:
            pass
        print(f"{Fore.CYAN}{'─' * 50}{Style.RESET_ALL}")
    else:
        try:
            with open(args.file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if '@' in line:
                        emails.append(line)
        except FileNotFoundError:
            print(f"{Fore.RED}ERROR: File '{args.file}' not found{Style.RESET_ALL}")
            sys.exit(1)
    
    return emails


def main():
    global total_emails, proxy_pool
    
    print(f"{Fore.CYAN}{'═' * 55}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}│   Microsoft Login API Email Validator                │{Style.RESET_ALL}")
    print(f"{Fore.CYAN}│   Uses GetCredentialType — works with ANY domain     │{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═' * 55}{Style.RESET_ALL}")
    
    args = parse_args()
    
    # ─── Proxy setup ─────────────────────────────────────────────────
    use_proxy_pool = False
    
    if args.free_proxies or args.proxy_file:
        use_proxy_pool = True
        raw_proxies = []

        if args.proxy_file:
            loaded = load_proxies_from_file(args.proxy_file)
            raw_proxies.extend(loaded)
            print(f"\n{Fore.CYAN}📁 Loaded {len(loaded)} proxies from {args.proxy_file}{Style.RESET_ALL}")
        
        if args.free_proxies:
            fetched = fetch_free_proxies()
            raw_proxies.extend(fetched)
        
        # Deduplicate and shuffle
        proxy_pool = list(set(raw_proxies))
        random.shuffle(proxy_pool)
        
        if not proxy_pool:
            print(f"{Fore.RED}⚠ No proxies found. Using direct connection.{Style.RESET_ALL}")
            use_proxy_pool = False
        else:
            print(f"\n{Fore.GREEN}✅ {len(proxy_pool)} proxies loaded (no pre-validation — rotate on failure){Style.RESET_ALL}")
    
    # ─── Main checking logic ─────────────────────────────────────────
    
    # Clear valid.txt
    open('valid.txt', 'w').close()
    
    # Read emails
    emails = read_emails(args)
    
    if not emails:
        print(f"{Fore.RED}No emails found to process.{Style.RESET_ALL}")
        sys.exit(1)
    
    total_emails = len(emails)
    proxy_info = f" | Proxies: {len(proxy_pool)}" if use_proxy_pool else ""
    print(f"\n{Fore.WHITE}{Style.BRIGHT}📧 Total emails: {total_emails} | Threads: {args.threads} | Delay: {args.delay}s{proxy_info}{Style.RESET_ALL}\n")
    
    # Queue emails
    for email in emails:
        email_queue.put(email)
    
    # Start threads
    start = time.perf_counter()
    threads = []
    for i in range(min(args.threads, total_emails)):
        t = threading.Thread(target=thread_worker, args=(args, use_proxy_pool))
        t.daemon = True
        t.start()
        threads.append(t)
    
    for t in threads:
        t.join()
    
    elapsed = time.perf_counter() - start
    
    # Summary
    print(f"\n{Fore.CYAN}{'═' * 55}{Style.RESET_ALL}")
    print(f"{Fore.GREEN}  ✅ Valid:   {valid_count}{Style.RESET_ALL}")
    print(f"{Fore.RED}  ❌ Invalid: {invalid_count}{Style.RESET_ALL}")
    if unknown_count > 0:
        print(f"{Fore.YELLOW}  ❓ Unknown: {unknown_count}{Style.RESET_ALL}")
    print(f"{Fore.WHITE}  ⏱  Time:    {elapsed:.2f}s ({elapsed/max(processed_emails,1):.2f}s/email){Style.RESET_ALL}")
    
    if use_proxy_pool:
        print(f"{Fore.CYAN}  🌐 Proxy pool: {len(proxy_pool)} loaded{Style.RESET_ALL}")
    
    valid_file_count = len(open('valid.txt').readlines()) if os.path.exists('valid.txt') else 0
    if valid_file_count > 0:
        print(f"{Fore.GREEN}  📄 Valid emails saved to: valid.txt{Style.RESET_ALL}")
    
    # Write to custom output if specified
    if args.output and valid_file_count > 0:
        with open('valid.txt', 'r') as src, open(args.output, 'w') as dst:
            dst.write(src.read())
        print(f"{Fore.GREEN}  📄 Also saved to: {args.output}{Style.RESET_ALL}")
    
    print(f"{Fore.CYAN}{'═' * 55}{Style.RESET_ALL}")


if __name__ == "__main__":
    main()
