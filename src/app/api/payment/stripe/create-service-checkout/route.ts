import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8000';

export async function POST(req: NextRequest) {
    try {
        const response = await fetch(`${BACKEND_URL}/v1/payment/stripe/create-service-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Service checkout proxy error:', error);
        return NextResponse.json(
            { error: 'Service checkout failed. Please try again.' },
            { status: 500 }
        );
    }
}
