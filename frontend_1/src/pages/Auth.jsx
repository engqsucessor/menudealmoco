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
    { email: 'test@example.com', password: 'test123', name: 'Test User' },
    { email: 'foodie@example.com', password: 'foodie123', name: 'Food Lover' },
    { email: 'reviewer@example.com', password: 'reviewer123', name: 'Restaurant Reviewer' },
    { email: 'admin@menudealmoco.com', password: 'admin123', name: 'Admin User' }
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
      setPassword('test123');
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
    if (isLogin) {
      const user = await login(email, password);
      if (user) {
        navigate(redirectUrl);
      } else {
        alert('Invalid credentials');
      }
    } else {
      const user = await signup(name, email, password);
      if (user) {
        navigate(redirectUrl);
      } else {
        alert('Signup failed');
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

        {isLogin && (
          <div className={styles.testUsers}>
            <h3>Test Accounts:</h3>
            <div className={styles.testUserButtons}>
              {testUsers.map((user, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => fillTestCredentials(user)}
                  className={styles.testUserButton}
                  title={`${user.name} - ${user.email}`}
                >
                  {user.name}
                </button>
              ))}
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
