import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserDisplayName, updateUserDisplayName } from '../services/usernameService';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('mmd_current_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('mmd_current_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userData = await apiService.login(email, password);
      if (userData) {
        setUser(userData);
        localStorage.setItem('mmd_current_user', JSON.stringify(userData));
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      const newUser = await apiService.signup(name, email, password);
      setUser(newUser);
      localStorage.setItem('mmd_current_user', JSON.stringify(newUser));
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
        const updatedUser = await apiService.updateDisplayName(user.email, newDisplayName.trim());
        setUser(updatedUser);
        localStorage.setItem('mmd_current_user', JSON.stringify(updatedUser));

        // Also update the local username service for backward compatibility
        updateUserDisplayName(user.email, newDisplayName.trim());
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
    localStorage.removeItem('mmd_current_user');
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
