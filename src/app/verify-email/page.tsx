'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './verify.module.css';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Auto-focus first input
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only digits

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Only last digit
        setCode(newCode);
        setError('');

        // Auto-advance to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all filled
        if (newCode.every(d => d) && newCode.join('').length === 6) {
            handleSubmit(newCode.join(''));
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setCode(pasted.split(''));
            handleSubmit(pasted);
        }
    };

    const handleSubmit = async (codeString?: string) => {
        const verifyCode = codeString || code.join('');
        if (verifyCode.length !== 6) {
            setError('Please enter the 6-digit code');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/verify-email/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, code: verifyCode })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            // Success! Store token and redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/dashboard');

        } catch (err: any) {
            setError(err.message);
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        setResending(true);
        setError('');

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to resend');
            }

            setCountdown(60); // 60 second cooldown

        } catch (err: any) {
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    if (!token) {
        return (
            <div className={styles.container}>
                <div className={styles.box}>
                    <h1>Invalid Link</h1>
                    <p>This verification link is invalid or expired.</p>
                    <a href="/signup" className="btn btn-primary">Sign Up Again</a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <div className={styles.icon}>📧</div>
                <h1>Verify Your Email</h1>
                <p>We sent a 6-digit code to <strong>{email || 'your email'}</strong></p>

                {error && (
                    <div className={styles.error}>
                        ⚠️ {error}
                    </div>
                )}

                <div className={styles.codeInputs} onPaste={handlePaste}>
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => { inputRefs.current[index] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={styles.codeInput}
                            disabled={loading}
                        />
                    ))}
                </div>

                <button
                    onClick={() => handleSubmit()}
                    className="btn btn-primary"
                    disabled={loading || code.join('').length !== 6}
                    style={{ width: '100%', marginTop: '20px' }}
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>

                <div className={styles.resend}>
                    <p>Didn't receive the code?</p>
                    <button
                        onClick={handleResend}
                        disabled={resending || countdown > 0}
                        className={styles.resendBtn}
                    >
                        {countdown > 0
                            ? `Resend in ${countdown}s`
                            : resending
                                ? 'Sending...'
                                : 'Resend Code'
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.box}>
                    <div className={styles.icon}>⏳</div>
                    <h1>Loading...</h1>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
