'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useCredits } from '@/contexts/CreditContext';

interface EmailSortResult {
    email: string;
    domain: string;
    category: 'office365' | 'gsuite' | 'titan' | 'other';
    provider: string;
    tld: string;
    mx_host?: string;
}

interface SortedResults {
    office365: EmailSortResult[];
    gsuite: EmailSortResult[];
    titan: EmailSortResult[];
    other: EmailSortResult[];
    total: number;
    credits_used: number;
}

export default function SortPage() {
    const [emails, setEmails] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<SortedResults | null>(null);
    const [activeTab, setActiveTab] = useState<'office365' | 'gsuite' | 'titan' | 'other'>('office365');
    const { balance, deductCredits } = useCredits();

    const handleSort = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!emails.trim()) return;

        const emailList = emails
            .split('\n')
            .map(e => e.trim())
            .filter(e => e && e.includes('@'));

        const estimatedCost = Math.ceil(emailList.length * 0.5);

        if (balance < estimatedCost) {
            alert(`Insufficient credits! You need ${estimatedCost} credits but have ${balance}.`);
            return;
        }

        setLoading(true);
        setResults(null);

        try {
            const response = await fetch('/api/sort', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ emails: emailList })
            });

            if (!response.ok) {
                if (response.status === 402) {
                    alert('Insufficient credits! Please purchase more credits.');
                    return;
                }
                throw new Error('Sorting failed');
            }

            const data = await response.json();
            deductCredits(data.credits_used);
            setResults(data);
        } catch (error) {
            console.error('Sorting error:', error);
            alert('Failed to sort emails. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadCategory = (category: 'office365' | 'gsuite' | 'titan' | 'other') => {
        if (!results) return;

        const categoryEmails = results[category];
        const csv = ['Email,Domain,Provider,TLD,MX Host']
            .concat(categoryEmails.map(e => `${e.email},${e.domain},${e.provider},${e.tld},${e.mx_host || 'N/A'}`))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${category}_emails.csv`;
        a.click();
    };

    return (
        <div className={styles.container}>
            {/* Info Box */}
            <div className={styles.infoBox}>
                <p>
                    <strong>📧 Email Sorter:</strong> Automatically categorize your email list by provider
                    (Office 365, G Suite, Titan, or other domains). Perfect for targeted campaigns!
                </p>
            </div>

            <div className={styles.inputSection}>
                <h2>Email Sorter</h2>
                <p className={styles.subtitle}>
                    Paste your email list below (one per line). We'll categorize them by provider.
                </p>

                <form onSubmit={handleSort} className={styles.form}>
                    <textarea
                        value={emails}
                        onChange={(e) => setEmails(e.target.value)}
                        placeholder="user1@company.com&#10;user2@gmail.com&#10;user3@outlook.com&#10;..."
                        className={styles.textarea}
                        rows={10}
                        required
                    />

                    <div className={styles.formFooter}>
                        <p className={styles.emailCount}>
                            {emails.split('\n').filter(e => e.trim() && e.includes('@')).length} emails
                        </p>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Sorting...' : 'Sort Emails'}
                        </button>
                    </div>
                </form>
            </div>

            {
                results && (
                    <div className={styles.resultsSection}>
                        <div className={styles.resultHeader}>
                            <h3>Sorting Results</h3>
                            <div className={styles.stats}>
                                <span>Total: {results.total}</span>
                                <span>Credits Used: {results.credits_used}</span>
                            </div>
                        </div>

                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'office365' ? styles.active : ''}`}
                                onClick={() => setActiveTab('office365')}
                            >
                                <span className={styles.tabIcon}>🏢</span>
                                Office 365
                                <span className={styles.tabCount}>{results.office365.length}</span>
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'gsuite' ? styles.active : ''}`}
                                onClick={() => setActiveTab('gsuite')}
                            >
                                <span className={styles.tabIcon}>📧</span>
                                G Suite
                                <span className={styles.tabCount}>{results.gsuite.length}</span>
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'titan' ? styles.active : ''}`}
                                onClick={() => setActiveTab('titan')}
                            >
                                <span className={styles.tabIcon}>⚡</span>
                                Titan Email
                                <span className={styles.tabCount}>{results.titan.length}</span>
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'other' ? styles.active : ''}`}
                                onClick={() => setActiveTab('other')}
                            >
                                <span className={styles.tabIcon}>🌐</span>
                                Other
                                <span className={styles.tabCount}>{results.other.length}</span>
                            </button>
                        </div>

                        <div className={styles.tabContent}>
                            <div className={styles.contentHeader}>
                                <h4>
                                    {activeTab === 'office365' && 'Office 365 / Microsoft 365 Emails'}
                                    {activeTab === 'gsuite' && 'G Suite / Google Workspace Emails'}
                                    {activeTab === 'titan' && 'Titan Email Accounts'}
                                    {activeTab === 'other' && 'Other Domain Emails'}
                                </h4>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => downloadCategory(activeTab)}
                                    style={{ padding: '8px 16px', fontSize: '14px' }}
                                >
                                    Download CSV
                                </button>
                            </div>

                            <div className={styles.emailList}>
                                {results[activeTab].length === 0 ? (
                                    <p className={styles.emptyState}>No emails in this category</p>
                                ) : (
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Email</th>
                                                <th>Domain</th>
                                                <th>Provider</th>
                                                <th>TLD</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results[activeTab].map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.email}</td>
                                                    <td>{item.domain}</td>
                                                    <td>
                                                        <span className={styles.providerBadge}>
                                                            {item.provider}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.tldBadge}>
                                                            {item.tld}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <div className={styles.summary}>
                            <h4>Summary</h4>
                            <div className={styles.summaryGrid}>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryIcon}>🏢</div>
                                    <div className={styles.summaryLabel}>Office 365</div>
                                    <div className={styles.summaryValue}>{results.office365.length}</div>
                                    <div className={styles.summaryPercent}>
                                        {((results.office365.length / results.total) * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryIcon}>📧</div>
                                    <div className={styles.summaryLabel}>G Suite</div>
                                    <div className={styles.summaryValue}>{results.gsuite.length}</div>
                                    <div className={styles.summaryPercent}>
                                        {((results.gsuite.length / results.total) * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryIcon}>⚡</div>
                                    <div className={styles.summaryLabel}>Titan Email</div>
                                    <div className={styles.summaryValue}>{results.titan.length}</div>
                                    <div className={styles.summaryPercent}>
                                        {((results.titan.length / results.total) * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div className={styles.summaryCard}>
                                    <div className={styles.summaryIcon}>🌐</div>
                                    <div className={styles.summaryLabel}>Other Domains</div>
                                    <div className={styles.summaryValue}>{results.other.length}</div>
                                    <div className={styles.summaryPercent}>
                                        {((results.other.length / results.total) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
