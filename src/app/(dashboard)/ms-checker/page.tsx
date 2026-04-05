'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useCredits } from '@/contexts/CreditContext';
import CreditsBanner from '@/components/CreditsBanner';
import PaywallModal from '@/components/PaywallModal';
import { useAuth } from '@/contexts/AuthContext';

interface MSCheckResult {
    email: string;
    status: string;
    exists: boolean | null;
    if_exists_result: number;
    details: string;
}

export default function MSCheckerPage() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState<MSCheckResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [filter, setFilter] = useState<string | null>(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const { balance, deductCredits, refreshBalance } = useCredits();
    const { token, isAuthenticated } = useAuth();

    const emails = input
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.includes('@'));

    const handleValidate = async () => {
        if (emails.length === 0) return;

        if (!isAuthenticated || !token) {
            window.location.href = '/login';
            return;
        }

        if (balance < emails.length) {
            setShowPaywall(true);
            return;
        }

        setLoading(true);
        setResults([]);
        setProgress(0);
        setFilter(null);

        // Process in batches of 50 for smoother UX
        const batchSize = 50;
        const allResults: MSCheckResult[] = [];

        for (let i = 0; i < emails.length; i += batchSize) {
            const batch = emails.slice(i, i + batchSize);

            try {
                const response = await fetch('/api/ms-check', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ emails: batch })
                });

                if (!response.ok) {
                    if (response.status === 402) {
                        setShowPaywall(true);
                        break;
                    }
                    throw new Error('Check failed');
                }

                const data = await response.json();
                allResults.push(...data.results);
                setResults([...allResults]);
                setProgress(Math.min(((i + batch.length) / emails.length) * 100, 100));
                deductCredits(batch.length);

            } catch (error) {
                console.error('MS Check error:', error);
                // Mark remaining batch as error
                batch.forEach(email => {
                    allResults.push({
                        email,
                        status: 'error',
                        exists: null,
                        if_exists_result: -1,
                        details: 'Request failed'
                    });
                });
                setResults([...allResults]);
            }
        }

        setProgress(100);
        setLoading(false);
    };

    const validCount = results.filter(r => r.status === 'valid').length;
    const invalidCount = results.filter(r => r.status === 'invalid').length;
    const unknownCount = results.filter(r => r.status === 'unknown' || r.status === 'error').length;

    const filteredResults = filter
        ? results.filter(r => {
            if (filter === 'unknown') return r.status === 'unknown' || r.status === 'error';
            return r.status === filter;
        })
        : results;

    const toggleFilter = (f: string) => setFilter(prev => prev === f ? null : f);

    const exportValid = () => {
        const validEmails = results.filter(r => r.status === 'valid').map(r => r.email).join('\n');
        const blob = new Blob([validEmails], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'valid_emails.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const getBadgeClass = (status: string) => {
        switch (status) {
            case 'valid': return styles.badgeValid;
            case 'invalid': return styles.badgeInvalid;
            case 'unknown': return styles.badgeUnknown;
            default: return styles.badgeError;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Microsoft Checker</h1>
                <p>Validate any email using Microsoft&apos;s Login API — works with all domains, not just Office 365.</p>
            </div>

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                creditsNeeded={emails.length}
                feature="Microsoft email check"
            />

            <CreditsBanner credits={balance} onRefresh={refreshBalance} />

            <div className={styles.infoBadge}>
                <strong>🔷 How it works:</strong> This tool uses Microsoft&apos;s GetCredentialType API to check if an email account exists
                in Microsoft&apos;s directory. It works with <strong>any domain</strong> — Gmail, Yahoo, custom domains, and more —
                not just Outlook/Hotmail. Paste your emails below and hit validate.
            </div>

            <div className={styles.inputSection}>
                <h2><span>📧</span> Paste Emails</h2>
                <p className={styles.subtitle}>One email per line. Maximum 500 emails per request.</p>
                <textarea
                    className={styles.textarea}
                    placeholder={`user@gmail.com\njohn@company.com\ntest@hotmail.fr\n...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={loading}
                />
                <div className={styles.actions}>
                    <span className={styles.emailCount}>
                        <strong>{emails.length}</strong> email{emails.length !== 1 ? 's' : ''} detected
                        {emails.length > 0 && ` • ${emails.length} credit${emails.length !== 1 ? 's' : ''}`}
                    </span>
                    <button
                        className={styles.btnValidate}
                        onClick={handleValidate}
                        disabled={loading || emails.length === 0}
                    >
                        {loading ? '⏳ Validating...' : '🔍 Validate All'}
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            {loading && (
                <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                    <div className={styles.progressText}>
                        <span>Checking emails...</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            )}

            {/* Summary Cards */}
            {results.length > 0 && (
                <>
                    <div className={styles.summary}>
                        <div
                            className={`${styles.summaryCard} ${styles.cardTotal} ${styles.clickable} ${filter === null ? styles.activeCard : ''}`}
                            onClick={() => setFilter(null)}
                        >
                            <h3>{results.length}</h3>
                            <p>Total</p>
                        </div>
                        <div
                            className={`${styles.summaryCard} ${styles.cardValid} ${styles.clickable} ${filter === 'valid' ? styles.activeCard : ''}`}
                            onClick={() => toggleFilter('valid')}
                        >
                            <h3>{validCount}</h3>
                            <p>Valid</p>
                        </div>
                        <div
                            className={`${styles.summaryCard} ${styles.cardInvalid} ${styles.clickable} ${filter === 'invalid' ? styles.activeCard : ''}`}
                            onClick={() => toggleFilter('invalid')}
                        >
                            <h3>{invalidCount}</h3>
                            <p>Invalid</p>
                        </div>
                        <div
                            className={`${styles.summaryCard} ${styles.cardUnknown} ${styles.clickable} ${filter === 'unknown' ? styles.activeCard : ''}`}
                            onClick={() => toggleFilter('unknown')}
                        >
                            <h3>{unknownCount}</h3>
                            <p>Unknown</p>
                        </div>
                    </div>

                    {/* Results Table */}
                    <div className={styles.resultsSection}>
                        <div className={styles.resultsHeader}>
                            <h3>
                                Results
                                {filter && <span className={styles.filterLabel}> — showing {filter}</span>}
                            </h3>
                            {validCount > 0 && (
                                <button className={styles.exportBtn} onClick={exportValid}>
                                    📥 Export Valid ({validCount})
                                </button>
                            )}
                        </div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Status</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((r, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td className={styles.emailCell}>{r.email}</td>
                                        <td>
                                            <span className={`${styles.badge} ${getBadgeClass(r.status)}`}>
                                                {r.status === 'valid' ? '✅ Valid' :
                                                    r.status === 'invalid' ? '❌ Invalid' :
                                                        r.status === 'unknown' ? '❓ Unknown' : '⚠️ Error'}
                                            </span>
                                        </td>
                                        <td className={styles.detailText}>{r.details}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}
