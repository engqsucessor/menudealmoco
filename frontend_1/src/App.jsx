import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';

// Page Components
import Home from './pages/Home';
import Search from './pages/Search';
import RestaurantDetail from './pages/RestaurantDetail';
import AddRestaurant from './pages/AddRestaurant';
import About from './pages/About';
import Auth from './pages/Auth';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppContent />
    </Router>
  );
}

export default App;
