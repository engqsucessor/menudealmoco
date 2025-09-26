import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Search.module.css';
import RestaurantCard from '../components/ui/RestaurantCard';
import { getRestaurants } from '../services/mockApi';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState(query.get('q') || '');
  const [priceRange, setPriceRange] = useState('');
  const [foodType, setFoodType] = useState('');

  useEffect(() => {
    setLoading(true);
    getRestaurants({ 
      location: searchLocation, 
      price: priceRange, 
      cuisine: foodType 
    }).then(data => {
      setRestaurants(data);
      setLoading(false);
    });
  }, [searchLocation, priceRange, foodType]);

  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect hook will handle the search
  };

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.title}>Search Restaurants</h1>

      <form onSubmit={handleSearch} className={styles.filters}>
        <div className={styles.filterGrid}>
          <div className={styles.filterGroup}>
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              className={styles.filterInput}
              placeholder="e.g., Porto, Lisboa"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
            />
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="price">Max Price</label>
            <select 
              id="price" 
              className={styles.filterSelect} 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="">All</option>
              <option value="8">€8</option>
              <option value="10">€10</option>
              <option value="12">€12</option>
              <option value="15">€15</option>
              <option value="20">€20</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="foodType">Food Type</label>
            <select 
              id="foodType" 
              className={styles.filterSelect} 
              value={foodType} 
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="">All</option>
              <option value="Traditional Portuguese">Traditional Portuguese</option>
              <option value="Modern/Contemporary">Modern/Contemporary</option>
              <option value="Seafood">Seafood</option>
              <option value="Meat-focused">Meat-focused</option>
              <option value="Vegetarian-friendly">Vegetarian-friendly</option>
              <option value="International">International</option>
            </select>
          </div>
        </div>
      </form>

      <div className={styles.resultsHeader}>
        <p className={styles.resultsCount}>
          {loading ? 'Loading...' : `${restaurants.length} restaurants found`}
        </p>
        <select className={styles.sortSelect}>
          <option value="rating">Sort by: Rating</option>
          <option value="price">Sort by: Price</option>
        </select>
      </div>

      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <div className={styles.restaurantList}>
          {restaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
