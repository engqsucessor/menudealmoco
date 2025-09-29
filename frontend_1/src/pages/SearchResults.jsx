import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { restaurantsApi } from '../services/axiosApi';
import { recentSearches } from '../services/localStorage';

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

      const restaurants = await restaurantsApi.getAll(filters);
      setRestaurants(restaurants);
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
      <span style={styles.stars}>
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
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.pageTitle}>PROCURAR RESTAURANTES</h1>
          <p style={styles.pageDescription}>
            Encontre os melhores menus de almoço na sua área
          </p>
        </div>

        {/* Search Bar */}
        <div style={styles.searchSection}>
          <div style={styles.mainSearch}>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Porto, Lisboa, Braga..."
              style={styles.searchInput}
            />
            <button
              onClick={searchRestaurants}
              style={styles.searchButton}
              disabled={isLoading}
            >
              {isLoading ? 'PROCURANDO...' : 'PROCURAR'}
            </button>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={styles.filterToggle}
          >
            {showFilters ? 'OCULTAR FILTROS' : 'MOSTRAR FILTROS'}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div style={styles.filtersPanel}>
            <div style={styles.filtersGrid}>
              {/* Price Range */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>PREÇO</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  style={styles.filterSelect}
                >
                  {filterOptions.priceRanges.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Food Type */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>TIPO DE COMIDA</label>
                <select
                  value={filters.foodType}
                  onChange={(e) => handleFilterChange('foodType', e.target.value)}
                  style={styles.filterSelect}
                >
                  {filterOptions.foodTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>ORDENAR POR</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  style={styles.filterSelect}
                >
                  {filterOptions.sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <div style={styles.filterGroup}>
                <button
                  onClick={clearFilters}
                  style={styles.clearButton}
                >
                  LIMPAR FILTROS
                </button>
              </div>
            </div>

            {/* Feature Filters */}
            <div style={styles.featureFilters}>
              <span style={styles.filterLabel}>CARACTERÍSTICAS:</span>
              <div style={styles.featureButtons}>
                {filterOptions.features.map(feature => (
                  <button
                    key={feature.value}
                    onClick={() => handleFeatureToggle(feature.value)}
                    style={{
                      ...styles.featureButton,
                      ...(filters.features.includes(feature.value) ? styles.featureButtonActive : {})
                    }}
                  >
                    {feature.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div style={styles.resultsHeader}>
          {isLoading ? (
            <span style={styles.loadingText}>PROCURANDO...</span>
          ) : (
            <span style={styles.resultsCount}>
              {restaurants.length} RESTAURANTE{restaurants.length !== 1 ? 'S' : ''} ENCONTRADO{restaurants.length !== 1 ? 'S' : ''}
            </span>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.errorText}>{error}</span>
            <button onClick={searchRestaurants} style={styles.retryButton}>
              TENTAR NOVAMENTE
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && restaurants.length === 0 && (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyTitle}>NENHUM RESTAURANTE ENCONTRADO</h3>
            <p style={styles.emptyDescription}>
              Tente ajustar os seus filtros ou procurar numa localização diferente.
            </p>
            <button onClick={clearFilters} style={styles.emptyButton}>
              LIMPAR FILTROS
            </button>
          </div>
        )}

        {/* Restaurant List */}
        {!isLoading && restaurants.length > 0 && (
          <div style={styles.restaurantList}>
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                style={styles.restaurantCard}
                onClick={() => handleRestaurantClick(restaurant.id)}
              >
                <div style={styles.cardContent}>
                  <div style={styles.cardMain}>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.restaurantName}>{restaurant.name}</h3>
                      <div style={styles.priceSection}>
                        <span style={styles.price}>€{restaurant.menuPrice}</span>
                        <span style={styles.priceRange}>{restaurant.priceRange}</span>
                      </div>
                    </div>

                    <p style={styles.restaurantAddress}>{restaurant.address}</p>

                    <div style={styles.cardMeta}>
                      <div style={styles.rating}>
                        {renderStars(restaurant.valueRating)}
                        <span style={styles.ratingText}>
                          {restaurant.valueRating}/5 ({restaurant.reviewCount} avaliações)
                        </span>
                      </div>
                      <span style={styles.distance}>{restaurant.distance}km</span>
                    </div>

                    <div style={styles.cardDetails}>
                      <span style={styles.foodType}>{restaurant.foodType}</span>
                      <span style={styles.included}>
                        Inclui: {restaurant.included.join(', ')}
                      </span>
                    </div>

                    {restaurant.features.length > 0 && (
                      <div style={styles.features}>
                        {restaurant.features.map((feature, index) => (
                          <span key={index} style={styles.feature}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={styles.cardAction}>
                    <span style={styles.viewMore}>VER DETALHES →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button (if implementing pagination) */}
        {restaurants.length > 0 && restaurants.length >= 10 && (
          <div style={styles.loadMoreSection}>
            <button style={styles.loadMoreButton}>
              CARREGAR MAIS RESTAURANTES
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: 'Space Mono, monospace'
  },
  header: {
    textAlign: 'center',
    marginBottom: '48px',
    paddingBottom: '32px',
    borderBottom: '3px solid #000000'
  },
  pageTitle: {
    fontSize: '48px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: '16px',
    lineHeight: 1.2
  },
  pageDescription: {
    fontSize: '18px',
    fontWeight: 400,
    color: '#666666',
    lineHeight: 1.6
  },
  searchSection: {
    marginBottom: '32px'
  },
  mainSearch: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  searchInput: {
    flex: 1,
    padding: '16px',
    border: '3px solid #000000',
    background: '#ffffff',
    fontSize: '16px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 400
  },
  searchButton: {
    padding: '16px 32px',
    border: '3px solid #000000',
    background: '#000000',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 700,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  filterToggle: {
    padding: '12px 24px',
    border: '2px solid #666666',
    background: 'transparent',
    color: '#666666',
    fontSize: '12px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 700,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  filtersPanel: {
    border: '3px solid #e5e5e5',
    background: '#f5f5f5',
    padding: '32px',
    marginBottom: '32px'
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  filterLabel: {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#000000'
  },
  filterSelect: {
    padding: '12px',
    border: '2px solid #999999',
    background: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 400
  },
  clearButton: {
    padding: '12px 24px',
    border: '2px solid #999999',
    background: 'transparent',
    color: '#666666',
    fontSize: '12px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 700,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    alignSelf: 'flex-end'
  },
  featureFilters: {
    paddingTop: '24px',
    borderTop: '2px solid #e5e5e5'
  },
  featureButtons: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '12px'
  },
  featureButton: {
    padding: '8px 16px',
    border: '2px solid #999999',
    background: 'transparent',
    color: '#666666',
    fontSize: '12px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 400,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  featureButtonActive: {
    borderColor: '#000000',
    background: '#000000',
    color: '#ffffff'
  },
  resultsHeader: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #e5e5e5'
  },
  resultsCount: {
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#000000'
  },
  loadingText: {
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#666666'
  },
  errorMessage: {
    background: '#f5f5f5',
    border: '2px solid #999999',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '32px'
  },
  errorText: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#666666',
    marginBottom: '16px',
    display: 'block'
  },
  retryButton: {
    padding: '12px 24px',
    border: '2px solid #000000',
    background: '#000000',
    color: '#ffffff',
    fontSize: '12px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 700,
    letterSpacing: '0.05em',
    cursor: 'pointer'
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px'
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '16px',
    letterSpacing: '0.05em'
  },
  emptyDescription: {
    fontSize: '16px',
    fontWeight: 400,
    color: '#666666',
    marginBottom: '32px',
    lineHeight: 1.6
  },
  emptyButton: {
    padding: '16px 32px',
    border: '3px solid #000000',
    background: '#000000',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 700,
    letterSpacing: '0.05em',
    cursor: 'pointer'
  },
  restaurantList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  restaurantCard: {
    border: '3px solid #e5e5e5',
    background: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  cardContent: {
    padding: '24px'
  },
  cardMain: {
    marginBottom: '16px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '16px'
  },
  restaurantName: {
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.3
  },
  priceSection: {
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  price: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1,
    color: '#000000'
  },
  priceRange: {
    fontSize: '12px',
    fontWeight: 400,
    color: '#666666'
  },
  restaurantAddress: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#666666',
    marginBottom: '16px',
    margin: 0
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  stars: {
    fontSize: '16px',
    color: '#000000'
  },
  ratingText: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#666666'
  },
  distance: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#000000'
  },
  cardDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '16px'
  },
  foodType: {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    color: '#000000',
    textTransform: 'uppercase'
  },
  included: {
    fontSize: '14px',
    fontWeight: 400,
    color: '#666666'
  },
  features: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px'
  },
  feature: {
    padding: '4px 8px',
    border: '1px solid #e5e5e5',
    background: '#f5f5f5',
    fontSize: '10px',
    fontWeight: 400,
    color: '#666666'
  },
  cardAction: {
    paddingTop: '16px',
    borderTop: '2px solid #e5e5e5',
    textAlign: 'right'
  },
  viewMore: {
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    color: '#000000'
  },
  loadMoreSection: {
    textAlign: 'center',
    marginTop: '48px'
  },
  loadMoreButton: {
    padding: '16px 32px',
    border: '3px solid #000000',
    background: 'transparent',
    color: '#000000',
    fontSize: '14px',
    fontFamily: 'Space Mono, monospace',
    fontWeight: 700,
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

// Add hover effects
if (typeof document !== 'undefined') {
  const addHoverEffects = () => {
    const style = document.createElement('style');
    style.textContent = `
      .search-button:hover {
        background: #ffffff !important;
        color: #000000 !important;
      }
      .filter-toggle:hover {
        border-color: #000000 !important;
        color: #000000 !important;
      }
      .restaurant-card:hover {
        border-color: #000000 !important;
        transform: translateY(-2px) !important;
      }
      .load-more-button:hover {
        background: #000000 !important;
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(style);
  };

  setTimeout(addHoverEffects, 100);
}

export default SearchResults;