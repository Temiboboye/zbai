import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { jobTitles, getJobTitleBySlug, getAllJobTitleSlugs } from '@/app/data/jobTitles'
import styles from '@/app/compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ jobTitle: string }>
}

export async function generateStaticParams() {
    return getAllJobTitleSlugs().map((slug) => ({ jobTitle: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { jobTitle: slug } = await params
    const job = getJobTitleBySlug(slug)
    if (!job) return { title: 'Not Found' }

    return {
        title: `How to Find and Verify a ${job.title}'s Email Address | ZeroBounce AI`,
        description: `Learn the most common email formats for a ${job.title}. See how to verify their email address without getting blacklisted.`,
        openGraph: {
            title: `Find & Verify ${job.title} Emails`,
            description: job.description,
            url: `https://zerobounceai.com/email-format-for/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/email-format-for/${slug}` },
    }
}

export default async function JobTitleEmailFormatPage({ params }: PageProps) {
    const { jobTitle: slug } = await params
    const job = getJobTitleBySlug(slug)
    if (!job) notFound()

    const others = jobTitles.filter(j => j.slug !== slug)

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Job Titles', item: 'https://zerobounceai.com/email-format' },
                { '@type': 'ListItem', position: 3, name: job.title, item: `https://zerobounceai.com/email-format-for/${slug}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `How to Find and Verify a ${job.title}'s Email`,
            description: job.description,
            author: { '@type': 'Organization', name: 'ZeroBounce AI' }
        }
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
                            <span>👔</span> Executive Email Discovery
                        </div>
                        <h1>
                            Find & Verify a <span className="greenhead">{job.title}&apos;s</span> Email
                        </h1>
                        <p>{job.description}</p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Start Finding Emails</a>
                            <a href="/pricing" className="btn btn-secondary">View Pricing</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Formats & Tips */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent}>
                        <h2>Common Email Formats for a {job.title}</h2>
                        <div className={styles.prosConsGrid}>
                            <div className={styles.prosCard}>
                                <h3>✅ Standard Patterns</h3>
                                <ul>
                                    {job.commonPatterns.map((pat, i) => (
                                        <li key={i}><strong>{pat}</strong>company.com</li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.consCard}>
                                <h3>⚠️ Verification Challenges</h3>
                                <ul>
                                    <li>Executive emails are often protected by strong spam filters.</li>
                                    <li>Guessing and bouncing damages your sender reputation.</li>
                                    <li>Many leaders use catch-all routing arrays to deflect cold outreach.</li>
                                </ul>
                            </div>
                        </div>

                        <h2 style={{ marginTop: '3rem' }}>Expert Tips for Contacting a {job.title}</h2>
                        <ul style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', listStyle: 'none', padding: 0 }}>
                            {job.tips.map((tip, i) => (
                                <li key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    💡 {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Don&apos;t risk guessing executive emails.</h2>
                        <p>
                            Verify their address with 98%+ accuracy before you hit send. ZeroBounce AI gives you the confidence to do cold outreach properly.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Get 100 Free Credits</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Find Email Formats for Other Roles</h3>
                    <div className={styles.linksGrid} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {others.map(o => (
                            <a key={o.slug} href={`/email-format-for/${o.slug}`}>
                                {o.title}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Cross-Template Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Related Resources</h3>
                    <div className={styles.linksGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                        <a href="/email-lookup/google.com">🔎 Google Email Lookup</a>
                        <a href="/email-lookup/microsoft.com">🔎 Microsoft Email Lookup</a>
                        <a href="/email-lookup/salesforce.com">🔎 Salesforce Email Lookup</a>
                        <a href="/email-format/google/sales">🏢 Google Sales Dept</a>
                        <a href="/email-format/microsoft/engineering">🏢 Microsoft Engineering Dept</a>
                        <a href="/email-format/apple/executive">🏢 Apple Executive Dept</a>
                        <a href="/glossary/sender-reputation">📖 What is Sender Reputation?</a>
                        <a href="/glossary/spam-trap">📖 What is a Spam Trap?</a>
                        <a href="/glossary/catch-all-email">📖 What is Catch-All Email?</a>
                        <a href="/free-tools/email-bounce-checker">🔧 Bounce Checker Tool</a>
                        <a href="/free-tools/catch-all-checker">🔧 Catch-All Checker Tool</a>
                        <a href="/verify-email/gmail">⚡ Gmail API Example</a>
                        <a href="/verify-email/microsoft-365">⚡ M365 API Example</a>
                        <a href="/email-verification-for/cold-email">📧 Cold Email Verification</a>
                        <a href="/pricing/vs/hunter-io">💸 vs Hunter.io Pricing</a>
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
