import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { restaurantsApi } from '../services/axiosApi';
import { recentSearches } from '../services/localStorage';
import { PRICE_RANGE_OPTIONS, FOOD_TYPE_OPTIONS, SORT_OPTIONS, PRACTICAL_OPTIONS } from '../constants/filterOptions';
import styles from './SearchResults.module.css';

// Map centralized options to the format expected by the component
const filterOptions = {
  priceRanges: [
    { value: 'all', label: 'Todos os preços' },
    ...PRICE_RANGE_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))
  ],
  foodTypes: [
    { value: 'all', label: 'Todos os tipos' },
    ...FOOD_TYPE_OPTIONS.map(type => ({ value: type.toLowerCase().replace(/\s+/g, '-'), label: type }))
  ],
  sortOptions: SORT_OPTIONS,
  features: PRACTICAL_OPTIONS.map(opt => ({ value: opt.key, label: opt.label }))
};

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // State
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Search filters
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    priceRange: 'all',
    foodType: 'all',
    features: [],
    sortBy: 'rating'
  });

  // Load restaurants on component mount and filter changes
  useEffect(() => {
    searchRestaurants();
  }, [filters]);

  // Update location from URL params
  useEffect(() => {
    const locationFromUrl = searchParams.get('location');
    if (locationFromUrl && locationFromUrl !== filters.location) {
      setFilters(prev => ({ ...prev, location: locationFromUrl }));
    }
  }, [searchParams]);

  const searchRestaurants = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Save search to recent searches if location is provided
      if (filters.location.trim()) {
        recentSearches.add(filters.location.trim());
      }

      const response = await restaurantsApi.getAll(filters);
      const normalizedRestaurants = Array.isArray(response) ? response : (response?.restaurants || []);
      setRestaurants(normalizedRestaurants);
    } catch (err) {
      setError('Erro ao procurar restaurantes. Tente novamente.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));

    // Update URL if location changes
    if (key === 'location' && value) {
      navigate(`/search?location=${encodeURIComponent(value)}`, { replace: true });
    }
  };

  const handleFeatureToggle = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceRange: 'all',
      foodType: 'all',
      features: [],
      sortBy: 'rating'
    });
    navigate('/search', { replace: true });
  };

  const handleRestaurantClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <span className={styles.stars}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  return (
    <Layout
      pageTitle="Procurar Restaurantes"
      pageDescription="Encontre os melhores menus de almoço na sua área com filtros personalizados."
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>PROCURAR RESTAURANTES</h1>
          <p className={styles.pageDescription}>
            Encontre os melhores menus de almoço na sua área
          </p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchSection}>
          <div className={styles.mainSearch}>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Porto, Lisboa, Braga..."
              className={styles.searchInput}
            />
            <button
              onClick={searchRestaurants}
              className={styles.searchButton}
              disabled={isLoading}
            >
              {isLoading ? 'PROCURANDO...' : 'PROCURAR'}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={styles.filterToggle}
          >
            {showFilters ? 'OCULTAR FILTROS' : 'MOSTRAR FILTROS'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className={styles.filtersPanel}>
            <div className={styles.filtersGrid}>
              {/* Price Range */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>PREÇO</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className={styles.filterSelect}
                >
                  {filterOptions.priceRanges.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Food Type */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>TIPO DE COMIDA</label>
                <select
                  value={filters.foodType}
                  onChange={(e) => handleFilterChange('foodType', e.target.value)}
                  className={styles.filterSelect}
                >
                  {filterOptions.foodTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>ORDENAR POR</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className={styles.filterSelect}
                >
                  {filterOptions.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div className={styles.filterGroup}>
                <button
                  onClick={clearFilters}
                  className={styles.clearButton}
                >
                  LIMPAR FILTROS
                </button>
              </div>
            </div>

            {/* Feature Filters */}
            <div className={styles.featureFilters}>
              <span className={styles.filterLabel}>CARACTERÍSTICAS:</span>
              <div className={styles.featureButtons}>
                {filterOptions.features.map(feature => (
                  <button
                    key={feature.value}
                    onClick={() => handleFeatureToggle(feature.value)}
                    className={`${styles.featureButton} ${filters.features.includes(feature.value) ? styles.featureButtonActive : ''}`}
                  >
                    {feature.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div className={styles.resultsHeader}>
          {isLoading ? (
            <span className={styles.loadingText}>PROCURANDO...</span>
          ) : (
            <span className={styles.resultsCount}>
              {restaurants.length} RESTAURANTE{restaurants.length !== 1 ? 'S' : ''} ENCONTRADO{restaurants.length !== 1 ? 'S' : ''}
            </span>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className={styles.errorMessage}>
            <span className={styles.errorText}>{error}</span>
            <button onClick={searchRestaurants} className={styles.retryButton}>
              TENTAR NOVAMENTE
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && restaurants.length === 0 && (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>NENHUM RESTAURANTE ENCONTRADO</h3>
            <p className={styles.emptyDescription}>
              Tente ajustar os seus filtros ou procurar numa localização diferente.
            </p>
            <button onClick={clearFilters} className={styles.emptyButton}>
              LIMPAR FILTROS
            </button>
          </div>
        )}

        {/* Restaurant List */}
        {!isLoading && restaurants.length > 0 && (
          <div className={styles.restaurantList}>
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className={styles.restaurantCard}
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div className={styles.cardContent}>
                  <div className={styles.cardMain}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.restaurantName}>{restaurant.name}</h3>
                      <div className={styles.priceSection}>
                        <span className={styles.price}>€{restaurant.menuPrice}</span>
                        <span className={styles.priceRange}>{restaurant.priceRange}</span>
                      </div>
                    </div>

                    <p className={styles.restaurantAddress}>{restaurant.address}</p>

                    <div className={styles.cardMeta}>
                      <div className={styles.rating}>
                        {renderStars(restaurant.valueRating)}
                        <span className={styles.ratingText}>
                          {restaurant.valueRating}/5 ({restaurant.reviewCount} avaliações)
                        </span>
                      </div>
                      <span className={styles.distance}>{restaurant.distance}km</span>
                    </div>

                    <div className={styles.cardDetails}>
                      <span className={styles.foodType}>{restaurant.foodType}</span>
                      <span className={styles.included}>
                        Inclui: {restaurant.included.join(', ')}
                      </span>
                    </div>

                    {restaurant.features.length > 0 && (
                      <div className={styles.features}>
                        {restaurant.features.map((feature, index) => (
                          <span key={index} className={styles.feature}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className={styles.cardAction}>
                    <span className={styles.viewMore}>VER DETALHES →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if implementing pagination) */}
        {restaurants.length > 0 && restaurants.length >= 10 && (
          <div className={styles.loadMoreSection}>
            <button className={styles.loadMoreButton}>
              CARREGAR MAIS RESTAURANTES
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
