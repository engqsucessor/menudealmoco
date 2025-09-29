import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const testUsers = [
    { email: 'test@example.com', password: 'testuser123', name: '👤 Test User', role: 'User' },
    { email: 'foodie@example.com', password: 'foodlover456', name: '🍽️ Food Lover', role: 'User' },
    { email: 'reviewer@example.com', password: 'reviewer789', name: '⭐ Reviewer', role: 'Reviewer' },
    { email: 'admin@menudealmoco.com', password: 'admin2024secure', name: '🛡️ Admin', role: 'Admin' }
  ];
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/profile';

  useEffect(() => {
    if (isLogin) {
      setEmail('test@example.com');
      setPassword('testuser123');
    } else {
      setEmail('');
      setPassword('');
    }
  }, [isLogin]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const fillTestCredentials = (testUser) => {
    setEmail(testUser.email);
    setPassword(testUser.password);
    if (!isLogin) {
      setName(testUser.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const user = await login(email, password);
        if (user) {
          navigate(redirectUrl);
        } else {
          alert('❌ Login failed: Invalid credentials\n\n🔧 Try using the test account buttons above!');
        }
      } else {
        const user = await signup(name, email, password);
        if (user) {
          navigate(redirectUrl);
        } else {
          alert('❌ Signup failed');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert(`❌ Authentication error: ${error.message}\n\n🔧 Check console for details`);
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

        {isLogin && (
          <div className={styles.testUsers}>
            <h3>🧪 Test Accounts - Click to Auto-Fill:</h3>
            <div className={styles.testUserButtons}>
              {testUsers.map((user, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillTestCredentials(user)}
                  className={styles.testUserButton}
                  title={`${user.email} | Password: ${user.password} | Role: ${user.role}`}
                >
                  <div className={styles.testUserInfo}>
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                    <small>🔑 {user.password}</small>
                  </div>
                </button>
              ))}
            </div>
            <div className={styles.testUserNote}>
              <small>ℹ️ All passwords are already updated for the new secure system!</small>
            </div>
          </div>
        )}
        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        <p>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={toggleForm}>{isLogin ? 'Sign up' : 'Login'}</span>
        </p>
      </form>
    </div>
  );
};

export default Auth;
