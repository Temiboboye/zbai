'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layout.module.css';
import { CreditProvider, useCredits } from '@/contexts/CreditContext';

function CreditBalance() {
    const { balance, loading } = useCredits();
    return <h3>{loading ? '...' : balance.toLocaleString()}</h3>;
}

import { useAuth } from '@/contexts/AuthContext';

function DashboardInner({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth(); // Use Auth Context

    const navItems = [
        { href: '/dashboard', icon: '📊', label: 'Dashboard' },
        { href: '/verify', icon: '🔍', label: 'Real-Time Verify' },
        { href: '/bulk', icon: '📁', label: 'Bulk Verifier' },
        { href: '/sort', icon: '📧', label: 'Email Sorter' },
        { href: '/email-finder', icon: '🔎', label: 'Email Finder' },
        { href: '/api-keys', icon: '🔑', label: 'API Keys' },
        { href: '/blacklist', icon: '🚫', label: 'Blacklist Monitor' },
        { href: '/billing', icon: '💳', label: 'Billing' },
        { href: '/profile', icon: '👤', label: 'Profile' },
    ];

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className={styles.layout}>
            <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
                        <span className="greenhead">ZB</span>
                        ZeroBounce
                    </Link>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                            onClick={closeMobileMenu}
                        >
                            <span>{item.icon}</span> {item.label}
                        </Link>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    <div className={styles.creditCard}>
                        <p>Credits Remaining</p>
                        <CreditBalance />
                    </div>
                    <div className={styles.userProfile}>
                        <div className={styles.avatar}>{user?.email?.[0]?.toUpperCase() || 'U'}</div>
                        <div className={styles.userInfo}>
                            <p className={styles.userName} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{user ? 'User' : 'Guest'}</p>
                            <p className={styles.userEmail} style={{ fontSize: '10px' }}>{user?.email || 'Not logged in'}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className={styles.overlay}
                    onClick={closeMobileMenu}
                />
            )}

            <main className={styles.content}>
                <header className={styles.topHeader}>
                    {/* Mobile Menu Button */}
                    <button
                        className={styles.mobileMenuBtn}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                    <h2>Welcome back, {user?.email?.split('@')[0] || 'Guest'}</h2>
                    <div className={styles.headerActions}>
                        <button className={styles.iconBtn} title="Notifications">🔔</button>
                        <Link href="/profile" className={styles.iconBtn} title="Profile">⚙️</Link>
                        <button
                            className={styles.logoutBtn}
                            onClick={logout}
                            title="Logout"
                        >
                            🚪 Logout
                        </button>
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
        <DashboardInner>{children}</DashboardInner>
    );
}
