import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { verificationExamples, getVerificationExampleBySlug, getAllVerificationExampleSlugs } from '@/app/data/examples'
import styles from '@/app/compare/[competitor]/page.module.css'

interface PageProps {
    params: Promise<{ example: string }>
}

export async function generateStaticParams() {
    return getAllVerificationExampleSlugs().map((slug) => ({ example: slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { example: slug } = await params
    const example = getVerificationExampleBySlug(slug)
    if (!example) return { title: 'Not Found' }

    return {
        title: `${example.title} | ZeroBounce AI`,
        description: example.description,
        openGraph: {
            title: `ZeroBounce AI: ${example.title}`,
            description: example.description,
            url: `https://zerobounceai.com/verify-email/${slug}`,
        },
        alternates: { canonical: `https://zerobounceai.com/verify-email/${slug}` },
    }
}

export default async function VerificationExamplePage({ params }: PageProps) {
    const { example: slug } = await params
    const example = getVerificationExampleBySlug(slug)
    if (!example) notFound()

    const others = verificationExamples.filter(e => e.slug !== slug)

    let statusColor = '#00FFA3'
    if (example.status === 'Invalid' || example.status === 'Disposable') statusColor = '#FF5252'
    else if (example.status === 'Catch-All') statusColor = '#FFC107'

    return (
        <main className={styles.main}>
            <Navbar />

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <div className={styles.badge}>
                            <span>⚡</span> Verification Example
                        </div>
                        <h1>
                            <span className="greenhead">{example.title}</span>
                        </h1>
                        <p>{example.description}</p>
                        <div className={styles.heroCta}>
                            <a href="/signup" className="btn btn-primary">Try the API For Free</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Code Response */}
            <section className={styles.whySwitch}>
                <div className={styles.container}>
                    <div className={styles.whySwitchContent} style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>API Response Payload</h2>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)', color: statusColor }}>
                                    Status: {example.status}
                                </span>
                                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    Confidence: {example.confidence}%
                                </span>
                            </div>
                        </div>
                        
                        <div style={{ 
                            background: '#0d1117', 
                            padding: '2rem', 
                            borderRadius: '12px', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            overflowX: 'auto'
                        }}>
                            <pre style={{ margin: 0, color: '#e6edf3', fontSize: '0.95rem', fontFamily: 'monospace', lineHeight: 1.5 }}>
                                <code>{example.rawResponse}</code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Integrate in Minutes</h2>
                        <p>
                            Verify emails directly in your app with our lightning-fast API. 
                        </p>
                        <div className={styles.ctaButtons}>
                            <a href="/signup" className="btn btn-primary">Get API Key</a>
                            <a href="/docs" className="btn btn-secondary">Read Documentation</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Internal Links */}
            <section className={styles.seoLinks}>
                <div className={styles.container}>
                    <h3>See More Examples</h3>
                    <div className={styles.linksGrid} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {others.map(o => (
                            <a key={o.slug} href={`/verify-email/${o.slug}`}>
                                {o.title}
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
