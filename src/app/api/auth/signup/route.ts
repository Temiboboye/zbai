import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

// List of common disposable email domains (subset - full list should be loaded from file)
const DISPOSABLE_DOMAINS = new Set([
    'tempmail.com', 'guerrillamail.com', 'mailinator.com', '10minutemail.com',
    'throwaway.email', 'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
    'yopmail.com', 'maildrop.cc', 'getairmail.com', 'mohmal.com',
    'tempail.com', 'dispostable.com', 'mailnesia.com', 'tmail.com',
    'sharklasers.com', 'grr.la', 'guerrillamail.info', 'spam4.me'
]);

// Simple in-memory rate limiting (in production, use Redis)
const signupAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_SIGNUPS_PER_IP = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// Pending verification store (in production, use Redis)
const pendingVerifications = new Map<string, {
    code: string;
    email: string;
    userData: any;
    expires: number;
}>();

function getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIP = req.headers.get('x-real-ip');
    return forwarded?.split(',')[0] || realIP || 'unknown';
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const attempts = signupAttempts.get(ip);

    if (!attempts) {
        signupAttempts.set(ip, { count: 1, firstAttempt: now });
        return false;
    }

    // Reset if window has passed
    if (now - attempts.firstAttempt > RATE_LIMIT_WINDOW) {
        signupAttempts.set(ip, { count: 1, firstAttempt: now });
        return false;
    }

    // Increment and check
    attempts.count++;
    return attempts.count > MAX_SIGNUPS_PER_IP;
}

function isDisposableEmail(email: string): boolean {
    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return false;
    return DISPOSABLE_DOMAINS.has(domain);
}

function generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
}

// Export for use by verify-email route
export function getPendingVerification(token: string) {
    return pendingVerifications.get(token);
}

export function deletePendingVerification(token: string) {
    pendingVerifications.delete(token);
}

export async function POST(req: NextRequest) {
    try {
        const clientIP = getClientIP(req);

        // Check rate limit
        if (isRateLimited(clientIP)) {
            return NextResponse.json(
                { error: 'Too many signup attempts. Please try again later.' },
                { status: 429 }
            );
        }

        const { full_name, email, password } = await req.json();

        // Validation
        if (!full_name || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Block disposable emails
        if (isDisposableEmail(email)) {
            return NextResponse.json(
                { error: 'Disposable email addresses are not allowed. Please use a permanent email.' },
                { status: 400 }
            );
        }

        // Check if email exists (mock)
        if (email === 'demo@zerobounce.ai') {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Generate verification code and token
        const code = generateCode();
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Store pending verification
        pendingVerifications.set(verificationToken, {
            code,
            email,
            userData: {
                full_name,
                email,
                password, // In production, hash this
                signup_ip: clientIP
            },
            expires: Date.now() + 15 * 60 * 1000 // 15 minutes
        });

        // Auto-cleanup after expiry
        setTimeout(() => pendingVerifications.delete(verificationToken), 15 * 60 * 1000);

        // Send verification email
        const emailSent = await sendVerificationEmail(email, code);
        if (!emailSent) {
            console.error('[SIGNUP] Failed to send verification email to', email);
            // Don't block the user if it's just a transient email failure,
            // but in production we might want to know.
            // For now, let's return a specific message if it fails in a way we want to expose.
        }

        // Return token for verification page
        return NextResponse.json({
            requiresVerification: true,
            verificationToken,
            email: email.replace(/(.{2}).*(@.*)/, '$1***$2'), // Masked email
            message: emailSent
                ? 'Please check your email for the verification code.'
                : 'Account created, but we had trouble sending the verification email. Please contact support or try logging in.'
        });

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
