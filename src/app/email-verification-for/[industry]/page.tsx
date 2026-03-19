import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { industries, getIndustryBySlug, getAllIndustrySlugs } from '@/app/data/industries'
import styles from './page.module.css'

interface PageProps {
    params: Promise<{ industry: string }>
}

export async function generateStaticParams() {
    return getAllIndustrySlugs().map((slug) => ({ industry: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { industry: slug } = await params
    const ind = getIndustryBySlug(slug)
    if (!ind) return { title: 'Not Found' }

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
}

export default async function IndustryPage({ params }: PageProps) {
    const { industry: slug } = await params
    const ind = getIndustryBySlug(slug)
    if (!ind) notFound()

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

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.industryBadge}>
                            <span className={styles.industryIcon}>{ind.icon}</span>
                            Email Verification for {ind.name}
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

            {/* Stats Bar */}
            <section className={styles.statsBar}>
                <div className={styles.container}>
                    <div className={styles.statsGrid}>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{ind.avgBounceRate}</span>
                            <span className={styles.statLabel}>Avg Bounce Rate</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{ind.avgListSize}</span>
                            <span className={styles.statLabel}>Typical List Size</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statValue}>{ind.potentialSavings.split(' ')[0]}</span>
                            <span className={styles.statLabel}>Potential Annual Savings</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pain Points */}
            <section className={styles.painPoints}>
                <div className={styles.container}>
                    <h2>The Cost of Dirty Email Lists</h2>
                    <div className={styles.painGrid}>
                        {ind.painPoints.map((pp, i) => (
                            <div key={i} className={styles.painCard}>
                                <h3>❌ {pp.title}</h3>
                                <p>{pp.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className={styles.benefits}>
                <div className={styles.container}>
                    <h2>How ZeroBounce AI Helps {ind.name}</h2>
                    <div className={styles.benefitsGrid}>
                        {ind.benefits.map((b, i) => (
                            <div key={i} className={styles.benefitCard}>
                                <h3>{b.title}</h3>
                                <p>{b.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className={styles.useCases}>
                <div className={styles.container}>
                    <h2>Common Use Cases</h2>
                    <div className={styles.useCasesList}>
                        {ind.useCases.map((uc, i) => (
                            <div key={i} className={styles.useCaseChip}>{uc}</div>
                        ))}
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

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Email Verification for Other Industries</h3>
                    <div className={styles.linksGrid}>
                        {others.map(o => (
                            <a key={o.slug} href={`/email-verification-for/${o.slug}`}>
                                {o.icon} {o.name}
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
