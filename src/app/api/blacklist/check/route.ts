import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await fetch(`${BACKEND_URL}/v1/blacklist/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY || 'zb_live_demo_key_123456'}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.detail || 'Blacklist check failed' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Blacklist check proxy error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
