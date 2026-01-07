import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const sig = req.headers.get('stripe-signature') || '';

        let event: Stripe.Event;

        try {
            const stripe = getStripe();
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        } catch (err: any) {
            console.error('Webhook signature verification failed:', err.message);
            return NextResponse.json(
                { error: 'Webhook signature verification failed' },
                { status: 400 }
            );
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object as Stripe.Checkout.Session;
                await handleSuccessfulPayment(session);
                break;

            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('PaymentIntent succeeded:', paymentIntent.id);
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                console.log('Payment failed:', failedPayment.id);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
    const { pack_id, credits, user_id } = session.metadata || {};

    if (!credits || !user_id) {
        console.error('Missing metadata in session');
        return;
    }

    // Call backend to add credits
    try {
        const response = await fetch(`${process.env.BACKEND_URL}/v1/credits/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id,
                credits: parseInt(credits),
                amount: session.amount_total! / 100,
                transaction_id: session.id,
                payment_method: 'stripe',
                pack_id,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to add credits');
        }

        console.log(`Added ${credits} credits to user ${user_id}`);
    } catch (error) {
        console.error('Error adding credits:', error);
    }
}
