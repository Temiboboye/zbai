import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization') || '';
        const body = await req.json();

        const response = await fetch(`${BACKEND_URL}/v1/keys/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            },
            body: JSON.stringify({
                name: body.name,
                limit: body.limit || 1000
            })
        });

        if (!response.ok) {
            let errorMessage = 'Failed to create key';
            try {
                const error = await response.json();
                errorMessage = error.detail || errorMessage;
            } catch (e) {
                // Ignore parsing parsing errors
            }
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Create key error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
