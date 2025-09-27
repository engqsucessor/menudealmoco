import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';
import styles from './SearchBar.module.css';

const SearchBar = ({
  onSearch,
  onLocationSelect,
  placeholder = "",
  showLocationButton = true,
  className = '',
  initialQuery = '',
  initialLocation = ''
}) => {
  const [searchTerm, setSearchTerm] = useState(initialQuery || initialLocation || '');
  const [searchMode, setSearchMode] = useState('location'); // 'location' or 'restaurant'
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update search term and mode when initial values change
  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
      setSearchMode('restaurant');
    } else if (initialLocation) {
      setSearchTerm(initialLocation);
      setSearchMode('location');
    }
  }, [initialQuery, initialLocation]);

  // Mock location suggestions - in real app would come from API
  const mockSuggestions = [
    'Porto, Portugal',
    'Lisboa, Portugal',
    'Braga, Portugal',
    'Coimbra, Portugal',
    'Aveiro, Portugal',
    'Faro, Portugal',
    'Funchal, Madeira',
    'Ponta Delgada, Açores'
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Only show location suggestions when in location mode
    if (searchMode === 'location' && value.length > 1) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      if (searchMode === 'location') {
        // Search by location
        onSearch?.('', searchTerm.trim());
      } else {
        // Search by restaurant name/description
        onSearch?.(searchTerm.trim(), '');
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Suggestions are always locations
    onSearch?.('', suggestion);
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Mock reverse geocoding - in real app would use proper service
        setTimeout(() => {
          const mockLocation = 'Near you, Portugal';
          setSearchTerm(mockLocation);
          onLocationSelect?.({ latitude, longitude, address: mockLocation });
          onSearch?.('', mockLocation); // Also trigger search with location
          setIsLocating(false);
        }, 1500);
      },
      (error) => {
        let errorMessage = 'Unable to get your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setLocationError(errorMessage);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  const searchBarClasses = [
    styles.searchBar,
    className
  ].filter(Boolean).join(' ');

  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return searchMode === 'location'
      ? 'Search by city, district, or address...'
      : 'Search by restaurant name...';
  };

  return (
    <div className={searchBarClasses}>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchModeToggle}>
          <button
            type="button"
            className={`${styles.modeButton} ${searchMode === 'location' ? styles.active : ''}`}
            onClick={() => setSearchMode('location')}
          >
            📍 Location
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${searchMode === 'restaurant' ? styles.active : ''}`}
            onClick={() => setSearchMode('restaurant')}
          >
            🍽️ Restaurant
          </button>
        </div>
        <div className={styles.inputContainer}>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder={getPlaceholder()}
            className={styles.searchInput}
            autoComplete="off"
          />

          <div className={styles.buttonGroup}>
            {showLocationButton && (
              <Button
                type="button"
                variant="ghost"
                size="small"
                onClick={handleUseLocation}
                loading={isLocating}
                className={styles.locationButton}
                disabled={isLocating}
              >
                {isLocating ? 'LOCATING...' : '📍 NEAR ME'}
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="small"
              disabled={!searchTerm.trim()}
              className={styles.searchButton}
            >
              SEARCH
            </Button>
          </div>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div ref={suggestionsRef} className={styles.suggestions}>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className={styles.suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className={styles.suggestionIcon}>📍</span>
                <span className={styles.suggestionText}>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Location Error */}
      {locationError && (
        <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠</span>
          <span className={styles.errorText}>{locationError}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;