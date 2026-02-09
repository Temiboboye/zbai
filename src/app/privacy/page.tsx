import styles from './page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Privacy Policy | ZeroBounce AI',
    description: 'Learn how ZeroBounce AI collects, uses, and protects your personal information. Our commitment to your privacy and data security.',
};

export default function PrivacyPolicy() {
    return (
        <div className={styles.legalPage}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <nav className={styles.breadcrumb}>
                        <a href="/">Home</a>
                        <span>/</span>
                        <span>Privacy Policy</span>
                    </nav>
                    <h1>Privacy Policy</h1>
                    <p className={styles.lastUpdated}>Last Updated: February 9, 2026</p>
                </header>

                <div className={styles.content}>
                    <section>
                        <h2>1. Introduction</h2>
                        <p>
                            Welcome to ZeroBounce AI ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered email verification platform.
                        </p>
                        <p>
                            By using ZeroBounce AI, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2>2. Information We Collect</h2>

                        <h3>2.1 Information You Provide</h3>
                        <ul>
                            <li><strong>Account Information:</strong> Name, email address, company name, billing information</li>
                            <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely through Stripe)</li>
                            <li><strong>Email Data:</strong> Email addresses you submit for verification</li>
                            <li><strong>Communications:</strong> Messages you send to our support team</li>
                        </ul>

                        <h3>2.2 Automatically Collected Information</h3>
                        <ul>
                            <li><strong>Usage Data:</strong> API calls, verification requests, feature usage</li>
                            <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                            <li><strong>Cookies:</strong> Session data, preferences, analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. How We Use Your Information</h2>
                        <p>We use the collected information for the following purposes:</p>
                        <ul>
                            <li><strong>Service Delivery:</strong> To provide email verification services and AI-powered features</li>
                            <li><strong>Account Management:</strong> To create and manage your account</li>
                            <li><strong>Payment Processing:</strong> To process transactions and manage billing</li>
                            <li><strong>Customer Support:</strong> To respond to your inquiries and provide assistance</li>
                            <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our AI algorithms</li>
                            <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security incidents</li>
                            <li><strong>Communications:</strong> To send service updates, security alerts, and marketing messages (with your consent)</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Data Processing and AI</h2>
                        <p>
                            Our AI-powered verification system processes email addresses to provide confidence scores and pattern recognition. Here's how we handle this data:
                        </p>
                        <ul>
                            <li><strong>Temporary Processing:</strong> Email addresses are processed in real-time and not stored permanently unless required for service delivery</li>
                            <li><strong>Anonymized Learning:</strong> Our AI models learn from aggregated, anonymized data patterns</li>
                            <li><strong>No Personal Content:</strong> We do not read or store email message content</li>
                            <li><strong>Secure Infrastructure:</strong> All processing occurs on encrypted, secure servers</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Data Sharing and Disclosure</h2>
                        <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>

                        <h3>5.1 Service Providers</h3>
                        <ul>
                            <li><strong>Payment Processors:</strong> Stripe for payment processing</li>
                            <li><strong>Cloud Hosting:</strong> Secure cloud infrastructure providers</li>
                            <li><strong>Analytics:</strong> Anonymous usage analytics services</li>
                        </ul>

                        <h3>5.2 Legal Requirements</h3>
                        <p>We may disclose your information if required by law or in response to valid legal requests.</p>

                        <h3>5.3 Business Transfers</h3>
                        <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
                    </section>

                    <section>
                        <h2>6. Data Security</h2>
                        <p>We implement industry-standard security measures to protect your information:</p>
                        <ul>
                            <li><strong>Encryption:</strong> All data transmitted is encrypted using TLS/SSL</li>
                            <li><strong>Access Controls:</strong> Strict access controls and authentication requirements</li>
                            <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
                            <li><strong>Secure Infrastructure:</strong> Data stored on secure, encrypted servers</li>
                            <li><strong>Employee Training:</strong> Regular security training for all team members</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Data Retention</h2>
                        <p>We retain your information for as long as necessary to provide our services and comply with legal obligations:</p>
                        <ul>
                            <li><strong>Account Data:</strong> Retained while your account is active and for 90 days after deletion</li>
                            <li><strong>Verification Data:</strong> Email addresses processed are not stored permanently</li>
                            <li><strong>Billing Records:</strong> Retained for 7 years for tax and accounting purposes</li>
                            <li><strong>Usage Logs:</strong> Retained for 12 months for security and analytics</li>
                        </ul>
                    </section>

                    <section>
                        <h2>8. Your Rights</h2>
                        <p>You have the following rights regarding your personal information:</p>
                        <ul>
                            <li><strong>Access:</strong> Request a copy of your personal data</li>
                            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                            <li><strong>Portability:</strong> Receive your data in a portable format</li>
                            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                            <li><strong>Restriction:</strong> Request limitation of data processing</li>
                        </ul>
                        <p>To exercise these rights, contact us at <a href="mailto:privacy@zerobounceai.com">privacy@zerobounceai.com</a></p>
                    </section>

                    <section>
                        <h2>9. Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies to enhance your experience:</p>
                        <ul>
                            <li><strong>Essential Cookies:</strong> Required for service functionality</li>
                            <li><strong>Analytics Cookies:</strong> To understand usage patterns</li>
                            <li><strong>Preference Cookies:</strong> To remember your settings</li>
                        </ul>
                        <p>You can control cookies through your browser settings, but some features may not function properly if disabled.</p>
                    </section>

                    <section>
                        <h2>10. International Data Transfers</h2>
                        <p>
                            Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
                        </p>
                    </section>

                    <section>
                        <h2>11. Children's Privacy</h2>
                        <p>
                            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2>12. Changes to This Policy</h2>
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
                        </p>
                    </section>

                    <section>
                        <h2>13. Contact Us</h2>
                        <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
                        <ul>
                            <li><strong>Email:</strong> <a href="mailto:privacy@zerobounceai.com">privacy@zerobounceai.com</a></li>
                            <li><strong>Support:</strong> <a href="/support">Contact Support</a></li>
                            <li><strong>Address:</strong> ZeroBounce AI, Inc.</li>
                        </ul>
                    </section>

                    <div className={styles.relatedLinks}>
                        <h3>Related Policies</h3>
                        <ul>
                            <li><a href="/terms">Terms of Service</a></li>
                            <li><a href="/security">Security Practices</a></li>
                            <li><a href="/gdpr">GDPR Compliance</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
