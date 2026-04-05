#!/usr/bin/env python3
"""
Microsoft Login API Email Validator
Uses the GetCredentialType endpoint to validate ANY email address.
Works with all domains — not just Office 365.

Usage:
  python3 ms_checker.py emails.txt              # File input
  python3 ms_checker.py -                       # Paste mode (stdin)
  python3 ms_checker.py emails.txt -t 10 -v     # 10 threads, verbose
"""

import sys
import argparse
import queue
import threading
import time
import uuid
import requests
import os

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


email_queue = queue.Queue()
total_emails = 0
processed_emails = 0
valid_count = 0
invalid_count = 0
unknown_count = 0
progress_lock = threading.Lock()


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
    parser.add_argument("-p", "--proxy", help="Proxy URL (e.g. http://127.0.0.1:8080)")
    parser.add_argument("-d", "--delay", type=float, default=0.05,
                        help="Delay between requests per thread in seconds (default: 0.05)")
    return parser.parse_args()


def check_email_login_api(email, proxy=None):
    """
    Check if an email exists using Microsoft's GetCredentialType endpoint.
    
    IfExistsResult codes:
        0 = User exists (valid account)
        1 = User does not exist
        2 = Throttled (too many requests)
        5 = Exists but in different identity provider
        6 = Exists in external directory
    
    Returns: (exists: bool|None, if_exists_code: int, details: str)
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
    
    response = requests.post(url, json=payload, headers=headers, timeout=15, proxies=proxies)
    
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


def thread_worker(args):
    global processed_emails, valid_count, invalid_count, unknown_count
    
    output_lock = threading.Lock()
    
    while not email_queue.empty():
        try:
            email = email_queue.get(False)
        except queue.Empty:
            return
        
        start_t = time.time()
        
        try:
            exists, code, details = check_email_login_api(email, args.proxy)
            elapsed = time.time() - start_t
            
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
                # Save to valid.txt in real time
                with output_lock:
                    with open('valid.txt', 'a') as f:
                        f.write(email + '\n')
            elif exists is False:
                if args.verbose:
                    print(f"{Fore.RED}INVALID: {email} {tag} — {details}{Style.RESET_ALL}")
            else:
                if args.verbose:
                    print(f"{Fore.YELLOW}UNKNOWN: {email} {tag} — {details}{Style.RESET_ALL}")
                # If throttled, back off
                if code == 2:
                    print(f"{Fore.MAGENTA}⚠ Throttled! Backing off 5s...{Style.RESET_ALL}")
                    time.sleep(5)
                    email_queue.put(email)  # Re-queue
                    with progress_lock:
                        processed_emails -= 1
                        unknown_count -= 1
        
        except requests.exceptions.ConnectionError:
            print(f"{Fore.YELLOW}CONNECTION ERROR: {email} — retrying...{Style.RESET_ALL}")
            email_queue.put(email)
            time.sleep(2)
        except Exception as e:
            print(f"{Fore.RED}ERROR: {email} — {e}{Style.RESET_ALL}")
        
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
    global total_emails
    
    print(f"{Fore.CYAN}{'═' * 55}{Style.RESET_ALL}")
    print(f"{Fore.CYAN}│   Microsoft Login API Email Validator                │{Style.RESET_ALL}")
    print(f"{Fore.CYAN}│   Uses GetCredentialType — works with ANY domain     │{Style.RESET_ALL}")
    print(f"{Fore.CYAN}{'═' * 55}{Style.RESET_ALL}")
    
    args = parse_args()
    
    # Clear valid.txt
    open('valid.txt', 'w').close()
    
    # Read emails
    emails = read_emails(args)
    
    if not emails:
        print(f"{Fore.RED}No emails found to process.{Style.RESET_ALL}")
        sys.exit(1)
    
    total_emails = len(emails)
    print(f"\n{Fore.WHITE}{Style.BRIGHT}📧 Total emails: {total_emails} | Threads: {args.threads} | Delay: {args.delay}s{Style.RESET_ALL}\n")
    
    # Queue emails
    for email in emails:
        email_queue.put(email)
    
    # Start threads
    start = time.perf_counter()
    threads = []
    for i in range(min(args.threads, total_emails)):
        t = threading.Thread(target=thread_worker, args=(args,))
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
