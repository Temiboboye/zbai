import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import styles from './page.module.css'

export const metadata: Metadata = {
    title: 'Free Email Checker — Verify Any Email Address Instantly | ZeroBounce AI',
    description: 'Check if any email address is valid, deliverable, and safe to send. Our AI-powered email checker verifies Gmail, Outlook, Yahoo, and catch-all emails with 98%+ accuracy.',
    keywords: 'email checker, check email, verify email address, email validation, is email valid, email address checker',
    openGraph: {
        title: 'Free Email Checker — Verify Any Email Instantly',
        description: 'AI-powered email checker with 98%+ accuracy. Check any email address for validity, deliverability, and risk.',
        url: 'https://zerobounceai.com/email-checker',
    },
    alternates: { canonical: 'https://zerobounceai.com/email-checker' },
}

export default function EmailCheckerPage() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ZeroBounce AI Email Checker',
            description: 'Free AI-powered email checker that verifies email addresses with 98%+ accuracy. Checks syntax, MX records, SMTP responses, and catch-all domains.',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: '100 free email checks' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', ratingCount: '847' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Email Checker', item: 'https://zerobounceai.com/email-checker' },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: 'How does an email checker work?', acceptedAnswer: { '@type': 'Answer', text: 'An email checker verifies addresses by checking syntax, DNS/MX records, and SMTP responses. ZeroBounce AI adds AI-powered analysis including catch-all confidence scoring, pattern recognition, and domain reputation intelligence for 98%+ accuracy.' } },
                { '@type': 'Question', name: 'Is ZeroBounce AI email checker free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! ZeroBounce AI offers 100 free email checks with no credit card required. Additional checks start at $0.005 per email.' } },
                { '@type': 'Question', name: 'Can I check bulk email lists?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. ZeroBounce AI supports bulk email checking — upload CSV files with thousands of emails and get results in minutes.' } },
                { '@type': 'Question', name: 'What is a catch-all email?', acceptedAnswer: { '@type': 'Answer', text: 'A catch-all email domain accepts all emails regardless of whether the mailbox exists. ZeroBounce AI uses AI confidence scoring (0-100) to predict validity on these domains instead of returning "unknown".' } },
            ],
        },
    ]

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            <span>✉️</span> Free Email Checker
                        </div>
                        <h1>
                            Check Any Email Address <span className="greenhead">Instantly</span>
                        </h1>
                        <p>
                            Verify if an email is valid, deliverable, and safe to send — powered by AI with 98%+ accuracy.
                            Works with Gmail, Outlook, Yahoo, catch-all domains, and 450+ providers.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/free-tools" className="btn btn-primary">Check Email Free</a>
                            <a href="/signup" className="btn btn-secondary">Get 100 Free Credits</a>
                        </div>
                        <div className={styles.statsBar}>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>98.7%</span>
                                <span className={styles.statLabel}>Accuracy</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>12M+</span>
                                <span className={styles.statLabel}>Emails checked this month</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>450+</span>
                                <span className={styles.statLabel}>Providers supported</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>0-100</span>
                                <span className={styles.statLabel}>AI confidence scores</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>How Our Email Checker Works</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>1</div>
                            <h3>Enter Email</h3>
                            <p>Type or paste any email address into our checker. Check single emails or upload bulk lists.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>2</div>
                            <h3>AI Verification</h3>
                            <p>Our AI checks syntax, MX records, SMTP responses, domain reputation, and runs pattern analysis.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>3</div>
                            <h3>Confidence Score</h3>
                            <p>Get a clear result: valid, invalid, or a 0-100 confidence score for catch-all domains.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>4</div>
                            <h3>Send Safely</h3>
                            <p>Email verified addresses with confidence. Protect your sender reputation and reduce bounces.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className={styles.features}>
                <div className={styles.container}>
                    <h2>What Our Email Checker Detects</h2>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>✅</div>
                            <h3>Valid Emails</h3>
                            <p>Confirmed deliverable mailboxes that will accept your email without bouncing.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>❌</div>
                            <h3>Invalid Emails</h3>
                            <p>Non-existent addresses, expired domains, and mailboxes that will hard bounce.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🎯</div>
                            <h3>Catch-All Scoring</h3>
                            <p>AI confidence scores (0-100) for catch-all domains instead of useless &quot;unknown&quot; results.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🗑️</div>
                            <h3>Disposable Emails</h3>
                            <p>Detect temporary and throwaway email addresses from 10MinuteMail, Guerrilla, and more.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>🛡️</div>
                            <h3>Spam Traps</h3>
                            <p>Identify honeypot addresses that can get your domain blacklisted if you email them.</p>
                        </div>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIcon}>👤</div>
                            <h3>Role-Based Emails</h3>
                            <p>Flag generic addresses like info@, support@, admin@ that have lower engagement rates.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Provider-specific checking */}
            <section className={styles.useCases}>
                <div className={styles.container}>
                    <h2>Check Emails Across All Providers</h2>
                    <p>Our email checker works with every major email provider:</p>
                    <div className={styles.useCaseGrid}>
                        <a href="/verify/gmail" className={styles.useCaseCard}>📧 <strong>Gmail Checker</strong> — 99.2% accuracy</a>
                        <a href="/verify/outlook" className={styles.useCaseCard}>📬 <strong>Outlook Checker</strong> — 96.8% accuracy</a>
                        <a href="/verify/yahoo" className={styles.useCaseCard}>📮 <strong>Yahoo Checker</strong> — 98.5% accuracy</a>
                        <a href="/verify/icloud" className={styles.useCaseCard}>☁️ <strong>iCloud Checker</strong> — 95.4% accuracy</a>
                        <a href="/verify/protonmail" className={styles.useCaseCard}>🔐 <strong>ProtonMail Checker</strong> — AI scoring</a>
                        <a href="/verify/zoho" className={styles.useCaseCard}>🏢 <strong>Zoho Checker</strong> — 96.1% accuracy</a>
                        <a href="/verify/custom-domain" className={styles.useCaseCard}>🌐 <strong>Custom Domains</strong> — catch-all scoring</a>
                        <a href="/verify/disposable" className={styles.useCaseCard}>🗑️ <strong>Disposable Detector</strong> — 99%+ detection</a>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.faq}>
                <div className={styles.container}>
                    <h2>Email Checker FAQ</h2>
                    <div className={styles.faqList}>
                        <div className={styles.faqItem}>
                            <h4>How does an email checker work?</h4>
                            <p>An email checker verifies addresses through multiple steps: syntax validation, DNS/MX record lookup, SMTP connection testing, and mailbox verification. ZeroBounce AI adds AI-powered analysis including catch-all confidence scoring, pattern recognition, and domain reputation intelligence for 98%+ accuracy.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Is this email checker free?</h4>
                            <p>Yes! ZeroBounce AI offers 100 free email checks with no credit card required. You can check single emails or upload small lists. For larger volumes, plans start at $0.005 per email.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Can I check email addresses in bulk?</h4>
                            <p>Absolutely. Upload CSV or TXT files with thousands of email addresses and get results in minutes. Our bulk email checker processes lists of any size with the same AI-powered accuracy.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>What makes ZeroBounce AI different from other email checkers?</h4>
                            <p>While most email checkers only do basic SMTP verification, ZeroBounce AI uses artificial intelligence to provide catch-all confidence scoring (0-100), email pattern recognition, and domain reputation analysis. This means actionable results instead of &quot;unknown&quot; for ~30% of business emails.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Check Your First Email Free</h2>
                        <p>100 free email checks. No credit card required. Results in seconds.</p>
                        <div className={styles.ctaButtons}>
                            <a href="/free-tools" className="btn btn-primary">Check Email Now</a>
                            <a href="/comparison" className="btn btn-secondary">Compare Tools</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ 100 Free Credits</span>
                            <span>✓ No Credit Card</span>
                            <span>✓ 98%+ Accuracy</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Related Tools &amp; Guides</h3>
                    <div className={styles.linksGrid}>
                        <a href="/email-verifier">Email Verifier</a>
                        <a href="/free-email-verification">Free Email Verification</a>
                        <a href="/free-tools">All Free Tools</a>
                        <a href="/blog/reduce-email-bounce-rate">Reduce Bounce Rate</a>
                        <a href="/blog/catch-all-email-verification">Catch-All Guide</a>
                        <a href="/comparison">Compare Checkers</a>
                        <a href="/blog/email-verification-guide">Complete Guide</a>
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
