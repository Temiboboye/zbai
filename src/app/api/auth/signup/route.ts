import { NextRequest, NextResponse } from 'next/server';

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
const MAX_SIGNUPS_PER_IP = 3;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours

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

        // Create user with 49 free credits
        const newUser = {
            id: Math.floor(Math.random() * 10000),
            email,
            full_name,
            credits_balance: 49, // Free tier credits
            signup_ip: clientIP,
            created_at: new Date().toISOString()
        };

        // Generate token
        const token = Buffer.from(`${newUser.id}:${newUser.email}:${Date.now()}`).toString('base64');

        const response = NextResponse.json({
            token,
            user: newUser,
            message: 'Account created successfully! You received 49 free credits.'
        });

        // Set HTTP-only cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
