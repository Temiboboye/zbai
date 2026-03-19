import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { competitors, getCompetitorBySlug, getAllCompetitorSlugs } from '@/app/data/competitors'
import styles from './page.module.css'

interface PageProps {
    params: Promise<{ competitor: string }>
}

export async function generateStaticParams() {
    return getAllCompetitorSlugs().map((slug) => ({ competitor: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { competitor: slug } = await params
    const comp = getCompetitorBySlug(slug)
    if (!comp) return { title: 'Comparison Not Found' }

    return {
        title: `ZeroBounce AI vs ${comp.name} — Feature Comparison & Review (2026)`,
        description: `Compare ZeroBounce AI vs ${comp.name}. See side-by-side feature comparison, pricing, accuracy, and why businesses switch to AI-powered email verification.`,
        openGraph: {
            title: `ZeroBounce AI vs ${comp.name} — Which Email Verifier is Better?`,
            description: `Head-to-head comparison: ZeroBounce AI vs ${comp.name}. AI confidence scoring, pattern recognition, and 98%+ accuracy vs ${comp.accuracy}.`,
            url: `https://zerobounceai.com/compare/${slug}`,
            type: 'website',
        },
        alternates: {
            canonical: `https://zerobounceai.com/compare/${slug}`,
        },
    }
}

export default async function CompetitorPage({ params }: PageProps) {
    const { competitor: slug } = await params
    const comp = getCompetitorBySlug(slug)
    if (!comp) notFound()

    const otherCompetitors = competitors.filter(c => c.slug !== slug)

    const features = [
        { label: 'Accuracy', ours: '98.3%+', theirs: comp.accuracy },
        { label: 'Catch-All Confidence Scoring', ours: true, theirs: comp.catchAllScoring },
        { label: 'AI Pattern Recognition', ours: true, theirs: comp.patternRecognition },
        { label: 'Domain Reputation Intelligence', ours: true, theirs: comp.domainReputation },
        { label: 'Email Finder', ours: true, theirs: comp.emailFinder },
        { label: 'Bulk Verification', ours: true, theirs: comp.bulkVerification },
        { label: 'Real-Time API', ours: true, theirs: comp.apiAccess },
        { label: 'Free Credits', ours: '100 free credits', theirs: comp.freeCredits },
        { label: 'Processing Speed', ours: 'Real-time', theirs: comp.speed },
        { label: 'Pricing', ours: 'From $0.005/email', theirs: comp.pricing },
    ]

    const faqs = [
        {
            q: `Is ZeroBounce AI better than ${comp.name}?`,
            a: `ZeroBounce AI offers AI-powered features like catch-all confidence scoring (0-100), email pattern recognition, and domain reputation intelligence that ${comp.name} doesn't provide. With 98.3%+ accuracy compared to ${comp.name}'s ${comp.accuracy}, ZeroBounce AI delivers more actionable insights.`,
        },
        {
            q: `How does ZeroBounce AI's pricing compare to ${comp.name}?`,
            a: `ZeroBounce AI starts at $0.005 per email with all AI features included. ${comp.name}'s pricing starts at ${comp.pricing}. ZeroBounce AI bundles email verification, email finder, and AI confidence scoring into one platform — no separate subscriptions needed.`,
        },
        {
            q: `Can I switch from ${comp.name} to ZeroBounce AI?`,
            a: `Yes! Switching is easy. ZeroBounce AI offers a simple REST API that's compatible with most integrations. Upload your existing email lists for bulk verification and start getting AI-powered results in minutes. Most users see improved accuracy on day one.`,
        },
        {
            q: `What does ZeroBounce AI have that ${comp.name} doesn't?`,
            a: `ZeroBounce AI's key differentiators include: (1) AI Catch-All Confidence Scoring — a 0-100 score for catch-all emails instead of binary yes/no, (2) Email Pattern Recognition — AI-powered suggestions for likely valid email addresses, (3) Domain Reputation Intelligence — trust scoring for email domains.`,
        },
    ]

    // JSON-LD schema for rich snippets
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: `ZeroBounce AI vs ${comp.name}`,
        description: `Compare ZeroBounce AI vs ${comp.name} email verification.`,
        mainEntity: {
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.a,
                },
            })),
        },
    }

    return (
        <main className={styles.main}>
            <Navbar />

            {/* JSON-LD Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            <span>⚔️</span> Head-to-Head Comparison
                        </div>
                        <h1>
                            ZeroBounce AI vs <span className="greenhead">{comp.name}</span>
                        </h1>
                        <p>
                            {comp.tagline}. See how ZeroBounce AI&apos;s AI-powered email verification
                            compares on accuracy, features, and pricing.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Try ZeroBounce AI Free</a>
                            <a href="/free-tools" className="btn btn-secondary">Free Tools</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Comparison Table */}
            <section className={styles.featureTable}>
                <div className={styles.container}>
                    <h2>Feature-by-Feature Comparison</h2>
                    <div className={styles.tableWrapper}>
                        <table className={styles.comparisonTable}>
                            <thead>
                                <tr>
                                    <th>Feature</th>
                                    <th>ZeroBounce AI ✨</th>
                                    <th>{comp.name}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((f, i) => (
                                    <tr key={i}>
                                        <td className={styles.featureLabel}>{f.label}</td>
                                        <td>{renderValue(f.ours)}</td>
                                        <td>{renderValue(f.theirs)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Why Switch */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent}>
                        <h2>Why Switch from {comp.name}?</h2>
                        <p className={styles.whySwitchText}>{comp.whySwitch}</p>

                        <div className={styles.prosConsGrid}>
                            <div className={styles.prosCard}>
                                <h3>✅ {comp.name}&apos;s Strengths</h3>
                                <ul>
                                    {comp.pros.map((p, i) => <li key={i}>{p}</li>)}
                                </ul>
                            </div>
                            <div className={styles.consCard}>
                                <h3>❌ {comp.name}&apos;s Limitations</h3>
                                <ul>
                                    {comp.cons.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* AI Advantages */}
            <section className={styles.advantages}>
                <div className={styles.container}>
                    <h2>What ZeroBounce AI Adds</h2>
                    <div className={styles.advantagesGrid}>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>🤖</div>
                            <h3>AI Confidence Scoring</h3>
                            <p>
                                Get a 0-100 confidence score for catch-all emails instead of binary
                                yes/no. Know exactly which emails are worth trying.
                            </p>
                        </div>
                        <div className={styles.advantageCard}>
                            <div className={styles.advantageIcon}>🔍</div>
                            <h3>Pattern Recognition</h3>
                            <p>
                                Our AI learns email patterns across companies and suggests likely
                                valid addresses. Find emails that other tools miss.
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
                            <div className={styles.advantageIcon}>📧</div>
                            <h3>Built-in Email Finder</h3>
                            <p>
                                Find and verify emails in one platform. No need for separate
                                subscriptions to Hunter.io or Snov.io.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
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
                        <h2>Ready to Switch to AI-Powered Verification?</h2>
                        <p>
                            Join businesses who&apos;ve upgraded from {comp.name} to ZeroBounce AI.
                            Get 98%+ accuracy with confidence scoring, pattern recognition, and more.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Start Free — No Credit Card</a>
                            <a href="/billing" className="btn btn-secondary">View Pricing</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ 100 Free Credits</span>
                            <span>✓ No Credit Card Required</span>
                            <span>✓ Cancel Anytime</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Compare ZeroBounce AI with Other Tools</h3>
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

function renderValue(val: boolean | string) {
    if (typeof val === 'boolean') {
        return val ? <span style={{ color: '#B9FF66', fontSize: 20 }}>✓</span> : <span style={{ color: '#555', fontSize: 20 }}>✗</span>
    }
    return val
}
