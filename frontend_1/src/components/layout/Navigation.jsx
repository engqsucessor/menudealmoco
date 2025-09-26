import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navigation.module.css';

const Navigation = ({ mobile = false, onItemClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (onItemClick) {
      onItemClick();
    }
    navigate('/'); // Redirect to home after logout
  };

  return (
    <nav className={`${styles.navigation} ${mobile ? styles.mobile : styles.desktop}`}>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <Link to="/search" className={styles.navLink} onClick={onItemClick}>
            {mobile && <span className={styles.navIcon}>⌕</span>}
            <span className={styles.navLabel}>FIND DEALS</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/add-restaurant" className={styles.navLink} onClick={onItemClick}>
            {mobile && <span className={styles.navIcon}>+</span>}
            <span className={styles.navLabel}>ADD RESTAURANT</span>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/about" className={styles.navLink} onClick={onItemClick}>
            {mobile && <span className={styles.navIcon}>i</span>}
            <span className={styles.navLabel}>ABOUT</span>
          </Link>
        </li>
        
        {user ? (
          <>
            <li className={styles.navItem}>
              <Link to="/profile" className={styles.navLink} onClick={onItemClick}>
                {mobile && <span className={styles.navIcon}>👤</span>}
                <span className={styles.navLabel}>PROFILE</span>
              </Link>
            </li>
            {user.isReviewer && (
              <li className={styles.navItem}>
                <Link to="/reviewer" className={styles.navLink} onClick={onItemClick}>
                  {mobile && <span className={styles.navIcon}>⚖</span>}
                  <span className={styles.navLabel}>REVIEWER</span>
                </Link>
              </li>
            )}
            <li className={styles.navItem}>
              <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>
                {mobile && <span className={styles.navIcon}>↩</span>}
                <span className={styles.navLabel}>LOGOUT</span>
              </button>
            </li>
          </>
        ) : (
          <li className={styles.navItem}>
            <Link to="/auth" className={styles.navLink} onClick={onItemClick}>
              {mobile && <span className={styles.navIcon}>→</span>}
              <span className={styles.navLabel}>LOGIN / SIGN UP</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;