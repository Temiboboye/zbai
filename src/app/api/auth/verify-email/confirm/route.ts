import { NextRequest, NextResponse } from 'next/server';
import { getPendingVerification, deletePendingVerification } from '../../signup/route';

export async function POST(req: NextRequest) {
    try {
        const { token, code } = await req.json();

        if (!token || !code) {
            return NextResponse.json(
                { error: 'Token and code are required' },
                { status: 400 }
            );
        }

        const pending = getPendingVerification(token);

        if (!pending) {
            return NextResponse.json(
                { error: 'Verification session expired. Please sign up again.' },
                { status: 400 }
            );
        }

        if (Date.now() > pending.expires) {
            deletePendingVerification(token);
            return NextResponse.json(
                { error: 'Verification code expired. Please sign up again.' },
                { status: 400 }
            );
        }

        if (pending.code !== code) {
            return NextResponse.json(
                { error: 'Invalid verification code.' },
                { status: 400 }
            );
        }

        // Success! Create the user account
        const userData = pending.userData;
        deletePendingVerification(token);

        // In production, this would create the user in the database
        const newUser = {
            id: Math.floor(Math.random() * 10000),
            email: userData.email,
            full_name: userData.full_name,
            credits_balance: 49,
            email_verified: true,
            created_at: new Date().toISOString()
        };

        // Generate auth token
        const authToken = Buffer.from(`${newUser.id}:${newUser.email}:${Date.now()}`).toString('base64');

        const response = NextResponse.json({
            token: authToken,
            user: newUser,
            message: 'Email verified successfully! Welcome to ZeroBounce.'
        });

        // Set HTTP-only cookie
        response.cookies.set('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 7 days
        });

        return response;

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
