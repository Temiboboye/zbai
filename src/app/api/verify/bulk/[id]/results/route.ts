import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const response = await fetch(`${BACKEND_URL}/v1/bulk/${id}/results`, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY || 'zb_live_demo_key_123456'}`
            },
            next: { revalidate: 0 }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
