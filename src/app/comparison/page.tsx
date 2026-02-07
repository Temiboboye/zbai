import Navbar from "@/components/Navbar";
import ComparisonTable from "@/components/ComparisonTable";
import styles from "./page.module.css";

export const metadata = {
    title: "ZeroBounce AI vs Competitors | Feature Comparison",
    description: "Compare ZeroBounce AI's AI-powered email verification against ZeroBounce, NeverBounce, Hunter.io, and Clearout. See why our confidence scoring and pattern recognition set us apart.",
};

export default function ComparisonPage() {
    return (
        <main className={styles.main}>
            <Navbar />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            <span>🏆</span> Industry Comparison
                        </div>
                        <h1>
                            See Why <span className="greenhead">AI Makes the Difference</span>
                        </h1>
                        <p>
                            We're not just another email verification tool. Our AI-powered platform
                            delivers features and accuracy that competitors simply can't match.
                        </p>
                    </div>
                </div>
            </section>

            <ComparisonTable />

            {/* Key Differentiators */}
            <section className={styles.differentiators}>
                <div className={styles.container}>
                    <h2>What Sets Us Apart</h2>
                    <div className={styles.diffGrid}>
                        <div className={styles.diffCard}>
                            <div className={styles.diffIcon}>🤖</div>
                            <h3>AI-Powered Intelligence</h3>
                            <p>
                                Our machine learning algorithms analyze patterns and provide confidence
                                scores (0-100) for catch-all domains. Competitors only give binary yes/no.
                            </p>
                        </div>

                        <div className={styles.diffCard}>
                            <div className={styles.diffIcon}>🎯</div>
                            <h3>98%+ Accuracy</h3>
                            <p>
                                Industry-leading accuracy rate compared to competitors' 92-95%.
                                Our AI learns from millions of verifications to get smarter over time.
                            </p>
                        </div>

                        <div className={styles.diffCard}>
                            <div className={styles.diffIcon}>🔍</div>
                            <h3>Email Pattern Recognition</h3>
                            <p>
                                Unique AI feature that suggests likely valid emails based on company
                                patterns. Find emails competitors miss.
                            </p>
                        </div>

                        <div className={styles.diffCard}>
                            <div className={styles.diffIcon}>🛡️</div>
                            <h3>Domain Reputation Scoring</h3>
                            <p>
                                Know which domains to trust with our proprietary reputation intelligence.
                                Identify risky domains before they hurt your sender score.
                            </p>
                        </div>

                        <div className={styles.diffCard}>
                            <div className={styles.diffIcon}>💰</div>
                            <h3>All-in-One Platform</h3>
                            <p>
                                Email verification + Email Finder + Bulk Sorter in one platform.
                                Competitors charge separately or don't offer these features at all.
                            </p>
                        </div>

                        <div className={styles.diffCard}>
                            <div className={styles.diffIcon}>⚡</div>
                            <h3>Real-Time Everything</h3>
                            <p>
                                Every feature available via API. Competitors gate API access or
                                charge extra for advanced features.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className={styles.testimonials}>
                <div className={styles.container}>
                    <h2>What Our Users Say</h2>
                    <div className={styles.testimonialGrid}>
                        <div className={styles.testimonialCard}>
                            <div className={styles.quote}>"</div>
                            <p>
                                The confidence scoring is a game-changer. We used to waste credits on
                                catch-all domains. Now we know exactly which ones are worth trying.
                            </p>
                            <div className={styles.author}>
                                <strong>Sarah M.</strong>
                                <span>Marketing Director, SaaS Company</span>
                            </div>
                        </div>

                        <div className={styles.testimonialCard}>
                            <div className={styles.quote}>"</div>
                            <p>
                                Switched from NeverBounce and immediately noticed better accuracy.
                                The AI pattern recognition found 340 emails we would have missed.
                            </p>
                            <div className={styles.author}>
                                <strong>James K.</strong>
                                <span>Lead Generation Specialist</span>
                            </div>
                        </div>

                        <div className={styles.testimonialCard}>
                            <div className={styles.quote}>"</div>
                            <p>
                                Finally, a verification tool that understands our needs as an agency.
                                The built-in email finder saves us $99/month on Hunter.io.
                            </p>
                            <div className={styles.author}>
                                <strong>Maria L.</strong>
                                <span>Agency Owner</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className={styles.finalCta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Ready to Make the Switch?</h2>
                        <p>
                            Join hundreds of businesses who've upgraded to AI-powered email verification.
                            Start with 49 free credits—no credit card required.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Start Free Trial</a>
                            <a href="/billing" className="btn btn-secondary">View Pricing</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ 49 Free Credits</span>
                            <span>✓ No Credit Card</span>
                            <span>✓ Cancel Anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p>© 2026 ZeroBounce AI. All rights reserved. GDPR Compliant.</p>
                </div>
            </footer>
        </main>
    );
}
