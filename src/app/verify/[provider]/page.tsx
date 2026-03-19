import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { providers, getProviderBySlug, getAllProviderSlugs } from '@/app/data/providers'
import styles from './page.module.css'

interface PageProps {
    params: Promise<{ provider: string }>
}

export async function generateStaticParams() {
    return getAllProviderSlugs().map((slug) => ({ provider: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { provider: slug } = await params
    const prov = getProviderBySlug(slug)
    if (!prov) return { title: 'Not Found' }

    return {
        title: `${prov.name} Email Verification — Tips, Patterns & Free Tool | ZeroBounce AI`,
        description: `How to verify ${prov.name} (${prov.domain}) emails with 98%+ accuracy. Learn verification tips, common patterns, and challenges. Try our free ${prov.name} email checker.`,
        openGraph: {
            title: `Verify ${prov.name} Emails — Best Practices Guide`,
            description: `Complete guide to ${prov.name} email verification. ${prov.userBase} users, ${prov.difficulty} difficulty. Get AI-powered confidence scoring.`,
            url: `https://zerobounceai.com/verify/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/verify/${slug}` },
    }
}

export default async function ProviderPage({ params }: PageProps) {
    const { provider: slug } = await params
    const prov = getProviderBySlug(slug)
    if (!prov) notFound()

    const otherProviders = providers.filter(p => p.slug !== slug)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: prov.faq.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    }

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.providerBadge}>
                            <span className={styles.providerIcon}>{prov.icon}</span>
                            {prov.name} Verification Guide
                        </div>
                        <h1>
                            How to Verify <span className="greenhead">{prov.name}</span> Emails
                        </h1>
                        <p>{prov.description}</p>
                        <div className={styles.heroMeta}>
                            <div className={styles.metaItem}>👥 <strong>{prov.userBase}</strong></div>
                            <div className={styles.metaItem}>📊 Difficulty: <strong>{prov.difficulty}</strong></div>
                            <div className={styles.metaItem}>🎯 Catch-All: <strong>{prov.isCatchAll ? 'Yes' : 'No'}</strong></div>
                        </div>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Verify {prov.name} Emails Free</a>
                            <a href="/free-tools" className="btn btn-secondary">Try Free Tools</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tips */}
            <section className={styles.tips}>
                <div className={styles.container}>
                    <h2>Verification Tips for {prov.name}</h2>
                    <div className={styles.tipsList}>
                        {prov.tips.map((tip, i) => (
                            <div key={i} className={styles.tipItem}>
                                <span className={styles.tipNumber}>{i + 1}</span>
                                <span className={styles.tipText}>{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Common Patterns */}
            <section className={styles.patterns}>
                <div className={styles.container}>
                    <h2>Common {prov.name} Email Patterns</h2>
                    <p className={styles.patternsSubtitle}>
                        These are the most frequently used email formats for {prov.domain}
                    </p>
                    <div className={styles.patternsGrid}>
                        {prov.commonPatterns.map((pattern, i) => (
                            <div key={i} className={styles.patternChip}>
                                {pattern}@{prov.domain === 'any domain' ? 'company.com' : prov.domain}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Challenges */}
            <section className={styles.challenges}>
                <div className={styles.container}>
                    <h2>Verification Challenges</h2>
                    <div className={styles.challengesList}>
                        {prov.challenges.map((challenge, i) => (
                            <div key={i} className={styles.challengeItem}>
                                <span className={styles.challengeIcon}>⚠️</span>
                                {challenge}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.faq}>
                <div className={styles.container}>
                    <h2>Frequently Asked Questions</h2>
                    <div className={styles.faqList}>
                        {prov.faq.map((f, i) => (
                            <div key={i} className={styles.faqItem}>
                                <h4>{f.q}</h4>
                                <p>{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Start Verifying {prov.name} Emails</h2>
                        <p>
                            Get 98%+ accuracy on {prov.name} emails with AI-powered verification.
                            {prov.isCatchAll && ' Our confidence scoring handles catch-all domains with ease.'}
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Start Free — 100 Credits</a>
                            <a href="/billing" className="btn btn-secondary">View Pricing</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Verify Emails from Other Providers</h3>
                    <div className={styles.linksGrid}>
                        {otherProviders.map(p => (
                            <a key={p.slug} href={`/verify/${p.slug}`}>
                                {p.icon} {p.name}
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
