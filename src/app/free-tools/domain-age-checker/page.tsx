'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from '../page.module.css';

export default function DomainAgeChecker() {
    const [userEmail, setUserEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockEmail, setUnlockEmail] = useState('');
    const [domainInput, setDomainInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<null | { domain: string; exists: boolean; soaRecord: string | null; status: string; recommendation: string }>(null);

    useEffect(() => {
        const saved = localStorage.getItem('freetools_email');
        if (saved) { setUserEmail(saved); setIsUnlocked(true); }
    }, []);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!unlockEmail || !unlockEmail.includes('@')) return;
        localStorage.setItem('freetools_email', unlockEmail);
        setUserEmail(unlockEmail);
        setIsUnlocked(true);
    };

    const runCheck = async () => {
        const d = domainInput.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
        if (!d) return;
        setLoading(true);
        try {
            const res = await fetch(`https://dns.google/resolve?name=${d}&type=SOA`);
            const data = await res.json();
            const hasRecords = data.Answer && data.Answer.length > 0;
            setResult({
                domain: d, exists: hasRecords, soaRecord: hasRecords ? data.Answer[0].data : null,
                status: hasRecords ? 'Domain is active and has DNS records' : 'Domain not found or has no DNS records',
                recommendation: hasRecords ? 'This domain appears to be established and active.' : 'This domain may not exist or may be very new. Proceed with caution.',
            });
        } catch {
            setResult({ domain: d, exists: false, soaRecord: null, status: 'Lookup failed', recommendation: 'Could not check this domain.' });
        }
        setLoading(false);
    };

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
                { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Free Domain Age Checker', applicationCategory: 'WebApplication', operatingSystem: 'Web', description: 'Check if a domain exists and has active DNS records. Determine domain trust.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
                { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                    { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://zerobounceai.com/free-tools' },
                    { '@type': 'ListItem', position: 3, name: 'Domain Age Checker', item: 'https://zerobounceai.com/free-tools/domain-age-checker' },
                ] },
            ]) }} />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1>Free <span className="greenhead">Domain Age Checker</span></h1>
                    <p className={styles.heroDesc}>Check if a domain exists, has active DNS records, and is trustworthy. New domains are higher risk.</p>
                </div>
            </section>

            {!isUnlocked && (
                <section className={styles.gateSection}>
                    <div className={styles.container}>
                        <div className={styles.gateBox}>
                            <h2>🔓 Unlock Free Tool</h2>
                            <p>Enter your email to access results.</p>
                            <form onSubmit={handleUnlock} className={styles.gateForm}>
                                <input type="email" placeholder="you@company.com" value={unlockEmail} onChange={(e) => setUnlockEmail(e.target.value)} required />
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
                        <h3>📅 Domain Age Checker</h3>
                        <div className={styles.inputGroup}>
                            <input type="text" placeholder="example.com" value={domainInput} onChange={(e) => setDomainInput(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => { if (isUnlocked) runCheck(); }} disabled={loading || !isUnlocked}>
                            {loading ? 'Checking...' : !isUnlocked ? '🔒 Enter email above to unlock' : 'Check Domain'}
                        </button>

                        {isUnlocked && result && (
                            <div className={`${styles.resultBox} ${result.exists ? styles.resultSuccess : styles.resultError}`}>
                                <div className={styles.resultHeader}>
                                    <span className={styles.resultIcon}>{result.exists ? '✅' : '⚠️'}</span>
                                    <h4>{result.status}</h4>
                                </div>
                                <div className={styles.resultDetails}>
                                    <p><strong>Domain:</strong> {result.domain}</p>
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
                        <h2>Get Full Domain Intelligence</h2>
                        <p>Domain age is one factor. ZeroBounce AI also checks domain reputation, configuration, and email deliverability.</p>
                        <div className={styles.ctaActions}>
                            <a href="/signup" className="btn btn-primary">Verify Free — 100 Credits</a>
                            <a href="/blog/email-deliverability-guide" className="btn btn-outline">Deliverability Guide</a>
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
                        <a href="/free-tools/disposable-email-detector">Disposable Detector</a>
                        <a href="/free-tools/email-pattern-generator">Pattern Generator</a>
                        <a href="/free-tools">All Free Tools</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
