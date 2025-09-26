import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

const Navigation = ({ mobile = false, onItemClick }) => {
  const navItems = [
    { label: 'FIND DEALS', href: '/search', icon: '⌕' },
    { label: 'ADD RESTAURANT', href: '/add-restaurant', icon: '+' },
    { label: 'ABOUT', href: '/about', icon: 'i' },
    { label: 'LOGIN', href: '/login', icon: '→' },
    { label: 'SIGN UP', href: '/signup', icon: '+' }
  ];

  return (
    <nav className={`${styles.navigation} ${mobile ? styles.mobile : styles.desktop}`}>
      <ul className={styles.navList}>
        {navItems.map((item, index) => (
          <li key={index} className={styles.navItem}>
            <Link
              to={item.href}
              className={styles.navLink}
              onClick={onItemClick}
            >
              {mobile && (
                <span className={styles.navIcon}>{item.icon}</span>
              )}
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;