import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const Auth = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/profile';

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = await googleLogin(credentialResponse.credential);
      if (user) {
        navigate(redirectUrl);
      } else {
        alert('❌ Google login failed');
      }
    } catch (error) {
      console.error('Google auth error:', error);
      alert(`❌ Google authentication error: ${error.message}`);
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    alert(`Google login failed. Please try again.`);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.form}>
        <div className={styles.brandHeader}>
          <h1 className={styles.logoText}>MENU DEAL MOÇO</h1>
          <h2 className={styles.logoSubtext}>OS MELHORES MENUS</h2>
        </div>
        <p className={styles.subtitle}>Sign in with your Google account</p>

        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signin_with"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
