'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import styles from './page.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CreditPack {
    id: string;
    name: string;
    credits: number;
    price: number;
    originalPrice?: number;
    per_credit: number;
    popular?: boolean;
    features: string[];
    finderSearches?: number;
    apiLimit?: string;
    support?: string;
    validity?: string;
}

const FOUNDING_MEMBER_DISCOUNT = 0.30; // 30% off

const creditPacks: CreditPack[] = [
    {
        id: 'pack_1k',
        name: 'Starter',
        credits: 1000,
        price: 8.40,
        originalPrice: 12,
        per_credit: 0.0084,
        features: [
            'Full verification suite',
            'API access (500 req/day)',
            'Basic reporting',
            'Email support'
        ],
        apiLimit: '500 requests/day',
        support: 'Email support',
        validity: '6 months'
    },
    {
        id: 'pack_10k',
        name: 'Professional',
        credits: 10000,
        price: 55.30,
        originalPrice: 79,
        per_credit: 0.00553,
        popular: true,
        features: [
            'Everything in Starter',
            'Email Finder (500 searches)',
            'Advanced reporting & analytics',
            'Catch-all confidence scoring',
            'Priority email support'
        ],
        finderSearches: 500,
        apiLimit: '5,000 requests/day',
        support: 'Priority email',
        validity: '12 months'
    },
    {
        id: 'pack_50k',
        name: 'Business',
        credits: 50000,
        price: 209.30,
        originalPrice: 299,
        per_credit: 0.00419,
        features: [
            'Everything in Professional',
            'Email Finder (2,500 searches)',
            'Bulk verification (unlimited)',
            'Email pattern suggestions',
            'Domain reputation scoring',
            'Dedicated account manager'
        ],
        finderSearches: 2500,
        apiLimit: '25,000 requests/day',
        support: 'Dedicated manager',
        validity: '12 months'
    },
    {
        id: 'pack_250k',
        name: 'Enterprise',
        credits: 250000,
        price: 839.30,
        originalPrice: 1199,
        per_credit: 0.00336,
        features: [
            'Everything in Business',
            'Email Finder (15,000 searches)',
            'Custom integrations',
            'White-label options',
            'Unlimited API requests',
            '99.9% SLA',
            'Phone + email support'
        ],
        finderSearches: 15000,
        apiLimit: 'Unlimited',
        support: 'Phone + email',
        validity: '24 months'
    },
    {
        id: 'pack_1m',
        name: 'Volume',
        credits: 1000000,
        price: 2799.30,
        originalPrice: 3999,
        per_credit: 0.0028,
        features: [
            'Everything in Enterprise',
            'Email Finder (75,000 searches)',
            'Dedicated infrastructure',
            'Custom contract terms',
            'Credits never expire',
            'White-glove onboarding'
        ],
        finderSearches: 75000,
        apiLimit: 'Unlimited',
        support: 'Dedicated team',
        validity: 'Never expires'
    },
];

interface Transaction {
    id: number;
    type: string;
    amount: number;
    currency_amount: number;
    description: string;
    status: string;
    reference_id: string;
    timestamp: string;
}

export default function BillingPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');
    const { token } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        if (token) {
            fetch('/api/payment/history', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) setTransactions(data);
                })
                .catch(err => console.error(err));
        }
    }, [token]);

    const handlePurchase = async (pack: CreditPack) => {
        setLoading(pack.id);

        try {
            if (paymentMethod === 'stripe') {
                const response = await fetch('/api/payment/stripe/create-checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        pack_id: pack.id,
                        credits: pack.credits,
                        amount: pack.price,
                    }),
                });

                if (!response.ok) throw new Error('Checkout failed');
                const { url } = await response.json();
                if (url) {
                    window.location.href = url;
                } else {
                    throw new Error('No checkout URL received');
                }
            } else {
                const response = await fetch('/api/payment/crypto/create-invoice', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
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
            {/* Founding Member Banner */}
            <div className={styles.foundingBanner}>
                <span className={styles.foundingIcon}>🎉</span>
                <div className={styles.foundingText}>
                    <strong>Founding Member Pricing:</strong> Lock in 30% off forever! Limited time offer.
                </div>
            </div>

            {/* Header Strategy */}
            <div className={styles.header}>
                <h1>AI-Powered Email Intelligence</h1>
                <p>Enterprise-grade verification with catch-all confidence scoring, email pattern recognition, and domain reputation intelligence. More accurate than basic SMTP checks.</p>
                <div className={styles.trustBadge}>
                    <span>🤖 AI-Enhanced Verification</span>
                    <span>•</span>
                    <span>📊 98%+ Accuracy</span>
                    <span>•</span>
                    <span>🔍 Email Finder Included</span>
                </div>
            </div>

            {/* Core Value Props */}
            <div className={styles.valueProps}>
                <div className={styles.valueItem}>✓ Catch-all confidence scoring (0-100)</div>
                <div className={styles.valueItem}>✓ AI email pattern recognition</div>
                <div className={styles.valueItem}>✓ Domain reputation intelligence</div>
                <div className={styles.valueItem}>✓ Real-time email finder</div>
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
                    ⏰ <strong>Limited Time:</strong> Founding Member pricing ends soon. Lock in 30% off forever!
                </div>
            </div>

            {/* Pricing Table */}
            <div className={styles.pricingTable}>
                {creditPacks.map((pack) => (
                    <div key={pack.id} className={`${styles.pricingCard} ${pack.popular ? styles.popularCard : ''}`}>
                        {pack.popular && <div className={styles.bestValue}>Most Popular</div>}

                        <div className={styles.tierName}>{pack.name}</div>

                        <div className={styles.cardHeader}>
                            <h3 className={styles.creditsAmount}>{pack.credits.toLocaleString()}</h3>
                            <span className={styles.creditsLabel}>Credits</span>
                        </div>

                        <div className={styles.cardPrice}>
                            {pack.originalPrice && (
                                <div className={styles.originalPrice}>
                                    <span className={styles.strikethrough}>${pack.originalPrice}</span>
                                    <span className={styles.discountBadge}>-30%</span>
                                </div>
                            )}
                            <div>
                                <span className={styles.currency}>$</span>
                                <span className={styles.amount}>{pack.price}</span>
                            </div>
                        </div>

                        <div className={styles.perVerify}>
                            ${pack.per_credit.toFixed(5)} / email
                        </div>

                        <ul className={styles.featureList}>
                            {pack.features.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                            ))}
                            <li>Credits valid: {pack.validity}</li>
                        </ul>

                        <button
                            className={`btn ${pack.popular ? 'btn-primary' : 'btn-outline'}`}
                            style={{ width: '100%' }}
                            onClick={() => handlePurchase(pack)}
                            disabled={!!loading}
                        >
                            {loading === pack.id ? 'Loading...' : 'Get Started'}
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

            {/* Transaction History */}
            <div className={styles.enterpriceSection} style={{ marginTop: '4rem', background: 'transparent', boxShadow: 'none' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--white)' }}>Transaction History</h3>
                <div style={{ overflowX: 'auto', background: 'var(--gray-900)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--gray-800)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--gray-800)' }}>
                                <th style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Date</th>
                                <th style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Description</th>
                                <th style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Type</th>
                                <th style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Credits</th>
                                <th style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Amount</th>
                                <th style={{ padding: '1rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>
                                        No transactions found
                                    </td>
                                </tr>
                            ) : transactions.map(tx => (
                                <tr key={tx.id} style={{ borderBottom: '1px solid var(--gray-800)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--white)' }}>{new Date(tx.timestamp).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--white)' }}>{tx.description}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            textTransform: 'capitalize',
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            background: tx.type === 'credit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                            color: tx.type === 'credit' ? 'var(--green)' : '#ef4444',
                                            fontSize: '0.75rem',
                                            fontWeight: '600'
                                        }}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', fontWeight: '600', fontSize: '0.9rem', color: tx.type === 'debit' ? '#ef4444' : 'var(--green)' }}>
                                        {tx.type === 'debit' ? '-' : '+'}{tx.amount.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--white)' }}>
                                        {tx.currency_amount && tx.currency_amount > 0 ? `$${tx.currency_amount}` : '-'}
                                    </td>
                                    <td style={{ padding: '1rem', fontSize: '0.9rem', color: 'var(--white)' }}>
                                        {tx.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
