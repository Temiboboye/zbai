import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
    try {
        const { emails } = await req.json();

        if (!emails || !Array.isArray(emails)) {
            return NextResponse.json(
                { error: 'Invalid email list' },
                { status: 400 }
            );
        }

        // Call FastAPI backend for real MX record sorting
        const response = await fetch(`${BACKEND_URL}/v1/sort`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY || 'zb_live_demo_key_123456'}`
            },
            body: JSON.stringify({ emails })
        });

        if (!response.ok) {
            // Fallback to client-side sorting if backend is unavailable
            return fallbackSort(emails);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Sort error:', error);
        // Fallback to client-side sorting
        return fallbackSort(await req.json().then(d => d.emails));
    }
}

// Fallback client-side sorting (basic, no MX lookup)
function fallbackSort(emails: string[]) {
    const office365: any[] = [];
    const gsuite: any[] = [];
    const titan: any[] = [];
    const other: any[] = [];

    const OFFICE365_DOMAINS = new Set([
        'outlook.com', 'hotmail.com', 'live.com', 'msn.com'
    ]);

    const GSUITE_DOMAINS = new Set([
        'gmail.com', 'googlemail.com'
    ]);

    emails.forEach(email => {
        const [local, domain] = email.toLowerCase().split('@');
        const tld = domain?.split('.').pop() || '';

        const result = {
            email,
            domain,
            tld: tld.toUpperCase(),
            detection_method: 'fallback'
        };

        if (OFFICE365_DOMAINS.has(domain)) {
            office365.push({
                ...result,
                category: 'office365',
                provider: 'Microsoft 365'
            });
        } else if (GSUITE_DOMAINS.has(domain)) {
            gsuite.push({
                ...result,
                category: 'gsuite',
                provider: 'Google Workspace'
            });
        } else {
            other.push({
                ...result,
                category: 'other',
                provider: `Custom Domain (.${tld})`
            });
        }
    });

    return NextResponse.json({
        office365,
        gsuite,
        titan,
        other,
        total: emails.length,
        credits_used: Math.ceil(emails.length * 0.5),
        fallback: true
    });
}
