import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import ComparisonTable from "@/components/ComparisonTable";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={`${styles.heroContent} animate-fade-in`}>
            <h1>
              Email verification <br />
              <span className="greenhead">that actually thinks</span>
            </h1>
            <p>
              Go beyond basic SMTP checks. Our AI-powered platform delivers 98%+ accuracy
              with catch-all confidence scoring, email pattern recognition, and domain
              reputation intelligence. Know exactly which emails to trust.
            </p>
            <div className={styles.heroActions}>
              <a href="/signup" className="btn btn-primary">Start Free Trial - 49 Credits</a>
              <a href="/comparison" className="btn btn-secondary">Compare Features</a>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.cardMockup}>
              <div className={styles.mockupHeader}>
                <div className={styles.dot} style={{ background: '#ff5f56' }} />
                <div className={styles.dot} style={{ background: '#ffbd2e' }} />
                <div className={styles.dot} style={{ background: '#27c93f' }} />
              </div>
              <div className={styles.mockupBody}>
                <div className={styles.inputLine}>
                  <span>POST /v1/verify</span>
                </div>
                <div className={styles.codeBlock}>
                  <pre>
                    {`{
  "email": "user@example.com",
  "status": "valid_safe",
  "score": 98,
  "mx": "found",
  "smtp": "responsive"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🎯</div>
              <div className={styles.statNumber}>98.3%</div>
              <div className={styles.statLabel}>Accuracy Rate</div>
              <div className={styles.statDescription}>Industry-leading verification accuracy</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statNumber}>2.5M+</div>
              <div className={styles.statLabel}>Emails Verified</div>
              <div className={styles.statDescription}>Processed this month</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🤖</div>
              <div className={styles.statNumber}>0-100</div>
              <div className={styles.statLabel}>Confidence Scores</div>
              <div className={styles.statDescription}>AI-powered catch-all detection</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>🚀</div>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Active Users</div>
              <div className={styles.statDescription}>Businesses trust ZeroBounce AI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>AI-Powered Features</h2>
            <p className={styles.sectionDesc}>
              Advanced email intelligence that goes beyond basic verification. Our AI analyzes patterns,
              scores confidence, and provides actionable insights you won't find anywhere else.
            </p>
          </div>

          <div className={styles.featureGrid}>
            <div className={`${styles.featureCard} ${styles.featureCardGray}`}>
              <div className={styles.featureCardTitle}>
                <h3>
                  <span className="greenhead">Confidence</span><br />
                  Scoring (0-100)
                </h3>
                <a href="#" className={styles.learnMore}>
                  <svg viewBox="0 0 41 41" fill="none">
                    <circle cx="20.5" cy="20.5" r="20.5" fill="#191A23" />
                    <path d="M11.25 24.701C10.5326 25.1152 10.2867 26.0326 10.701 26.75C11.1152 27.4674 12.0326 27.7133 12.75 27.299L11.25 24.701ZM30.7694 16.3882C30.9838 15.588 30.5089 14.7655 29.7087 14.5511L16.6687 11.0571C15.8685 10.8426 15.046 11.3175 14.8316 12.1177C14.6172 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0607L24.3776 28.6518C24.1631 29.452 24.638 30.2745 25.4382 30.4889C26.2384 30.7034 27.0609 30.2285 27.2753 29.4283L30.7694 16.3882ZM12.75 27.299L30.0705 17.299L28.5705 14.701L11.25 24.701L12.75 27.299Z" fill="#B9FF66" />
                  </svg>
                  Learn more
                </a>
              </div>
            </div>

            <div className={`${styles.featureCard} ${styles.featureCardGreen}`}>
              <div className={styles.featureCardTitle}>
                <h3>
                  <span className="whitehead">Email Pattern</span><br />
                  Recognition
                </h3>
                <a href="#" className={styles.learnMore}>
                  <svg viewBox="0 0 41 41" fill="none">
                    <circle cx="20.5" cy="20.5" r="20.5" fill="#191A23" />
                    <path d="M11.25 24.701C10.5326 25.1152 10.2867 26.0326 10.701 26.75C11.1152 27.4674 12.0326 27.7133 12.75 27.299L11.25 24.701ZM30.7694 16.3882C30.9838 15.588 30.5089 14.7655 29.7087 14.5511L16.6687 11.0571C15.8685 10.8426 15.046 11.3175 14.8316 12.1177C14.6172 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0607L24.3776 28.6518C24.1631 29.452 24.638 30.2745 25.4382 30.4889C26.2384 30.7034 27.0609 30.2285 27.2753 29.4283L30.7694 16.3882ZM12.75 27.299L30.0705 17.299L28.5705 14.701L11.25 24.701L12.75 27.299Z" fill="#B9FF66" />
                  </svg>
                  Learn more
                </a>
              </div>
            </div>

            <div className={`${styles.featureCard} ${styles.featureCardDark}`}>
              <div className={styles.featureCardTitle}>
                <h3>
                  <span className="whitehead">Domain</span><br />
                  Reputation
                </h3>
                <a href="#" className={styles.learnMore} style={{ color: 'white' }}>
                  <svg viewBox="0 0 41 41" fill="none">
                    <circle cx="20.5" cy="20.5" r="20.5" fill="white" />
                    <path d="M11.25 24.701C10.5326 25.1152 10.2867 26.0326 10.701 26.75C11.1152 27.4674 12.0326 27.7133 12.75 27.299L11.25 24.701ZM30.7694 16.3882C30.9838 15.588 30.5089 14.7655 29.7087 14.5511L16.6687 11.0571C15.8685 10.8426 15.046 11.3175 14.8316 12.1177C14.6172 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0607L24.3776 28.6518C24.1631 29.452 24.638 30.2745 25.4382 30.4889C26.2384 30.7034 27.0609 30.2285 27.2753 29.4283L30.7694 16.3882ZM12.75 27.299L30.0705 17.299L28.5705 14.701L11.25 24.701L12.75 27.299Z" fill="#191A23" />
                  </svg>
                  Learn more
                </a>
              </div>
            </div>

            <div className={`${styles.featureCard} ${styles.featureCardGray}`}>
              <div className={styles.featureCardTitle}>
                <h3>
                  <span className="greenhead">Email</span><br />
                  Finder
                </h3>
                <a href="#" className={styles.learnMore}>
                  <svg viewBox="0 0 41 41" fill="none">
                    <circle cx="20.5" cy="20.5" r="20.5" fill="#191A23" />
                    <path d="M11.25 24.701C10.5326 25.1152 10.2867 26.0326 10.701 26.75C11.1152 27.4674 12.0326 27.7133 12.75 27.299L11.25 24.701ZM30.7694 16.3882C30.9838 15.588 30.5089 14.7655 29.7087 14.5511L16.6687 11.0571C15.8685 10.8426 15.046 11.3175 14.8316 12.1177C14.6172 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0607L24.3776 28.6518C24.1631 29.452 24.638 30.2745 25.4382 30.4889C26.2384 30.7034 27.0609 30.2285 27.2753 29.4283L30.7694 16.3882ZM12.75 27.299L30.0705 17.299L28.5705 14.701L11.25 24.701L12.75 27.299Z" fill="#B9FF66" />
                  </svg>
                  Learn more
                </a>
              </div>
            </div>

            <div className={`${styles.featureCard} ${styles.featureCardGreen}`}>
              <div className={styles.featureCardTitle}>
                <h3>
                  <span className="whitehead">Real-Time</span><br />
                  API
                </h3>
                <a href="#" className={styles.learnMore}>
                  <svg viewBox="0 0 41 41" fill="none">
                    <circle cx="20.5" cy="20.5" r="20.5" fill="#191A23" />
                    <path d="M11.25 24.701C10.5326 25.1152 10.2867 26.0326 10.701 26.75C11.1152 27.4674 12.0326 27.7133 12.75 27.299L11.25 24.701ZM30.7694 16.3882C30.9838 15.588 30.5089 14.7655 29.7087 14.5511L16.6687 11.0571C15.8685 10.8426 15.046 11.3175 14.8316 12.1177C14.6172 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0607L24.3776 28.6518C24.1631 29.452 24.638 30.2745 25.4382 30.4889C26.2384 30.7034 27.0609 30.2285 27.2753 29.4283L30.7694 16.3882ZM12.75 27.299L30.0705 17.299L28.5705 14.701L11.25 24.701L12.75 27.299Z" fill="#B9FF66" />
                  </svg>
                  Learn more
                </a>
              </div>
            </div>

            <div className={`${styles.featureCard} ${styles.featureCardDark}`}>
              <div className={styles.featureCardTitle}>
                <h3>
                  <span className="greenhead">Bulk</span><br />
                  Processing
                </h3>
                <a href="#" className={styles.learnMore} style={{ color: 'white' }}>
                  <svg viewBox="0 0 41 41" fill="none">
                    <circle cx="20.5" cy="20.5" r="20.5" fill="white" />
                    <path d="M11.25 24.701C10.5326 25.1152 10.2867 26.0326 10.701 26.75C11.1152 27.4674 12.0326 27.7133 12.75 27.299L11.25 24.701ZM30.7694 16.3882C30.9838 15.588 30.5089 14.7655 29.7087 14.5511L16.6687 11.0571C15.8685 10.8426 15.046 11.3175 14.8316 12.1177C14.6172 12.9179 15.0921 13.7404 15.8923 13.9548L27.4834 17.0607L24.3776 28.6518C24.1631 29.452 24.638 30.2745 25.4382 30.4889C26.2384 30.7034 27.0609 30.2285 27.2753 29.4283L30.7694 16.3882ZM12.75 27.299L30.0705 17.299L28.5705 14.701L11.25 24.701L12.75 27.299Z" fill="#191A23" />
                  </svg>
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ComparisonTable />

      {/* Testimonials Section */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className={styles.testimonialsHeader}>
            <h2>Trusted by <span className="greenhead">Email Marketers</span></h2>
            <p>See how our AI-powered platform helps businesses achieve better results</p>
          </div>
          <div className={styles.testimonialsGrid}>
            <div className={styles.testimonialCard}>
              <div className={styles.quote}>"</div>
              <p className={styles.testimonialText}>
                The confidence scoring is a game-changer. We used to waste credits on
                catch-all domains. Now we know exactly which ones are worth trying.
                <strong> Generated $127K in new ARR</strong> from emails we would have skipped.
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>SM</div>
                <div>
                  <div className={styles.authorName}>Sarah Martinez</div>
                  <div className={styles.authorTitle}>Marketing Director, SaaS Startup</div>
                </div>
              </div>
              <div className={styles.testimonialFeature}>
                <span className={styles.featureBadge}>🤖 AI Confidence Scoring</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.quote}>"</div>
              <p className={styles.testimonialText}>
                Switched from NeverBounce and immediately noticed better accuracy.
                The AI pattern recognition <strong>found 340 emails</strong> we would have missed.
                The ROI paid for itself in the first week.
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>JK</div>
                <div>
                  <div className={styles.authorName}>James Kim</div>
                  <div className={styles.authorTitle}>Lead Generation Specialist</div>
                </div>
              </div>
              <div className={styles.testimonialFeature}>
                <span className={styles.featureBadge}>🎯 Pattern Recognition</span>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.quote}>"</div>
              <p className={styles.testimonialText}>
                Finally, a verification tool that understands our needs as an agency.
                The built-in email finder <strong>saves us $99/month</strong> on Hunter.io.
                Plus the 98% accuracy is unmatched.
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>ML</div>
                <div>
                  <div className={styles.authorName}>Maria Lopez</div>
                  <div className={styles.authorTitle}>Agency Owner</div>
                </div>
              </div>
              <div className={styles.testimonialFeature}>
                <span className={styles.featureBadge}>💰 All-in-One Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerLinks}>
              <a href="#features">Features</a>
              <a href="/comparison">Compare</a>
              <a href="#pricing">Pricing</a>
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
            </div>
            <p>© 2026 ZeroBounce AI. All rights reserved. GDPR Compliant.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
