import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover' as any, // Cast to any to avoid strict version mismatch if types are outdated/too new
    });
};

export async function POST(req: NextRequest) {
    try {
        const stripe = getStripe();

        // Fixed price for the service
        const PRICE_AMOUNT = 99700; // $997.00
        const PRODUCT_NAME = "YC Cold Email Growth Package";

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: PRODUCT_NAME,
                            description: "Complete cold email setup, leads, and execution for YC startups.",
                            images: ['https://zerobounceai.com/assets/yc-lead-gen-thumb.png'], // Placeholder or actual asset
                        },
                        unit_amount: PRICE_AMOUNT,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/yc-lead-gen?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/yc-lead-gen?payment=cancelled`,
            metadata: {
                service_type: 'yc_lead_gen',
            },
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error: any) {
        console.error('Stripe checkout error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
