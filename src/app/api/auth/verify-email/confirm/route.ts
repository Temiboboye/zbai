import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { error: 'Token is required' },
                { status: 400 }
            );
        }

        // Forward to the real Python backend
        const response = await fetch(`${BACKEND_URL}/v1/auth/verify-email?token=${token}`, {
            method: 'GET'
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.detail || 'Verification failed' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully! Welcome to ZeroBounce.'
        });

    } catch (error) {
        console.error('Verification proxy error:', error);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}

