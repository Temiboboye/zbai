import styles from './Pricing.module.css';

const plans = [
    {
        name: 'Starter',
        price: '$8.40',
        credits: '1,000',
        costPerCredit: '$0.0084',
        features: ['30-Day Rollover', 'Email Support', 'AI Verification', 'Bulk Upload & API'],
        buttonText: 'Get Started',
        variant: 'gray',
        packId: 'pack_1k'
    },
    {
        name: 'Professional',
        price: '$55.30',
        credits: '10,000',
        costPerCredit: '$0.0055',
        features: ['60-Day Rollover', 'Priority Email', 'Confidence Scoring', 'Pattern Recognition'],
        buttonText: 'Get Started',
        variant: 'dark',
        packId: 'pack_10k',
        popular: true
    },
    {
        name: 'Business',
        price: '$209.30',
        credits: '50,000',
        costPerCredit: '$0.0042',
        features: ['90-Day Rollover', 'Priority Support', 'Domain Intelligence', 'Dedicated Account Manager'],
        buttonText: 'Get Started',
        variant: 'gray',
        packId: 'pack_50k'
    }
];

export default function Pricing() {
    return (
        <section id="pricing" className={styles.pricing}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2><span className="greenhead">Pricing</span></h2>
                    <p>AI-powered email verification starting at just $8.40 for 1,000 credits. No hidden fees.</p>
                    <a href="/comparison" className={styles.compareLink}>
                        See how we compare to competitors →
                    </a>
                </div>

                <div className={styles.grid}>
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`${styles.card} ${plan.variant === 'dark' ? styles.cardDark : styles.cardGray}`}
                        >
                            <h3>{plan.name}</h3>
                            <div className={styles.priceContainer}>
                                <span className={styles.price}>{plan.price}</span>
                                <span className={styles.credits}>/ {plan.credits} credits</span>
                            </div>
                            <p className={styles.costPer}>{plan.costPerCredit} per email</p>

                            <ul className={styles.features}>
                                {plan.features.map((feature) => (
                                    <li key={feature}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`btn ${plan.variant === 'dark' ? 'btn-green' : 'btn-primary'} ${styles.cta}`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
