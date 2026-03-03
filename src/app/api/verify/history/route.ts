import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(req: NextRequest) {
    try {
        const auth = req.headers.get('Authorization') || '';
        const { searchParams } = new URL(req.url);

        // Forward all query params to the backend
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
            params.set(key, value);
        });

        const response = await fetch(`${BACKEND_URL}/v1/verify/history?${params.toString()}`, {
            headers: { 'Authorization': auth },
        });

        if (!response.ok) {
            const error = await response.text();
            return NextResponse.json(
                { error: error || 'Failed to fetch history' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('History proxy error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
