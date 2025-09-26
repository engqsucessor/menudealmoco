import React from 'react'
import Header from './Header'
import styles from './Layout.module.css'

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
              <li><a href="/" className={styles.footerLink}>Find Deals</a></li>
              <li><a href="/add" className={styles.footerLink}>Add Restaurant</a></li>
              <li><a href="/how" className={styles.footerLink}>How It Works</a></li>
              <li><a href="/about" className={styles.footerLink}>About</a></li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>SUPPORT</h4>
            <ul className={styles.footerLinks}>
              <li><a href="/contact" className={styles.footerLink}>Contact</a></li>
              <li><a href="/privacy" className={styles.footerLink}>Privacy</a></li>
              <li><a href="/terms" className={styles.footerLink}>Terms</a></li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © 2024 MENU DEAL MOÇO — ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Layout