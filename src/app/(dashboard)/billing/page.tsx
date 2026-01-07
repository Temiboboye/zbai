'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './page.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CreditPack {
    id: string;
    credits: number;
    price: number;
    per_credit: number;
    popular?: boolean;
}

const creditPacks: CreditPack[] = [
    { id: 'pack_5k', credits: 5000, price: 8, per_credit: 0.0016 },
    { id: 'pack_10k', credits: 10000, price: 12, per_credit: 0.0012 },
    { id: 'pack_25k', credits: 25000, price: 25, per_credit: 0.0010 },
    { id: 'pack_50k', credits: 50000, price: 40, per_credit: 0.0008, popular: true },
    { id: 'pack_100k', credits: 100000, price: 70, per_credit: 0.0007 },
    { id: 'pack_200k', credits: 200000, price: 120, per_credit: 0.0006 },
    { id: 'pack_500k', credits: 500000, price: 260, per_credit: 0.00052 },
    { id: 'pack_1m', credits: 1000000, price: 380, per_credit: 0.00038 },
];

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');

    const handlePurchase = async (pack: CreditPack) => {
        setLoading(pack.id);

        try {
            if (paymentMethod === 'stripe') {
                const response = await fetch('/api/payment/stripe/create-checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pack_id: pack.id,
                        credits: pack.credits,
                        amount: pack.price,
                    }),
                });

                if (!response.ok) throw new Error('Checkout failed');
                const { sessionId } = await response.json();
                const stripe = await stripePromise;
                if (!stripe) throw new Error('Stripe failed');
                await (stripe as any).redirectToCheckout({ sessionId });
            } else {
                const response = await fetch('/api/payment/crypto/create-invoice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        pack_id: pack.id,
                        credits: pack.credits,
                        amount: pack.price,
                    }),
                });
                const { payment_url } = await response.json();
                window.location.href = payment_url;
            }
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className={styles.container}>
            {/* Header Strategy */}
            <div className={styles.header}>
                <h1>Simple, Honest Email Verification Pricing</h1>
                <p>Enterprise-grade accuracy without inflated tiers, hidden rules, or forced overpaying.</p>
                <div className={styles.trustBadge}>
                    <span>🛡️ Fair pricing from day one</span>
                    <span>•</span>
                    <span>📈 Rewards as you grow</span>
                </div>
            </div>

            {/* Core Value Props */}
            <div className={styles.valueProps}>
                <div className={styles.valueItem}>✓ No "starter tax" for small lists</div>
                <div className={styles.valueItem}>✓ Same verification quality on every plan</div>
                <div className={styles.valueItem}>✓ Credits work for bulk & API</div>
                <div className={styles.valueItem}>✓ Pay only for what you verify</div>
            </div>

            {/* Payment Method Selector */}
            <div className={styles.paymentSelector}>
                <button
                    className={`${styles.methodBtn} ${paymentMethod === 'stripe' ? styles.activeMethod : ''}`}
                    onClick={() => setPaymentMethod('stripe')}
                >
                    💳 Card Payment
                </button>
                <button
                    className={`${styles.methodBtn} ${paymentMethod === 'crypto' ? styles.activeMethod : ''}`}
                    onClick={() => setPaymentMethod('crypto')}
                >
                    ₿ Crypto
                </button>
                <div className={styles.bonusBanner}>
                    🚀 <strong>Launch Special:</strong> Get 20% Bonus Credits on all packs today!
                </div>
            </div>

            {/* Pricing Table */}
            <div className={styles.pricingTable}>
                {creditPacks.map((pack) => (
                    <div key={pack.id} className={`${styles.pricingCard} ${pack.popular ? styles.popularCard : ''}`}>
                        {pack.popular && <div className={styles.bestValue}>Best Value</div>}

                        <div className={styles.cardHeader}>
                            <h3 className={styles.creditsAmount}>{pack.credits.toLocaleString()}</h3>
                            <span className={styles.creditsLabel}>Credits</span>
                        </div>

                        <div className={styles.cardPrice}>
                            <span className={styles.currency}>$</span>
                            <span className={styles.amount}>{pack.price}</span>
                        </div>

                        <div className={styles.perVerify}>
                            ${pack.per_credit.toFixed(5)} / email
                        </div>

                        <ul className={styles.featureList}>
                            <li>Includes <strong>{(pack.credits * 0.2).toLocaleString()}</strong> bonus credits</li>
                            <li>Never expire</li>
                            <li>Full report access</li>
                        </ul>

                        <button
                            className={`btn ${pack.popular ? 'btn-primary' : 'btn-outline'}`}
                            style={{ width: '100%' }}
                            onClick={() => handlePurchase(pack)}
                            disabled={!!loading}
                        >
                            {loading === pack.id ? 'Loading...' : 'Buy Now'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Enterprise / Volume Section */}
            <div className={styles.enterpriseSection}>
                <div className={styles.enterpriseContent}>
                    <h3>Need more than 1M credits?</h3>
                    <p>Talk to us for volume pricing built around your usage, not arbitrary tiers.</p>
                    <button className="btn btn-outline" style={{ marginTop: '16px' }}>Contact Sales</button>
                </div>
            </div>

            {/* Philosophy Section */}
            <div className={styles.philosophySection}>
                <h3>What You Get on Every Plan</h3>
                <div className={styles.philosophyGrid}>
                    <div className={styles.philItem}>
                        <h4>Full Verification Suite</h4>
                        <p>Syntax, MX, SMTP, Catch-all, Disposable, Role-based, and Spam-risk detection included.</p>
                    </div>
                    <div className={styles.philItem}>
                        <h4>No Hidden Limits</h4>
                        <p>No daily throttling. No feature gating. Small plans get the same speed and accuracy as enterprise.</p>
                    </div>
                    <div className={styles.philItem}>
                        <h4>Transparent & Fair</h4>
                        <p>1 credit = 1 verification. Catch-alls consume credits. No hidden multipliers or confusing rules.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
