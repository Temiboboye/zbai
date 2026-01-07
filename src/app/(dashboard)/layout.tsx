'use client';

import Link from 'next/link';
import styles from './layout.module.css';
import { CreditProvider, useCredits } from '@/contexts/CreditContext';

function CreditBalance() {
    const { balance, loading } = useCredits();
    return <h3>{loading ? '...' : balance.toLocaleString()}</h3>;
}

function DashboardInner({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>
                        <span className="greenhead">ZB</span>
                        ZeroBounce
                    </Link>
                </div>

                <nav className={styles.nav}>
                    <Link href="/dashboard" className={styles.navLink}>
                        <span>📊</span> Dashboard
                    </Link>
                    <Link href="/verify" className={styles.navLink}>
                        <span>🔍</span> Real-Time Verify
                    </Link>
                    <Link href="/bulk" className={styles.navLink}>
                        <span>📁</span> Bulk Tasks
                    </Link>
                    <Link href="/sort" className={styles.navLink}>
                        <span>📊</span> Sort Emails
                    </Link>
                    <Link href="/api-keys" className={styles.navLink}>
                        <span>🔑</span> API Keys
                    </Link>
                    <Link href="/blacklist" className={styles.navLink}>
                        <span>🚫</span> Blacklist Monitor
                    </Link>
                    <Link href="/billing" className={styles.navLink}>
                        <span>💳</span> Billing
                    </Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.creditCard}>
                        <p>Credits Remaining</p>
                        <CreditBalance />
                    </div>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>JD</div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName}>John Doe</p>
                            <p className={styles.userEmail}>john@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className={styles.content}>
                <header className={styles.topHeader}>
                    <h2>Welcome back, John</h2>
                    <div className={styles.headerActions}>
                        <button className={styles.iconBtn}>🔔</button>
                        <button className={styles.iconBtn}>⚙️</button>
                    </div>
                </header>
                <div className={styles.scrollArea}>
                    {children}
                </div>
            </main>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <CreditProvider>
            <DashboardInner>{children}</DashboardInner>
        </CreditProvider>
    );
}
