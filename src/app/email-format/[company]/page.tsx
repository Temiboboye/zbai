import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { companies, getCompanyBySlug, getAllCompanySlugs, getCompaniesByIndustry } from '@/app/data/companies'
import styles from './page.module.css'

interface PageProps {
    params: Promise<{ company: string }>
}

export async function generateStaticParams() {
    return getAllCompanySlugs().map((slug) => ({ company: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { company: slug } = await params
    const co = getCompanyBySlug(slug)
    if (!co) return { title: 'Not Found' }

    return {
        title: `${co.name} Email Format — Find @${co.domain} Email Addresses | ZeroBounce AI`,
        description: `What is the email format for ${co.name}? Common patterns for @${co.domain}: ${co.patterns.join(', ')}. Verify ${co.name} emails with 98%+ accuracy.`,
        openGraph: {
            title: `${co.name} Email Format — @${co.domain} Patterns`,
            description: `Find the most common email patterns for ${co.name} (${co.domain}). Verify emails instantly with ZeroBounce AI.`,
            url: `https://zerobounceai.com/email-format/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/email-format/${slug}` },
    }
}

const PATTERN_LABELS: Record<string, string> = {
    'first.last': 'firstname.lastname',
    'firstlast': 'firstnamelastname',
    'flast': 'firstinitiallastname',
    'firstl': 'firstnamelastinitial',
    'first': 'firstnameonly',
    'first_last': 'firstname_lastname',
    'first.x.last': 'first.middle.last',
    'last.first': 'lastname.firstname',
    'lastp': 'lastinitialfirst',
    'fl1234': 'firstinitiallast+id',
}

function expandPattern(p: string, domain: string): string {
    switch (p) {
        case 'first.last': return `john.doe@${domain}`
        case 'firstlast': return `johndoe@${domain}`
        case 'flast': return `jdoe@${domain}`
        case 'firstl': return `johnd@${domain}`
        case 'first': return `john@${domain}`
        case 'first_last': return `john_doe@${domain}`
        case 'first.x.last': return `john.m.doe@${domain}`
        case 'last.first': return `doe.john@${domain}`
        case 'lastp': return `doej@${domain}`
        case 'fl1234': return `jd1234@${domain}`
        default: return `${p}@${domain}`
    }
}

export default async function CompanyEmailFormatPage({ params }: PageProps) {
    const { company: slug } = await params
    const co = getCompanyBySlug(slug)
    if (!co) notFound()

    const sameIndustry = getCompaniesByIndustry(co.industry).filter(c => c.slug !== slug).slice(0, 12)
    const otherPopular = companies.filter(c => c.slug !== slug && c.industry !== co.industry).slice(0, 8)
    const related = [...sameIndustry, ...otherPopular].slice(0, 16)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: `What is the email format for ${co.name}?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `The most common email format at ${co.name} (${co.domain}) is ${co.patterns[0]}@${co.domain}. Other patterns include: ${co.patterns.slice(1).map(p => p + '@' + co.domain).join(', ')}.`,
                },
            },
            {
                '@type': 'Question',
                name: `How do I verify a ${co.name} email address?`,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: `Use ZeroBounce AI to verify ${co.name} email addresses with 98%+ accuracy. Our AI-powered verification checks SMTP responses, domain reputation, and uses pattern recognition to confirm email validity.`,
                },
            },
        ],
    }

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.companyBadge}>
                            📧 Email Format Guide
                        </div>
                        <h1>
                            <span className="greenhead">{co.name}</span> Email Format
                        </h1>
                        <p>
                            Find the most common email patterns for @{co.domain}.
                            Use these patterns to find anyone&apos;s email at {co.name}, then verify with ZeroBounce AI.
                        </p>
                        <div className={styles.heroMeta}>
                            <div className={styles.metaItem}>🏢 <strong>{co.industry}</strong></div>
                            <div className={styles.metaItem}>🌐 <strong>{co.domain}</strong></div>
                            <div className={styles.metaItem}>👥 <strong>{co.employees}</strong> employees</div>
                        </div>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Verify @{co.domain} Emails</a>
                            <a href="/free-tools" className="btn btn-secondary">Try Free Tools</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Patterns */}
            <section className={styles.patterns}>
                <div className={styles.container}>
                    <h2>Common Email Patterns at {co.name}</h2>
                    <p className={styles.patternsSubtitle}>
                        Ranked by likelihood — the most common format is listed first
                    </p>
                    <div className={styles.patternsList}>
                        {co.patterns.map((p, i) => (
                            <div key={i} className={styles.patternCard}>
                                <span className={styles.patternRank}>{i + 1}</span>
                                <span className={styles.patternFormat}>{p}@{co.domain}</span>
                                <span className={styles.patternLabel}>{PATTERN_LABELS[p] || p}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Examples */}
            <section className={styles.examples}>
                <div className={styles.container}>
                    <h2>Example Email Addresses</h2>
                    <div className={styles.examplesGrid}>
                        {co.patterns.map((p, i) => (
                            <div key={i} className={styles.exampleCard}>
                                {expandPattern(p, co.domain)}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <div className={styles.container}>
                    <h2>How to Find & Verify {co.name} Emails</h2>
                    <div className={styles.stepsGrid}>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>1</div>
                            <h3>Guess the Format</h3>
                            <p>Use the patterns above to construct the likely email address for your contact at {co.name}.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>2</div>
                            <h3>Verify with AI</h3>
                            <p>Paste the email into ZeroBounce AI. Our AI checks SMTP, MX records, and runs pattern analysis in seconds.</p>
                        </div>
                        <div className={styles.stepCard}>
                            <div className={styles.stepNumber}>3</div>
                            <h3>Send with Confidence</h3>
                            <p>Get a confidence score (0-100). Scores 80+ are safe to send. No more bounced emails.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Verify @{co.domain} Emails Instantly</h2>
                        <p>
                            Don&apos;t guess — verify. Get 98%+ accuracy on {co.name} email addresses
                            with AI-powered verification and confidence scoring.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Start Free — 100 Credits</a>
                            <a href="/billing" className="btn btn-secondary">View Pricing</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Companies */}
            <section className={styles.related}>
                <div className={styles.container}>
                    <h3>Email Formats for Similar Companies</h3>
                    <div className={styles.relatedGrid}>
                        {related.map(c => (
                            <a key={c.slug} href={`/email-format/${c.slug}`}>
                                {c.name}
                            </a>
                        ))}
                    </div>

                    {/* Cross-category links */}
                    <h3 style={{ marginTop: '32px' }}>📧 Verify Emails by Provider</h3>
                    <div className={styles.relatedGrid}>
                        <a href="/verify/gmail">Verify Gmail</a>
                        <a href="/verify/outlook">Verify Outlook</a>
                        <a href="/verify/yahoo">Verify Yahoo</a>
                        <a href="/verify/icloud">Verify iCloud</a>
                        <a href="/verify/catch-all">Catch-All Guide</a>
                        <a href="/verify/disposable">Disposable Guide</a>
                    </div>

                    <h3 style={{ marginTop: '24px' }}>🏆 Compare Verification Tools</h3>
                    <div className={styles.relatedGrid}>
                        <a href="/compare/neverbounce">vs NeverBounce</a>
                        <a href="/compare/hunter-io">vs Hunter.io</a>
                        <a href="/compare/clearout">vs Clearout</a>
                        <a href="/comparison">Full Comparison →</a>
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

