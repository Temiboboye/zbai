import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import styles from '../email-verification-guide/page.module.css'

export const metadata: Metadata = {
    title: 'How to Clean Your Email List — Step-by-Step Guide (2026) | ZeroBounce AI',
    description: 'Learn how to clean your email list in 5 steps. Remove invalid, disposable, and risky emails to improve deliverability and protect your sender reputation.',
    openGraph: {
        title: 'How to Clean Your Email List — 2026 Guide',
        description: 'Step-by-step guide to email list cleaning. Remove bounces, spam traps, and inactive subscribers.',
        url: 'https://zerobounceai.com/blog/how-to-clean-email-list',
    },
    alternates: { canonical: 'https://zerobounceai.com/blog/how-to-clean-email-list' },
}

export default function CleanEmailListBlog() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'How to Clean Your Email List — Step-by-Step Guide (2026)',
            author: { '@type': 'Organization', name: 'ZeroBounce AI' },
            publisher: { '@type': 'Organization', name: 'ZeroBounce AI', logo: { '@type': 'ImageObject', url: 'https://zerobounceai.com/og-image.png' } },
            datePublished: '2026-03-20',
            dateModified: '2026-04-16',
            mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://zerobounceai.com/blog/how-to-clean-email-list' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://zerobounceai.com/blog/email-verification-guide' },
                { '@type': 'ListItem', position: 3, name: 'Clean Email List', item: 'https://zerobounceai.com/blog/how-to-clean-email-list' },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Clean Your Email List',
            step: [
                { '@type': 'HowToStep', name: 'Export your list', text: 'Export your email list from your ESP or CRM as a CSV file.' },
                { '@type': 'HowToStep', name: 'Run verification', text: 'Upload the CSV to an email verification tool like ZeroBounce AI.' },
                { '@type': 'HowToStep', name: 'Review results', text: 'Check the categorized results: valid, invalid, catch-all, disposable, role-based.' },
                { '@type': 'HowToStep', name: 'Remove bad emails', text: 'Delete invalid, disposable, and low-confidence catch-all addresses.' },
                { '@type': 'HowToStep', name: 'Re-import clean list', text: 'Import the cleaned list back into your ESP. Set up ongoing verification.' },
            ],
        },
    ]

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <article className={styles.article}>
                <div className={styles.container}>
                    <div className={styles.badge}>🧹 List Hygiene</div>
                    <h1>How to Clean Your Email List <span className="greenhead">— 5 Steps</span></h1>
                    <p className={styles.subtitle}>
                        Email lists degrade 25-30% per year. Here&apos;s exactly how to clean yours and protect your deliverability.
                    </p>
                    <div className={styles.meta}>
                        <span>Updated March 2026</span>
                        <span>•</span>
                        <span>8 min read</span>
                    </div>

                    <section className={styles.section}>
                        <h2>Why Clean Your Email List?</h2>
                        <p>
                            An unclean email list is a ticking time bomb. <strong>25-30% of email addresses become invalid every year</strong> as people change jobs, domains expire, and accounts get abandoned. Sending to these addresses causes bounces, which damage your sender reputation and reduce deliverability for everyone on your list.
                        </p>
                        <div className={styles.statsBanner}>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>25-30%</span>
                                <span>Lists degrade annually</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>&lt;2%</span>
                                <span>Target bounce rate</span>
                            </div>
                            <div className={styles.stat}>
                                <span className={styles.statNum}>40%</span>
                                <span>Better engagement after cleaning</span>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>Step 1: Export Your Email List</h2>
                        <p>
                            Export your subscriber list from your ESP (Mailchimp, SendGrid, HubSpot, etc.) as a CSV file. Include the email column and any segmentation data you want to preserve.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Step 2: Run AI-Powered Verification</h2>
                        <p>
                            Upload your CSV to <a href="/email-checker">ZeroBounce AI</a>. Our AI engine checks each address across multiple layers:
                        </p>
                        <div className={styles.callout}>
                            <h4>🤖 What AI Verification Checks</h4>
                            <p>
                                ✅ <strong>Syntax validation</strong> — catches typos and formatting errors<br />
                                ✅ <strong>MX record check</strong> — confirms the domain can receive email<br />
                                ✅ <strong>SMTP verification</strong> — confirms the mailbox exists<br />
                                ✅ <strong>Catch-all scoring</strong> — AI confidence for accept-all domains<br />
                                ✅ <strong>Disposable detection</strong> — flags temporary email services<br />
                                ✅ <strong>Spam trap identification</strong> — protects against blacklisting
                            </p>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>Step 3: Review Categorized Results</h2>
                        <p>Results are categorized into actionable groups:</p>
                        <div className={styles.industryGrid}>
                            <span className={styles.industryLink}>✅ <strong>Valid</strong> — Safe to email</span>
                            <span className={styles.industryLink}>❌ <strong>Invalid</strong> — Remove immediately</span>
                            <span className={styles.industryLink}>🎯 <strong>Catch-All 80+</strong> — Safe to email</span>
                            <span className={styles.industryLink}>⚠️ <strong>Catch-All &lt;50</strong> — Remove or risk</span>
                            <span className={styles.industryLink}>🗑️ <strong>Disposable</strong> — Remove</span>
                            <span className={styles.industryLink}>👤 <strong>Role-Based</strong> — Segment separately</span>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>Step 4: Remove Bad Emails</h2>
                        <p>
                            Delete all invalid, disposable, and low-confidence catch-all (score below 50) addresses. Move role-based emails (info@, sales@) to a separate segment with different messaging.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>Step 5: Re-Import &amp; Set Up Ongoing Cleaning</h2>
                        <p>
                            Import your cleaned list back into your ESP. Then set up ongoing protection:
                        </p>
                        <div className={styles.providerCards}>
                            <a href="/free-email-verification" className={styles.providerCard}>
                                <span className={styles.provIcon}>🔄</span>
                                <h3>Monthly Bulk Cleaning</h3>
                                <p>Re-verify your full list monthly to catch newly-invalid addresses.</p>
                                <span className={styles.link}>Start Free →</span>
                            </a>
                            <a href="/email-verifier" className={styles.providerCard}>
                                <span className={styles.provIcon}>⚡</span>
                                <h3>Real-Time API</h3>
                                <p>Verify at signup to prevent bad emails from entering your list.</p>
                                <span className={styles.link}>API Docs →</span>
                            </a>
                            <a href="/blog/reduce-email-bounce-rate" className={styles.providerCard}>
                                <span className={styles.provIcon}>📉</span>
                                <h3>Reduce Bounces</h3>
                                <p>7 strategies to keep your bounce rate permanently under 2%.</p>
                                <span className={styles.link}>Read Guide →</span>
                            </a>
                        </div>
                    </section>

                    <section className={styles.ctaSection}>
                        <div className={styles.ctaBox}>
                            <h2>Clean Your Email List Now</h2>
                            <p>Upload your list and get AI-verified results in minutes. 100 free verifications, no credit card.</p>
                            <div className={styles.ctaButtons}>
                                <a href="/signup" className="btn btn-primary">Clean My List Free</a>
                                <a href="/blog/email-deliverability-guide" className="btn btn-secondary">Deliverability Guide</a>
                            </div>
                        </div>
                    </section>
                </div>
            </article>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p>© 2026 ZeroBounce AI. All rights reserved. GDPR Compliant.</p>
                </div>
            </footer>
        </main>
    )
}
