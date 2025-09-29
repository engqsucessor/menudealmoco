import React, { useState, useEffect } from 'react';
import styles from './FilterModal.module.css';
import Button from './Button';
import RatingSlider from './RatingSlider';
import BudgetSlider from './BudgetSlider';
import MinimumRatingSlider from './MinimumRatingSlider';

const FilterModal = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [clearFeedback, setClearFeedback] = useState('');

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  const handleChange = (category, key, value) => {
    if (category === 'features' || category === 'practicalFilters') {
      setLocalFilters(prev => ({
        ...prev,
        [category]: { ...prev[category], [key]: value }
      }));
    } else if (category === 'foodTypes') {
      const currentArray = localFilters[category] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      setLocalFilters(prev => ({ ...prev, [category]: newArray }));
    } else {
      setLocalFilters(prev => ({ ...prev, [category]: value }));
    }
  };

  const handlePriceRangeChange = (value) => {
    const priceRanges = {
      'budget': { min: 6, max: 8 },
      'standard': { min: 8, max: 10 },
      'good': { min: 10, max: 12 },
      'premium': { min: 12, max: 15 },
      'high-end': { min: 15, max: 25 },
      'any': { min: 6, max: 25 }
    };
    const range = priceRanges[value];
    setLocalFilters(prev => ({ 
      ...prev, 
      priceRange: value,
      minPrice: range.min, 
      maxPrice: range.max 
    }));
  };

  const handleBudgetSliderChange = (priceRange) => {
    setLocalFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      priceRange: 'custom' // Set to custom to indicate slider usage
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClearAll = () => {
    const clearedFilters = {
      ...filters,
      priceRange: 'any',
      minPrice: 6,
      maxPrice: 25,
      foodTypes: [],
      features: {},
      practicalFilters: {},
      openNow: false,
      minGoogleRating: 0,
      overallRating: 0,
      hasMenuReviews: false,
      lastUpdatedDays: '',
      showOnlyFavorites: false
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    showClearFeedback('All filters cleared!');
  };

  const handleClearSection = (sectionName) => {
    let updatedFilters = { ...localFilters };

    switch (sectionName) {
      case 'price':
        updatedFilters.priceRange = 'any';
        updatedFilters.minPrice = 6;
        updatedFilters.maxPrice = 25;
        break;
      case 'ratings':
        updatedFilters.minGoogleRating = 0;
        updatedFilters.overallRating = 0;
        break;
      case 'cuisine':
        updatedFilters.foodTypes = [];
        break;
      case 'features':
        updatedFilters.features = {};
        break;
      case 'practical':
        updatedFilters.practicalFilters = {};
        break;
      case 'other':
        updatedFilters.openNow = false;
        updatedFilters.hasMenuReviews = false;
        updatedFilters.lastUpdatedDays = '';
        break;
    }

    setLocalFilters(updatedFilters);
    showClearFeedback(`${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} filters cleared!`);
  };

  const showClearFeedback = (message) => {
    setClearFeedback(message);
    setTimeout(() => setClearFeedback(''), 2000);
  };

  const handleRatingChange = (type, value) => {
    setLocalFilters(prev => ({ ...prev, [type]: value }));
  };

  if (!isOpen) return null;

  const renderCheckbox = (category, key, label) => (
    <label className={styles.checkboxLabel}>
      <input
        type="checkbox"
        checked={
          category === 'foodTypes'
            ? localFilters.foodTypes?.includes(key)
            : localFilters[category]?.[key] || false
        }
        onChange={(e) => {
          if (category === 'foodTypes') {
            // For foodTypes, pass the key (food type string) as value
            handleChange(category, key, key);
          } else {
            // For other categories, pass the checked boolean
            handleChange(category, key, e.target.checked);
          }
        }}
        className={styles.checkboxInput}
      />
      <span className={styles.checkboxCustom}></span>
      <span className={styles.checkboxText}>{label}</span>
    </label>
  );

  const renderRadioGroup = (name, category, options, handler = null) => (
    <div className={styles.radioGroup}>
      {options.map(({ value, label }) => (
        <label key={value} className={styles.radioLabel}>
          <input
            type="radio"
            name={name}
            value={value}
            checked={localFilters[category] === value}
            onChange={(e) => handler ? handler(e.target.value) : handleChange(category, null, e.target.value)}
            className={styles.radioInput}
          />
          <span className={styles.radioCustom}></span>
          <span className={styles.radioText}>{label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <h2 className={styles.title}>Filters</h2>
          <button onClick={onClose} className={styles.closeButton}>&times;</button>
        </header>

        <main className={styles.modalContent}>
          <div className={styles.filterGrid}>
            {/* Price Range */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Price Range</h3>
                <button
                  onClick={() => handleClearSection('price')}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className={styles.sectionContent}>
                <BudgetSlider
                  min={6}
                  max={25}
                  value={[localFilters.minPrice || 6, localFilters.maxPrice || 25]}
                  onChange={handleBudgetSliderChange}
                  step={0.5}
                  label="Your budget (per meal)"
                />
              </div>
            </div>

            {/* Overall Rating */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Overall Rating</h3>
                <button
                  onClick={() => handleClearSection('ratings')}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className={styles.sectionContent}>
                <MinimumRatingSlider
                  value={localFilters.overallRating || 0}
                  onChange={(value) => handleRatingChange('overallRating', value)}
                  label="Menu de Almoço rating"
                  step={0.1}
                />
              </div>
            </div>

            {/* Google Rating */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Google Rating</h3>
              </div>
              <div className={styles.sectionContent}>
                <MinimumRatingSlider
                  value={localFilters.minGoogleRating || 0}
                  onChange={(value) => handleRatingChange('minGoogleRating', value)}
                  label="Google rating"
                  step={0.1}
                />
              </div>
            </div>

            {/* Data Freshness */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Data Freshness</h3>
              </div>
              <div className={styles.sectionContent}>
                {renderRadioGroup('dataFreshness', 'lastUpdatedDays', [
                  { value: '', label: 'Anytime' },
                  { value: '7', label: 'Last Week' },
                  { value: '30', label: 'Last Month' },
                  { value: '90', label: 'Last 3 Months' }
                ])}
              </div>
            </div>

            {/* Cuisine Type */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Cuisine Type</h3>
                <button
                  onClick={() => handleClearSection('cuisine')}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className={styles.sectionContent}>
                {renderCheckbox('foodTypes', 'Traditional Portuguese', 'Traditional Portuguese')}
                {renderCheckbox('foodTypes', 'Modern/Contemporary', 'Modern/Contemporary')}
                {renderCheckbox('foodTypes', 'Seafood specialist', 'Seafood')}
                {renderCheckbox('foodTypes', 'Meat-focused', 'Meat-focused')}
                {renderCheckbox('foodTypes', 'Vegetarian-friendly', 'Vegetarian-friendly')}
                {renderCheckbox('foodTypes', 'International', 'International')}
              </div>
            </div>

            {/* What's Included */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>What's Included</h3>
                <button
                  onClick={() => handleClearSection('features')}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className={styles.sectionContent}>
                {renderCheckbox('features', 'coffeeIncluded', 'Coffee Included')}
                {renderCheckbox('features', 'dessertIncluded', 'Dessert Included')}
                {renderCheckbox('features', 'wineAvailable', 'Wine Available')}
                {renderCheckbox('features', 'breadSoupIncluded', 'Bread/Soup Included')}
                {renderCheckbox('features', 'vegetarianOptions', 'Vegetarian Options')}
              </div>
            </div>

            {/* Practical Features */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Practical Features</h3>
                <button
                  onClick={() => handleClearSection('practical')}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className={styles.sectionContent}>
                {renderCheckbox('practicalFilters', 'takesCards', 'Takes Cards')}
                {renderCheckbox('practicalFilters', 'hasParking', 'Has Parking')}
                {renderCheckbox('practicalFilters', 'quickService', 'Quick Service')}
                {renderCheckbox('practicalFilters', 'groupFriendly', 'Group Friendly')}
                {renderCheckbox('practicalFilters', 'nearMetro', 'Near Metro')}
              </div>
            </div>

            {/* Other */}
            <div className={styles.filterSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Other Options</h3>
                <button
                  onClick={() => handleClearSection('other')}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              <div className={styles.sectionContent}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={localFilters.openNow || false}
                    onChange={(e) => handleChange('openNow', null, e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxCustom}></span>
                  <span className={styles.checkboxText}>Open Now</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={localFilters.hasMenuReviews || false}
                    onChange={(e) => handleChange('hasMenuReviews', null, e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxCustom}></span>
                  <span className={styles.checkboxText}>Has Menu Reviews</span>
                </label>
              </div>
            </div>
          </div>
        </main>

        <footer className={styles.modalFooter}>
          {clearFeedback && (
            <div className={styles.clearFeedback}>
              {clearFeedback}
            </div>
          )}
          <div className={styles.footerActions}>
            <Button onClick={handleClearAll} variant="secondary" className={styles.clearAllButton}>
              Clear All Filters
            </Button>
            <Button onClick={handleApply} variant="primary" className={styles.applyButton}>
              Show Results
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FilterModal;