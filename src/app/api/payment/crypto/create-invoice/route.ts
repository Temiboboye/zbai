import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY || '';
const CRYPTOMUS_MERCHANT_ID = process.env.CRYPTOMUS_MERCHANT_ID || '';
const CRYPTOMUS_API_URL = 'https://api.cryptomus.com/v1';

function generateSign(data: any): string {
    const jsonData = JSON.stringify(data);
    const encoded = Buffer.from(jsonData).toString('base64');
    return crypto
        .createHmac('sha256', CRYPTOMUS_API_KEY)
        .update(encoded)
        .digest('hex');
}

export async function POST(req: NextRequest) {
    try {
        const { pack_id, credits, amount } = await req.json();

        // Create invoice data
        const invoiceData = {
            amount: amount.toString(),
            currency: 'USD',
            order_id: `order_${Date.now()}_${pack_id}`,
            url_return: `${req.headers.get('origin')}/billing?payment=success`,
            url_callback: `${req.headers.get('origin')}/api/payment/crypto/webhook`,
            is_payment_multiple: false,
            lifetime: 3600, // 1 hour
            to_currency: 'USDT', // Default to USDT, user can choose on payment page
            subtitle: `${credits.toLocaleString()} Credits`,
            description: `Purchase ${credits.toLocaleString()} email verification credits`,
            additional_data: JSON.stringify({
                pack_id,
                credits,
                user_id: 'user_123', // Replace with actual user ID
            }),
        };

        // Generate signature
        const sign = generateSign(invoiceData);

        // Call Cryptomus API
        const response = await fetch(`${CRYPTOMUS_API_URL}/payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'merchant': CRYPTOMUS_MERCHANT_ID,
                'sign': sign,
            },
            body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Cryptomus API error');
        }

        const data = await response.json();

        return NextResponse.json({
            payment_url: data.result.url,
            invoice_id: data.result.uuid,
            amount: data.result.amount,
        });
    } catch (error: any) {
        console.error('Cryptomus invoice error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
