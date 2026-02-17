'use client';

import Link from 'next/link';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import styles from './page.module.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function YCLeadGenPage() {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        console.log("Starting checkout process...");
        setLoading(true);
        try {
            console.log("Fetching checkout session...");
            const response = await fetch('/api/payment/stripe/create-service-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Checkout API error:", errorData);
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const { sessionId, url } = await response.json();
            console.log("Session ID received:", sessionId);

            if (url) {
                console.log("Redirecting to checkout URL:", url);
                window.location.href = url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (error) {
            console.error('Checkout flow error:', error);
            alert('Something went wrong. Please check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <div className="greenhead" style={{ marginBottom: '1.5rem' }}>For High-Ticket / funded YC Startups</div>
                <h1 className={styles.heroTitle}>
                    Turn Capital Into <span className="text-gradient">Revenue</span><br />
                    Predictably
                </h1>
                <p className={styles.heroSubtitle}>
                    You've raised the round. Now hit the aggressive growth targets. We build the outbound engine that fills your sales team's calendar with qualified enterprise leads.
                </p>

                <div style={{ margin: '2rem 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#191A23' }}>$997 <span style={{ fontSize: '1rem', fontWeight: 'normal', color: '#666' }}>/ one-time setup</span></div>
                    <p style={{ color: '#666', marginTop: '0.5rem' }}>Complete Cold Email Infrastructure + 1-Month Management</p>
                </div>

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
                        <h3 className={styles.featureTitle}>Enterprise-Grade Targeting</h3>
                        <p className={styles.featureText}>
                            Don't waste expensive rep time on bad data. We enrich and verify leads to ensure your team only speaks to decision-makers with budget.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>📈</div>
                        <h3 className={styles.featureTitle}>Predictable Pipeline</h3>
                        <p className={styles.featureText}>
                            Investors demand forecastable growth. Our system delivers a steady stream of qualified meetings to support your Series A/B metrics.
                        </p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🛡️</div>
                        <h3 className={styles.featureTitle}>Volume Without Risk</h3>
                        <p className={styles.featureText}>
                            Scale your outreach to thousands of prospects while protecting your primary domain's reputation. We handle the technical infrastructure.
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
                        Ready to Deploy Capital Efficiently?
                    </h2>
                    <p className={styles.ctaText} style={{ color: 'var(--black)' }}>
                        Join other funded YC companies who are automating their top-of-funnel to hit revenue milestones faster.
                    </p>
                    <div style={{ margin: '1.5rem 0', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#191A23' }}>$997</div>
                    </div>
                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Processing...' : 'Book Strategy Call / Pay Now'}
                    </button>
                </div>
            </section>
        </div>
    );
}
