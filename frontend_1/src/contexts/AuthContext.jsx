import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi, favoritesApi } from '../services/axiosApi';
import { favoriteRestaurants } from '../services/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync favorites from backend to localStorage
  const syncFavorites = async () => {
    try {
      const backendFavorites = await favoritesApi.getAll();
      const localFavorites = favoriteRestaurants.get();

      // Merge: add any backend favorites not in localStorage
      backendFavorites.forEach(id => {
        if (!localFavorites.includes(id)) {
          favoriteRestaurants.add(id);
        }
      });

      // Sync any localStorage favorites to backend
      for (const id of localFavorites) {
        if (!backendFavorites.includes(id)) {
          try {
            await favoritesApi.add(id);
          } catch (error) {
            console.error(`Failed to sync favorite ${id} to backend:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing favorites:', error);
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = sessionStorage.getItem('access_token');

      // Set loading false immediately to not block page render
      setLoading(false);

      if (token) {
        try {
          const userInfo = await authApi.getCurrentUser();
          setUser(userInfo);
          // Sync favorites in background (non-blocking)
          syncFavorites().catch(err => console.error('Favorites sync failed:', err));
        } catch (error) {
          console.error('Token validation failed:', error);
          authApi.logout();
        }
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const userData = await authApi.login(email, password);
      setUser(userData);
      // Sync favorites after successful login
      await syncFavorites();
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
      // Sync favorites after successful signup
      await syncFavorites();
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Google Login function
  const googleLogin = async (credential) => {
    try {
      const userData = await authApi.googleLogin(credential);
      setUser(userData);
      // Sync favorites after successful login
      await syncFavorites();
      return userData;
    } catch (error) {
      console.error('Google login error:', error);
      return null;
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
    googleLogin,
    logout,
    updateDisplayName,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
