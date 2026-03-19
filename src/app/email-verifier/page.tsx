import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import styles from '../email-checker/page.module.css'

export const metadata: Metadata = {
    title: 'Email Verifier — AI-Powered Email Verification Tool | ZeroBounce AI',
    description: 'Verify email addresses with 98%+ accuracy using AI. Our email verifier checks syntax, MX records, SMTP, catch-all domains, and disposable emails. 100 free verifications.',
    keywords: 'email verifier, verify email, email verification tool, check email address, email validator',
    openGraph: {
        title: 'Email Verifier — AI-Powered Email Verification',
        description: 'Verify any email address with AI-powered 98%+ accuracy. Catch-all confidence scoring, pattern recognition, and domain intelligence.',
        url: 'https://zerobounceai.com/email-verifier',
    },
    alternates: { canonical: 'https://zerobounceai.com/email-verifier' },
}

export default function EmailVerifierPage() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ZeroBounce AI Email Verifier',
            description: 'AI-powered email verifier with 98%+ accuracy. Verifies email addresses using SMTP, MX records, AI pattern recognition, and catch-all confidence scoring.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: '100 free email verifications' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', ratingCount: '847' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Email Verifier', item: 'https://zerobounceai.com/email-verifier' },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: 'What is an email verifier?', acceptedAnswer: { '@type': 'Answer', text: 'An email verifier is a tool that checks whether an email address exists, is deliverable, and is safe to send to. It validates syntax, DNS records, SMTP responses, and uses AI to score catch-all domains.' } },
                { '@type': 'Question', name: 'How accurate is email verification?', acceptedAnswer: { '@type': 'Answer', text: 'ZeroBounce AI achieves 98.3%+ accuracy on standard domains and uses AI confidence scoring (0-100) for catch-all domains. Gmail verification is 99.2% accurate.' } },
                { '@type': 'Question', name: 'Can I verify emails without sending?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Email verification does not send any email to the address being checked. It connects to the mail server at the protocol level to confirm the mailbox exists without delivering a message.' } },
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
                            <span>🔍</span> Email Verifier
                        </div>
                        <h1>
                            Verify Emails with <span className="greenhead">AI Precision</span>
                        </h1>
                        <p>
                            Our email verifier goes beyond basic SMTP checks. AI-powered verification delivers 98%+ accuracy with confidence scoring for catch-all domains — no more &quot;unknown&quot; results.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/free-tools" className="btn btn-primary">Verify Email Free</a>
                            <a href="/signup" className="btn btn-secondary">Get 100 Free Credits</a>
                        </div>
                        <div className={styles.statsBar}>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>98.3%</span>
                                <span className={styles.statLabel}>Verification accuracy</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>12M+</span>
                                <span className={styles.statLabel}>Verified this month</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>&lt;2s</span>
                                <span className={styles.statLabel}>Verification speed</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>How Email Verification Works</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>📝</div>
                            <h3>Syntax Check</h3>
                            <p>Validates email format, local part rules, and domain structure.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>🌐</div>
                            <h3>DNS &amp; MX Lookup</h3>
                            <p>Confirms the domain exists and has valid mail exchange records.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>📡</div>
                            <h3>SMTP Verification</h3>
                            <p>Connects to the mail server to confirm the specific mailbox exists.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepIcon}>🤖</div>
                            <h3>AI Analysis</h3>
                            <p>Catch-all scoring, pattern recognition, and domain reputation intelligence.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.container}>
                    <h2>Why Choose Our Email Verifier</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🎯</div>
                            <h3>Catch-All Confidence Scoring</h3>
                            <p>Get a 0-100 probability score for catch-all emails instead of useless &quot;unknown&quot; results. Scores above 80 are safe to email.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🧠</div>
                            <h3>AI Pattern Recognition</h3>
                            <p>Our AI learns email patterns across companies and predicts likely valid addresses even on difficult domains.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🛡️</div>
                            <h3>Domain Reputation</h3>
                            <p>Trust scoring for email domains helps you identify risky senders before they damage your deliverability.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h3>Real-Time API</h3>
                            <p>Verify emails at the point of collection with our REST API. Sub-2-second response times for signup forms.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>📦</div>
                            <h3>Bulk Verification</h3>
                            <p>Upload CSV files and verify thousands of emails at once. Download clean, categorized results.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🔍</div>
                            <h3>Built-in Email Finder</h3>
                            <p>Find and verify emails in one platform. No separate subscriptions needed.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.useCases}>
                <div className={styles.container}>
                    <h2>Verify Emails by Provider</h2>
                    <p>Provider-specific verification strategies for maximum accuracy:</p>
                    <div className={styles.useCaseGrid}>
                        <a href="/verify/gmail" className={styles.useCaseCard}>📧 <strong>Gmail Verifier</strong> — 99.2% accuracy</a>
                        <a href="/verify/outlook" className={styles.useCaseCard}>📬 <strong>Outlook Verifier</strong> — catch-all scoring</a>
                        <a href="/verify/yahoo" className={styles.useCaseCard}>📮 <strong>Yahoo Verifier</strong> — 98.5% accuracy</a>
                        <a href="/verify/icloud" className={styles.useCaseCard}>☁️ <strong>iCloud Verifier</strong> — privacy handling</a>
                        <a href="/verify/protonmail" className={styles.useCaseCard}>🔐 <strong>ProtonMail Verifier</strong> — AI pattern analysis</a>
                        <a href="/verify/zoho" className={styles.useCaseCard}>🏢 <strong>Zoho Verifier</strong> — SMB domain handling</a>
                    </div>
                </div>
            </section>

            <section className={styles.faq}>
                <div className={styles.container}>
                    <h2>Email Verifier FAQ</h2>
                    <div className={styles.faqList}>
                        <div className={styles.faqItem}>
                            <h4>What is an email verifier?</h4>
                            <p>An email verifier is a tool that checks whether an email address exists, is deliverable, and is safe to send to. It validates syntax, DNS records, SMTP responses, and uses AI to score catch-all domains — all without sending any actual email.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>How accurate is ZeroBounce AI&apos;s email verifier?</h4>
                            <p>ZeroBounce AI achieves 98.3%+ accuracy on standard domains. For Gmail, accuracy is 99.2%. For catch-all domains (~30% of business emails), our AI confidence scoring provides a 0-100 probability score instead of &quot;unknown.&quot;</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Can I verify emails without sending a message?</h4>
                            <p>Yes. Email verification connects to the mail server at the SMTP protocol level to confirm the mailbox exists. No email is ever sent to the address being verified.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>How is this different from other email verifiers?</h4>
                            <p>Most verifiers give you binary results (valid/invalid) and return &quot;unknown&quot; for catch-all domains. ZeroBounce AI adds AI confidence scoring, pattern recognition, and domain intelligence — turning &quot;unknowns&quot; into actionable data.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Verify Your First Email Free</h2>
                        <p>100 free verifications. No credit card required. AI-powered results in seconds.</p>
                        <div className={styles.ctaButtons}>
                            <a href="/free-tools" className="btn btn-primary">Verify Email Now</a>
                            <a href="/email-checker" className="btn btn-secondary">Try Email Checker</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ 100 Free Credits</span>
                            <span>✓ No Credit Card</span>
                            <span>✓ GDPR Compliant</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Related Tools &amp; Resources</h3>
                    <div className={styles.linksGrid}>
                        <a href="/email-checker">Email Checker</a>
                        <a href="/free-email-verification">Free Verification</a>
                        <a href="/free-tools">All Free Tools</a>
                        <a href="/blog/email-verification-guide">Complete Guide</a>
                        <a href="/blog/catch-all-email-verification">Catch-All Guide</a>
                        <a href="/blog/email-verification-b2b-sales">B2B Sales Guide</a>
                        <a href="/comparison">Compare Verifiers</a>
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
