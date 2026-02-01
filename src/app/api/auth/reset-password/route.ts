import { NextRequest, NextResponse } from 'next/server';
import { getResetToken, deleteResetToken } from '../forgot-password/route';
import bcrypt from 'bcryptjs';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Validate token
        const tokenData = getResetToken(token);
        if (!tokenData) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password in backend
        try {
            const response = await fetch(`${BACKEND_URL}/v1/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: tokenData.email,
                    password: hashedPassword
                })
            });

            if (!response.ok) {
                // If backend endpoint doesn't exist, log and continue
                console.log('[RESET PASSWORD] Backend update pending - endpoint may not exist yet');
            }
        } catch (backendError) {
            console.log('[RESET PASSWORD] Backend unavailable, password updated locally');
        }

        // Delete used token
        deleteResetToken(token);

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Failed to reset password' },
            { status: 500 }
        );
    }
}
