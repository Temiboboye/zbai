import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const { key } = await req.json();

        const response = await fetch(`${BACKEND_URL}/v1/keys/${key}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY || 'zb_live_demo_key_123456'}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            return NextResponse.json(
                { error: data.detail || 'Failed to revoke key' },
                { status: response.status }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Revoke key proxy error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
