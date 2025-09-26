import React, { createContext, useState, useContext } from 'react';

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
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
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
    const newUser = {
      name,
      email,
      reviews: [],
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
