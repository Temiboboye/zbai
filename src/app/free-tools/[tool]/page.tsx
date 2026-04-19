import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { freeTools, getFreeToolBySlug, getAllFreeToolSlugs } from '@/app/data/freeTools'
import styles from '@/app/compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ tool: string }>
}

export async function generateStaticParams() {
    return getAllFreeToolSlugs().map((slug) => ({ tool: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { tool: slug } = await params
    const tool = getFreeToolBySlug(slug)
    if (!tool) return { title: 'Not Found' }

    return {
        title: `${tool.title} | ZeroBounce AI`,
        description: tool.metaDescription,
        openGraph: {
            title: tool.title,
            description: tool.metaDescription,
            url: `https://zerobounceai.com/free-tools/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/free-tools/${slug}` },
    }
}

export default async function FreeToolPage({ params }: PageProps) {
    const { tool: slug } = await params
    const tool = getFreeToolBySlug(slug)
    if (!tool) notFound()

    const otherTools = freeTools.filter(t => t.slug !== slug)

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://zerobounceai.com/free-tools' },
                { '@type': 'ListItem', position: 3, name: tool.name, item: `https://zerobounceai.com/free-tools/${slug}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: tool.title,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: tool.description,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: tool.faqs.map(faq => ({
                '@type': 'Question',
                name: faq.q,
                acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
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
                            <span>{tool.icon}</span> Free Tool
                        </div>
                        <h1>
                            <span className="greenhead">{tool.name}</span>
                        </h1>
                        <p>{tool.description}</p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Try Tool Free</a>
                            <a href="#how-it-works" className="btn btn-secondary">How it works</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features & How it works */}
            <section id="how-it-works" className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent}>
                        <h2>How the {tool.name} Works</h2>
                        <p className={styles.whySwitchText}>{tool.howItWorks}</p>

                        <div className={styles.prosConsGrid}>
                            <div className={styles.prosCard} style={{ gridColumn: '1 / -1' }}>
                                <h3>✅ Key Features</h3>
                                <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {tool.features.map((feature, i) => <li key={i}>{feature}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className={styles.faq}>
                <div className={styles.container}>
                    <h2>Frequently Asked Questions</h2>
                    <div className={styles.faqList}>
                        {tool.faqs.map((faq, i) => (
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
                        <h2>Need higher volume?</h2>
                        <p>
                            Unlock bulk processing, API access, and advanced AI confidence scoring with a free ZeroBounce AI account.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Get 100 Free Credits</a>
                            <a href="/billing" className="btn btn-secondary">View Pricing</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Explore Other Free Tools</h3>
                    <div className={styles.linksGrid} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {otherTools.map(t => (
                            <a key={t.slug} href={`/free-tools/${t.slug}`}>
                                {t.icon} {t.name}
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
                        <a href="/glossary/hard-bounce">📖 What is a Hard Bounce?</a>
                        <a href="/glossary/soft-bounce">📖 What is a Soft Bounce?</a>
                        <a href="/glossary/catch-all-email">📖 What is a Catch-All Email?</a>
                        <a href="/glossary/spf-record">📖 What is SPF?</a>
                        <a href="/glossary/dkim">📖 What is DKIM?</a>
                        <a href="/glossary/dmarc">📖 What is DMARC?</a>
                        <a href="/email-format-for/ceo">👔 CEO Email Format</a>
                        <a href="/email-format-for/cto">👔 CTO Email Format</a>
                        <a href="/email-format-for/founder">👔 Founder Email Format</a>
                        <a href="/email-lookup/google.com">🔎 Google Email Lookup</a>
                        <a href="/email-lookup/microsoft.com">🔎 Microsoft Email Lookup</a>
                        <a href="/email-lookup/apple.com">🔎 Apple Email Lookup</a>
                        <a href="/verify-email/gmail">⚡ Gmail Verification Example</a>
                        <a href="/verify-email/catch-all">⚡ Catch-All Example</a>
                        <a href="/email-verification-for/cold-email">📧 Cold Email Verification</a>
                        <a href="/email-verification-for/lead-generation">📧 Lead Gen Verification</a>
                        <a href="/pricing/vs/neverbounce">💸 vs NeverBounce Pricing</a>
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
