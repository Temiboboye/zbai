import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
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
              <a href="#features" className="btn btn-secondary">See How It Works</a>
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

      <Pricing />

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>© 2026 ZeroBounce. All rights reserved. GDPR Compliant.</p>
        </div>
      </footer>
    </main>
  );
}
