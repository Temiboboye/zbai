'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './WelcomeActivation.module.css';
import { useCredits } from '@/contexts/CreditContext';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeActivationProps {
    totalVerified: number;
}

export default function WelcomeActivation({ totalVerified }: WelcomeActivationProps) {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { balance, deductCredits } = useCredits();
    const { token } = useAuth();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || loading) return;

        if (balance < 1) {
            window.location.href = '/billing';
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                if (response.status === 402) {
                    window.location.href = '/billing';
                    return;
                }
                throw new Error('Verification failed');
            }

            const data = await response.json();
            deductCredits(1);

            const getStatusLabel = (status: string, catchAll: boolean) => {
                if (status === 'valid_safe' && !catchAll) return 'Safe to Send';
                if (status === 'valid_risky' || catchAll) return 'Risky';
                if (status.includes('invalid')) return 'Invalid';
                if (status === 'disposable') return 'Disposable';
                return status.replace(/_/g, ' ');
            };

            setResult({
                email: data.email,
                statusLabel: getStatusLabel(data.final_status, data.catch_all),
                score: data.safety_score,
                syntax: data.syntax ? '✓' : '✗',
                domain: data.domain ? '✓' : '✗',
                mx: data.mx ? '✓' : '✗',
                smtp: data.smtp ? '✓' : '✗',
            });
        } catch (error) {
            console.error('Verification error:', error);
            setResult({ error: true });
        } finally {
            setLoading(false);
        }
    };

    const creditsUsed = 100 - balance;
    const progressPercent = Math.min((creditsUsed / 100) * 100, 100);

    const getBadgeClass = (label: string) => {
        if (label === 'Safe to Send') return styles.badgeSafe;
        if (label === 'Risky') return styles.badgeRisky;
        return styles.badgeInvalid;
    };

    const getScoreClass = (score: number) => {
        if (score >= 70) return styles.scoreGreen;
        if (score >= 40) return styles.scoreOrange;
        return styles.scoreRed;
    };

    return (
        <div className={styles.activation}>
            {/* Hero + Inline Verify */}
            <div className={styles.hero}>
                <span className={styles.heroEmoji}>👋</span>
                <h2 className={styles.heroTitle}>Verify Your First Email</h2>
                <p className={styles.heroSubtitle}>
                    Paste any email below to see our AI verification in action. You have {balance} free credits to start.
                </p>

                <form onSubmit={handleVerify} className={styles.verifyForm}>
                    <input
                        type="email"
                        placeholder="e.g. john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.verifyInput}
                        required
                    />
                    <button type="submit" className={styles.verifyBtn} disabled={loading}>
                        {loading ? '⏳ Verifying...' : '⚡ Verify'}
                    </button>
                </form>

                {/* Inline Result */}
                {result && !result.error && (
                    <div className={styles.resultCard}>
                        <div className={styles.resultTop}>
                            <span className={styles.resultEmail}>{result.email}</span>
                            <span className={`${styles.badge} ${getBadgeClass(result.statusLabel)}`}>
                                {result.statusLabel}
                            </span>
                        </div>
                        <div className={styles.resultChecks}>
                            <div className={styles.checkPill}>
                                <span>Syntax</span>
                                <span>{result.syntax}</span>
                            </div>
                            <div className={styles.checkPill}>
                                <span>Domain</span>
                                <span>{result.domain}</span>
                            </div>
                            <div className={styles.checkPill}>
                                <span>MX</span>
                                <span>{result.mx}</span>
                            </div>
                            <div className={styles.checkPill}>
                                <span>SMTP</span>
                                <span>{result.smtp}</span>
                            </div>
                        </div>
                        <div className={styles.resultScore}>
                            <span>Safety Score</span>
                            <span className={`${styles.scoreValue} ${getScoreClass(result.score)}`}>
                                {result.score}/100
                            </span>
                        </div>
                        <Link href="/bulk" className={styles.resultCta}>
                            Ready to verify your full list? Upload a CSV →
                        </Link>
                    </div>
                )}

                {result?.error && (
                    <div className={styles.resultCard}>
                        <p style={{ color: '#ff5050', textAlign: 'center', margin: 0 }}>
                            Verification failed. Please try again.
                        </p>
                    </div>
                )}
            </div>

            {/* Credits Progress */}
            <div className={styles.progressSection}>
                <div className={styles.progressTop}>
                    <span className={styles.progressLabel}>Free Credits</span>
                    <span className={styles.progressCount}>
                        <strong>{creditsUsed}</strong> / 100 used
                    </span>
                </div>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.actionsGrid}>
                <Link href="/bulk" className={styles.actionCard}>
                    <span className={styles.actionEmoji}>📁</span>
                    <div className={styles.actionTitle}>Upload a CSV</div>
                    <div className={styles.actionDesc}>
                        Verify up to 100 emails at once with your free credits
                    </div>
                </Link>
                <Link href="/api-keys" className={styles.actionCard}>
                    <span className={styles.actionEmoji}>🔑</span>
                    <div className={styles.actionTitle}>Get Your API Key</div>
                    <div className={styles.actionDesc}>
                        Integrate verification into your app or workflow
                    </div>
                </Link>
                <Link href="/billing" className={styles.actionCard}>
                    <span className={styles.actionEmoji}>🚀</span>
                    <div className={styles.actionTitle}>Buy More Credits</div>
                    <div className={styles.actionDesc}>
                        Plans start at just $3 for 250 emails
                    </div>
                </Link>
            </div>
        </div>
    );
}
