import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

// In-memory storage for password reset tokens (use database in production)
const resetTokens = new Map<string, { email: string; expires: number }>();

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = Date.now() + 60 * 60 * 1000; // 1 hour

        // Store token
        resetTokens.set(token, { email: email.toLowerCase(), expires });

        // Generate reset URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://zerobounceai.com';
        const resetUrl = `${baseUrl}/reset-password?token=${token}`;

        // Send reset email
        await sendPasswordResetEmail(email, resetUrl);

        // Always return success (don't reveal if email exists)
        return NextResponse.json({
            success: true,
            message: 'If the email exists, a reset link has been sent'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        // Still return success to not reveal if email exists
        return NextResponse.json({
            success: true,
            message: 'If the email exists, a reset link has been sent'
        });
    }
}

// Export for use by reset-password endpoint
export function getResetToken(token: string) {
    const data = resetTokens.get(token);
    if (!data) return null;
    if (Date.now() > data.expires) {
        resetTokens.delete(token);
        return null;
    }
    return data;
}

export function deleteResetToken(token: string) {
    resetTokens.delete(token);
}
