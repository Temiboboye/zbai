'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useCredits } from '@/contexts/CreditContext';
import CreditsBanner from '@/components/CreditsBanner';
import PaywallModal from '@/components/PaywallModal';

// Note: Metadata must be in a separate layout.tsx for client components
// This page uses client-side features, so metadata is in the parent layout

export default function VerifyPage() {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const { balance, deductCredits, refreshBalance } = useCredits();

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Show paywall if no credits
        if (balance < 1) {
            setShowPaywall(true);
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            // Call the Next.js API route which proxies to FastAPI backend
            const response = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                if (response.status === 402) {
                    setShowPaywall(true);
                    return;
                }
                throw new Error('Verification failed');
            }

            const data = await response.json();

            // Deduct credits locally for immediate feedback
            // (The backend assumes deduction happened if 200 OK, but client state needs update)
            if (data.credits_remaining !== undefined) {
                // In a real app we might sync with server value
            }
            deductCredits(1);

            // Convert status to user-friendly label
            const getStatusLabel = (status: string, catchAll: boolean) => {
                if (status === 'valid_safe' && !catchAll) return 'Safe to Send';
                if (status === 'valid_safe' && catchAll) return 'Risky';
                if (status === 'valid_risky' || catchAll) return 'Risky';
                if (status.includes('invalid')) return 'Invalid';
                if (status === 'disposable') return 'Disposable';
                return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            };

            const statusLabel = getStatusLabel(data.final_status, data.catch_all);

            // Transform backend response to frontend format
            setResult({
                email: data.email,
                status: data.final_status,
                statusLabel: statusLabel,
                score: data.safety_score,
                syntax: data.syntax,
                domain: data.domain,
                mx: data.mx,
                smtp: data.smtp,
                catchAll: data.catch_all ? 'Yes' : 'No',
                disposable: data.disposable ? 'Yes' : 'No',
                roleBased: data.role_based ? 'Yes' : 'No',
                spamRisk: data.spam_risk,
                isO365: data.is_o365
            });
        } catch (error) {
            console.error('Verification error:', error);
            alert('Failed to verify email. Make sure the backend is running on port 8000.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Paywall Modal */}
            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                creditsNeeded={1}
                feature="email verification"
            />

            {/* Credits Banner */}
            <CreditsBanner credits={balance} onRefresh={refreshBalance} />

            {/* Info Box */}
            <div style={{
                background: 'rgba(185, 255, 102, 0.1)',
                border: '1px solid var(--green)',
                borderRadius: '14px',
                padding: '20px',
                marginBottom: '30px'
            }}>
                <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
                    <strong>💡 Catch-All Detection:</strong> Our system tests for catch-all domains (like <code>support@penniesuntouched.com</code>)
                    which accept all emails. These are flagged as "risky" since we cannot verify if the specific mailbox exists.
                </p>
            </div>

            <div className={styles.inputSection}>
                <h2>Real-Time Verification</h2>
                <form onSubmit={handleVerify} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Enter email address (e.g. boss@example.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles.input}
                        required
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Analyzing...' : 'Verify Now'}
                    </button>
                </form>
            </div>

            {result && (
                <div className={`${styles.resultSection} animate-fade-in`}>
                    <div className={styles.resultHeader}>
                        <h3>Verification Results</h3>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span className={styles.creditsBadge}>
                                💳 1 Credit Used
                            </span>
                            <span className={`${styles.statusBadge} ${result.statusLabel === 'Safe to Send' ? styles.valid :
                                result.statusLabel === 'Risky' ? styles.risky :
                                    styles.invalid
                                }`}>
                                {result.statusLabel}
                            </span>
                        </div>
                    </div>

                    <div className={styles.scoreCard}>
                        <p>Safety Score</p>
                        <div className={styles.scoreValue}>{result.score}</div>
                    </div>

                    <div className={styles.checksGrid}>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>Syntax</span>
                            <span className={`${styles.checkValue} ${styles.pass}`}>{result.syntax}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>Domain</span>
                            <span className={`${styles.checkValue} ${styles.pass}`}>{result.domain}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>MX Records</span>
                            <span className={`${styles.checkValue} ${styles.pass}`}>{result.mx}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>SMTP Handshake</span>
                            <span className={`${styles.checkValue} ${styles.pass}`}>{result.smtp}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>Catch-All</span>
                            <span className={`${styles.checkValue} ${styles.warn}`}>{result.catchAll}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>Disposable</span>
                            <span className={`${styles.checkValue} ${styles.pass}`}>{result.disposable}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>Role-Based</span>
                            <span className={`${styles.checkValue} ${styles.warn}`}>{result.roleBased}</span>
                        </div>
                        <div className={styles.checkItem}>
                            <span className={styles.checkLabel}>Spam Risk</span>
                            <span className={`${styles.checkValue} ${styles.pass}`}>{result.spamRisk}</span>
                        </div>
                    </div>

                    <div className={styles.jsonBlock}>
                        <h4>JSON Response</h4>
                        <pre>
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
