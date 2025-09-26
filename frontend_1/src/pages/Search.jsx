import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Search.module.css';
import RestaurantCard from '../components/ui/RestaurantCard';
import FilterPanel from '../components/ui/FilterPanel'; // Import FilterPanel
import SearchBar from '../components/ui/SearchBar'; // Import SearchBar
import HorizontalFilterBar from '../components/ui/HorizontalFilterBar';
import { getRestaurants } from '../services/mockApi';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const Search = () => {
  const query = useQuery();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Initialize filters to match FilterPanel's initial state
  const [filters, setFilters] = useState({
    location: query.get('q') || '',
    priceRange: '',
    foodType: [],
    distance: '',
    includes: {
      coffee: false,
      dessert: false,
      wine: false,
      bread: false,
    },
    practical: {
      openNow: false,
      takesCards: false,
      quickService: false,
      groupFriendly: false,
      hasParking: false,
    },
    minGoogleRating: '',
    minZomatoRating: '',
    hasMenuReviews: false,
    lastUpdatedDays: '',
  });

  useEffect(() => {
    setLoading(true);
    getRestaurants(filters).then(data => {
      setRestaurants(data);
      setLoading(false);
    });
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      includes: { ...prevFilters.includes, ...newFilters.includes },
      practical: { ...prevFilters.practical, ...newFilters.practical },
    }));
  };

  const handleSearch = (searchTerm) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      location: searchTerm,
    }));
  };

  const handleLocationSelect = (locationData) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      location: locationData.address,
    }));
  };

  const handleQuickFilterChange = (category, key, value) => {
    let newFilters;

    if (category === 'includes' || category === 'practical') {
      newFilters = {
        ...filters,
        [category]: {
          ...filters[category],
          [key]: value,
        },
      };
    } else {
      newFilters = {
        ...filters,
        [category]: value,
      };
    }
    setFilters(newFilters);
  };

  return (
    <div className={styles.searchPage}>
      <h1 className={styles.title}>Find Your Lunch Deal</h1>

      <SearchBar
        onSearch={handleSearch}
        onLocationSelect={handleLocationSelect}
        placeholder="Search by location or restaurant name..."
        className={styles.mainSearchBar}
      />

      <HorizontalFilterBar
        onToggleAllFilters={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
        onFilterChange={handleQuickFilterChange}
        activeFilters={filters}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      {/* Active Filters Display */}
      <div className={styles.activeFilters}>
        <button 
          className={styles.filterButton}
          onClick={() => setIsFilterModalOpen(true)}
        >
          Filtros
        </button>
        {Object.entries(filters).map(([key, value]) => {
          if (!value) return null;
          if (typeof value === 'object') {
            const activeItems = Object.entries(value).filter(([_, v]) => v);
            return activeItems.map(([itemKey]) => (
              <span key={`${key}-${itemKey}`} className={styles.filterTag}>
                {itemKey}
                <button 
                  onClick={() => handleFilterChange(key, itemKey, false)}
                  className={styles.removeFilter}
                >
                  ×
                </button>
              </span>
            ));
          }
          if (value) {
            return (
              <span key={key} className={styles.filterTag}>
                {key}: {value}
                <button 
                  onClick={() => handleFilterChange(key, null, '')}
                  className={styles.removeFilter}
                >
                  ×
                </button>
              </span>
            );
          }
          return null;
        })}

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
        <div className={styles.restaurantGrid}>
          {restaurants.map(r => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;