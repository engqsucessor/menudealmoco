import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Search.module.css';
import { restaurantService } from '@services/restaurantService';
import RestaurantCard from '../components/ui/RestaurantCard';
import HorizontalFilterBar from '../components/ui/HorizontalFilterBar';
import FilterModal from '../components/ui/FilterModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchPage = () => {
  const query = useQuery();
  const initialQuery = query.get('query') || '';
  const initialLocation = query.get('location') || 'Lisboa';

  const [restaurants, setRestaurants] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  // Complex filter state matching MONO design
  const [filters, setFilters] = useState({
    query: initialQuery,
    location: initialLocation,
    userLocation: null,
    maxDistance: 50,
    priceRange: 'any',
    minPrice: 6,
    maxPrice: 25,
    foodTypes: [],
    features: {},
    practicalFilters: {},
    openNow: false,
    sortBy: 'rating',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
    minGoogleRating: 0,
    minZomatoRating: 0,
    overallRating: 0,
    hasMenuReviews: false,
    lastUpdatedDays: ''
  });

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await restaurantService.searchRestaurants(filters);
      setRestaurants(results.restaurants);
      setTotalResults(results.pagination.total);
    } catch (err) {
      setError('Failed to fetch restaurants. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleSearch = (searchQuery, searchLocation) => {
    setFilters(prev => ({ ...prev, query: searchQuery, location: searchLocation, page: 1 }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleQuickFilterChange = (category, key, value) => {
    if (category === 'clearAll') {
      // Handle clear all filters from HorizontalFilterBar
      clearAllFilters();
      return;
    }

    let newFilters = { ...filters, page: 1 };

    if (category === 'priceRange') {
      // Handle price range changes with proper min/max updates
      const priceRanges = {
        'budget': { min: 6, max: 8 },
        'standard': { min: 8, max: 10 },
        'good': { min: 10, max: 12 },
        'premium': { min: 12, max: 15 },
        'high-end': { min: 15, max: 25 },
        'any': { min: 6, max: 25 }
      };
      const range = priceRanges[value] || priceRanges['any'];
      newFilters.priceRange = value;
      newFilters.minPrice = range.min;
      newFilters.maxPrice = range.max;
    } else if (category === 'features' || category === 'practicalFilters') {
      newFilters[category] = { ...newFilters[category], [key]: value };
    } else if (category === 'foodTypes') {
      newFilters.foodTypes = newFilters.foodTypes.includes(value)
        ? newFilters.foodTypes.filter(f => f !== value)
        : [...newFilters.foodTypes, value];
    } else {
      newFilters[category] = value;
    }
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    setFilters(prev => ({ ...prev, sortBy, sortOrder, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      query: filters.query,
      location: filters.location,
      userLocation: filters.userLocation,
      maxDistance: 50,
      priceRange: 'any',
      minPrice: 6,
      maxPrice: 25,
      foodTypes: [],
      features: {},
      practicalFilters: {},
      openNow: false,
      sortBy: 'rating',
      sortOrder: 'desc',
      page: 1,
      limit: 20,
      minGoogleRating: 0,
      minZomatoRating: 0,
      overallRating: 0,
      hasMenuReviews: false,
      lastUpdatedDays: ''
    };
    setFilters(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange && filters.priceRange !== 'any') count++;
    count += filters.foodTypes.length;
    count += Object.values(filters.features).filter(Boolean).length;
    count += Object.values(filters.practicalFilters).filter(Boolean).length;
    if (filters.openNow) count++;
    if (filters.minGoogleRating > 0) count++;
    if (filters.minZomatoRating > 0) count++;
    if (filters.overallRating > 0) count++;
    if (filters.hasMenuReviews) count++;
    if (filters.lastUpdatedDays) count++;
    return count;
  };

  const renderContent = () => {
    if (loading) {
      return <div className={styles.messageContainer}><LoadingSpinner /></div>;
    }
    if (error) {
      return (
        <div className={styles.messageContainer}>
          <h3>{error}</h3>
          <Button onClick={fetchRestaurants} variant="primary">Retry</Button>
        </div>
      );
    }
    if (restaurants.length === 0) {
      return (
        <div className={styles.messageContainer}>
          <h3>No results found.</h3>
          <p>Try adjusting your search or filters.</p>
          {getActiveFiltersCount() > 0 && (
            <Button onClick={clearAllFilters} variant="secondary">Clear Filters</Button>
          )}
        </div>
      );
    }
    return (
      <div className={styles.restaurantGrid}>
        {restaurants.map((restaurant, index) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} style={{ animationDelay: `${index * 50}ms` }} />
        ))}
      </div>
    );
  };

  const totalPages = Math.ceil(totalResults / filters.limit);

  return (
    <div className={styles.searchPage}>
      <header className={styles.header}>
        <div className={styles.mainSearchBar}>
          <SearchBar onSearch={handleSearch} initialQuery={initialQuery} initialLocation={initialLocation} />
        </div>
      </header>

      <HorizontalFilterBar
        onToggleAllFilters={() => setFilterModalOpen(true)}
        onFilterChange={handleQuickFilterChange}
        activeFilters={filters}
      />

      <main className={styles.resultsContainer}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsInfo}>
              <h1 className={styles.resultsCount}>
                {totalResults} Restaurants in {filters.location}
              </h1>
            </div>
            <div className={styles.sortingControls}>
              <select onChange={handleSortChange} className={styles.sortSelect} value={`${filters.sortBy}-${filters.sortOrder}`}>
                <option value="rating-desc">Sort by Rating</option>
                <option value="price-asc">Sort by Price (Low to High)</option>
                <option value="price-desc">Sort by Price (High to Low)</option>
                <option value="name-asc">Sort by Name</option>
              </select>
            </div>
          </div>

          {renderContent()}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page <= 1}>
                Previous
              </Button>
              <span className={styles.pageInfo}>
                Page {filters.page} of {totalPages}
              </span>
              <Button onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page >= totalPages}>
                Next
              </Button>
            </div>
          )}
        </main>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />
    </div>
  );
};

export default SearchPage;

