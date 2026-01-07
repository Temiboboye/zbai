import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    try {
        // Get user ID from session/token (mock for now)
        const user_id = 'user_123';

        // Call backend to get credit balance
        const response = await fetch(`${BACKEND_URL}/v1/credits`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY || 'zb_live_demo_key_123456'}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch balance');
        }

        const data = await response.json();

        return NextResponse.json({
            balance: data.credits_remaining,
            user_id: data.user_id
        });

    } catch (error: any) {
        console.error('Balance fetch error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
