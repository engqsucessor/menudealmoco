import React, { createContext, useState, useContext } from 'react';
import { getUserDisplayName, updateUserDisplayName } from '../services/usernameService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Mock login function
  const login = (email, password) => {
    // In a real app, you'd validate against a backend
    if (email === 'john.doe@example.com' && password === 'password') {
      const displayName = getUserDisplayName(email);
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        displayName: displayName,
        isReviewer: true, // Make John a reviewer for testing
        reviews: [
          { id: 1, restaurant: 'The Great Eatery', review: 'Amazing food and service!', upvotes: 10 },
          { id: 2, restaurant: 'Burger Palace', review: 'Decent burgers, but slow service.', upvotes: 5 },
        ],
      };
      setUser(mockUser);
      return mockUser;
    }
    return null;
  };

  // Mock signup function
  const signup = (name, email, password) => {
    // In a real app, you'd send this to a backend
    const displayName = getUserDisplayName(email);
    const newUser = {
      name,
      email,
      displayName: displayName,
      reviews: [],
    };
    setUser(newUser);
    return newUser;
  };

  // Update display name function
  const updateDisplayName = (newDisplayName) => {
    if (user && newDisplayName.trim()) {
      updateUserDisplayName(user.email, newDisplayName.trim());
      setUser({ ...user, displayName: newDisplayName.trim() });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateDisplayName,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
