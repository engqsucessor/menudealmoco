import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Search.module.css';
import { restaurantsApi } from '../services/axiosApi';
import { 
  createInitialFilters, 
  createClearedFilters, 
  PRICE_RANGES, 
  prepareFiltersForAPI 
} from '../constants/filterConfig';
import RestaurantCard from '../components/ui/RestaurantCard';
import HorizontalFilterBar from '../components/ui/HorizontalFilterBar';
import FilterModal from '../components/ui/FilterModal';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Search = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const initialQuery = query.get('query') || '';
  const initialLocation = query.get('location') || '';

  const [restaurants, setRestaurants] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  // Complex filter state matching MONO design
  const [filters, setFilters] = useState(
    createInitialFilters({
      query: initialQuery,
      location: initialLocation
    })
  );

  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the centralized helper to prepare filters for API
      const apiFilters = prepareFiltersForAPI(filters);
      
      const response = await restaurantsApi.getAll(apiFilters);
      // Handle both old format (array) and new format (object with restaurants array)
      if (Array.isArray(response)) {
        // Old format - no pagination
        setRestaurants(response);
        setTotalResults(response.length);
      } else {
        // New format - with pagination
        setRestaurants(response.restaurants || []);
        setTotalResults(response.total || 0);
      }
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

  // Scroll to top when component mounts or query params change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [initialQuery, initialLocation]);

  // Handle scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      // Handle price range changes using centralized config
      const range = PRICE_RANGES[value] || PRICE_RANGES.any;
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
    window.scrollTo(0, 0);
  };

  const clearAllFilters = () => {
    setFilters(createClearedFilters(filters));
  };  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.showOnlyFavorites) count++;
    count += filters.foodTypes.length;
    count += Object.values(filters.features).filter(Boolean).length;
    count += Object.values(filters.practicalFilters).filter(Boolean).length;
    if (filters.openNow) count++;
    if (filters.minGoogleRating > 0) count++;
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
                {totalResults} Restaurants{filters.location ? ` in ${filters.location}` : ''}
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

              {/* Page Numbers */}
              <div className={styles.pageNumbers}>
                {(() => {
                  const currentPage = filters.page;
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                  // Adjust start page if we're near the end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }

                  const pages = [];

                  // Add first page if not in range
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        className={`${styles.pageButton} ${1 === currentPage ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(<span key="start-ellipsis" className={styles.ellipsis}>...</span>);
                    }
                  }

                  // Add visible page range
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        className={`${styles.pageButton} ${i === currentPage ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(i)}
                      >
                        {i}
                      </button>
                    );
                  }

                  // Add last page if not in range
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(<span key="end-ellipsis" className={styles.ellipsis}>...</span>);
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        className={`${styles.pageButton} ${totalPages === currentPage ? styles.activePage : ''}`}
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    );
                  }

                  return pages;
                })()}
              </div>

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

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          className={styles.scrollTopButton}
          onClick={scrollToTop}
          title="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Search;

