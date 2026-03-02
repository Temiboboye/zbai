import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization') || '';

        // Call backend to get credit balance
        const response = await fetch(`${BACKEND_URL}/v1/credits`, {
            headers: {
                'Authorization': auth
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
