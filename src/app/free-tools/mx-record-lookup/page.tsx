'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from '../page.module.css';

export default function MxRecordLookup() {
    const [userEmail, setUserEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | { domain: string; hasMx: boolean; records: string[]; status: string }>(null);

    useEffect(() => {
        const saved = localStorage.getItem('freetools_email');
        if (saved) { setUserEmail(saved); setIsUnlocked(true); }
    }, []);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!emailInput || !emailInput.includes('@')) return;
        localStorage.setItem('freetools_email', emailInput);
        setUserEmail(emailInput);
        setIsUnlocked(true);
    };

    const runCheck = async () => {
        const domainPart = emailInput.trim().includes('@') ? emailInput.trim().split('@')[1] : emailInput.trim().replace(/^https?:\/\//, '').replace(/^www\./, '');
        if (!domainPart) return;
        setLoading(true);
        try {
            const res = await fetch(`https://dns.google/resolve?name=${domainPart}&type=MX`);
            const data = await res.json();
            const records = data.Answer?.map((a: { data: string }) => a.data) || [];
            setResult({ domain: domainPart, hasMx: records.length > 0, records: records.slice(0, 5), status: records.length > 0 ? 'Mail server found' : 'No mail server found' });
        } catch {
            setResult({ domain: domainPart, hasMx: false, records: [], status: 'Lookup failed' });
        }
        setLoading(false);
    };

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
                { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Free MX Record Lookup', applicationCategory: 'WebApplication', operatingSystem: 'Web', description: 'Check if a domain has valid mail server (MX) records.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
                { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                    { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://zerobounceai.com/free-tools' },
                    { '@type': 'ListItem', position: 3, name: 'MX Record Lookup', item: 'https://zerobounceai.com/free-tools/mx-record-lookup' },
                ] },
            ]) }} />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1>Free <span className="greenhead">MX Record Lookup</span></h1>
                    <p className={styles.heroDesc}>Check if a domain has valid mail servers. Enter an email or domain to find MX records.</p>
                </div>
            </section>

            {!isUnlocked && (
                <section className={styles.gateSection}>
                    <div className={styles.container}>
                        <div className={styles.gateBox}>
                            <h2>🔓 Unlock Free Tool</h2>
                            <p>Enter your email to access results.</p>
                            <form onSubmit={handleUnlock} className={styles.gateForm}>
                                <input type="email" placeholder="you@company.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required />
                                <button type="submit" className="btn btn-primary">Unlock</button>
                            </form>
                            <small>We&apos;ll never spam you.</small>
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.toolsSection}>
                <div className={styles.container}>
                    <div className={styles.activePanel}>
                        <h3>🌐 MX Record Lookup</h3>
                        <div className={styles.inputGroup}>
                            <input type="text" placeholder="example.com or test@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => { if (isUnlocked) runCheck(); }} disabled={loading || !isUnlocked}>
                            {loading ? 'Looking up...' : !isUnlocked ? '🔒 Enter email above to unlock' : 'Lookup MX Records'}
                        </button>

                        {isUnlocked && result && (
                            <div className={`${styles.resultBox} ${result.hasMx ? styles.resultSuccess : styles.resultError}`}>
                                <div className={styles.resultHeader}>
                                    <span className={styles.resultIcon}>{result.hasMx ? '✅' : '❌'}</span>
                                    <h4>{result.status}</h4>
                                </div>
                                <div className={styles.resultDetails}>
                                    <p><strong>Domain:</strong> {result.domain}</p>
                                    {result.records.length > 0 && (
                                        <div><strong>MX Records:</strong><ul>{result.records.map((r, idx) => <li key={idx}>{r}</li>)}</ul></div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Go Beyond MX Checks</h2>
                        <p>MX lookup confirms a domain can receive email, but doesn&apos;t verify the mailbox exists. Get full SMTP verification with ZeroBounce AI.</p>
                        <div className={styles.ctaActions}>
                            <a href="/signup" className="btn btn-primary">Full Verification — 100 Free</a>
                            <a href="/email-checker" className="btn btn-outline">Full Email Checker</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>🛠️ More Free Tools</h3>
                    <div className={styles.seoLinksGrid}>
                        <a href="/free-tools/email-syntax-checker">Syntax Checker</a>
                        <a href="/free-tools/disposable-email-detector">Disposable Detector</a>
                        <a href="/free-tools/email-pattern-generator">Pattern Generator</a>
                        <a href="/free-tools/domain-age-checker">Domain Age Checker</a>
                        <a href="/free-tools">All Free Tools</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
