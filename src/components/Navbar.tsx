import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className="greenhead" style={{
            marginRight: '10px',
            fontSize: '1rem'
          }}>ZB</span>
          ZeroBounce
        </Link>

        <div className={styles.links}>
          <Link href="#features">Features</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#api">API</Link>
        </div>

        <div className={styles.actions}>
          <Link href="/login" className="btn btn-outline">Login</Link>
          <Link href="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
