'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from '../page.module.css';

export default function EmailSyntaxChecker() {
    const [userEmail, setUserEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [result, setResult] = useState<null | { valid: boolean; email: string; localPart: string; domain: string; issues: string[] }>(null);

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

    const runCheck = () => {
        const email = emailInput.trim();
        const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        const isValid = regex.test(email);
        const parts = email.split('@');
        const localPart = parts[0] || '';
        const domainPart = parts[1] || '';
        setResult({
            email, valid: isValid, localPart, domain: domainPart,
            issues: !isValid ? [
                !email.includes('@') ? 'Missing @ symbol' : null,
                localPart.length === 0 ? 'Empty local part' : null,
                domainPart.length === 0 ? 'Empty domain' : null,
                !domainPart.includes('.') ? 'Domain missing TLD' : null,
            ].filter(Boolean) as string[] : [],
        });
    };

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
                {
                    '@context': 'https://schema.org', '@type': 'SoftwareApplication',
                    name: 'Free Email Syntax Checker', applicationCategory: 'WebApplication',
                    operatingSystem: 'Web',
                    description: 'Check if an email address has valid syntax. RFC-compliant regex validation.',
                    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
                },
                {
                    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                        { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://zerobounceai.com/free-tools' },
                        { '@type': 'ListItem', position: 3, name: 'Email Syntax Checker', item: 'https://zerobounceai.com/free-tools/email-syntax-checker' },
                    ],
                },
            ]) }} />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1>Free <span className="greenhead">Email Syntax Checker</span></h1>
                    <p className={styles.heroDesc}>
                        Validate any email format with RFC-compliant regex checking. Catch typos, missing domains, and formatting errors instantly.
                    </p>
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
                        <h3>✅ Email Syntax Checker</h3>
                        <div className={styles.inputGroup}>
                            <input type="email" placeholder="test@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => { if (isUnlocked) runCheck(); }} disabled={!isUnlocked}>
                            {!isUnlocked ? '🔒 Enter email above to unlock' : 'Check Syntax'}
                        </button>

                        {isUnlocked && result && (
                            <div className={`${styles.resultBox} ${result.valid ? styles.resultSuccess : styles.resultError}`}>
                                <div className={styles.resultHeader}>
                                    <span className={styles.resultIcon}>{result.valid ? '✅' : '❌'}</span>
                                    <h4>{result.valid ? 'Valid Syntax' : 'Invalid Syntax'}</h4>
                                </div>
                                <div className={styles.resultDetails}>
                                    <p><strong>Email:</strong> {result.email}</p>
                                    <p><strong>Local Part:</strong> {result.localPart}</p>
                                    <p><strong>Domain:</strong> {result.domain}</p>
                                    {result.issues.length > 0 && (
                                        <div className={styles.issues}>
                                            <strong>Issues:</strong>
                                            <ul>{result.issues.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
                                        </div>
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
                        <h2>Need Full Verification?</h2>
                        <p>Syntax checking is just step 1. Get SMTP verification, catch-all scoring, and domain reputation with ZeroBounce AI.</p>
                        <div className={styles.ctaActions}>
                            <a href="/signup" className="btn btn-primary">Verify Free — 100 Credits</a>
                            <a href="/email-checker" className="btn btn-outline">Full Email Checker</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>🛠️ More Free Tools</h3>
                    <div className={styles.seoLinksGrid}>
                        <a href="/free-tools/mx-record-lookup">MX Record Lookup</a>
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
