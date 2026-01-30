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
              Navigating email <br />
              <span className="greenhead">deliverability</span> <br />
              for success
            </h1>
            <p>
              Our email verification platform helps businesses protect sender reputation
              and maximize deliverability through real-time validation, catch-all detection,
              and spam trap identification.
            </p>
            <div className={styles.heroActions}>
              <a href="/signup" className="btn btn-primary">Get 49 Free Credits</a>
              <a href="/login" className="btn btn-secondary">Login</a>
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
            <h2 className={styles.sectionTitle}>Services</h2>
            <p className={styles.sectionDesc}>
              At ZeroBounce, we offer a range of email verification services to keep your lists clean and your sender reputation protected.
            </p>
          </div>

          <div className={styles.featureGrid}>
            <div className={`${styles.featureCard} ${styles.featureCardGray}`}>
              <div className={styles.featureCardTitle}>
                <h3>
                  <span className="greenhead">Syntax & MX</span><br />
                  Validation
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
                  <span className="whitehead">SMTP</span><br />
                  Verification
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
                  <span className="whitehead">Catch-All</span><br />
                  Detection
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
                  <span className="greenhead">Disposable</span><br />
                  Detection
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
                  <span className="whitehead">Spam Trap</span><br />
                  Identification
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
                  Verification
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
