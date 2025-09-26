import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Auth.module.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect URL from query parameters
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get('redirect') || '/profile';

  useEffect(() => {
    if (isLogin) {
      setEmail('john.doe@example.com');
      setPassword('password');
    } else {
      setEmail('');
      setPassword('');
    }
  }, [isLogin]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const user = login(email, password);
      if (user) {
        navigate(redirectUrl);
      } else {
        alert('Invalid credentials');
      }
    } else {
      const user = signup(name, email, password);
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
