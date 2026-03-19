import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import styles from '../email-checker/page.module.css'

export const metadata: Metadata = {
    title: 'Free Email Verification — Check Emails Free with AI | ZeroBounce AI',
    description: 'Verify email addresses for free with AI-powered accuracy. Get 100 free email verifications — no credit card required. Check Gmail, Outlook, Yahoo, and catch-all emails.',
    keywords: 'free email verification, verify email free, free email checker, free email validator, check email free',
    openGraph: {
        title: 'Free Email Verification — 100 Free Credits',
        description: 'Verify emails for free with 98%+ accuracy. 100 free credits, no credit card needed.',
        url: 'https://zerobounceai.com/free-email-verification',
    },
    alternates: { canonical: 'https://zerobounceai.com/free-email-verification' },
}

export default function FreeEmailVerificationPage() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ZeroBounce AI Free Email Verification',
            description: 'Free email verification tool powered by AI. Get 100 free verifications with no credit card required.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: '100 free verifications, no credit card required' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Free Email Verification', item: 'https://zerobounceai.com/free-email-verification' },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: 'Is there a completely free email verification tool?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. ZeroBounce AI offers 100 free email verifications with no credit card required. Sign up, verify emails immediately — no strings attached.' } },
                { '@type': 'Question', name: 'How many emails can I verify for free?', acceptedAnswer: { '@type': 'Answer', text: 'You get 100 free email verifications when you sign up. Each verification uses the same AI-powered analysis as paid plans — including catch-all confidence scoring.' } },
                { '@type': 'Question', name: 'Do I need a credit card for free verification?', acceptedAnswer: { '@type': 'Answer', text: 'No. ZeroBounce AI does not require a credit card for the free tier. Sign up with just your email address and start verifying immediately.' } },
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
                        <div className={styles.badge}>
                            <span>🎉</span> 100% Free — No Credit Card
                        </div>
                        <h1>
                            Free Email <span className="greenhead">Verification</span>
                        </h1>
                        <p>
                            Verify up to 100 email addresses completely free. Same AI-powered accuracy as paid plans — catch-all scoring, pattern recognition, and domain intelligence included.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Get 100 Free Credits</a>
                            <a href="/free-tools" className="btn btn-secondary">Try Without Signup</a>
                        </div>
                        <div className={styles.statsBar}>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>100</span>
                                <span className={styles.statLabel}>Free verifications</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>$0</span>
                                <span className={styles.statLabel}>No credit card</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>98.7%</span>
                                <span className={styles.statLabel}>Same AI accuracy</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>3 Steps to Free Email Verification</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>1</div>
                            <h3>Sign Up Free</h3>
                            <p>Create your account with just an email address. No credit card, no payment details, no commitment.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>2</div>
                            <h3>Verify Emails</h3>
                            <p>Check single emails or upload a list. Get AI-powered results with catch-all confidence scores.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>3</div>
                            <h3>Download Results</h3>
                            <p>Get clean, categorized results: valid, invalid, catch-all (with scores), disposable, and role-based.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.container}>
                    <h2>What&apos;s Included Free</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🎯</div>
                            <h3>Full AI Accuracy</h3>
                            <p>Free verifications use the same AI engine as paid plans — 98%+ accuracy, not a watered-down version.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🤖</div>
                            <h3>Catch-All Scoring</h3>
                            <p>AI confidence scores (0-100) for catch-all domains. Know exactly which &quot;unknown&quot; emails are safe to contact.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📦</div>
                            <h3>Bulk Upload</h3>
                            <p>Upload CSV files with multiple email addresses. Use your 100 credits however you want — single or bulk.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3>API Access</h3>
                            <p>Full API access with your free credits. Integrate verification into your app or workflow.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🗑️</div>
                            <h3>Disposable Detection</h3>
                            <p>Identify temporary and throwaway emails from 100+ disposable providers.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔍</div>
                            <h3>Email Finder</h3>
                            <p>Find email addresses by name and domain. Your free credits work for finding and verifying.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.useCases}>
                <div className={styles.container}>
                    <h2>Free Alternatives Comparison</h2>
                    <p>See how ZeroBounce AI&apos;s free tier compares to competitors:</p>
                    <div className={styles.useCaseGrid}>
                        <a href="/compare/hunter-io" className={styles.useCaseCard}>🔍 <strong>vs Hunter.io</strong> — 25 free searches/mo</a>
                        <a href="/compare/neverbounce" className={styles.useCaseCard}>⚡ <strong>vs NeverBounce</strong> — 1,000 free credits</a>
                        <a href="/compare/clearout" className={styles.useCaseCard}>🎯 <strong>vs Clearout</strong> — 100 free credits</a>
                        <a href="/compare/emailable" className={styles.useCaseCard}>✉️ <strong>vs Emailable</strong> — 250 free credits</a>
                        <a href="/compare/debounce" className={styles.useCaseCard}>💨 <strong>vs DeBounce</strong> — 100 free credits</a>
                        <a href="/compare/kickbox" className={styles.useCaseCard}>🏢 <strong>vs Kickbox</strong> — 100 free credits</a>
                    </div>
                </div>
            </section>

            <section className={styles.faq}>
                <div className={styles.container}>
                    <h2>Free Verification FAQ</h2>
                    <div className={styles.faqList}>
                        <div className={styles.faqItem}>
                            <h4>Is this really free?</h4>
                            <p>Yes. 100 email verifications are completely free with no credit card required. We offer the free tier so you can test our AI-powered accuracy before committing to a paid plan.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Is the free version as accurate as paid?</h4>
                            <p>Yes. Free verifications use the exact same AI engine, catch-all confidence scoring, and pattern recognition as paid plans. There&apos;s no accuracy difference.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>What happens after I use all 100 credits?</h4>
                            <p>You can continue using our free tools (syntax check, disposable detection, format lookup) without credits. For more verifications, plans start at $0.005 per email.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Can I use the API with free credits?</h4>
                            <p>Yes. Your 100 free credits work with both the web interface and the REST API. Same endpoints, same accuracy, same results.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Start Verifying Emails Free</h2>
                        <p>100 free verifications. No credit card. No commitment. Full AI accuracy.</p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Get Free Credits Now</a>
                            <a href="/free-tools" className="btn btn-secondary">Try Without Signup</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ 100 Free Credits</span>
                            <span>✓ No Credit Card</span>
                            <span>✓ Full AI Features</span>
                            <span>✓ GDPR Compliant</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Related Pages</h3>
                    <div className={styles.linksGrid}>
                        <a href="/email-checker">Email Checker</a>
                        <a href="/email-verifier">Email Verifier</a>
                        <a href="/free-tools">Free Tools</a>
                        <a href="/blog/email-verification-guide">Verification Guide</a>
                        <a href="/blog/reduce-email-bounce-rate">Reduce Bounces</a>
                        <a href="/comparison">Compare Tools</a>
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
