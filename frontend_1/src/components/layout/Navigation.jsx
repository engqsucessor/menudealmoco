import React from 'react';
import styles from './Navigation.module.css';

const Navigation = ({ mobile = false, onItemClick }) => {
  const navItems = [
    { label: 'FIND DEALS', href: '/', icon: '⌕' },
    { label: 'ADD RESTAURANT', href: '/add', icon: '+' },
    { label: 'HOW IT WORKS', href: '/how', icon: '?' },
    { label: 'ABOUT', href: '/about', icon: 'i' }
  ];

  const handleItemClick = (href) => {
    if (onItemClick) {
      onItemClick();
    }
    // Here you would handle routing
    console.log(`Navigate to: ${href}`);
  };

  return (
    <nav className={`${styles.navigation} ${mobile ? styles.mobile : styles.desktop}`}>
      <ul className={styles.navList}>
        {navItems.map((item, index) => (
          <li key={index} className={styles.navItem}>
            <button
              className={styles.navLink}
              onClick={() => handleItemClick(item.href)}
              type="button"
            >
              {mobile && (
                <span className={styles.navIcon}>{item.icon}</span>
              )}
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;