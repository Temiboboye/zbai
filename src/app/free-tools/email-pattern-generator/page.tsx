'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import styles from '../page.module.css';

const EMAIL_PATTERNS = [
    '{first}@{domain}', '{last}@{domain}', '{first}.{last}@{domain}',
    '{first}{last}@{domain}', '{f}{last}@{domain}', '{first}_{last}@{domain}',
    '{first}-{last}@{domain}', '{f}.{last}@{domain}', '{last}.{first}@{domain}', '{last}{f}@{domain}',
];

export default function EmailPatternGenerator() {
    const [userEmail, setUserEmail] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [unlockEmail, setUnlockEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [domain, setDomain] = useState('');
    const [patterns, setPatterns] = useState<string[]>([]);

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

    const runGenerate = () => {
        if (!firstName || !lastName || !domain) return;
        const f = firstName.toLowerCase();
        const l = lastName.toLowerCase();
        const d = domain.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
        setPatterns(EMAIL_PATTERNS.map(p => p.replace('{first}', f).replace('{last}', l).replace('{f}', f[0]).replace('{domain}', d)));
    };

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
                { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'Free Email Pattern Generator', applicationCategory: 'WebApplication', operatingSystem: 'Web', description: 'Generate likely email addresses from a name and company domain.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
                { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                    { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://zerobounceai.com/free-tools' },
                    { '@type': 'ListItem', position: 3, name: 'Email Pattern Generator', item: 'https://zerobounceai.com/free-tools/email-pattern-generator' },
                ] },
            ]) }} />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1>Free <span className="greenhead">Email Pattern Generator</span></h1>
                    <p className={styles.heroDesc}>Generate likely email addresses from a person&apos;s name and company domain. Find the right email format.</p>
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
                        <h3>🔍 Email Pattern Generator</h3>
                        <div className={styles.inputGroup}>
                            <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            <input type="text" placeholder="company.com" value={domain} onChange={(e) => setDomain(e.target.value)} />
                        </div>
                        <button className="btn btn-primary" onClick={() => { if (isUnlocked) runGenerate(); }} disabled={!isUnlocked}>
                            {!isUnlocked ? '🔒 Enter email above to unlock' : 'Generate Patterns'}
                        </button>

                        {isUnlocked && patterns.length > 0 && (
                            <div className={`${styles.resultBox} ${styles.resultSuccess}`}>
                                <div className={styles.resultHeader}>
                                    <span className={styles.resultIcon}>🔍</span>
                                    <h4>Likely Email Patterns for {firstName} {lastName}</h4>
                                </div>
                                <div className={styles.resultDetails}>
                                    <p><strong>Domain:</strong> {domain}</p>
                                    <div className={styles.patternList}>
                                        {patterns.map((p, idx) => (
                                            <div key={idx} className={styles.patternItem}>
                                                <span className={styles.patternRank}>#{idx + 1}</span>
                                                <code>{p}</code>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className={styles.ctaSection}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Verify These Patterns Instantly</h2>
                        <p>Use ZeroBounce AI&apos;s Email Finder to find and verify the correct email — not just guess patterns.</p>
                        <div className={styles.ctaActions}>
                            <a href="/signup" className="btn btn-primary">Try Email Finder Free</a>
                            <a href="/email-checker" className="btn btn-outline">Verify an Email</a>
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
                        <a href="/free-tools/domain-age-checker">Domain Age Checker</a>
                        <a href="/free-tools">All Free Tools</a>
                    </div>
                </div>
            </section>
        </main>
    );
}
