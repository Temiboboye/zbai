'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './CreditsBanner.module.css';

interface CreditsBannerProps {
    credits: number;
    onRefresh?: () => void;
}

export default function CreditsBanner({ credits, onRefresh }: CreditsBannerProps) {
    const [showUpgrade, setShowUpgrade] = useState(false);

    const getStatusColor = () => {
        if (credits <= 0) return 'critical';
        if (credits <= 10) return 'low';
        if (credits <= 25) return 'medium';
        return 'good';
    };

    const status = getStatusColor();

    return (
        <div className={`${styles.banner} ${styles[status]}`}>
            <div className={styles.creditsInfo}>
                <span className={styles.icon}>⚡</span>
                <span className={styles.count}>
                    <strong>{credits}</strong> credits remaining
                </span>
                {credits <= 10 && credits > 0 && (
                    <span className={styles.warning}>Running low!</span>
                )}
                {credits <= 0 && (
                    <span className={styles.warning}>No credits left!</span>
                )}
            </div>

            <div className={styles.actions}>
                {onRefresh && (
                    <button onClick={onRefresh} className={styles.refreshBtn} title="Refresh credits">
                        🔄
                    </button>
                )}
                <Link href="/billing" className={styles.upgradeBtn}>
                    {credits <= 0 ? '🔓 Buy Credits' : '⬆️ Get More'}
                </Link>
            </div>
        </div>
    );
}
