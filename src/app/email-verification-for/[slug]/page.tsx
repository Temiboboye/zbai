import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { industries, getIndustryBySlug, getAllIndustrySlugs } from '@/app/data/industries'
import { useCases, getUseCaseBySlug, getAllUseCaseSlugs } from '@/app/data/useCases'
import styles from '@/app/compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    const indSlugs = getAllIndustrySlugs().map((s) => ({ slug: s }))
    const ucSlugs = getAllUseCaseSlugs().map((s) => ({ slug: s }))
    return [...indSlugs, ...ucSlugs]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const ind = getIndustryBySlug(slug)
    const uc = getUseCaseBySlug(slug)

    if (!ind && !uc) return { title: 'Not Found' }

    if (ind) {
        return {
            title: `Email Verification for ${ind.name} — Clean Lists, Better ROI | ZeroBounce AI`,
            description: `Why ${ind.name.toLowerCase()} need email verification. Reduce bounces, improve deliverability, and protect sender reputation with AI-powered verification.`,
            openGraph: {
                title: `Email Verification for ${ind.name}`,
                description: `${ind.headline}. Save ${ind.potentialSavings} with ZeroBounce AI's email verification.`,
                url: `https://zerobounceai.com/email-verification-for/${slug}`,
            },
            alternates: { canonical: `https://zerobounceai.com/email-verification-for/${slug}` },
        }
    } else if (uc) {
        return {
            title: `${uc.title} | ZeroBounce AI`,
            description: uc.description,
            openGraph: {
                title: uc.title,
                description: uc.description,
                url: `https://zerobounceai.com/email-verification-for/${slug}`,
            },
            alternates: { canonical: `https://zerobounceai.com/email-verification-for/${slug}` },
        }
    }
    
    return { title: 'Not Found' }
}

export default async function UseCaseOrIndustryPage({ params }: PageProps) {
    const { slug } = await params
    const ind = getIndustryBySlug(slug)
    const uc = getUseCaseBySlug(slug)

    if (!ind && !uc) notFound()

    if (ind) {
        const others = industries.filter(i => i.slug !== slug)

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: ind.faq.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        }

        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Industries', item: 'https://zerobounceai.com/free-tools' },
                { '@type': 'ListItem', position: 3, name: `${ind.name}`, item: `https://zerobounceai.com/email-verification-for/${slug}` },
            ],
        }

        return (
            <main className={styles.main}>
                <Navbar />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <div className={styles.heroContent}>
                            <div className={styles.badge}>
                                <span>{ind.icon}</span> Email Verification for {ind.name}
                            </div>
                            <h1>
                                <span className="greenhead">{ind.headline}</span>
                            </h1>
                            <p>{ind.description}</p>
                            <div className={styles.heroCta}>
                                <a href="/signup" className="btn btn-primary">Start Verifying Free</a>
                                <a href="/free-tools" className="btn btn-secondary">Try Free Tools</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.whySwitch}>
                    <div className={styles.container}>
                        <div className={styles.whySwitchContent}>
                            <h2>The Cost of Dirty Email Lists</h2>
                            <div className={styles.prosConsGrid}>
                                {ind.painPoints.map((pp, i) => (
                                    <div key={i} className={styles.consCard}>
                                        <h3>❌ {pp.title}</h3>
                                        <p>{pp.text}</p>
                                    </div>
                                ))}
                            </div>
                            
                            <h2 style={{ marginTop: '3rem' }}>How ZeroBounce AI Helps {ind.name}</h2>
                            <div className={styles.prosConsGrid}>
                                {ind.benefits.map((b, i) => (
                                    <div key={i} className={styles.prosCard}>
                                        <h3>✅ {b.title}</h3>
                                        <p>{b.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className={styles.faq}>
                    <div className={styles.container}>
                        <h2>Frequently Asked Questions</h2>
                        <div className={styles.faqList}>
                            {ind.faq.map((f, i) => (
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
                            <h2>Start Cleaning Your {ind.name} Email Lists</h2>
                            <p>
                                Get 98%+ accuracy with AI-powered email verification.
                                Join hundreds of {ind.name.toLowerCase()} businesses that trust ZeroBounce AI.
                            </p>
                            <div className={styles.ctaButtons}>
                                <a href="/signup" className="btn btn-primary">Start Free — 100 Credits</a>
                                <a href="/billing" className="btn btn-secondary">View Pricing</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.seoLinks}>
                    <div className={styles.container}>
                        <h3>Explore Use Cases</h3>
                        <div className={styles.linksGrid} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {useCases.map(u => (
                                <a key={u.slug} href={`/email-verification-for/${u.slug}`}>
                                    {u.name}
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

    if (uc) {
        const others = useCases.filter(u => u.slug !== slug)

        const jsonLd = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: uc.faqs.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
        }

        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Use Cases', item: 'https://zerobounceai.com/free-tools' },
                { '@type': 'ListItem', position: 3, name: `${uc.name}`, item: `https://zerobounceai.com/email-verification-for/${slug}` },
            ],
        }

        return (
            <main className={styles.main}>
                <Navbar />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

                {/* Hero */}
                <section className={styles.hero}>
                    <div className={styles.container}>
                        <div className={styles.heroContent}>
                            <div className={styles.badge}>
                                <span>🎯</span> Use Case
                            </div>
                            <h1>
                                <span className="greenhead">{uc.title}</span>
                            </h1>
                            <p>{uc.description}</p>
                            <div className={styles.heroCta}>
                                <a href="/signup" className="btn btn-primary">Start Verifying Free</a>
                                <a href="/pricing" className="btn btn-secondary">View Pricing</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.whySwitch}>
                    <div className={styles.container}>
                        <div className={styles.whySwitchContent}>
                            <h2>The Challenge</h2>
                            <div className={styles.prosConsGrid}>
                                <div className={styles.consCard} style={{ gridColumn: '1 / -1' }}>
                                    <h3>❌ The Pain Point</h3>
                                    <p>{uc.painPoint}</p>
                                </div>
                            </div>

                            <h2 style={{ marginTop: '3rem' }}>The ZeroBounce AI Solution</h2>
                            <div className={styles.prosConsGrid}>
                                <div className={styles.prosCard}>
                                    <h3>✅ Our Solution</h3>
                                    <p>{uc.solution}</p>
                                </div>
                                <div className={styles.prosCard}>
                                    <h3>🚀 Key Features</h3>
                                    <ul>
                                        {uc.keyFeatures.map((kf, i) => (
                                            <li key={i}>{kf}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Best Practices */}
                <section className={styles.whySwitch} style={{ paddingTop: 0 }}>
                    <div className={styles.container}>
                         <div className={styles.whySwitchContent}>
                            <h2>Best Practices for {uc.name}</h2>
                            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', listStyle: 'none', padding: 0 }}>
                                {uc.bestPractices.map((bp, i) => (
                                    <li key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        💡 {bp}
                                    </li>
                                ))}
                            </ul>
                         </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className={styles.faq}>
                    <div className={styles.container}>
                        <h2>Frequently Asked Questions</h2>
                        <div className={styles.faqList}>
                            {uc.faqs.map((f, i) => (
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
                            <h2>Elevate your {uc.name}</h2>
                            <p>
                                Get 98%+ accuracy with AI-powered email verification. 100 free credits, no credit card required.
                            </p>
                            <div className={styles.ctaButtons}>
                                <a href="/signup" className="btn btn-primary">Start Free — 100 Credits</a>
                            </div>
                        </div>
                    </div>
                </section>

                <section className={styles.seoLinks}>
                    <div className={styles.container}>
                        <h3>Explore Other Use Cases</h3>
                        <div className={styles.linksGrid} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                            {others.map(o => (
                                <a key={o.slug} href={`/email-verification-for/${o.slug}`}>
                                    {o.name}
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
}
