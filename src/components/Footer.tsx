import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.footerContent}>
                    <div className={styles.footerBrand}>
                        <div className={styles.logo}>
                            <span className="greenhead">ZB</span> ZeroBounce AI
                        </div>
                        <p className={styles.tagline}>
                            AI-powered email verification with 98%+ accuracy.
                        </p>

                        {/* Newsletter Signup */}
                        <div className={styles.newsletter}>
                            <h4>Stay Updated</h4>
                            <p>Get email verification tips and product updates.</p>
                            <form className={styles.newsletterForm} action="/api/newsletter" method="POST">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    required
                                    className={styles.newsletterInput}
                                />
                                <button type="submit" className={styles.newsletterButton}>
                                    Subscribe
                                </button>
                            </form>
                            <p className={styles.newsletterDisclaimer}>
                                No spam. Unsubscribe anytime.
                            </p>
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.footerColumn}>
                            <h4>Product</h4>
                            <a href="/#features">Features</a>
                            <a href="/comparison">Compare</a>
                            <a href="/#pricing">Pricing</a>
                            <a href="/signup">Free Trial</a>
                        </div>

                        <div className={styles.footerColumn}>
                            <h4>Resources</h4>
                            <a href="/blog">Blog</a>
                            <a href="/docs">Documentation</a>
                            <a href="/api">API Reference</a>
                            <a href="/support">Support</a>
                        </div>

                        <div className={styles.footerColumn}>
                            <h4>Company</h4>
                            <a href="/about">About Us</a>
                            <a href="/contact">Contact</a>
                            <a href="/careers">Careers</a>
                        </div>

                        <div className={styles.footerColumn}>
                            <h4>Legal</h4>
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                            <a href="/security">Security</a>
                            <a href="/gdpr">GDPR</a>
                        </div>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>&copy; 2026 ZeroBounce AI. All rights reserved.</p>
                    <div className={styles.footerSocial}>
                        <a href="https://twitter.com/zerobounceai" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://linkedin.com/company/zerobounceai" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://github.com/zerobounceai" target="_blank" rel="noopener noreferrer">GitHub</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
