import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { companies } from '@/app/data/companies'
import styles from '@/app/compare/[competitor]/page.module.css'

const DEPARTMENTS = [
    { slug: 'sales', name: 'Sales' },
    { slug: 'marketing', name: 'Marketing' },
    { slug: 'engineering', name: 'Engineering' },
    { slug: 'hr', name: 'Human Resources' },
    { slug: 'finance', name: 'Finance' },
    { slug: 'operations', name: 'Operations' },
    { slug: 'executive', name: 'Executive' },
    { slug: 'legal', name: 'Legal' },
    { slug: 'it', name: 'Information Technology' },
    { slug: 'product', name: 'Product' }
]

interface PageProps {
    params: Promise<{ company: string, department: string }>
}

export async function generateStaticParams() {
    return []
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { company: compSlug, department: deptSlug } = await params
    const company = companies.find(c => c.slug === compSlug)
    const dept = DEPARTMENTS.find(d => d.slug === deptSlug)
    
    if (!company || !dept) return { title: 'Not Found' }

    return {
        title: `${company.name} ${dept.name} Email Format & Contacts | ZeroBounce AI`,
        description: `Looking to contact the ${dept.name} department at ${company.name}? Learn their common email routing patterns and verify addresses before sending.`,
        openGraph: {
            title: `${company.name} ${dept.name} Email Format`,
            description: `Verify emails for the ${dept.name} team at ${company.name}.`,
            url: `https://zerobounceai.com/email-format/${compSlug}/${deptSlug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/email-format/${compSlug}/${deptSlug}` },
    }
}

export default async function DepartmentEmailFormatPage({ params }: PageProps) {
    const { company: compSlug, department: deptSlug } = await params
    const company = companies.find(c => c.slug === compSlug)
    const dept = DEPARTMENTS.find(d => d.slug === deptSlug)
    
    if (!company || !dept) notFound()

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
                { '@type': 'ListItem', position: 2, name: 'Company Formats', item: 'https://zerobounceai.com/email-format' },
                { '@type': 'ListItem', position: 3, name: company.name, item: `https://zerobounceai.com/email-format/${compSlug}` },
                { '@type': 'ListItem', position: 4, name: `${dept.name} Team`, item: `https://zerobounceai.com/email-format/${compSlug}/${deptSlug}` },
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
                            <span>🏢</span> Department Targeting
                        </div>
                        <h1>
                            <span className="greenhead">{company.name}</span> {dept.name} Email Format
                        </h1>
                        <p>
                            Contacting the {dept.name} team at {company.name}? Discover common email structures and verify your list to improve your cold outreach deliverability.
                        </p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Start Verifying Free</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent}>
                        <h2>Targeting {company.name} {dept.name}</h2>
                        
                        <div className={styles.prosConsGrid}>
                            <div className={styles.consCard} style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                                <h3 style={{ color: '#fff' }}>⚠️ Common Pitfalls</h3>
                                <ul>
                                    <li>Sending to generic role-based emails like <strong>{deptSlug}@{company.domain}</strong> usually yields low open rates.</li>
                                    <li>Large {dept.name} departments use strict filters against outbound sales platforms.</li>
                                    <li>Guessing a manager&apos;s email triggers spam traps.</li>
                                </ul>
                            </div>
                            <div className={styles.prosCard}>
                                <h3>✅ Better Approach</h3>
                                <ul>
                                    <li>Find the specific decision-maker on LinkedIn.</li>
                                    <li>Apply the standard company format: 
                                        <br />
                                        {company.patterns.map(p => <span key={p} style={{display:'inline-block', background:'rgba(0,255,163,0.1)', color:'#00ffa3', padding:'2px 8px', borderRadius:'4px', marginRight:'4px', marginTop:'4px'}}>{p}@{company.domain}</span>)}
                                    </li>
                                    <li>Verify the generated email with ZeroBounce AI before sending.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Reach out with confidence</h2>
                        <p>
                            Verify the {dept.name} contacts at {company.name} utilizing AI Confidence Scoring.
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
                    <h3>Other {company.name} Departments</h3>
                    <div className={styles.linksGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {DEPARTMENTS.filter(d => d.slug !== deptSlug).map(d => (
                            <a key={d.slug} href={`/email-format/${compSlug}/${d.slug}`}>
                                {company.name} {d.name}
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
                        <a href={`/email-lookup/${company.domain}`}>🔎 {company.domain} Email Lookup</a>
                        <a href={`/email-format/${compSlug}`}>🏢 All {company.name} Email Formats</a>
                        <a href="/email-format-for/ceo">👔 CEO Email Format</a>
                        <a href="/email-format-for/cto">👔 CTO Email Format</a>
                        <a href="/email-format-for/vp-sales">👔 VP Sales Email Format</a>
                        <a href="/glossary/catch-all-email">📖 What is Catch-All Email?</a>
                        <a href="/glossary/sender-reputation">📖 Sender Reputation</a>
                        <a href="/glossary/role-based-email">📖 Role-Based Emails</a>
                        <a href="/free-tools/email-bounce-checker">🔧 Bounce Checker</a>
                        <a href="/free-tools/catch-all-checker">🔧 Catch-All Checker</a>
                        <a href="/verify-email/gmail">⚡ Gmail API Example</a>
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
