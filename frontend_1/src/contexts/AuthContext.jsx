import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../services/axiosApi';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = sessionStorage.getItem('access_token');
      if (token) {
        try {
          const userInfo = await authApi.getCurrentUser();
          setUser(userInfo);
        } catch (error) {
          console.error('Token validation failed:', error);
          authApi.logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userData = await authApi.login(email, password);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      const newUser = await authApi.signup(name, email, password);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Update display name function
  const updateDisplayName = async (newDisplayName) => {
    if (user && newDisplayName.trim()) {
      try {
        const updatedUser = await authApi.updateDisplayName(newDisplayName.trim());
        setUser(updatedUser);
        return true;
      } catch (error) {
        console.error('Error updating display name:', error);
        return false;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    authApi.logout();
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateDisplayName,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
