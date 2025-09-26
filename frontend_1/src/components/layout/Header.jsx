import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import styles from './Header.module.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>MENU</span>
          <span className={styles.logoSubtext}>DEAL MOÇO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={styles.desktopNav}>
          <Navigation />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.menuToggle}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className={styles.menuIcon}>
            {isMenuOpen ? '✕' : '☰'}
          </span>
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className={styles.mobileNav}>
            <Navigation mobile onItemClick={() => setIsMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;