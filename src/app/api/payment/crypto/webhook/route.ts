import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CRYPTOMUS_API_KEY = process.env.CRYPTOMUS_API_KEY || '';

function verifySignature(body: any, signature: string): boolean {
    const jsonData = JSON.stringify(body);
    const encoded = Buffer.from(jsonData).toString('base64');
    const expectedSign = crypto
        .createHmac('sha256', CRYPTOMUS_API_KEY)
        .update(encoded)
        .digest('hex');

    return expectedSign === signature;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const signature = req.headers.get('sign') || '';

        // Verify webhook signature
        if (!verifySignature(body, signature)) {
            console.error('Invalid webhook signature');
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 401 }
            );
        }

        const { status, order_id, amount, currency, additional_data } = body;

        // Handle payment status
        if (status === 'paid' || status === 'paid_over') {
            await handleSuccessfulPayment(body);
        } else if (status === 'cancel' || status === 'fail') {
            console.log(`Payment ${order_id} failed or cancelled`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Cryptomus webhook error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

async function handleSuccessfulPayment(paymentData: any) {
    try {
        const additionalData = JSON.parse(paymentData.additional_data || '{}');
        const { pack_id, credits, user_id } = additionalData;

        if (!credits || !user_id) {
            console.error('Missing data in payment');
            return;
        }

        // Call backend to add credits
        const response = await fetch(`${process.env.BACKEND_URL}/v1/credits/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id,
                credits: parseInt(credits),
                amount: parseFloat(paymentData.amount),
                transaction_id: paymentData.uuid,
                payment_method: 'crypto',
                pack_id,
                crypto_currency: paymentData.currency,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add credits');
        }

        console.log(`Added ${credits} credits to user ${user_id} via crypto payment`);
    } catch (error) {
        console.error('Error processing crypto payment:', error);
    }
}
