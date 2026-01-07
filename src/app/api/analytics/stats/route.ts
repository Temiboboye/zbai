import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/v1/analytics/stats`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY || 'zb_live_demo_key_123456'}`
            },
            next: { revalidate: 60 } // Cache for 1 minute
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Analytics proxy error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
