import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// In-memory store for verification codes (use Redis in production)
const verificationCodes = new Map<string, {
    code: string;
    email: string;
    expires: number;
    userData: any;
}>();

// Generate 6-digit verification code
function generateCode(): string {
    return crypto.randomInt(100000, 999999).toString();
}

// Store pending verification
export function storePendingVerification(email: string, userData: any): string {
    const code = generateCode();
    const token = crypto.randomBytes(32).toString('hex');

    verificationCodes.set(token, {
        code,
        email,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        userData
    });

    // Clean up expired codes periodically
    setTimeout(() => verificationCodes.delete(token), 15 * 60 * 1000);

    return token;
}

// Verify code and return user data if valid
export function verifyCode(token: string, code: string): { valid: boolean; userData?: any; error?: string } {
    const pending = verificationCodes.get(token);

    if (!pending) {
        return { valid: false, error: 'Verification session expired. Please sign up again.' };
    }

    if (Date.now() > pending.expires) {
        verificationCodes.delete(token);
        return { valid: false, error: 'Verification code expired. Please sign up again.' };
    }

    if (pending.code !== code) {
        return { valid: false, error: 'Invalid verification code.' };
    }

    // Success - remove from pending and return user data
    const userData = pending.userData;
    verificationCodes.delete(token);
    return { valid: true, userData };
}

// Mock email sending (replace with real email service in production)
export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
    // In production, use SendGrid, SES, Mailgun, etc.
    console.log(`[EMAIL] Sending verification code ${code} to ${email}`);

    // Always return true for now (mock)
    // In production, actually send the email
    return true;
}

// API route to request new code
export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        const pending = verificationCodes.get(token);
        if (!pending) {
            return NextResponse.json(
                { error: 'Session expired. Please sign up again.' },
                { status: 400 }
            );
        }

        // Generate new code
        const newCode = generateCode();
        pending.code = newCode;
        pending.expires = Date.now() + 15 * 60 * 1000;

        // Send email
        await sendVerificationEmail(pending.email, newCode);

        return NextResponse.json({
            message: 'New verification code sent.',
            email: pending.email.replace(/(.{2}).*(@.*)/, '$1***$2') // Mask email
        });

    } catch (error) {
        console.error('Resend error:', error);
        return NextResponse.json(
            { error: 'Failed to resend code' },
            { status: 500 }
        );
    }
}
