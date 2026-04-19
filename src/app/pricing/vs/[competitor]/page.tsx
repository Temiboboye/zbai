import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { pricingVs, getPricingVsBySlug, getAllPricingVsSlugs } from '@/app/data/pricingVs'
import styles from '@/app/compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ competitor: string }>
}

export async function generateStaticParams() {
    return getAllPricingVsSlugs().map((slug) => ({ competitor: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { competitor: slug } = await params
    const pricing = getPricingVsBySlug(slug)
    if (!pricing) return { title: 'Not Found' }

    return {
        title: `${pricing.competitorName} Pricing vs ZeroBounce AI | Email Verification Cost Comparison`,
        description: `Compare ${pricing.competitorName} pricing against ZeroBounce AI. ${pricing.competitorName} starts at ${pricing.competitorPricingStartingAt}. See how much you can save with ZeroBounce AI.`,
        openGraph: {
            title: `${pricing.competitorName} Pricing vs ZeroBounce AI`,
            description: `A detailed cost comparison between ${pricing.competitorName} and ZeroBounce AI for bulk email verification.`,
            url: `https://zerobounceai.com/pricing/vs/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/pricing/vs/${slug}` },
    }
}

export default async function PricingVsPage({ params }: PageProps) {
    const { competitor: slug } = await params
    const pricing = getPricingVsBySlug(slug)
    if (!pricing) notFound()

    const others = pricingVs.filter(p => p.slug !== slug)

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Pricing Comparisons', item: 'https://zerobounceai.com/pricing' },
                { '@type': 'ListItem', position: 3, name: `vs ${pricing.competitorName}`, item: `https://zerobounceai.com/pricing/vs/${slug}` },
            ],
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
                            <span>💸</span> Pricing Comparison
                        </div>
                        <h1>
                            <span className="greenhead">{pricing.competitorName} Pricing</span> vs ZeroBounce AI
                        </h1>
                        <p>
                            Stop overpaying for email verification. Explore how {pricing.competitorName}&apos;s pricing models compare to ZeroBounce AI&apos;s AI-first approach. {pricing.savingsPercentage} difference.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Start Free — No Credit Card</a>
                            <a href="/pricing" className="btn btn-secondary">View ZeroBounce Pricing</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Table */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent}>
                        <h2>Direct Pricing Comparison</h2>
                        
                        <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
                            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', color: '#fff', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'rgba(255,255,255,0.1)', borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>Volume</th>
                                        <th style={{ padding: '1rem', fontWeight: 600 }}>{pricing.competitorName}</th>
                                        <th style={{ padding: '1rem', fontWeight: 600, color: '#00FFA3' }}>ZeroBounce AI</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>Starting At</td>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorPricingStartingAt}</td>
                                        <td style={{ padding: '1rem', color: '#00FFA3', fontWeight: 'bold' }}>{pricing.zerobounceAIStartingAt}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorPricingTier1.emails}</td>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorPricingTier1.price}</td>
                                        <td style={{ padding: '1rem', color: '#00FFA3', fontWeight: 'bold' }}>{pricing.zerobounceAIPricingTier1.price}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorPricingTier2.emails}</td>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorPricingTier2.price}</td>
                                        <td style={{ padding: '1rem', color: '#00FFA3', fontWeight: 'bold' }}>{pricing.zerobounceAIPricingTier2.price}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorPricingTier3.emails}</td>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorPricingTier3.price}</td>
                                        <td style={{ padding: '1rem', color: '#00FFA3', fontWeight: 'bold' }}>{pricing.zerobounceAIPricingTier3.price}</td>
                                    </tr>
                                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>Pricing Model</td>
                                        <td style={{ padding: '1rem' }}>{pricing.competitorModel}</td>
                                        <td style={{ padding: '1rem', color: '#00FFA3' }}>{pricing.zerobounceAIModel}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hidden Fees & Value Add */}
            <section className={styles.whySwitch} style={{ paddingTop: 0 }}>
                <div className={styles.container}>
                    <div className={styles.prosConsGrid}>
                        <div className={styles.consCard} style={{ gridColumn: '1 / -1' }}>
                            <h3>⚠️ The Hidden Cost of {pricing.competitorName}</h3>
                            <p>{pricing.hiddenFeesComparison}</p>
                        </div>
                        <div className={styles.prosCard} style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                            <h3>🚀 What you get for free with ZeroBounce AI</h3>
                            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                                {pricing.valueAdd.map((va, i) => (
                                    <li key={i}>{va}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Ready to Switch?</h2>
                        <p>
                            Take your budget further. Get premium AI verification for less than the cost of legacy verifiers.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Claim 100 Free Credits</a>
                            <a href={`/compare/${slug}`} className="btn btn-secondary">Read Full Feature Review</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Compare Other Competitors</h3>
                    <div className={styles.linksGrid} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {others.map(o => (
                            <a key={o.slug} href={`/pricing/vs/${o.slug}`}>
                                vs {o.competitorName} Pricing
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
                        <a href={`/alternative-to/${slug}`}>🔄 {pricing.competitorName} Alternative</a>
                        <a href={`/compare/${slug}`}>📊 Full {pricing.competitorName} Comparison</a>
                        <a href="/free-tools/email-bounce-checker">🔧 Free Bounce Checker</a>
                        <a href="/free-tools/catch-all-checker">🔧 Free Catch-All Checker</a>
                        <a href="/free-tools/dkim-validator">🔧 Free DKIM Validator</a>
                        <a href="/glossary/email-deliverability">📖 Email Deliverability</a>
                        <a href="/glossary/sender-reputation">📖 Sender Reputation</a>
                        <a href="/glossary/bounce-rate">📖 Bounce Rate</a>
                        <a href="/email-format-for/ceo">👔 CEO Email Format</a>
                        <a href="/email-format-for/vp-sales">👔 VP Sales Format</a>
                        <a href="/email-lookup/google.com">🔎 Google Email Lookup</a>
                        <a href="/email-lookup/microsoft.com">🔎 Microsoft Email Lookup</a>
                        <a href="/verify-email/gmail">⚡ Gmail Verification Example</a>
                        <a href="/email-verification-for/cold-email">📧 Cold Email Verification</a>
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
