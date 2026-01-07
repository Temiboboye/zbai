'use client';

import { useState } from 'react';
import { useCredits } from '@/contexts/CreditContext';
import styles from './page.module.css';

interface BlacklistResult {
    rbl: string;
    listed: boolean;
    status: string;
}

interface CheckResponse {
    target: string;
    resolved_ip: string;
    total_checks: number;
    listed_count: number;
    is_clean: boolean;
    results: BlacklistResult[];
    credits_used: number;
}

export default function BlacklistPage() {
    const [target, setTarget] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CheckResponse | null>(null);
    const { balance, deductCredits } = useCredits();

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!target) return;

        if (balance < 2) {
            alert('Insufficient credits! Checking a blacklist requires 2 credits.');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/blacklist/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target })
            });

            if (!response.ok) {
                if (response.status === 402) {
                    alert('Insufficient credits!');
                    return;
                }
                const err = await response.json();
                throw new Error(err.error || 'Check failed');
            }

            const data = await response.json();
            deductCredits(data.credits_used);
            setResult(data);
        } catch (error: any) {
            console.error('Blacklist check error:', error);
            alert(error.message || 'Failed to check blacklist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>🚫 Domain & IP Blacklist Monitor</h1>
                <p>Check if your domain or IP is listed on major spam blacklists (RBLs).</p>
            </div>

            <div className={styles.card}>
                <form onSubmit={handleCheck} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Enter domain (e.g. example.com) or IP address"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ minWidth: '150px' }}
                    >
                        {loading ? 'Checking...' : 'Check Status'}
                    </button>
                </form>
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                    Cost: 2 credits per check
                </div>
            </div>

            {result && (
                <div className="animate-fade-in">
                    <div className={styles.summary}>
                        <div className={styles.summaryCard}>
                            <div className={styles.summaryLabel}>Overall Status</div>
                            <div className={styles.summaryValue} style={{ color: result.is_clean ? '#b9ff66' : '#ff5050' }}>
                                {result.is_clean ? 'Clean ✅' : 'Blacklisted ⚠️'}
                            </div>
                        </div>
                        <div className={styles.summaryCard}>
                            <div className={styles.summaryLabel}>Lists Checked</div>
                            <div className={styles.summaryValue}>{result.total_checks}</div>
                        </div>
                        <div className={styles.summaryCard}>
                            <div className={styles.summaryLabel}>Lists Found On</div>
                            <div className={styles.summaryValue}>{result.listed_count}</div>
                        </div>
                        <div className={styles.summaryCard}>
                            <div className={styles.summaryLabel}>Resolved IP</div>
                            <div className={styles.summaryValue} style={{ fontSize: '18px' }}>{result.resolved_ip}</div>
                        </div>
                    </div>

                    <div className={styles.resultsHeader}>
                        <h3>Detailed Report</h3>
                        <div className={styles.creditsInfo}>
                            💳 {result.credits_used} Credits Used
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {result.results.map((item, index) => (
                            <div key={index} className={styles.resultItem} style={{
                                borderColor: item.listed ? 'rgba(255, 80, 80, 0.3)' : 'var(--gray-700)',
                                background: item.listed ? 'rgba(255, 80, 80, 0.05)' : 'var(--gray-800)'
                            }}>
                                <div className={styles.rblName}>{item.rbl}</div>
                                <div className={styles.status} style={{
                                    color: item.listed ? '#ff5050' : '#b9ff66'
                                }}>
                                    {item.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
