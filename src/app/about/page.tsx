import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import styles from '../email-checker/page.module.css'

export const metadata: Metadata = {
    title: 'About ZeroBounce AI — AI-Powered Email Verification Platform',
    description: 'ZeroBounce AI is an AI-powered email verification platform delivering 98%+ accuracy with catch-all confidence scoring, pattern recognition, and domain intelligence.',
    openGraph: {
        title: 'About ZeroBounce AI',
        description: 'AI-powered email verification with 98%+ accuracy. Learn about our mission and technology.',
        url: 'https://zerobounceai.com/about',
    },
    alternates: { canonical: 'https://zerobounceai.com/about' },
}

export default function AboutPage() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ZeroBounce AI',
            url: 'https://zerobounceai.com',
            logo: 'https://zerobounceai.com/og-image.png',
            description: 'AI-powered email verification platform with 98%+ accuracy, catch-all confidence scoring, and email pattern recognition.',
            sameAs: ['https://twitter.com/zerobounceai'],
            foundingDate: '2024',
            knowsAbout: [
                'Email Verification', 'Email Validation', 'Catch-All Detection',
                'Disposable Email Detection', 'Spam Trap Detection', 'Email Deliverability',
                'Sender Reputation', 'Email List Cleaning', 'SMTP Verification',
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'About', item: 'https://zerobounceai.com/about' },
            ],
        },
    ]

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.badge}><span>🤖</span> About Us</div>
                        <h1>AI That Knows Which <span className="greenhead">Emails to Trust</span></h1>
                        <p>
                            ZeroBounce AI is the only email verification platform that uses artificial intelligence to score catch-all domains, recognize email patterns, and analyze domain reputation — delivering 98%+ accuracy where traditional tools return &quot;unknown.&quot;
                        </p>
                    </div>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>What Makes Us Different</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>🧠</div>
                            <h3>AI Confidence Scoring</h3>
                            <p>~30% of business emails use catch-all domains. Instead of returning &quot;unknown,&quot; we give you a 0-100 probability score so you know exactly which emails to trust.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>🔍</div>
                            <h3>Pattern Recognition</h3>
                            <p>Our AI learns email naming conventions across companies. If a company uses firstname.lastname@, we can predict with high confidence whether john.doe@ exists.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>🛡️</div>
                            <h3>Domain Intelligence</h3>
                            <p>Trust scoring for email domains helps identify risky senders before they damage your deliverability. We factor domain age, configuration, and reputation into every check.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>⚡</div>
                            <h3>Built for Speed</h3>
                            <p>Sub-2-second verification via REST API. Verify emails at signup, during import, or in real-time CRM workflows without slowing down your users.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.container}>
                    <h2>What We Do</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>✉️</div>
                            <h3>Email Verification</h3>
                            <p>Verify any email address through syntax check, MX records, SMTP verification, and AI analysis. Single or bulk.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔎</div>
                            <h3>Email Finder</h3>
                            <p>Find professional email addresses by name and company domain. Verified and scored automatically.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🗑️</div>
                            <h3>Disposable Detection</h3>
                            <p>Identify temporary and throwaway emails from 100+ disposable providers before they pollute your list.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📊</div>
                            <h3>Email Format Lookup</h3>
                            <p>Look up email formats for 450+ companies. Know if Google uses firstname.lastname@ before you guess.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📦</div>
                            <h3>Bulk Verification</h3>
                            <p>Upload CSV files with thousands of emails. Download clean, categorized results in minutes.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔌</div>
                            <h3>REST API</h3>
                            <p>Full API access for custom integrations. Verify at point of collection in your signup forms, CRM, or tools.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.useCases}>
                <div className={styles.container}>
                    <h2>Trusted Across Industries</h2>
                    <p>Email verification for every use case:</p>
                    <div className={styles.useCaseGrid}>
                        <a href="/email-verification-for/saas" className={styles.useCaseCard}>💻 <strong>SaaS</strong> — Reduce churn from bad signups</a>
                        <a href="/email-verification-for/ecommerce" className={styles.useCaseCard}>🛒 <strong>E-Commerce</strong> — Protect transactional emails</a>
                        <a href="/email-verification-for/agencies" className={styles.useCaseCard}>🏢 <strong>Agencies</strong> — Client list verification</a>
                        <a href="/email-verification-for/recruiters" className={styles.useCaseCard}>👔 <strong>Recruiters</strong> — Reach candidates reliably</a>
                        <a href="/email-verification-for/real-estate" className={styles.useCaseCard}>🏠 <strong>Real Estate</strong> — Verify lead emails</a>
                        <a href="/email-verification-for/startups" className={styles.useCaseCard}>🚀 <strong>Startups</strong> — Scale outreach affordably</a>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Try ZeroBounce AI Free</h2>
                        <p>100 free verifications. No credit card. Experience AI-powered accuracy.</p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Get Free Credits</a>
                            <a href="/email-checker" className="btn btn-secondary">Check an Email</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ GDPR Compliant</span>
                            <span>✓ 98%+ Accuracy</span>
                            <span>✓ AI-Powered</span>
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
    )
}
