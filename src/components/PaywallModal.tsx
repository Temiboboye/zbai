'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './PaywallModal.module.css';

interface PaywallModalProps {
    isOpen: boolean;
    onClose?: () => void;
    creditsNeeded?: number;
    feature?: string;
}

const PRICING_TIERS = [
    { credits: 1000, price: 5, perCredit: 0.005, popular: false },
    { credits: 5000, price: 20, perCredit: 0.004, popular: true },
    { credits: 25000, price: 75, perCredit: 0.003, popular: false },
    { credits: 100000, price: 200, perCredit: 0.002, popular: false },
];

export default function PaywallModal({ isOpen, onClose, creditsNeeded = 1, feature = 'this feature' }: PaywallModalProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.lockIcon}>🔒</div>
                    <h2>Credits Required</h2>
                    <p>You need <strong>{creditsNeeded}</strong> credit{creditsNeeded > 1 ? 's' : ''} to use {feature}</p>
                </div>

                <div className={styles.tiers}>
                    {PRICING_TIERS.map((tier) => (
                        <div
                            key={tier.credits}
                            className={`${styles.tier} ${tier.popular ? styles.popular : ''}`}
                        >
                            {tier.popular && <span className={styles.badge}>Most Popular</span>}
                            <div className={styles.tierCredits}>
                                <strong>{tier.credits.toLocaleString()}</strong>
                                <span>credits</span>
                            </div>
                            <div className={styles.tierPrice}>
                                <span className={styles.currency}>$</span>
                                <span className={styles.amount}>{tier.price}</span>
                            </div>
                            <div className={styles.perCredit}>
                                ${tier.perCredit.toFixed(3)}/credit
                            </div>
                            <Link
                                href={`/billing?pack=${tier.credits}`}
                                className={styles.buyBtn}
                            >
                                Buy Now
                            </Link>
                        </div>
                    ))}
                </div>

                <div className={styles.footer}>
                    <p className={styles.guarantee}>
                        ✓ Instant delivery &nbsp;•&nbsp; ✓ No expiration &nbsp;•&nbsp; ✓ Secure payment
                    </p>
                    {onClose && (
                        <button onClick={onClose} className={styles.closeBtn}>
                            Maybe later
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
