import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { companies } from '@/app/data/companies'
import styles from '@/app/compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ domain: string }>
}

export async function generateStaticParams() {
    return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { domain } = await params
    const company = companies.find(c => c.domain === domain)
    if (!company) return { title: 'Not Found' }

    return {
        title: `${company.domain} Email Lookup & Format Analyzer | ZeroBounce AI`,
        description: `Find the email format for ${company.name} (${company.domain}). Our AI analyzes routing, MX records, and common patterns to help you verify addresses.`,
        openGraph: {
            title: `${company.domain} Email Lookup`,
            description: `Check the exact email format for ${company.name} and verify ${company.domain} email addresses.`,
            url: `https://zerobounceai.com/email-lookup/${domain}`,
        },
        alternates: { canonical: `https://zerobounceai.com/email-lookup/${domain}` },
    }
}

export default async function EmailLookupDomainPage({ params }: PageProps) {
    const { domain } = await params
    const company = companies.find(c => c.domain === domain)
    if (!company) notFound()

    // Grab 5 random similar companies to link to
    const others = [...companies].sort(() => 0.5 - Math.random()).slice(0, 8)

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Email Lookup', item: 'https://zerobounceai.com/free-tools' },
                { '@type': 'ListItem', position: 3, name: company.domain, item: `https://zerobounceai.com/email-lookup/${domain}` },
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
                            <span>🔎</span> Domain Email Lookup
                        </div>
                        <h1>
                            Lookup Emails at <span className="greenhead">{company.domain}</span>
                        </h1>
                        <p>
                            Verify email addresses for {company.name}. See common patterns and routing behavior for <strong>@{company.domain}</strong> emails before you send.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Start Verifying Free</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Formats & Insight */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent}>
                        <h2>Analysis for <strong>{company.name}</strong></h2>
                        
                        <div className={styles.prosConsGrid}>
                            <div className={styles.prosCard}>
                                <h3>📊 Domain Info</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <strong>Company Name:</strong> {company.name}
                                    </li>
                                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <strong>Industry:</strong> {company.industry}
                                    </li>
                                    <li style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <strong>Company Size:</strong> {company.employees} employees
                                    </li>
                                </ul>
                            </div>
                            <div className={styles.consCard} style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                <h3 style={{ color: '#fff' }}>📧 Primary Email Formats</h3>
                                <ul>
                                    {company.patterns.map((pat, i) => {
                                        // Display friendly format example
                                        let example = ''
                                        if(pat === 'first.last') example = 'john.doe@'
                                        else if(pat === 'firstlast') example = 'johndoe@'
                                        else if(pat === 'flast') example = 'jdoe@'
                                        else if(pat === 'first_last') example = 'john_doe@'
                                        else if(pat === 'firstl') example = 'johnd@'
                                        else if(pat === 'last') example = 'doe@'
                                        else if(pat === 'first') example = 'john@'
                                        else example = pat + '@'

                                        return (
                                            <li key={i}><strong>{example}</strong>{company.domain} <em>({pat})</em></li>
                                        )
                                    })}
                                </ul>
                            </div>
                        </div>

                        <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(0, 255, 163, 0.1)', border: '1px solid rgba(0, 255, 163, 0.3)', borderRadius: '12px' }}>
                            <h3 style={{ color: '#00FFA3', marginBottom: '1rem' }}>⚠️ Beware of Guessing</h3>
                            <p style={{ color: '#fff', lineHeight: 1.6 }}>
                                Sending an email to <strong>john.doe@{company.domain}</strong> without verifying it first risks a hard bounce. 
                                Large companies like {company.name} use advanced spam filters (like Proofpoint, Mimecast, or Barracuda) that actively penalize domains that guess emails. 
                                Use ZeroBounce AI to confirm the address exists before launching your outreach.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Verify {company.domain} Emails Now</h2>
                        <p>
                            Get 100 free credits to test our AI-powered verification. No credit card required.
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Get 100 Free Credits</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>Lookup Other Domains</h3>
                    <div className={styles.linksGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {others.map(o => (
                            <a key={o.slug} href={`/email-lookup/${o.domain}`}>
                                {o.domain}
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
