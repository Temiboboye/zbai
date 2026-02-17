'use client';

import Link from 'next/link';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './page.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function YCLeadGenPage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/payment/stripe/create-service-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const { sessionId } = await response.json();
            const stripe = await stripePromise;

            if (stripe) {
                const { error } = await (stripe as any).redirectToCheckout({ sessionId });
                if (error) {
                    console.error('Stripe error:', error);
                    alert('Payment failed. Please try again.');
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className="greenhead" style={{ marginBottom: '1.5rem' }}>For YC Batches & Alumni</div>
                <h1 className={styles.heroTitle}>
                    Scale Your <span className="text-gradient">Outbound</span><br />
                    Before Demo Day
                </h1>
                <p className={styles.heroSubtitle}>
                    Stop wasting hours on manual prospecting. We help YC startups identify high-intent leads and automate outreach that actually converts.
                </p>
                <div className={styles.ctaContainer}>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="btn btn-green"
                    >
                        {loading ? 'Processing...' : 'Get Started Now'}
                    </button>
                    <Link href="#how-it-works" className="btn btn-outline">
                        How it works
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className={styles.featuresSection} id="features">
                <h2 className={styles.sectionTitle}>Why Top YC Companies Trust Us</h2>
                <div className={styles.grid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🎯</div>
                        <h3 className={styles.featureTitle}>Precision Targeting</h3>
                        <p className={styles.featureText}>
                            We don't just scrape lists. We identify decision-makers who are actively looking for solutions like yours right now.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>⚡</div>
                        <h3 className={styles.featureTitle}>Instant Traction</h3>
                        <p className={styles.featureText}>
                            Ideal for hitting those weekly growth targets. Start seeing meetings booked within your first week of engagement.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🛡️</div>
                        <h3 className={styles.featureTitle}>Deliverability Guard</h3>
                        <p className={styles.featureText}>
                            We handle the domains, warming, and technical setup so your main domain never risks getting blacklisted.
                        </p>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className={styles.stepsSection} id="how-it-works">
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h2 className={styles.sectionTitle}>The Process</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>01</span>
                            <div className={styles.stepContent}>
                                <h3 className={styles.featureTitle}>Define ICP</h3>
                                <p className={styles.featureText}>
                                    We work with you to pinpoint exactly who your perfect customer is based on your current best users.
                                </p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>02</span>
                            <div className={styles.stepContent}>
                                <h3 className={styles.featureTitle}>Build & Enrich</h3>
                                <p className={styles.featureText}>
                                    Our improved engine scours 20+ data sources to find verified emails and phone numbers for your prospects.
                                </p>
                            </div>
                        </div>
                        <div className={styles.step}>
                            <span className={styles.stepNumber}>03</span>
                            <div className={styles.stepContent}>
                                <h3 className={styles.featureTitle}>Launch & Scale</h3>
                                <p className={styles.featureText}>
                                    We launch the campaigns. You receive the meetings. We iterate weekly to improve conversion rates.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaCard}>
                    <h2 className={styles.ctaTitle} style={{ color: 'var(--black)' }}>
                        Ready to Accelerate?
                    </h2>
                    <p className={styles.ctaText} style={{ color: 'var(--black)' }}>
                        Join other fast-growing YC startups who are automating their outbound sales with us.
                    </p>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Processing...' : 'Book a Strategy Call / Pay Now'}
                    </button>
                </div>
            </section>
        </div>
    );
}
