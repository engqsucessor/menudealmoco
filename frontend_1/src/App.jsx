import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './styles/global.css'

// Layout Components
import Layout from './components/layout/Layout'

// Page Components
import Home from './pages/Home'
import Search from './pages/Search'
import RestaurantDetail from './pages/RestaurantDetail'
import AddRestaurant from './pages/AddRestaurant'
import About from './pages/About'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/restaurant/:id" element={<RestaurantDetail />} />
          <Route path="/add-restaurant" element={<AddRestaurant />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App