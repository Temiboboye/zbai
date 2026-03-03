import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization') || '';
        const body = await req.json();
        const { key } = body;

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        const response = await fetch(`${BACKEND_URL}/v1/keys/${key}`, {
            method: 'DELETE',
            headers: {
                'Authorization': auth
            }
        });

        if (!response.ok) {
            let errorMessage = 'Failed to revoke key';
            try {
                const error = await response.json();
                errorMessage = error.detail || errorMessage;
            } catch (e) {
                // Ignore parse errors
            }
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Revoke key error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
