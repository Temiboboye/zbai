'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from '../page.module.css';

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

export default function DisposableEmailDetector() {
    const [userEmail, setUserEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [result, setResult] = useState<null | { email: string; domain: string; isDisposable: boolean; risk: string; recommendation: string }>(null);

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
        const domainPart = email.split('@')[1]?.toLowerCase();
        const isDisposable = domainPart ? DISPOSABLE_DOMAINS.has(domainPart) : false;
        setResult({
            email, domain: domainPart || '', isDisposable,
            risk: isDisposable ? 'high' : 'low',
            recommendation: isDisposable
                ? 'This is a disposable/temporary email. Do not add to your mailing list.'
                : 'This email does not appear to be from a known disposable provider.',
        });
    };

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
                { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Free Disposable Email Detector', applicationCategory: 'WebApplication', operatingSystem: 'Web', description: 'Detect throwaway and temporary email addresses from 40+ disposable providers.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
                { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                    { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://zerobounceai.com/free-tools' },
                    { '@type': 'ListItem', position: 3, name: 'Disposable Email Detector', item: 'https://zerobounceai.com/free-tools/disposable-email-detector' },
                ] },
            ]) }} />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1>Free <span className="greenhead">Disposable Email Detector</span></h1>
                    <p className={styles.heroDesc}>Detect throwaway and temporary email addresses. Protect your list from fake signups.</p>
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
                        <h3>🚫 Disposable Email Detector</h3>
                        <div className={styles.inputGroup}>
                            <input type="email" placeholder="test@example.com" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => { if (isUnlocked) runCheck(); }} disabled={!isUnlocked}>
                            {!isUnlocked ? '🔒 Enter email above to unlock' : 'Check Email'}
                        </button>

                        {isUnlocked && result && (
                            <div className={`${styles.resultBox} ${result.isDisposable ? styles.resultError : styles.resultSuccess}`}>
                                <div className={styles.resultHeader}>
                                    <span className={styles.resultIcon}>{result.isDisposable ? '🚫' : '✅'}</span>
                                    <h4>{result.isDisposable ? 'Disposable Email Detected' : 'Not a Disposable Email'}</h4>
                                </div>
                                <div className={styles.resultDetails}>
                                    <p><strong>Domain:</strong> {result.domain}</p>
                                    <p><strong>Risk Level:</strong> <span className={result.risk === 'high' ? styles.riskHigh : styles.riskLow}>{result.risk.toUpperCase()}</span></p>
                                    <p>{result.recommendation}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Block Disposable Emails at Signup</h2>
                        <p>Use the ZeroBounce AI API to detect 100+ disposable providers in real-time at your signup forms.</p>
                        <div className={styles.ctaActions}>
                            <a href="/signup" className="btn btn-primary">Get API Access Free</a>
                            <a href="/blog/how-to-avoid-spam-traps" className="btn btn-outline">Spam Trap Guide</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>🛠️ More Free Tools</h3>
                    <div className={styles.seoLinksGrid}>
                        <a href="/free-tools/email-syntax-checker">Syntax Checker</a>
                        <a href="/free-tools/mx-record-lookup">MX Record Lookup</a>
                        <a href="/free-tools/email-pattern-generator">Pattern Generator</a>
                        <a href="/free-tools/domain-age-checker">Domain Age Checker</a>
                        <a href="/free-tools">All Free Tools</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
