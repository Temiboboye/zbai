import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { getIntegrationBySlug, getAllIntegrationSlugs, getAllIntegrations } from '@/app/data/integrations'
import styles from '@/app/email-checker/page.module.css'

export function generateStaticParams() {
    return getAllIntegrationSlugs().map(slug => ({ platform: slug }))
}

export function generateMetadata({ params }: { params: { platform: string } }): Metadata {
    const integration = getIntegrationBySlug(params.platform)
    if (!integration) return {}
    return {
        title: `Email Verification for ${integration.name} — AI-Powered Integration | ZeroBounce AI`,
        description: `Verify emails in ${integration.name} with 98%+ AI accuracy. ${integration.description}`,
        openGraph: {
            title: `Email Verification for ${integration.name}`,
            description: integration.description,
            url: `https://zerobounceai.com/integrations/${integration.slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/integrations/${integration.slug}` },
    }
}

export default function IntegrationPage({ params }: { params: { platform: string } }) {
    const integration = getIntegrationBySlug(params.platform)
    if (!integration) notFound()

    const allIntegrations = getAllIntegrations().filter(i => i.slug !== integration.slug)

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: `ZeroBounce AI for ${integration.name}`,
            description: integration.description,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Integrations', item: 'https://zerobounceai.com/integrations/hubspot' },
                { '@type': 'ListItem', position: 3, name: integration.name, item: `https://zerobounceai.com/integrations/${integration.slug}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: `How do I use email verification with ${integration.name}?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `Export your ${integration.name} contacts as a CSV file, upload to ZeroBounce AI for verification, then re-import the cleaned list. You can also use our REST API for real-time verification.`,
                    },
                },
                {
                    '@type': 'Question',
                    name: `Does ZeroBounce AI integrate directly with ${integration.name}?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `ZeroBounce AI works with ${integration.name} through CSV export/import and via our REST API. For automated workflows, you can connect through Zapier to verify emails automatically.`,
                    },
                },
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
                            <span>{integration.icon}</span> {integration.category}
                        </div>
                        <h1>
                            Email Verification for <span className="greenhead">{integration.name}</span>
                        </h1>
                        <p>{integration.description}</p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Verify Free — 100 Credits</a>
                            <a href="/email-checker" className="btn btn-secondary">Try Email Checker</a>
                        </div>
                        <div className={styles.statsBar}>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>98.3%</span>
                                <span className={styles.statLabel}>Verification accuracy</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>0-100</span>
                                <span className={styles.statLabel}>Catch-all scoring</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNum}>&lt;2s</span>
                                <span className={styles.statLabel}>API response time</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>How to Verify {integration.name} Emails</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>1</div>
                            <h3>Export from {integration.name}</h3>
                            <p>Export your contact list from {integration.name} as a CSV file with email addresses.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>2</div>
                            <h3>Upload to ZeroBounce AI</h3>
                            <p>Upload the CSV to our bulk verification tool. AI-powered analysis runs automatically.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>3</div>
                            <h3>Download Clean Results</h3>
                            <p>Get categorized results: valid, invalid, catch-all (scored), disposable, and role-based.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNum}>4</div>
                            <h3>Re-Import to {integration.name}</h3>
                            <p>Import the cleaned list back. Only verified, deliverable emails remain.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.features}>
                <div className={styles.container}>
                    <h2>Use Cases for {integration.name}</h2>
                    <div className={styles.featuresGrid}>
                        {integration.useCases.map((uc, i) => (
                            <div key={i} className={styles.featureCard}>
                                <div className={styles.featureIcon}>✅</div>
                                <h3>{uc.split(' ').slice(0, 4).join(' ')}</h3>
                                <p>{uc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.useCases}>
                <div className={styles.container}>
                    <h2>Benefits for {integration.name} Users</h2>
                    <p>Why {integration.name} users choose ZeroBounce AI:</p>
                    <div className={styles.useCaseGrid}>
                        {integration.benefits.map((b, i) => (
                            <div key={i} className={styles.useCaseCard}>
                                🎯 <strong>{b}</strong>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.faq}>
                <div className={styles.container}>
                    <h2>{integration.name} Integration FAQ</h2>
                    <div className={styles.faqList}>
                        <div className={styles.faqItem}>
                            <h4>How do I use email verification with {integration.name}?</h4>
                            <p>Export your {integration.name} contacts as a CSV file, upload to ZeroBounce AI for AI-powered verification, then re-import the cleaned list. For real-time verification, use our REST API or connect through Zapier.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>Does ZeroBounce AI integrate directly with {integration.name}?</h4>
                            <p>ZeroBounce AI works with {integration.name} through CSV export/import, our REST API, and Zapier automation. This gives you flexibility to verify emails in the way that fits your workflow.</p>
                        </div>
                        <div className={styles.faqItem}>
                            <h4>How much does email verification for {integration.name} cost?</h4>
                            <p>You get 100 free verifications with no credit card required. After that, plans start at $0.005 per email. Volume discounts are available for large {integration.name} databases.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Clean Your {integration.name} Contacts Today</h2>
                        <p>100 free verifications. No credit card. AI-powered accuracy for {integration.name} users.</p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Get Free Credits</a>
                            <a href="/free-tools" className="btn btn-secondary">Try Free Tools</a>
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
                    <h3>More Integrations</h3>
                    <div className={styles.linksGrid}>
                        {allIntegrations.slice(0, 8).map(i => (
                            <a key={i.slug} href={`/integrations/${i.slug}`}>
                                {i.icon} {i.name}
                            </a>
                        ))}
                        <a href="/email-checker">Email Checker</a>
                        <a href="/email-verifier">Email Verifier</a>
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
