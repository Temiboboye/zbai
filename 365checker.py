#!/usr/bin/env python3

import sys

if sys.version_info < (3,0):
    print('ERROR: UhOh365 runs on Python 3.  Run as "./UhOh365.py" or "python3 UhOh365.py" !')
    sys.exit(1)

import argparse
import queue
import random
import string
import threading
import time
import requests
import colorama
from colorama import Fore, Style
import datetime
import os


email_queue = queue.Queue()
print_queue = queue.Queue()
args = None
domain_is_o365 = {}
domain_is_o365_lock = threading.Lock()
total_emails = 0
processed_emails = 0
start_time = None
progress_lock = threading.Lock()


def parse_args():
    parser = argparse.ArgumentParser(description="This script uses the autodiscover json API of office365 to enumerate "
                                                 "valid o365 email accounts. This does not require any login attempts "
                                                 "unlike other enumeration methods and therefore is very stealthy.")
    parser.add_argument("file", type=argparse.FileType('r'), help="Input file containing one email per line")
    parser.add_argument("-s", "--suffix", help="Add a domain suffix to every input line from file (e.g: contoso.com)",
                        default=None)
    parser.add_argument("-v", "--verbose", help="Display each result as valid/invalid. By default only displays valid",
                        action="store_true")
    parser.add_argument("-t", "--threads", help="Number of threads to run with. Default is 20", type=int, default=20)
    parser.add_argument("-o", "--output", help="Output file for valid emails only", type=argparse.FileType('w'))
    parser.add_argument("-n", "--nossl", help="Turn off SSL verification. This can increase speed if needed",
                        action="store_false")
    parser.add_argument("-p", "--proxy", help="Specify a proxy to run this through (eg: 'http://127.0.0.1:8080')")

    return parser.parse_args()


def thread_worker(args):
    global processed_emails, total_emails
    user_agent = 'Microsoft Office/16.0 (Windows NT 10.0; Microsoft Outlook 16.0.12026; Pro)'
    headers = {'User-Agent': user_agent, 'Accept': 'application/json'}
    proxies = {}
    if args.proxy is not None:
        proxies = {
                "http": args.proxy,
                "https": args.proxy
        }
    while not email_queue.empty():
        try:
            email = email_queue.get(False)
            email_start_time = time.time()
            domain = email.split("@")[1]
            if domain not in domain_is_o365.keys():
                with domain_is_o365_lock:
                    if domain not in domain_is_o365.keys():
                        junk_user = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(20))
                        r = requests.get('https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{}@{}?Protocol=rest'.format(junk_user, domain), headers=headers, verify=args.nossl, allow_redirects=False, proxies=proxies)
                        if 'outlook.office365.com' in r.text:
                            domain_is_o365[domain] = True
                        else:
                            if args.verbose:
                                print("It doesn't look like '{}' uses o365".format(domain))
                            domain_is_o365[domain] = False
            r = requests.get('https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/{}?Protocol=rest'.format(email), headers=headers, verify=args.nossl, allow_redirects=False, proxies=proxies)
            # Calculate email processing time
            email_process_time = time.time() - email_start_time
            
            # Update processed count
            with progress_lock:
                processed_emails += 1
                current_progress = processed_emails
            
            if r.status_code == 200:
                print(Fore.GREEN + f"VALID: {email} [{email_process_time:.2f}s] ({current_progress}/{total_emails})" + Style.RESET_ALL)
                if args.output is not None:
                    print_queue.put(email)
                # Save to valid.txt in real time
                with open('valid.txt', 'a') as valid_file:
                    valid_file.write(email + '\n')
            elif r.status_code == 302:
                if domain_is_o365[domain] and 'outlook.office365.com' not in r.text:
                    print(Fore.GREEN + f"VALID: {email} [{email_process_time:.2f}s] ({current_progress}/{total_emails})" + Style.RESET_ALL)
                    if args.output is not None:
                        print_queue.put(email)
                    # Save to valid.txt in real time
                    with open('valid.txt', 'a') as valid_file:
                        valid_file.write(email + '\n')
            else:
                if args.verbose:
                    print(Fore.RED + f"INVALID: {email} [{email_process_time:.2f}s] ({current_progress}/{total_emails})" + Style.RESET_ALL)
        except requests.exceptions.SSLError as e:
            print("SSL ERROR: If you are running through a proxy, "
                  "you probably want to use '-n' to disable SSL verification")
        except queue.Empty as e:
            return

        except Exception as e:
            print("ERROR: ", e)
        time.sleep(0.01)


def print_worker(args):
    if args.output is not None:
        while True:
            toPrint = print_queue.get()
            if toPrint == 'done':
                return
            args.output.write(toPrint + "\n")
            args.output.flush()


def main():
    global total_emails, start_time, processed_emails
    
    # Initialize colorama for Windows
    colorama.init()
    print("-----------------------------------------------------------")
    print("|                 o365 Email Validator                 |")
    print("|                                                      |")
    print("|                      By King Lee                     |")
    print("|                        @notanotherlee                |")
    print("-----------------------------------------------------------")
    requests.packages.urllib3.disable_warnings()
    
    # Clear valid.txt file at the start
    open('valid.txt', 'w').close()
    args = parse_args()
    
    # Read from the file specified in command line arguments
    email_lines = []
    for line in args.file:
        if args.suffix:
            line = line.strip()+"@"+str(args.suffix).replace("@", "")
        else:
            line = line.strip()
        if '@' in line:
            email_lines.append(line.strip())
    
    # Set total emails count
    total_emails = len(email_lines)
    print(f"Total emails to process: {total_emails}")
    
    # Add emails to queue
    for email in email_lines:
        email_queue.put(email)

    threads = []
    start = time.perf_counter()
    for i in range(args.threads):
        t = threading.Thread(target=thread_worker, args=(args,))
        t.daemon = True
        t.start()
        threads.append(t)

    print_thread = threading.Thread(target=print_worker, args=(args,))
    print_thread.daemon = True
    print_thread.start()

    for t in threads:
        t.join()
    print_queue.put('done')

    print_thread.join()

    total_time = time.perf_counter() - start
    print(f"\nDone! Total execution time: {total_time:.2f} seconds")
    print(f"Average time per email: {total_time/processed_emails:.2f} seconds")
    print(f"Valid emails found: {len(open('valid.txt').readlines()) if os.path.exists('valid.txt') else 0}")
    print(f"Success rate: {(len(open('valid.txt').readlines())/total_emails)*100:.1f}%" if os.path.exists('valid.txt') else "0%")


if __name__ == "__main__":
    main()
