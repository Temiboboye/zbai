'use client';

import { useState } from 'react';
import styles from './ComparisonTable.module.css';

interface Feature {
    name: string;
    category: string;
    zeroBounceAI: boolean | string;
    zeroBounce: boolean | string;
    neverBounce: boolean | string;
    hunter: boolean | string;
    clearout: boolean | string;
}

const features: Feature[] = [
    // AI-Powered Features
    {
        name: 'AI-Powered Verification',
        category: 'AI Features',
        zeroBounceAI: true,
        zeroBounce: false,
        neverBounce: false,
        hunter: false,
        clearout: false,
    },
    {
        name: 'Catch-All Confidence Scoring (0-100)',
        category: 'AI Features',
        zeroBounceAI: true,
        zeroBounce: 'Binary only',
        neverBounce: 'Binary only',
        hunter: false,
        clearout: 'Binary only',
    },
    {
        name: 'Email Pattern Recognition',
        category: 'AI Features',
        zeroBounceAI: true,
        zeroBounce: false,
        neverBounce: false,
        hunter: 'Limited',
        clearout: false,
    },
    {
        name: 'Domain Reputation Intelligence',
        category: 'AI Features',
        zeroBounceAI: true,
        zeroBounce: false,
        neverBounce: false,
        hunter: false,
        clearout: false,
    },
    {
        name: 'Email Suggestion Engine',
        category: 'AI Features',
        zeroBounceAI: true,
        zeroBounce: false,
        neverBounce: false,
        hunter: false,
        clearout: false,
    },

    // Core Verification
    {
        name: 'Syntax Validation',
        category: 'Core Verification',
        zeroBounceAI: true,
        zeroBounce: true,
        neverBounce: true,
        hunter: true,
        clearout: true,
    },
    {
        name: 'MX Record Check',
        category: 'Core Verification',
        zeroBounceAI: true,
        zeroBounce: true,
        neverBounce: true,
        hunter: true,
        clearout: true,
    },
    {
        name: 'SMTP Verification',
        category: 'Core Verification',
        zeroBounceAI: true,
        zeroBounce: true,
        neverBounce: true,
        hunter: true,
        clearout: true,
    },
    {
        name: 'Disposable Email Detection',
        category: 'Core Verification',
        zeroBounceAI: true,
        zeroBounce: true,
        neverBounce: true,
        hunter: true,
        clearout: true,
    },
    {
        name: 'Role-Based Email Detection',
        category: 'Core Verification',
        zeroBounceAI: true,
        zeroBounce: true,
        neverBounce: true,
        hunter: true,
        clearout: true,
    },

    // Additional Features
    {
        name: 'Email Finder (Built-in)',
        category: 'Additional Features',
        zeroBounceAI: 'Included',
        zeroBounce: 'Separate product',
        neverBounce: false,
        hunter: '$99/mo extra',
        clearout: false,
    },
    {
        name: 'Bulk Email Sorter',
        category: 'Additional Features',
        zeroBounceAI: true,
        zeroBounce: false,
        neverBounce: false,
        hunter: false,
        clearout: false,
    },
    {
        name: 'Advanced Analytics Dashboard',
        category: 'Additional Features',
        zeroBounceAI: true,
        zeroBounce: 'Basic',
        neverBounce: 'Basic',
        hunter: true,
        clearout: 'Basic',
    },
    {
        name: 'Blacklist Monitoring',
        category: 'Additional Features',
        zeroBounceAI: true,
        zeroBounce: true,
        neverBounce: false,
        hunter: false,
        clearout: true,
    },

    // API & Integration
    {
        name: 'REST API Access',
        category: 'API & Integration',
        zeroBounceAI: 'All plans',
        zeroBounce: 'All plans',
        neverBounce: 'All plans',
        hunter: 'Paid only',
        clearout: 'All plans',
    },
    {
        name: 'Webhook Support',
        category: 'API & Integration',
        zeroBounceAI: true,
        zeroBounce: true,
        neverBounce: true,
        hunter: false,
        clearout: true,
    },
    {
        name: 'Bulk Upload (Unlimited Size)',
        category: 'API & Integration',
        zeroBounceAI: 'Business+',
        zeroBounce: 'Paid plans',
        neverBounce: 'Paid plans',
        hunter: false,
        clearout: 'Paid plans',
    },

    // Pricing & Credits
    {
        name: 'Credits Never Expire',
        category: 'Pricing & Credits',
        zeroBounceAI: '12-24 months',
        zeroBounce: '12 months',
        neverBounce: '12 months',
        hunter: 'Monthly',
        clearout: '12 months',
    },
    {
        name: 'Free Trial Credits',
        category: 'Pricing & Credits',
        zeroBounceAI: '49 credits',
        zeroBounce: '100 credits',
        neverBounce: '1,000 credits',
        hunter: '25 searches',
        clearout: '100 credits',
    },
    {
        name: '10K Credits Price',
        category: 'Pricing & Credits',
        zeroBounceAI: '$55 (Founding)',
        zeroBounce: '$40',
        neverBounce: '$40',
        hunter: 'N/A',
        clearout: '$70',
    },
    {
        name: 'Accuracy Rate',
        category: 'Pricing & Credits',
        zeroBounceAI: '98%+',
        zeroBounce: '95%',
        neverBounce: '94%',
        hunter: '92%',
        clearout: '93%',
    },
];

const categories = [
    'AI Features',
    'Core Verification',
    'Additional Features',
    'API & Integration',
    'Pricing & Credits',
];

export default function ComparisonTable() {
    const [activeCategory, setActiveCategory] = useState<string>('AI Features');

    const renderValue = (value: boolean | string) => {
        if (value === true) {
            return <span className={styles.checkmark}>✓</span>;
        } else if (value === false) {
            return <span className={styles.cross}>✗</span>;
        } else {
            return <span className={styles.textValue}>{value}</span>;
        }
    };

    const filteredFeatures = features.filter(f => f.category === activeCategory);

    return (
        <div className={styles.comparisonWrapper}>
            <div className={styles.header}>
                <h2>Why Choose ZeroBounce AI?</h2>
                <p>See how our AI-powered platform stacks up against the competition</p>
            </div>

            {/* Category Tabs */}
            <div className={styles.categoryTabs}>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`${styles.categoryTab} ${activeCategory === category ? styles.active : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Comparison Table */}
            <div className={styles.tableWrapper}>
                <table className={styles.comparisonTable}>
                    <thead>
                        <tr>
                            <th className={styles.featureColumn}>Feature</th>
                            <th className={styles.ourColumn}>
                                <div className={styles.ourBadge}>
                                    <span className={styles.crown}>👑</span>
                                    <span>ZeroBounce AI</span>
                                </div>
                            </th>
                            <th>ZeroBounce</th>
                            <th>NeverBounce</th>
                            <th>Hunter.io</th>
                            <th>Clearout</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFeatures.map((feature, idx) => (
                            <tr key={idx}>
                                <td className={styles.featureName}>{feature.name}</td>
                                <td className={styles.ourValue}>{renderValue(feature.zeroBounceAI)}</td>
                                <td>{renderValue(feature.zeroBounce)}</td>
                                <td>{renderValue(feature.neverBounce)}</td>
                                <td>{renderValue(feature.hunter)}</td>
                                <td>{renderValue(feature.clearout)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* CTA Section */}
            <div className={styles.ctaSection}>
                <h3>Ready to experience the difference?</h3>
                <p>Start with 49 free credits. No credit card required.</p>
                <div className={styles.ctaButtons}>
                    <a href="/signup" className="btn btn-primary">Start Free Trial</a>
                    <a href="/billing" className="btn btn-secondary">View Pricing</a>
                </div>
            </div>

            {/* Disclaimer */}
            <div className={styles.disclaimer}>
                <p>* Pricing and features accurate as of February 2026. Competitor data based on publicly available information.</p>
            </div>
        </div>
    );
}
