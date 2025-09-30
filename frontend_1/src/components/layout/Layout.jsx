import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import styles from './Layout.module.css';

const Layout = ({ children, className = '' }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={`${styles.main} ${className}`}>
        {children}
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>MENU DEAL MOÇO</h3>
            <p className={styles.footerDescription}>
              Find the best lunch deals in Portugal, ranked by real people.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>QUICK LINKS</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/search" className={styles.footerLink}>Find Deals</Link></li>
              <li><Link to="/add-restaurant" className={styles.footerLink}>Add Restaurant</Link></li>
              <li><Link to="/about" className={styles.footerLink}>About</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2025 MENU DEAL MOÇO — ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;