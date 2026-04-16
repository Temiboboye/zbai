import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { competitors, getCompetitorBySlug, getAllCompetitorSlugs } from '@/app/data/competitors'
import styles from '../../compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ tool: string }>
}

export async function generateStaticParams() {
    return getAllCompetitorSlugs().map((slug) => ({ tool: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { tool: slug } = await params
    const comp = getCompetitorBySlug(slug)
    if (!comp) return { title: 'Not Found' }

    return {
        title: `Best ${comp.name} Alternative (2026) — AI-Powered Email Verification | ZeroBounce AI`,
        description: `Looking for a ${comp.name} alternative? ZeroBounce AI offers 98%+ accuracy with AI confidence scoring, pattern recognition, and lower pricing. Switch in minutes.`,
        openGraph: {
            title: `Best ${comp.name} Alternative in 2026 — ZeroBounce AI`,
            description: `Upgrade from ${comp.name} to AI-powered email verification. Get confidence scoring, pattern recognition, and 98%+ accuracy.`,
            url: `https://zerobounceai.com/alternative-to/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/alternative-to/${slug}` },
    }
}

export default async function AlternativeToPage({ params }: PageProps) {
    const { tool: slug } = await params
    const comp = getCompetitorBySlug(slug)
    if (!comp) notFound()

    const otherCompetitors = competitors.filter(c => c.slug !== slug).slice(0, 6)

    const faqs = [
        {
            q: `What is the best alternative to ${comp.name}?`,
            a: `ZeroBounce AI is the best ${comp.name} alternative in 2026. It offers AI-powered catch-all confidence scoring (0-100), email pattern recognition, and domain reputation intelligence — features ${comp.name} doesn't offer. With 98.3%+ accuracy vs ${comp.name}'s ${comp.accuracy}, you get more actionable results.`,
        },
        {
            q: `Is ZeroBounce AI cheaper than ${comp.name}?`,
            a: `ZeroBounce AI offers competitive pricing starting at $0.005 per email, with all AI features included. ${comp.name}'s pricing starts at ${comp.pricing}. Unlike ${comp.name}, ZeroBounce AI bundles email verification, email finder, and AI confidence scoring into one platform.`,
        },
        {
            q: `How easy is it to switch from ${comp.name} to ZeroBounce AI?`,
            a: `Switching from ${comp.name} to ZeroBounce AI takes minutes. Simply sign up, upload your email list, and start verifying. Our REST API is compatible with most integrations. You get 100 free credits to test before committing.`,
        },
        {
            q: `Why are people switching from ${comp.name}?`,
            a: `People switch from ${comp.name} because it ${comp.cons[0].toLowerCase()}. ZeroBounce AI solves this with AI-powered features including catch-all confidence scoring, email pattern recognition, and domain reputation intelligence.`,
        },
    ]

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Alternatives', item: 'https://zerobounceai.com/comparison' },
                { '@type': 'ListItem', position: 3, name: `${comp.name} Alternative`, item: `https://zerobounceai.com/alternative-to/${slug}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ZeroBounce AI',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: `AI-powered email verification — the best ${comp.name} alternative with 98%+ accuracy and catch-all confidence scoring.`,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', description: '100 free verification credits' },
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', bestRating: '5', worstRating: '1', ratingCount: '847' },
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
                            <span>🔄</span> Best Alternative
                        </div>
                        <h1>
                            Looking for a <span className="greenhead">{comp.name} Alternative</span>?
                        </h1>
                        <p>
                            {comp.name} {comp.cons[0].toLowerCase()}. ZeroBounce AI delivers AI-powered email verification with
                            98%+ accuracy, catch-all confidence scoring, and pattern recognition — all at competitive pricing.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Try ZeroBounce AI Free</a>
                            <a href={`/compare/${slug}`} className="btn btn-secondary">See Full Comparison</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Switch */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent}>
                        <h2>Why People Switch from {comp.name}</h2>
                        <p className={styles.whySwitchText}>{comp.whySwitch}</p>

                        <div className={styles.prosConsGrid}>
                            <div className={styles.consCard}>
                                <h3>❌ {comp.name} Limitations</h3>
                                <ul>
                                    {comp.cons.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                            <div className={styles.prosCard}>
                                <h3>✅ ZeroBounce AI Advantages</h3>
                                <ul>
                                    <li>AI catch-all confidence scoring (0-100)</li>
                                    <li>Email pattern recognition</li>
                                    <li>Domain reputation intelligence</li>
                                    <li>98.3%+ accuracy</li>
                                    <li>Built-in email finder</li>
                                    <li>100 free credits to start</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Advantages */}
            <section className={styles.advantages}>
                <div className={styles.container}>
                    <h2>What You Get with ZeroBounce AI</h2>
                    <div className={styles.advantagesGrid}>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>🤖</div>
                            <h3>AI Confidence Scoring</h3>
                            <p>
                                Get a 0-100 confidence score for catch-all emails. {comp.name} gives you
                                binary results — we give you actionable intelligence.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>🔍</div>
                            <h3>Pattern Recognition</h3>
                            <p>
                                Our AI learns email patterns across companies and suggests likely
                                valid addresses. Find emails that {comp.name} misses.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>🛡️</div>
                            <h3>Domain Intelligence</h3>
                            <p>
                                Reputation scoring for domains helps you identify risky senders
                                before they damage your deliverability.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>💰</div>
                            <h3>Better Value</h3>
                            <p>
                                All AI features included with every plan. No separate subscriptions
                                for email finding, verification, and intelligence.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.faq}>
                <div className={styles.container}>
                    <h2>Frequently Asked Questions</h2>
                    <div className={styles.faqList}>
                        {faqs.map((faq, i) => (
                            <div key={i} className={styles.faqItem}>
                                <h4>{faq.q}</h4>
                                <p>{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Ready to Switch from {comp.name}?</h2>
                        <p>
                            Get 98%+ accuracy with AI-powered verification. 100 free credits, no credit card required.
                            Most users see better results on day one.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Start Free — No Credit Card</a>
                            <a href="/billing" className="btn btn-secondary">View Pricing</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ 100 Free Credits</span>
                            <span>✓ No Credit Card Required</span>
                            <span>✓ Switch in Minutes</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Other Email Verification Alternatives</h3>
                    <div className={styles.linksGrid}>
                        {otherCompetitors.map(c => (
                            <a key={c.slug} href={`/alternative-to/${c.slug}`}>
                                {c.name} Alternative
                            </a>
                        ))}
                    </div>
                    <h3 style={{ marginTop: '24px' }}>Detailed Comparisons</h3>
                    <div className={styles.linksGrid}>
                        {otherCompetitors.map(c => (
                            <a key={c.slug} href={`/compare/${c.slug}`}>
                                vs {c.name}
                            </a>
                        ))}
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
