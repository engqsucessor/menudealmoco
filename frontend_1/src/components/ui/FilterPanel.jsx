import React, { useState } from 'react';
import Button from './Button';
import styles from './FilterPanel.module.css';

const FilterPanel = ({
  onFiltersChange,
  initialFilters = {},
  isOpen = false,
  onToggle,
  className = ''
}) => {
  const [filters, setFilters] = useState({
    priceRange: initialFilters.priceRange || '',
    foodType: initialFilters.foodType || '',
    distance: initialFilters.distance || '',
    includes: {
      coffee: initialFilters.includes?.coffee || false,
      dessert: initialFilters.includes?.dessert || false,
      wine: initialFilters.includes?.wine || false,
      bread: initialFilters.includes?.bread || false
    },
    practical: {
      openNow: initialFilters.practical?.openNow || false,
      takesCards: initialFilters.practical?.takesCards || false,
      quickService: initialFilters.practical?.quickService || false,
      groupFriendly: initialFilters.practical?.groupFriendly || false,
      hasParking: initialFilters.practical?.hasParking || false
    }
  });

  // Filter options from MVP specification
  const priceRanges = [
    { value: '6-8', label: '€6-8', subtitle: 'Budget deals' },
    { value: '8-10', label: '€8-10', subtitle: 'Standard' },
    { value: '10-12', label: '€10-12', subtitle: 'Good value' },
    { value: '12-15', label: '€12-15', subtitle: 'Premium' },
    { value: '15+', label: '€15+', subtitle: 'High-end' }
  ];

  const foodTypes = [
    'Traditional Portuguese',
    'Modern/Contemporary',
    'Seafood specialist',
    'Meat-focused',
    'Vegetarian-friendly',
    'International'
  ];

  const distanceOptions = [
    { value: '0.5', label: '500m', subtitle: 'Walking distance' },
    { value: '1', label: '1km', subtitle: 'Short walk' },
    { value: '2', label: '2km', subtitle: 'Bike/drive' },
    { value: '5', label: '5km', subtitle: 'Driving distance' },
    { value: 'any', label: 'Any', subtitle: 'No limit' }
  ];

  const includesOptions = [
    { key: 'coffee', label: 'Coffee included', icon: '☕' },
    { key: 'dessert', label: 'Dessert included', icon: '🍰' },
    { key: 'wine', label: 'Wine available', icon: '🍷' },
    { key: 'bread', label: 'Bread/soup included', icon: '🍞' }
  ];

  const practicalOptions = [
    { key: 'openNow', label: 'Open now', icon: '🕐' },
    { key: 'takesCards', label: 'Takes credit cards', icon: '💳' },
    { key: 'quickService', label: 'Quick service', icon: '⚡' },
    { key: 'groupFriendly', label: 'Group-friendly', icon: '👥' },
    { key: 'hasParking', label: 'Has parking', icon: '🚗' }
  ];

  const handleFilterChange = (category, key, value) => {
    let newFilters;

    if (category === 'includes' || category === 'practical') {
      newFilters = {
        ...filters,
        [category]: {
          ...filters[category],
          [key]: value
        }
      };
    } else {
      newFilters = {
        ...filters,
        [category]: value
      };
    }

    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      priceRange: '',
      foodType: '',
      distance: '',
      includes: {
        coffee: false,
        dessert: false,
        wine: false,
        bread: false
      },
      practical: {
        openNow: false,
        takesCards: false,
        quickService: false,
        groupFriendly: false,
        hasParking: false
      }
    };

    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange) count++;
    if (filters.foodType) count++;
    if (filters.distance) count++;
    count += Object.values(filters.includes).filter(Boolean).length;
    count += Object.values(filters.practical).filter(Boolean).length;
    return count;
  };

  const panelClasses = [
    styles.filterPanel,
    isOpen && styles.open,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={panelClasses}>
      {/* Toggle Button for Mobile */}
      <button
        className={styles.toggleButton}
        onClick={onToggle}
        type="button"
      >
        <span className={styles.toggleIcon}>⚙</span>
        <span className={styles.toggleText}>
          FILTERS {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
        </span>
        <span className={styles.toggleArrow}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Filter Content */}
      <div className={styles.filterContent}>
        <div className={styles.filterHeader}>
          <h3 className={styles.filterTitle}>FILTERS</h3>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="ghost"
              size="small"
              onClick={clearAllFilters}
              className={styles.clearButton}
            >
              CLEAR ALL
            </Button>
          )}
        </div>

        {/* Price Range */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>PRICE RANGE</h4>
          <div className={styles.optionGrid}>
            {priceRanges.map((range) => (
              <button
                key={range.value}
                className={`${styles.optionButton} ${
                  filters.priceRange === range.value ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('priceRange', null,
                  filters.priceRange === range.value ? '' : range.value
                )}
                type="button"
              >
                <span className={styles.optionLabel}>{range.label}</span>
                <span className={styles.optionSubtitle}>{range.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>DISTANCE</h4>
          <div className={styles.optionGrid}>
            {distanceOptions.map((distance) => (
              <button
                key={distance.value}
                className={`${styles.optionButton} ${
                  filters.distance === distance.value ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('distance', null,
                  filters.distance === distance.value ? '' : distance.value
                )}
                type="button"
              >
                <span className={styles.optionLabel}>{distance.label}</span>
                <span className={styles.optionSubtitle}>{distance.subtitle}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Food Type */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>FOOD TYPE</h4>
          <div className={styles.optionList}>
            {foodTypes.map((type) => (
              <button
                key={type}
                className={`${styles.listButton} ${
                  filters.foodType === type ? styles.active : ''
                }`}
                onClick={() => handleFilterChange('foodType', null,
                  filters.foodType === type ? '' : type
                )}
                type="button"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* What's Included */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>WHAT'S INCLUDED</h4>
          <div className={styles.checkboxGrid}>
            {includesOptions.map((option) => (
              <label
                key={option.key}
                className={`${styles.checkboxLabel} ${
                  filters.includes[option.key] ? styles.checked : ''
                }`}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filters.includes[option.key]}
                  onChange={(e) => handleFilterChange('includes', option.key, e.target.checked)}
                />
                <span className={styles.checkboxIcon}>{option.icon}</span>
                <span className={styles.checkboxText}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Practical Filters */}
        <div className={styles.filterSection}>
          <h4 className={styles.sectionTitle}>PRACTICAL</h4>
          <div className={styles.checkboxGrid}>
            {practicalOptions.map((option) => (
              <label
                key={option.key}
                className={`${styles.checkboxLabel} ${
                  filters.practical[option.key] ? styles.checked : ''
                }`}
              >
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filters.practical[option.key]}
                  onChange={(e) => handleFilterChange('practical', option.key, e.target.checked)}
                />
                <span className={styles.checkboxIcon}>{option.icon}</span>
                <span className={styles.checkboxText}>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;