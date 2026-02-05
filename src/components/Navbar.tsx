'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
          <span className="greenhead" style={{
            marginRight: '10px',
            fontSize: '1rem'
          }}>ZB</span>
          ZeroBounce
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.links}>
          <Link href="#features">Features</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#api">API</Link>
        </div>

        <div className={styles.actions}>
          <Link href="/login" className="btn btn-outline">Login</Link>
          <Link href="/signup" className="btn btn-primary">Sign Up</Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerActive : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileLinks}>
          <Link href="#features" onClick={closeMobileMenu}>Features</Link>
          <Link href="#pricing" onClick={closeMobileMenu}>Pricing</Link>
          <Link href="#api" onClick={closeMobileMenu}>API</Link>
        </div>
        <div className={styles.mobileActions}>
          <Link href="/login" className="btn btn-outline" onClick={closeMobileMenu}>Login</Link>
          <Link href="/signup" className="btn btn-primary" onClick={closeMobileMenu}>Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
