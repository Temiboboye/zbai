import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization') || '';

        const response = await fetch(`${BACKEND_URL}/v1/keys/`, {
            method: 'GET',
            headers: {
                'Authorization': auth
            }
        });

        if (!response.ok) {
            let errorMessage = 'Failed to list keys';
            try {
                const error = await response.json();
                errorMessage = error.detail || errorMessage;
            } catch (e) {
                // Ignore parsing errors for 500s
            }
            return NextResponse.json(
                { error: errorMessage },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('List keys error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
