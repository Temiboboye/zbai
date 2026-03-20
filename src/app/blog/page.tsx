import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import styles from './page.module.css'

export const metadata: Metadata = {
    title: 'Blog — Email Verification Guides, Tips & Best Practices | ZeroBounce AI',
    description: 'Expert guides on email verification, deliverability, list cleaning, and spam trap prevention. Learn how to protect your sender reputation and improve inbox placement.',
    alternates: { canonical: 'https://zerobounceai.com/blog' },
}

const blogPosts = [
    {
        slug: 'email-verification-guide',
        title: 'The Complete Email Verification Guide (2026)',
        description: 'Everything you need to know about email verification — how it works, why it matters, and how to choose the right tool.',
        category: '📚 Guide',
        readTime: '15 min',
    },
    {
        slug: 'email-deliverability-guide',
        title: 'Email Deliverability Guide — How to Land in the Inbox',
        description: 'Master the 5 pillars of deliverability: authentication, list quality, sender reputation, content, and engagement.',
        category: '📬 Deliverability',
        readTime: '14 min',
    },
    {
        slug: 'catch-all-email-verification',
        title: 'Best Catch-All Email Verification Tools',
        description: 'How AI confidence scoring solves the catch-all problem — turning "unknown" results into actionable data.',
        category: '🎯 Tools',
        readTime: '10 min',
    },
    {
        slug: 'email-verification-b2b-sales',
        title: 'Email Verification for B2B Sales Teams',
        description: 'How sales teams use email verification to increase cold outreach deliverability and book more meetings.',
        category: '💼 B2B Sales',
        readTime: '10 min',
    },
    {
        slug: 'reduce-email-bounce-rate',
        title: 'How to Reduce Email Bounce Rate — 7 Proven Strategies',
        description: 'Step-by-step strategies to permanently reduce your bounce rate below 2% and protect sender reputation.',
        category: '📉 Optimization',
        readTime: '11 min',
    },
    {
        slug: 'how-to-clean-email-list',
        title: 'How to Clean Your Email List — 5-Step Guide',
        description: 'The exact process get your email list clean: export, verify, categorize, remove, and set up ongoing protection.',
        category: '🧹 List Hygiene',
        readTime: '8 min',
    },
    {
        slug: 'how-to-avoid-spam-traps',
        title: 'How to Avoid Spam Traps — Protect Your Reputation',
        description: 'What spam traps are, how they damage your domain, and 6 strategies to avoid them forever.',
        category: '🛡️ Security',
        readTime: '9 min',
    },
    {
        slug: 'zerobounce-ai-vs-competitors',
        title: 'ZeroBounce AI vs Competitors — Complete Comparison',
        description: 'How ZeroBounce AI compares to ZeroBounce, Hunter, NeverBounce, and other verification tools.',
        category: '⚔️ Comparison',
        readTime: '8 min',
    },
]

export default function BlogIndexPage() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://zerobounceai.com' },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://zerobounceai.com/blog' },
        ],
    }

    return (
        <main className={styles.main}>
            <Navbar />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <section className={styles.hero}>
                <div className={styles.container}>
                    <h1>Email Verification <span className="greenhead">Blog</span></h1>
                    <p>Expert guides on email verification, deliverability, list hygiene, and sender reputation.</p>
                </div>
            </section>

            <section className={styles.posts}>
                <div className={styles.container}>
                    <div className={styles.postsGrid}>
                        {blogPosts.map((post) => (
                            <a key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
                                <div className={styles.postCategory}>{post.category}</div>
                                <h2>{post.title}</h2>
                                <p>{post.description}</p>
                                <div className={styles.postMeta}>
                                    <span>{post.readTime} read</span>
                                    <span className={styles.readMore}>Read →</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaBox}>
                        <h2>Ready to Verify Your Emails?</h2>
                        <p>100 free verifications. No credit card required.</p>
                        <a href="/signup" className="btn btn-primary">Get Started Free</a>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p>© 2026 ZeroBounce AI. All rights reserved.</p>
                </div>
            </footer>
        </main>
    )
}
