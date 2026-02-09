import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../privacy/page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'GDPR Compliance | ZeroBounce AI',
    description: 'Learn how ZeroBounce AI complies with GDPR and protects the rights of EU data subjects.',
};

export default function GDPR() {
    return (
        <>
            <Navbar />
            <div className={styles.legalPage}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <nav className={styles.breadcrumb}>
                            <a href="/">Home</a>
                            <span>/</span>
                            <span>GDPR Compliance</span>
                        </nav>
                        <h1>GDPR Compliance</h1>
                        <p className={styles.lastUpdated}>Last Updated: February 9, 2026</p>
                    </header>

                    <div className={styles.content}>
                        <section>
                            <h2>Our Commitment to GDPR</h2>
                            <p>
                                ZeroBounce AI is committed to complying with the General Data Protection Regulation (GDPR) and protecting the privacy rights of individuals in the European Union. This page outlines how we meet GDPR requirements and respect your data protection rights.
                            </p>
                        </section>

                        <section>
                            <h2>Legal Basis for Processing</h2>
                            <p>We process personal data under the following legal bases:</p>

                            <h3>Contract Performance</h3>
                            <ul>
                                <li>Processing necessary to provide our email verification services</li>
                                <li>Managing your account and billing</li>
                                <li>Delivering customer support</li>
                            </ul>

                            <h3>Legitimate Interests</h3>
                            <ul>
                                <li>Improving our AI algorithms and services</li>
                                <li>Detecting and preventing fraud</li>
                                <li>Ensuring network and information security</li>
                                <li>Analytics and service optimization</li>
                            </ul>

                            <h3>Consent</h3>
                            <ul>
                                <li>Marketing communications (you can opt-out anytime)</li>
                                <li>Non-essential cookies</li>
                            </ul>

                            <h3>Legal Obligation</h3>
                            <ul>
                                <li>Compliance with tax and accounting regulations</li>
                                <li>Responding to lawful requests from authorities</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Your GDPR Rights</h2>
                            <p>As a data subject under GDPR, you have the following rights:</p>

                            <h3>Right to Access</h3>
                            <p>
                                You have the right to request a copy of the personal data we hold about you. We will provide this information in a structured, commonly used, and machine-readable format.
                            </p>

                            <h3>Right to Rectification</h3>
                            <p>
                                You can request correction of inaccurate or incomplete personal data. You can update most information directly in your account settings.
                            </p>

                            <h3>Right to Erasure ("Right to be Forgotten")</h3>
                            <p>
                                You can request deletion of your personal data when:
                            </p>
                            <ul>
                                <li>The data is no longer necessary for the purposes it was collected</li>
                                <li>You withdraw consent (where consent was the legal basis)</li>
                                <li>You object to processing and there are no overriding legitimate grounds</li>
                                <li>The data was unlawfully processed</li>
                            </ul>

                            <h3>Right to Restriction of Processing</h3>
                            <p>
                                You can request that we limit how we use your data in certain circumstances, such as when you contest the accuracy of the data.
                            </p>

                            <h3>Right to Data Portability</h3>
                            <p>
                                You can request your data in a portable format and have it transmitted to another controller where technically feasible.
                            </p>

                            <h3>Right to Object</h3>
                            <p>
                                You can object to processing based on legitimate interests or for direct marketing purposes. We will stop processing unless we have compelling legitimate grounds.
                            </p>

                            <h3>Rights Related to Automated Decision-Making</h3>
                            <p>
                                While our AI processes email addresses, we do not make automated decisions that significantly affect you. Our AI provides verification results that you can choose to act upon.
                            </p>
                        </section>

                        <section>
                            <h2>How to Exercise Your Rights</h2>
                            <p>To exercise any of your GDPR rights:</p>
                            <ul>
                                <li><strong>Email:</strong> <a href="mailto:gdpr@zerobounceai.com">gdpr@zerobounceai.com</a></li>
                                <li><strong>Account Settings:</strong> Many rights can be exercised directly in your account</li>
                                <li><strong>Support Portal:</strong> <a href="/support">Contact Support</a></li>
                            </ul>
                            <p>
                                We will respond to your request within 30 days. If we need more time, we will inform you and explain why.
                            </p>
                        </section>

                        <section>
                            <h2>Data Processing Details</h2>

                            <h3>What Data We Collect</h3>
                            <ul>
                                <li><strong>Account Data:</strong> Name, email, company name, billing address</li>
                                <li><strong>Verification Data:</strong> Email addresses submitted for verification (processed temporarily)</li>
                                <li><strong>Usage Data:</strong> API calls, feature usage, timestamps</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                            </ul>

                            <h3>How Long We Keep Data</h3>
                            <ul>
                                <li><strong>Account Data:</strong> While account is active + 90 days after deletion</li>
                                <li><strong>Verification Data:</strong> Not stored permanently (processed in real-time)</li>
                                <li><strong>Billing Records:</strong> 7 years (legal requirement)</li>
                                <li><strong>Usage Logs:</strong> 12 months</li>
                            </ul>

                            <h3>Where We Store Data</h3>
                            <ul>
                                <li>Primary servers located in EU-compliant data centers</li>
                                <li>Backups stored in encrypted, geographically distributed locations</li>
                                <li>All international transfers protected by Standard Contractual Clauses (SCCs)</li>
                            </ul>
                        </section>

                        <section>
                            <h2>International Data Transfers</h2>
                            <p>
                                When we transfer personal data outside the EEA, we ensure adequate protection through:
                            </p>
                            <ul>
                                <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contracts with data processors</li>
                                <li><strong>Adequacy Decisions:</strong> Transfers to countries deemed adequate by the EU Commission</li>
                                <li><strong>Additional Safeguards:</strong> Encryption, access controls, and security measures</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Data Protection Officer</h2>
                            <p>
                                We have appointed a Data Protection Officer (DPO) to oversee GDPR compliance:
                            </p>
                            <ul>
                                <li><strong>Email:</strong> <a href="mailto:dpo@zerobounceai.com">dpo@zerobounceai.com</a></li>
                                <li><strong>Role:</strong> Monitoring compliance, advising on data protection, and serving as contact point</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Data Processing Agreements</h2>
                            <p>
                                If you are a controller using our services to process personal data, we act as your data processor. We offer Data Processing Agreements (DPAs) that include:
                            </p>
                            <ul>
                                <li>Description of processing activities</li>
                                <li>Security measures and safeguards</li>
                                <li>Sub-processor information</li>
                                <li>Data subject rights assistance</li>
                                <li>Data breach notification procedures</li>
                                <li>Audit rights</li>
                            </ul>
                            <p>
                                Enterprise customers can request a DPA by contacting <a href="mailto:legal@zerobounceai.com">legal@zerobounceai.com</a>
                            </p>
                        </section>

                        <section>
                            <h2>Data Breach Notification</h2>
                            <p>
                                In the event of a data breach that poses a risk to your rights and freedoms:
                            </p>
                            <ul>
                                <li>We will notify the relevant supervisory authority within 72 hours</li>
                                <li>We will notify affected individuals without undue delay</li>
                                <li>Notification will include nature of breach, likely consequences, and mitigation measures</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Cookies and Tracking</h2>
                            <p>
                                We use cookies in compliance with GDPR requirements:
                            </p>
                            <ul>
                                <li><strong>Essential Cookies:</strong> No consent required (necessary for service functionality)</li>
                                <li><strong>Analytics Cookies:</strong> Consent requested via cookie banner</li>
                                <li><strong>Marketing Cookies:</strong> Consent requested via cookie banner</li>
                            </ul>
                            <p>
                                You can manage cookie preferences in your browser settings or through our cookie consent tool.
                            </p>
                        </section>

                        <section>
                            <h2>Children's Privacy</h2>
                            <p>
                                Our services are not directed at children under 16. We do not knowingly collect personal data from children. If we become aware that we have collected data from a child, we will delete it promptly.
                            </p>
                        </section>

                        <section>
                            <h2>Supervisory Authority</h2>
                            <p>
                                You have the right to lodge a complaint with a supervisory authority if you believe we have violated GDPR. You can contact your local data protection authority or:
                            </p>
                            <ul>
                                <li><strong>EU Lead Authority:</strong> Irish Data Protection Commission (for EU operations)</li>
                                <li><strong>Website:</strong> <a href="https://www.dataprotection.ie" target="_blank" rel="noopener noreferrer">www.dataprotection.ie</a></li>
                            </ul>
                        </section>

                        <section>
                            <h2>GDPR Compliance Measures</h2>
                            <p>We maintain GDPR compliance through:</p>
                            <ul>
                                <li><strong>Privacy by Design:</strong> Data protection built into all systems and processes</li>
                                <li><strong>Privacy by Default:</strong> Strictest privacy settings applied by default</li>
                                <li><strong>Data Minimization:</strong> Only collecting necessary data</li>
                                <li><strong>Regular Audits:</strong> Quarterly GDPR compliance reviews</li>
                                <li><strong>Staff Training:</strong> All employees trained on GDPR requirements</li>
                                <li><strong>Documentation:</strong> Comprehensive records of processing activities</li>
                                <li><strong>Impact Assessments:</strong> DPIAs conducted for high-risk processing</li>
                            </ul>
                        </section>

                        <section>
                            <h2>Updates to This Page</h2>
                            <p>
                                We may update this GDPR compliance page to reflect changes in our practices or legal requirements. Material changes will be communicated via email or prominent notice on our website.
                            </p>
                        </section>

                        <section>
                            <h2>Contact Us</h2>
                            <p>For GDPR-related questions or requests:</p>
                            <ul>
                                <li><strong>GDPR Team:</strong> <a href="mailto:gdpr@zerobounceai.com">gdpr@zerobounceai.com</a></li>
                                <li><strong>DPO:</strong> <a href="mailto:dpo@zerobounceai.com">dpo@zerobounceai.com</a></li>
                                <li><strong>General Support:</strong> <a href="/support">Contact Support</a></li>
                            </ul>
                        </section>

                        <div className={styles.relatedLinks}>
                            <h3>Related Policies</h3>
                            <ul>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/terms">Terms of Service</a></li>
                                <li><a href="/security">Security Practices</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
