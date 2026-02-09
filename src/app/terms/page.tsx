import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../privacy/page.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Terms of Service | ZeroBounce AI',
    description: 'Read the terms and conditions for using ZeroBounce AI email verification services. Understand your rights and responsibilities.',
};

export default function TermsOfService() {
    return (
        <>
            <Navbar />
            <div className={styles.legalPage}>
                <div className={styles.container}>
                    <header className={styles.header}>
                        <nav className={styles.breadcrumb}>
                            <a href="/">Home</a>
                            <span>/</span>
                            <span>Terms of Service</span>
                        </nav>
                        <h1>Terms of Service</h1>
                        <p className={styles.lastUpdated}>Last Updated: February 9, 2026</p>
                    </header>

                    <div className={styles.content}>
                        <section>
                            <h2>1. Acceptance of Terms</h2>
                            <p>
                                Welcome to ZeroBounce AI. By accessing or using our AI-powered email verification platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
                            </p>
                            <p>
                                These Terms constitute a legally binding agreement between you ("User," "you," or "your") and ZeroBounce AI, Inc. ("ZeroBounce AI," "we," "us," or "our").
                            </p>
                        </section>

                        <section>
                            <h2>2. Service Description</h2>
                            <p>ZeroBounce AI provides:</p>
                            <ul>
                                <li><strong>Email Verification:</strong> AI-powered email address validation and verification</li>
                                <li><strong>Confidence Scoring:</strong> 0-100 confidence scores for catch-all domains</li>
                                <li><strong>Pattern Recognition:</strong> Email pattern analysis and suggestions</li>
                                <li><strong>Domain Intelligence:</strong> Domain reputation scoring and analysis</li>
                                <li><strong>Email Finder:</strong> Email discovery and validation tools</li>
                                <li><strong>Bulk Processing:</strong> Batch email verification capabilities</li>
                                <li><strong>API Access:</strong> Programmatic access to our verification services</li>
                            </ul>
                        </section>

                        <section>
                            <h2>3. Account Registration</h2>

                            <h3>3.1 Eligibility</h3>
                            <p>You must be at least 18 years old and capable of forming a binding contract to use our Service.</p>

                            <h3>3.2 Account Information</h3>
                            <ul>
                                <li>You must provide accurate, current, and complete information</li>
                                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                                <li>You are responsible for all activities that occur under your account</li>
                                <li>You must notify us immediately of any unauthorized access</li>
                            </ul>

                            <h3>3.3 Account Security</h3>
                            <p>
                                You agree to use a strong password and enable two-factor authentication when available. We are not liable for any loss or damage arising from your failure to protect your account credentials.
                            </p>
                        </section>

                        <section>
                            <h2>4. Acceptable Use Policy</h2>

                            <h3>4.1 Permitted Uses</h3>
                            <p>You may use our Service for:</p>
                            <ul>
                                <li>Verifying email addresses for legitimate business purposes</li>
                                <li>Improving email deliverability for marketing campaigns</li>
                                <li>Cleaning and maintaining email lists</li>
                                <li>Validating user-provided email addresses</li>
                            </ul>

                            <h3>4.2 Prohibited Uses</h3>
                            <p>You may NOT use our Service to:</p>
                            <ul>
                                <li>Send spam or unsolicited commercial emails</li>
                                <li>Harvest email addresses without consent</li>
                                <li>Violate any applicable laws or regulations</li>
                                <li>Infringe on intellectual property rights</li>
                                <li>Transmit malware, viruses, or harmful code</li>
                                <li>Attempt to gain unauthorized access to our systems</li>
                                <li>Reverse engineer or copy our AI algorithms</li>
                                <li>Resell or redistribute our Service without authorization</li>
                                <li>Use the Service for illegal activities</li>
                            </ul>
                        </section>

                        <section>
                            <h2>5. Credits and Billing</h2>

                            <h3>5.1 Credit System</h3>
                            <ul>
                                <li>Services are provided on a credit-based system</li>
                                <li>One credit = one email verification</li>
                                <li>Credits are non-refundable once purchased</li>
                                <li>Credits expire according to your plan (6-24 months)</li>
                                <li>Unused credits do not roll over unless specified in your plan</li>
                            </ul>

                            <h3>5.2 Pricing and Payment</h3>
                            <ul>
                                <li>Prices are listed on our pricing page and subject to change</li>
                                <li>All fees are in USD unless otherwise stated</li>
                                <li>Payment is due immediately upon purchase</li>
                                <li>We accept credit cards and cryptocurrency via our payment processors</li>
                                <li>You authorize us to charge your payment method for all fees</li>
                            </ul>

                            <h3>5.3 Refund Policy</h3>
                            <p>
                                We offer a 30-day money-back guarantee for first-time purchases. Refund requests must be submitted within 30 days of purchase and are subject to review. Credits used during this period will be deducted from the refund amount.
                            </p>
                        </section>

                        <section>
                            <h2>6. Service Level Agreement (SLA)</h2>

                            <h3>6.1 Uptime Guarantee</h3>
                            <ul>
                                <li><strong>Standard Plans:</strong> 99.5% uptime</li>
                                <li><strong>Enterprise Plans:</strong> 99.9% uptime with SLA credits</li>
                            </ul>

                            <h3>6.2 Accuracy Guarantee</h3>
                            <p>
                                We guarantee 98%+ accuracy for email verification. If you believe our results are inaccurate, please contact support with specific examples for review.
                            </p>

                            <h3>6.3 API Rate Limits</h3>
                            <ul>
                                <li><strong>Starter:</strong> 500 requests/day</li>
                                <li><strong>Professional:</strong> 5,000 requests/day</li>
                                <li><strong>Business:</strong> 25,000 requests/day</li>
                                <li><strong>Enterprise:</strong> Unlimited (fair use applies)</li>
                            </ul>
                        </section>

                        <section>
                            <h2>7. Intellectual Property</h2>

                            <h3>7.1 Our Rights</h3>
                            <p>
                                All content, features, and functionality of the Service, including but not limited to text, graphics, logos, icons, images, audio clips, data compilations, software, and AI algorithms, are the exclusive property of ZeroBounce AI and are protected by copyright, trademark, and other intellectual property laws.
                            </p>

                            <h3>7.2 Your Rights</h3>
                            <p>
                                You retain all rights to the email addresses you submit for verification. We do not claim ownership of your data.
                            </p>

                            <h3>7.3 License</h3>
                            <p>
                                We grant you a limited, non-exclusive, non-transferable license to access and use the Service for your internal business purposes in accordance with these Terms.
                            </p>
                        </section>

                        <section>
                            <h2>8. Data and Privacy</h2>
                            <p>
                                Your use of the Service is also governed by our <a href="/privacy">Privacy Policy</a>. By using the Service, you consent to our collection, use, and disclosure of your information as described in the Privacy Policy.
                            </p>
                            <p>Key points:</p>
                            <ul>
                                <li>We process email addresses temporarily for verification purposes</li>
                                <li>We do not sell or share your data with third parties</li>
                                <li>All data is encrypted in transit and at rest</li>
                                <li>We comply with GDPR, CCPA, and other privacy regulations</li>
                            </ul>
                        </section>

                        <section>
                            <h2>9. Warranties and Disclaimers</h2>

                            <h3>9.1 Service Provided "As Is"</h3>
                            <p>
                                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                            </p>

                            <h3>9.2 No Guarantee of Results</h3>
                            <p>
                                While we strive for 98%+ accuracy, we do not guarantee that the Service will meet your specific requirements or that email verification results will be 100% accurate in all cases.
                            </p>

                            <h3>9.3 Third-Party Services</h3>
                            <p>
                                We are not responsible for the availability, accuracy, or reliability of third-party services integrated with our platform.
                            </p>
                        </section>

                        <section>
                            <h2>10. Limitation of Liability</h2>
                            <p>
                                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ZEROBOUNCE AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
                            </p>
                            <ul>
                                <li>Your use or inability to use the Service</li>
                                <li>Unauthorized access to or alteration of your data</li>
                                <li>Statements or conduct of any third party on the Service</li>
                                <li>Any other matter relating to the Service</li>
                            </ul>
                            <p>
                                OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM.
                            </p>
                        </section>

                        <section>
                            <h2>11. Indemnification</h2>
                            <p>
                                You agree to indemnify, defend, and hold harmless ZeroBounce AI, its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees, arising out of or in any way connected with:
                            </p>
                            <ul>
                                <li>Your access to or use of the Service</li>
                                <li>Your violation of these Terms</li>
                                <li>Your violation of any third-party rights</li>
                                <li>Your use of verification results</li>
                            </ul>
                        </section>

                        <section>
                            <h2>12. Termination</h2>

                            <h3>12.1 By You</h3>
                            <p>
                                You may terminate your account at any time by contacting support. Termination does not entitle you to a refund of unused credits.
                            </p>

                            <h3>12.2 By Us</h3>
                            <p>
                                We may suspend or terminate your account immediately, without prior notice, if you:
                            </p>
                            <ul>
                                <li>Violate these Terms</li>
                                <li>Engage in fraudulent activity</li>
                                <li>Fail to pay fees when due</li>
                                <li>Use the Service in a manner that harms our business or reputation</li>
                            </ul>

                            <h3>12.3 Effect of Termination</h3>
                            <p>
                                Upon termination, your right to use the Service will immediately cease. All provisions of these Terms that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, and limitations of liability.
                            </p>
                        </section>

                        <section>
                            <h2>13. Changes to Terms</h2>
                            <p>
                                We reserve the right to modify these Terms at any time. We will notify you of material changes by:
                            </p>
                            <ul>
                                <li>Posting the updated Terms on our website</li>
                                <li>Updating the "Last Updated" date</li>
                                <li>Sending an email notification (for significant changes)</li>
                            </ul>
                            <p>
                                Your continued use of the Service after changes become effective constitutes acceptance of the updated Terms.
                            </p>
                        </section>

                        <section>
                            <h2>14. Dispute Resolution</h2>

                            <h3>14.1 Governing Law</h3>
                            <p>
                                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions.
                            </p>

                            <h3>14.2 Arbitration</h3>
                            <p>
                                Any dispute arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the American Arbitration Association's rules, except that either party may seek injunctive relief in court.
                            </p>

                            <h3>14.3 Class Action Waiver</h3>
                            <p>
                                You agree that any arbitration or proceeding shall be limited to the dispute between you and ZeroBounce AI individually. You waive any right to participate in a class action lawsuit or class-wide arbitration.
                            </p>
                        </section>

                        <section>
                            <h2>15. Miscellaneous</h2>

                            <h3>15.1 Entire Agreement</h3>
                            <p>
                                These Terms, together with our Privacy Policy, constitute the entire agreement between you and ZeroBounce AI regarding the Service.
                            </p>

                            <h3>15.2 Severability</h3>
                            <p>
                                If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
                            </p>

                            <h3>15.3 Waiver</h3>
                            <p>
                                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                            </p>

                            <h3>15.4 Assignment</h3>
                            <p>
                                You may not assign or transfer these Terms without our prior written consent. We may assign our rights and obligations without restriction.
                            </p>
                        </section>

                        <section>
                            <h2>16. Contact Information</h2>
                            <p>If you have questions about these Terms, please contact us:</p>
                            <ul>
                                <li><strong>Email:</strong> <a href="mailto:legal@zerobounceai.com">legal@zerobounceai.com</a></li>
                                <li><strong>Support:</strong> <a href="/support">Contact Support</a></li>
                                <li><strong>Address:</strong> ZeroBounce AI, Inc.</li>
                            </ul>
                        </section>

                        <div className={styles.relatedLinks}>
                            <h3>Related Policies</h3>
                            <ul>
                                <li><a href="/privacy">Privacy Policy</a></li>
                                <li><a href="/security">Security Practices</a></li>
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
