'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../login/auth.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send reset email');
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.authBox}>
                    <div className={styles.logo}>
                        <span className="greenhead">ZB</span>
                    </div>
                    <h1>Check Your Email</h1>
                    <p style={{ textAlign: 'center', color: '#888', marginBottom: '20px' }}>
                        If an account exists for <strong style={{ color: '#B9FF66' }}>{email}</strong>,
                        we've sent a password reset link.
                    </p>
                    <p style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
                        Didn't receive it? Check your spam folder or try again in a few minutes.
                    </p>
                    <Link href="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '20px', display: 'block', textAlign: 'center' }}>
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.logo}>
                    <span className="greenhead">ZB</span>
                </div>

                <h1>Reset Password</h1>
                <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                    <div className={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '20px' }}
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>
                        Remember your password? <Link href="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
