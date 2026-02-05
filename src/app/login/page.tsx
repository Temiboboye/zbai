'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './auth.module.css';

declare global {
    interface Window {
        google: any;
    }
}

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize Google Login when script is loaded and window.google is available
        const initGoogle = () => {
            if (window.google && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
                window.google.accounts.id.initialize({
                    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
                    callback: handleGoogleCallback
                });
                window.google.accounts.id.renderButton(
                    document.getElementById("googleBtn"),
                    {
                        theme: "outline",
                        size: "large",
                        text: "continue_with",
                        shape: "rectangular",
                        logo_alignment: "left"
                    }
                );
            }
        };

        // Check if script already loaded
        if (window.google) {
            initGoogle();
        } else {
            // Wait for script to load
            const interval = setInterval(() => {
                if (window.google) {
                    initGoogle();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }
    }, []);

    const handleGoogleCallback = async (response: any) => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id_token: response.credential })
            });

            if (!res.ok) {
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.detail || 'Google login failed');
                } catch (e) {
                    throw new Error(`Google login failed: ${res.statusText}`);
                }
            }

            const data = await res.json();
            login(data.access_token);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred');
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new URLSearchParams();
            formData.append('username', email); // OAuth2PasswordRequestForm expects username
            formData.append('password', password);

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            if (!response.ok) {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.detail || 'Login failed');
                } catch (e) {
                    // If parsing failed, use the text (likely HTML error)
                    throw new Error(`Server returned error: ${response.status} ${response.statusText}`);
                }
            }

            const data = await response.json();
            login(data.access_token);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
            />
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

                <div id="googleBtn" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}></div>

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
