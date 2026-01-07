import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    });
};

export async function POST(req: NextRequest) {
    try {
        const { pack_id, credits, amount } = await req.json();

        // Create Stripe checkout session
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `${pack_id.charAt(0).toUpperCase() + pack_id.slice(1)} Pack`,
                            description: `${credits.toLocaleString()} verification credits`,
                            images: ['https://your-domain.com/logo.png'],
                        },
                        unit_amount: amount * 100, // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/billing?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/billing?payment=cancelled`,
            metadata: {
                pack_id,
                credits: credits.toString(),
                user_id: 'user_123', // Replace with actual user ID from session
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
