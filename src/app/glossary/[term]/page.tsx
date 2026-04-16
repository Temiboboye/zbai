import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { glossaryTerms, getGlossaryTermBySlug, getAllGlossarySlugs } from '@/app/data/glossary'
import styles from '@/app/compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ term: string }>
}

export async function generateStaticParams() {
    return getAllGlossarySlugs().map((slug) => ({ term: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { term: slug } = await params
    const glossaryTerm = getGlossaryTermBySlug(slug)
    if (!glossaryTerm) return { title: 'Not Found' }

    return {
        title: `What is a ${glossaryTerm.term}? | Email Verification Glossary | ZeroBounce AI`,
        description: glossaryTerm.definition,
        openGraph: {
            title: `What is a ${glossaryTerm.term}? — ZeroBounce AI Glossary`,
            description: glossaryTerm.definition,
            url: `https://zerobounceai.com/glossary/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/glossary/${slug}` },
    }
}

export default async function GlossaryTermPage({ params }: PageProps) {
    const { term: slug } = await params
    const term = getGlossaryTermBySlug(slug)
    if (!term) notFound()

    const related = glossaryTerms.filter(t => term.relatedTerms.includes(t.slug))

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Glossary', item: 'https://zerobounceai.com/glossary' },
                { '@type': 'ListItem', position: 3, name: term.term, item: `https://zerobounceai.com/glossary/${slug}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'DefinedTerm',
            name: term.term,
            description: term.definition,
            url: `https://zerobounceai.com/glossary/${slug}`,
            inDefinedTermSet: {
                '@type': 'DefinedTermSet',
                name: 'Email Deliverability Glossary',
                url: 'https://zerobounceai.com/glossary'
            }
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
                            <span>📖</span> Glossary
                        </div>
                        <h1>
                            What is <span className="greenhead">{term.term}</span>?
                        </h1>
                        <p style={{ fontSize: '1.2rem', fontWeight: 500, color: '#fff', marginBottom: '1.5rem' }}>
                            {term.definition}
                        </p>
                    </div>
                </div>
            </section>

            {/* Detail Section */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent} style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div style={{ lineHeight: '1.8', color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
                            <h2 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.5rem' }}>Detailed Explanation</h2>
                            <p>{term.longDescription}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Terms */}
            {related.length > 0 && (
                <section className={styles.seoLinks}>
                    <div className={styles.container}>
                        <h3>Related Terms</h3>
                        <div className={styles.linksGrid}>
                            {related.map(r => (
                                <a key={r.slug} href={`/glossary/${r.slug}`}>
                                    {r.term}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Start Verifying Emails Today</h2>
                        <p>
                            Get 98%+ accuracy with AI-powered verification. 100 free credits, no credit card required.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Start Free — No Credit Card</a>
                        </div>
                        <div className={styles.trustBadges}>
                            <span>✓ 100 Free Credits</span>
                            <span>✓ Improve Deliverability</span>
                            <span>✓ Detect Catch-alls</span>
                        </div>
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
