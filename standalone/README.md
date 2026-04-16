# Microsoft Login API Email Validator

Standalone CLI tool that validates **any** email address using Microsoft's `GetCredentialType` API. Works with all domains — not just Office 365.

## Setup

```bash
pip install -r requirements.txt
```

## Usage

```bash
# Validate emails from a file (one email per line)
python3 ms_checker.py emails.txt

# Paste mode — type/paste emails interactively
python3 ms_checker.py -

# 10 threads, verbose output (shows invalid + unknown too)
python3 ms_checker.py emails.txt -t 10 -v

# Use a single proxy
python3 ms_checker.py emails.txt -p socks5://user:pass@host:port

# Custom output file
python3 ms_checker.py emails.txt -o results.txt

# Slower delay (avoid throttling on large lists)
python3 ms_checker.py emails.txt -d 0.2
```

## 🌐 Free Proxy Mode

Automatically fetch, validate, and rotate through free public proxies to avoid Microsoft throttling:

```bash
# Auto-fetch free proxies (fetches from 7+ public sources, validates, then uses)
python3 ms_checker.py emails.txt --free-proxies

# Require at least 10 working proxies before starting
python3 ms_checker.py emails.txt --free-proxies --min-proxies 10

# Save working proxies for reuse later
python3 ms_checker.py emails.txt --free-proxies --save-proxies working_proxies.txt

# Reuse saved proxies (skips fetching)
python3 ms_checker.py emails.txt --proxy-file working_proxies.txt

# Combine: fetch fresh + load from file
python3 ms_checker.py emails.txt --free-proxies --proxy-file extra_proxies.txt

# Skip validation (use all fetched proxies as-is — faster start, more failures)
python3 ms_checker.py emails.txt --free-proxies --no-validate

# Full power: free proxies, 30 threads, verbose, save results
python3 ms_checker.py emails.txt --free-proxies -t 30 -v -o results.txt --save-proxies working.txt
```

### How it works

1. **Fetch** — Pulls proxies from 7 public sources (ProxyScrape, TheSpeedX, monosans, hookzof)
2. **Validate** — Tests each proxy against Microsoft's actual API endpoint in parallel (50 workers)
3. **Rotate** — Each thread picks a random working proxy per request
4. **Self-heal** — Dead proxies are auto-removed from rotation mid-run
5. **Fallback** — If all proxies die, automatically falls back to direct connection

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `file` | Input file (or `-` for stdin) | stdin |
| `-v` / `--verbose` | Show invalid & unknown results | off |
| `-t` / `--threads` | Thread count | 20 |
| `-o` / `--output` | Output file for valid emails | — |
| `-p` / `--proxy` | Single proxy URL | — |
| `-d` / `--delay` | Delay between requests (seconds) | 0.05 |
| `--free-proxies` | Auto-fetch free public proxies | off |
| `--proxy-file` | Load proxies from a text file | — |
| `--min-proxies` | Minimum working proxies required | 5 |
| `--validate-workers` | Parallel proxy validation threads | 50 |
| `--no-validate` | Skip proxy validation | off |
| `--save-proxies` | Save working proxies to file | — |

## Proxy File Format

One proxy per line. Supports:
```
# Comments start with #
http://1.2.3.4:8080
socks5://5.6.7.8:1080
socks4://9.10.11.12:4145
1.2.3.4:8080              # Plain ip:port defaults to http://
```

## Output

- **Valid** emails are printed in green and auto-saved to `valid.txt`
- **Invalid** emails are shown only with `-v` flag
- **Throttled** requests auto-rotate to a new proxy (or backoff 5s without proxies)

## IfExistsResult Codes

| Code | Meaning |
|------|---------|
| 0 | User exists (valid) |
| 1 | User does not exist |
| 2 | Throttled |
| 5 | Exists (external IdP) |
| 6 | Exists (external directory) |
