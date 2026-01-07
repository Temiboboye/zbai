'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './auth.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store token and redirect to dashboard
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authBox}>
                <div className={styles.logo}>
                    <span className="greenhead">ZB</span>
                </div>

                <h1>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to your account to continue</p>

                {error && (
                    <div className={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className={styles.formFooter}>
                        <label className={styles.checkbox}>
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <Link href="/forgot-password" className={styles.link}>
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '20px' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <button className={styles.socialBtn}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.129 20 14.99 20 10c0-5.523-4.477-10-10-10z" />
                    </svg>
                    Continue with Google
                </button>

                <p className={styles.signupPrompt}>
                    Don't have an account? <Link href="/signup">Sign up</Link>
                </p>
            </div>

            <div className={styles.features}>
                <h2>Why Choose ZeroBounce AI?</h2>
                <ul>
                    <li>✅ 99.9% accuracy rate</li>
                    <li>✅ Real-time verification</li>
                    <li>✅ Catch-all detection</li>
                    <li>✅ Office 365 support</li>
                    <li>✅ Bulk processing</li>
                    <li>✅ API access</li>
                </ul>
            </div>
        </div>
    );
}
