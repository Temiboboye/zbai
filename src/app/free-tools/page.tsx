'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from './page.module.css';

const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'yopmail.com', 'maildrop.cc', 'getairmail.com', 'mohmal.com',
    'tempail.com', 'dispostable.com', 'mailnesia.com', 'tmail.com',
    'sharklasers.com', 'grr.la', 'guerrillamail.info', 'spam4.me',
    'guerrillamail.net', 'guerrillamail.org', 'guerrillamailblock.com',
    'safetymail.info', 'filzmail.com', 'mailexpire.com', 'tempinbox.com',
    'devnullmail.com', 'letthemeatspam.com', 'spamgourmet.com',
    'emailsensei.com', 'gishpuppy.com', 'mailcatch.com', 'mailnull.com',
    'mytrashmail.com', 'pookmail.com', 'sneakemail.com', 'sogetthis.com',
    'spambox.us', 'spamcero.com', 'spamhole.com', 'trashymail.com',
    'mintemail.com', 'emailondeck.com', 'guerrillamail.de', 'harakirimail.com',
]);

const EMAIL_PATTERNS = [
    '{first}@{domain}',
    '{last}@{domain}',
    '{first}.{last}@{domain}',
    '{first}{last}@{domain}',
    '{f}{last}@{domain}',
    '{first}_{last}@{domain}',
    '{first}-{last}@{domain}',
    '{f}.{last}@{domain}',
    '{last}.{first}@{domain}',
    '{last}{f}@{domain}',
];

interface ToolResult {
    type: string;
    data: Record<string, unknown>;
}

export default function FreeToolsPage() {
    const [userEmail, setUserEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [result, setResult] = useState<ToolResult | null>(null);
    const [loading, setLoading] = useState(false);

    // Pattern generator fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [domain, setDomain] = useState('');

    // Domain age field
    const [domainInput, setDomainInput] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('freetools_email');
        if (saved) {
            setUserEmail(saved);
            setIsUnlocked(true);
        }
    }, []);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailInput || !emailInput.includes('@')) return;
        localStorage.setItem('freetools_email', emailInput);
        setUserEmail(emailInput);
        setIsUnlocked(true);
    };

    const runSyntaxCheck = () => {
        const email = emailInput.trim();
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const isValid = regex.test(email);
        const parts = email.split('@');
        const localPart = parts[0] || '';
        const domainPart = parts[1] || '';

        setResult({
            type: 'syntax',
            data: {
                email,
                valid: isValid,
                localPart,
                domain: domainPart,
                issues: !isValid ? [
                    !email.includes('@') ? 'Missing @ symbol' : null,
                    localPart.length === 0 ? 'Empty local part' : null,
                    domainPart.length === 0 ? 'Empty domain' : null,
                    !domainPart.includes('.') ? 'Domain missing TLD' : null,
                ].filter(Boolean) : [],
            }
        });
    };

    const runMxLookup = async () => {
        const email = emailInput.trim();
        const domainPart = email.split('@')[1];
        if (!domainPart) {
            setResult({ type: 'mx', data: { error: 'Invalid email address' } });
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`https://dns.google/resolve?name=${domainPart}&type=MX`);
            const data = await res.json();
            const records = data.Answer?.map((a: { data: string }) => a.data) || [];
            setResult({
                type: 'mx',
                data: {
                    domain: domainPart,
                    hasMx: records.length > 0,
                    records: records.slice(0, 5),
                    status: records.length > 0 ? 'Mail server found' : 'No mail server found',
                }
            });
        } catch {
            setResult({ type: 'mx', data: { domain: domainPart, hasMx: false, records: [], status: 'Lookup failed' } });
        }
        setLoading(false);
    };

    const runDisposableCheck = () => {
        const email = emailInput.trim();
        const domainPart = email.split('@')[1]?.toLowerCase();
        const isDisposable = domainPart ? DISPOSABLE_DOMAINS.has(domainPart) : false;
        setResult({
            type: 'disposable',
            data: {
                email,
                domain: domainPart || '',
                isDisposable,
                risk: isDisposable ? 'high' : 'low',
                recommendation: isDisposable
                    ? 'This is a disposable/temporary email. Do not add to your mailing list.'
                    : 'This email does not appear to be from a known disposable provider.',
            }
        });
    };

    const runPatternGenerator = () => {
        if (!firstName || !lastName || !domain) return;
        const f = firstName.toLowerCase();
        const l = lastName.toLowerCase();
        const d = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');

        const patterns = EMAIL_PATTERNS.map(p =>
            p.replace('{first}', f)
                .replace('{last}', l)
                .replace('{f}', f[0])
                .replace('{domain}', d)
        );
        setResult({
            type: 'pattern',
            data: { firstName: f, lastName: l, domain: d, patterns }
        });
    };

    const runDomainAge = async () => {
        const d = (domainInput || emailInput.split('@')[1] || '').toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
        if (!d) return;
        setLoading(true);
        try {
            const res = await fetch(`https://dns.google/resolve?name=${d}&type=SOA`);
            const data = await res.json();
            const hasRecords = data.Answer && data.Answer.length > 0;
            setResult({
                type: 'domain_age',
                data: {
                    domain: d,
                    exists: hasRecords,
                    soaRecord: hasRecords ? data.Answer[0].data : null,
                    status: hasRecords ? 'Domain is active and has DNS records' : 'Domain not found or has no DNS records',
                    recommendation: hasRecords
                        ? 'This domain appears to be established and active.'
                        : 'This domain may not exist or may be very new. Proceed with caution.',
                }
            });
        } catch {
            setResult({ type: 'domain_age', data: { domain: d, exists: false, status: 'Lookup failed' } });
        }
        setLoading(false);
    };

    const tools = [
        {
            id: 'syntax',
            icon: '✅',
            title: 'Email Syntax Checker',
            description: 'Validate email format with RFC-compliant regex checking.',
            action: runSyntaxCheck,
            needsEmail: true,
        },
        {
            id: 'mx',
            icon: '🌐',
            title: 'MX Record Lookup',
            description: 'Check if a domain has valid mail server (MX) records.',
            action: runMxLookup,
            needsEmail: true,
        },
        {
            id: 'disposable',
            icon: '🚫',
            title: 'Disposable Email Detector',
            description: 'Detect throwaway and temporary email addresses.',
            action: runDisposableCheck,
            needsEmail: true,
        },
        {
            id: 'pattern',
            icon: '🔍',
            title: 'Email Pattern Generator',
            description: 'Generate likely email addresses from a name and domain.',
            action: runPatternGenerator,
            needsEmail: false,
        },
        {
            id: 'domain_age',
            icon: '📅',
            title: 'Domain Age Checker',
            description: 'Check if a domain exists and has active DNS records.',
            action: runDomainAge,
            needsEmail: false,
        },
    ];

    const renderResult = () => {
        if (!result) return null;
        const d = result.data;

        switch (result.type) {
            case 'syntax':
                return (
                    <div className={`${styles.resultBox} ${d.valid ? styles.resultSuccess : styles.resultError}`}>
                        <div className={styles.resultHeader}>
                            <span className={styles.resultIcon}>{d.valid ? '✅' : '❌'}</span>
                            <h4>{d.valid ? 'Valid Syntax' : 'Invalid Syntax'}</h4>
                        </div>
                        <div className={styles.resultDetails}>
                            <p><strong>Email:</strong> {String(d.email)}</p>
                            <p><strong>Local Part:</strong> {String(d.localPart)}</p>
                            <p><strong>Domain:</strong> {String(d.domain)}</p>
                            {Array.isArray(d.issues) && d.issues.length > 0 && (
                                <div className={styles.issues}>
                                    <strong>Issues:</strong>
                                    <ul>{d.issues.map((i: unknown, idx: number) => <li key={idx}>{String(i)}</li>)}</ul>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'mx':
                return (
                    <div className={`${styles.resultBox} ${d.hasMx ? styles.resultSuccess : styles.resultError}`}>
                        <div className={styles.resultHeader}>
                            <span className={styles.resultIcon}>{d.hasMx ? '✅' : '❌'}</span>
                            <h4>{String(d.status)}</h4>
                        </div>
                        <div className={styles.resultDetails}>
                            <p><strong>Domain:</strong> {String(d.domain)}</p>
                            {Array.isArray(d.records) && d.records.length > 0 && (
                                <div>
                                    <strong>MX Records:</strong>
                                    <ul>{d.records.map((r: unknown, idx: number) => <li key={idx}>{String(r)}</li>)}</ul>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'disposable':
                return (
                    <div className={`${styles.resultBox} ${d.isDisposable ? styles.resultError : styles.resultSuccess}`}>
                        <div className={styles.resultHeader}>
                            <span className={styles.resultIcon}>{d.isDisposable ? '🚫' : '✅'}</span>
                            <h4>{d.isDisposable ? 'Disposable Email Detected' : 'Not a Disposable Email'}</h4>
                        </div>
                        <div className={styles.resultDetails}>
                            <p><strong>Domain:</strong> {String(d.domain)}</p>
                            <p><strong>Risk Level:</strong> <span className={d.risk === 'high' ? styles.riskHigh : styles.riskLow}>{String(d.risk).toUpperCase()}</span></p>
                            <p>{String(d.recommendation)}</p>
                        </div>
                    </div>
                );
            case 'pattern':
                return (
                    <div className={`${styles.resultBox} ${styles.resultSuccess}`}>
                        <div className={styles.resultHeader}>
                            <span className={styles.resultIcon}>🔍</span>
                            <h4>Likely Email Patterns for {String(d.firstName)} {String(d.lastName)}</h4>
                        </div>
                        <div className={styles.resultDetails}>
                            <p><strong>Domain:</strong> {String(d.domain)}</p>
                            <div className={styles.patternList}>
                                {Array.isArray(d.patterns) && d.patterns.map((p: unknown, idx: number) => (
                                    <div key={idx} className={styles.patternItem}>
                                        <span className={styles.patternRank}>#{idx + 1}</span>
                                        <code>{String(p)}</code>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            case 'domain_age':
                return (
                    <div className={`${styles.resultBox} ${d.exists ? styles.resultSuccess : styles.resultError}`}>
                        <div className={styles.resultHeader}>
                            <span className={styles.resultIcon}>{d.exists ? '✅' : '⚠️'}</span>
                            <h4>{String(d.status)}</h4>
                        </div>
                        <div className={styles.resultDetails}>
                            <p><strong>Domain:</strong> {String(d.domain)}</p>
                            <p>{String(d.recommendation)}</p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className={styles.main}>
            <Navbar />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1>
                        Free <span className="greenhead">Lead Gen Tools</span>
                    </h1>
                    <p className={styles.heroDesc}>
                        5 powerful email tools to boost your lead generation — completely free.
                        Enter your email once to unlock all results.
                    </p>
                </div>
            </section>

            {/* Email Gate */}
            {!isUnlocked && (
                <section className={styles.gateSection}>
                    <div className={styles.container}>
                        <div className={styles.gateBox}>
                            <h2>🔓 Unlock Free Tools</h2>
                            <p>Enter your email to access results from all 5 tools.</p>
                            <form onSubmit={handleUnlock} className={styles.gateForm}>
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    required
                                />
                                <button type="submit" className="btn btn-primary">Unlock Tools</button>
                            </form>
                            <small>We'll never spam you. Just unlock and go.</small>
                        </div>
                    </div>
                </section>
            )}

            {/* Tools Grid */}
            <section className={styles.toolsSection}>
                <div className={styles.container}>
                    <div className={styles.toolsGrid}>
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                className={`${styles.toolCard} ${activeTool === tool.id ? styles.toolCardActive : ''}`}
                                onClick={() => { setActiveTool(tool.id); setResult(null); }}
                            >
                                <div className={styles.toolIcon}>{tool.icon}</div>
                                <h3>{tool.title}</h3>
                                <p>{tool.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Active Tool Panel */}
                    {activeTool && (
                        <div className={styles.activePanel}>
                            <h3>{tools.find(t => t.id === activeTool)?.title}</h3>

                            {activeTool === 'pattern' ? (
                                <div className={styles.inputGroup}>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="company.com"
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                    />
                                </div>
                            ) : activeTool === 'domain_age' ? (
                                <div className={styles.inputGroup}>
                                    <input
                                        type="text"
                                        placeholder="example.com"
                                        value={domainInput}
                                        onChange={(e) => setDomainInput(e.target.value)}
                                    />
                                </div>
                            ) : (
                                <div className={styles.inputGroup}>
                                    <input
                                        type="email"
                                        placeholder="test@example.com"
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                    />
                                </div>
                            )}

                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    if (!isUnlocked) return;
                                    tools.find(t => t.id === activeTool)?.action();
                                }}
                                disabled={loading || !isUnlocked}
                            >
                                {loading ? 'Checking...' : !isUnlocked ? '🔒 Enter email above to unlock' : 'Run Check'}
                            </button>

                            {isUnlocked && renderResult()}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Need Full Verification?</h2>
                        <p>
                            These free tools are just the beginning. Get 98%+ accuracy with AI-powered
                            verification, confidence scoring, and bulk processing.
                        </p>
                        <div className={styles.ctaActions}>
                            <a href="/signup" className="btn btn-primary">Create Account</a>
                            <a href="/#pricing" className="btn btn-outline">View Pricing</a>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
