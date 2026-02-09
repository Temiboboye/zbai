import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../privacy/page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Security Practices | ZeroBounce AI',
    description: 'Learn about ZeroBounce AI\'s security measures, data protection, and compliance standards to keep your data safe.',
};

export default function Security() {
    return (
        <>
            <Navbar />
            <div className={styles.legalPage}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <nav className={styles.breadcrumb}>
                            <a href="/">Home</a>
                            <span>/</span>
                            <span>Security</span>
                        </nav>
                        <h1>Security Practices</h1>
                        <p className={styles.lastUpdated}>Last Updated: February 9, 2026</p>
                    </header>

                    <div className={styles.content}>
                        <section>
                            <h2>Our Commitment to Security</h2>
                            <p>
                                At ZeroBounce AI, security is not an afterthought—it's built into every aspect of our platform. We employ industry-leading security practices to protect your data and ensure the integrity of our AI-powered email verification services.
                            </p>
                        </section>

                        <section>
                            <h2>Data Encryption</h2>
                            <h3>In Transit</h3>
                            <ul>
                                <li><strong>TLS 1.3:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.3</li>
                                <li><strong>HTTPS Only:</strong> We enforce HTTPS across all our services</li>
                                <li><strong>Certificate Pinning:</strong> Additional protection against man-in-the-middle attacks</li>
                            </ul>

                            <h3>At Rest</h3>
                            <ul>
                                <li><strong>AES-256 Encryption:</strong> All stored data is encrypted using AES-256</li>
                                <li><strong>Encrypted Backups:</strong> All backups are encrypted and stored securely</li>
                                <li><strong>Key Management:</strong> Encryption keys are rotated regularly and stored in secure vaults</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Infrastructure Security</h2>
                            <ul>
                                <li><strong>Cloud Infrastructure:</strong> Hosted on enterprise-grade cloud providers with SOC 2 Type II certification</li>
                                <li><strong>Network Isolation:</strong> Services are isolated in private networks with strict firewall rules</li>
                                <li><strong>DDoS Protection:</strong> Advanced DDoS mitigation and rate limiting</li>
                                <li><strong>Intrusion Detection:</strong> 24/7 monitoring for suspicious activity</li>
                                <li><strong>Regular Patching:</strong> Automated security updates and patch management</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Application Security</h2>
                            <h3>Secure Development</h3>
                            <ul>
                                <li><strong>Code Reviews:</strong> All code is peer-reviewed before deployment</li>
                                <li><strong>Static Analysis:</strong> Automated security scanning of codebase</li>
                                <li><strong>Dependency Scanning:</strong> Regular checks for vulnerable dependencies</li>
                                <li><strong>Penetration Testing:</strong> Annual third-party security audits</li>
                            </ul>

                            <h3>Authentication & Authorization</h3>
                            <ul>
                                <li><strong>Password Requirements:</strong> Minimum 12 characters with complexity requirements</li>
                                <li><strong>Password Hashing:</strong> bcrypt with high cost factor</li>
                                <li><strong>Two-Factor Authentication:</strong> Optional 2FA via authenticator apps</li>
                                <li><strong>Session Management:</strong> Secure session tokens with automatic expiration</li>
                                <li><strong>API Keys:</strong> Encrypted API keys with rate limiting</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Data Protection</h2>
                            <h3>Data Minimization</h3>
                            <ul>
                                <li>We only collect data necessary for service delivery</li>
                                <li>Email addresses are processed temporarily and not stored permanently</li>
                                <li>Personal data is anonymized where possible</li>
                            </ul>

                            <h3>Data Retention</h3>
                            <ul>
                                <li><strong>Verification Data:</strong> Not stored permanently</li>
                                <li><strong>Account Data:</strong> Retained while account is active + 90 days</li>
                                <li><strong>Audit Logs:</strong> Retained for 12 months</li>
                                <li><strong>Billing Records:</strong> Retained for 7 years (legal requirement)</li>
                            </ul>

                            <h3>Data Deletion</h3>
                            <ul>
                                <li>Secure deletion of data upon account termination</li>
                                <li>Multi-pass overwriting of sensitive data</li>
                                <li>Backup purging within 90 days of deletion request</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Access Controls</h2>
                            <ul>
                                <li><strong>Principle of Least Privilege:</strong> Employees have access only to data necessary for their role</li>
                                <li><strong>Role-Based Access:</strong> Granular permissions based on job function</li>
                                <li><strong>Multi-Factor Authentication:</strong> Required for all employee accounts</li>
                                <li><strong>Access Logging:</strong> All data access is logged and monitored</li>
                                <li><strong>Regular Reviews:</strong> Quarterly access audits and permission reviews</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Incident Response</h2>
                            <h3>Detection & Monitoring</h3>
                            <ul>
                                <li>24/7 security monitoring and alerting</li>
                                <li>Automated anomaly detection</li>
                                <li>Real-time threat intelligence integration</li>
                            </ul>

                            <h3>Response Plan</h3>
                            <ul>
                                <li><strong>Immediate Response:</strong> Security team alerted within minutes</li>
                                <li><strong>Containment:</strong> Affected systems isolated to prevent spread</li>
                                <li><strong>Investigation:</strong> Root cause analysis and impact assessment</li>
                                <li><strong>Notification:</strong> Affected users notified within 72 hours</li>
                                <li><strong>Remediation:</strong> Vulnerabilities patched and systems restored</li>
                                <li><strong>Post-Mortem:</strong> Lessons learned and preventive measures implemented</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Compliance & Certifications</h2>
                            <ul>
                                <li><strong>GDPR:</strong> Full compliance with EU data protection regulations</li>
                                <li><strong>CCPA:</strong> California Consumer Privacy Act compliance</li>
                                <li><strong>SOC 2 Type II:</strong> In progress (expected Q3 2026)</li>
                                <li><strong>ISO 27001:</strong> Information security management certification (planned)</li>
                                <li><strong>PCI DSS:</strong> Payment Card Industry compliance via Stripe</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Employee Security</h2>
                            <ul>
                                <li><strong>Background Checks:</strong> All employees undergo background verification</li>
                                <li><strong>Security Training:</strong> Mandatory security awareness training</li>
                                <li><strong>Confidentiality Agreements:</strong> All employees sign NDAs</li>
                                <li><strong>Device Security:</strong> Company devices with full-disk encryption and MDM</li>
                                <li><strong>Remote Work Security:</strong> VPN required for remote access</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Third-Party Security</h2>
                            <ul>
                                <li><strong>Vendor Assessment:</strong> Security review of all third-party services</li>
                                <li><strong>Data Processing Agreements:</strong> DPAs with all data processors</li>
                                <li><strong>Limited Access:</strong> Third parties have minimal access to customer data</li>
                                <li><strong>Regular Audits:</strong> Ongoing monitoring of vendor security practices</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Vulnerability Disclosure</h2>
                            <p>
                                We welcome responsible disclosure of security vulnerabilities. If you discover a security issue, please report it to:
                            </p>
                            <ul>
                                <li><strong>Email:</strong> <a href="mailto:security@zerobounceai.com">security@zerobounceai.com</a></li>
                                <li><strong>PGP Key:</strong> Available upon request</li>
                            </ul>
                            <p>
                                We commit to:
                            </p>
                            <ul>
                                <li>Acknowledge receipt within 24 hours</li>
                                <li>Provide regular updates on remediation progress</li>
                                <li>Credit researchers (with permission) in our security hall of fame</li>
                                <li>Not pursue legal action against good-faith security researchers</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Security Best Practices for Users</h2>
                            <p>Help us keep your account secure:</p>
                            <ul>
                                <li><strong>Use Strong Passwords:</strong> At least 12 characters with mixed case, numbers, and symbols</li>
                                <li><strong>Enable 2FA:</strong> Add an extra layer of security to your account</li>
                                <li><strong>Rotate API Keys:</strong> Change API keys regularly and after employee turnover</li>
                                <li><strong>Monitor Activity:</strong> Review your account activity logs regularly</li>
                                <li><strong>Report Suspicious Activity:</strong> Contact us immediately if you notice anything unusual</li>
                                <li><strong>Keep Software Updated:</strong> Use the latest browser and operating system versions</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Questions?</h2>
                            <p>For security-related inquiries, contact:</p>
                            <ul>
                                <li><strong>Security Team:</strong> <a href="mailto:security@zerobounceai.com">security@zerobounceai.com</a></li>
                                <li><strong>General Support:</strong> <a href="/support">Contact Support</a></li>
                            </ul>
                        </section>

                        <div className={styles.relatedLinks}>
                            <h3>Related Policies</h3>
                            <ul>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                                <li><a href="/gdpr">GDPR Compliance</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
