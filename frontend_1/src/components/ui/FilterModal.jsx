import React, { useState, useEffect } from 'react';
import styles from './FilterModal.module.css';
import Button from './Button';
import RatingSlider from './RatingSlider';
import BudgetSlider from './BudgetSlider';
import MinimumRatingSlider from './MinimumRatingSlider';
import { 
  PRICE_RANGES, 
  createClearedFilters, 
  DATA_FRESHNESS_OPTIONS,
  FOOD_TYPE_OPTIONS,
  FEATURE_LABELS,
  SLIDER_CONFIG
} from '../../constants/filterConfig';

const FilterModal = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [clearFeedback, setClearFeedback] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    overallRating: true,
    googleRating: true,
    freshness: true,
    cuisine: true,
    included: true,
    practical: true,
    other: true
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    const range = PRICE_RANGES[value];
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
    const clearedFilters = createClearedFilters(filters);
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    showClearFeedback('All filters cleared!');
  };

  const handleClearSection = (sectionName) => {
    let updatedFilters = { ...localFilters };

    switch (sectionName) {
      case 'price':
        const anyRange = PRICE_RANGES.any;
        updatedFilters.priceRange = 'any';
        updatedFilters.minPrice = anyRange.min;
        updatedFilters.maxPrice = anyRange.max;
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

  const toggleSection = (sectionName) => {
    if (isMobile) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionName]: !prev[sectionName]
      }));
    }
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
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('price')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.price ? '▼ ' : '▶ ')}Price Range
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearSection('price'); }}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              {expandedSections.price && <div className={styles.sectionContent}>
                <BudgetSlider
                  min={SLIDER_CONFIG.price.min}
                  max={SLIDER_CONFIG.price.max}
                  value={[localFilters.minPrice || SLIDER_CONFIG.price.min, localFilters.maxPrice || SLIDER_CONFIG.price.max]}
                  onChange={handleBudgetSliderChange}
                  step={SLIDER_CONFIG.price.step}
                  label={SLIDER_CONFIG.price.label}
                />
              </div>}
            </div>

            {/* Overall Rating */}
            <div className={styles.filterSection}>
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('overallRating')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.overallRating ? '▼ ' : '▶ ')}Menu de Almoço Rating
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearSection('ratings'); }}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              {expandedSections.overallRating && <div className={styles.sectionContent}>
                <MinimumRatingSlider
                  value={localFilters.overallRating || 0}
                  onChange={(value) => handleRatingChange('overallRating', value)}
                  label="Menu de Almoço rating"
                  step={0.1}
                />
              </div>}
            </div>

            {/* Google Rating */}
            <div className={styles.filterSection}>
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('googleRating')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.googleRating ? '▼ ' : '▶ ')}Google Rating
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearSection('ratings'); }}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              {expandedSections.googleRating && <div className={styles.sectionContent}>
                <MinimumRatingSlider
                  value={localFilters.minGoogleRating || 0}
                  onChange={(value) => handleRatingChange('minGoogleRating', value)}
                  label="Google rating"
                  step={0.1}
                />
              </div>}
            </div>

            {/* Data Freshness */}
            <div className={styles.filterSection}>
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('freshness')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.freshness ? '▼ ' : '▶ ')}Data Freshness
                </h3>
              </div>
              {expandedSections.freshness && <div className={styles.sectionContent}>
                {renderRadioGroup('dataFreshness', 'lastUpdatedDays', DATA_FRESHNESS_OPTIONS)}
              </div>}
            </div>

            {/* Cuisine Type */}
            <div className={styles.filterSection}>
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('cuisine')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.cuisine ? '▼ ' : '▶ ')}Cuisine Type
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearSection('cuisine'); }}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              {expandedSections.cuisine && <div className={styles.sectionContent}>
                {FOOD_TYPE_OPTIONS.map(foodType =>
                  renderCheckbox('foodTypes', foodType, foodType)
                )}
              </div>}
            </div>

            {/* What's Included */}
            <div className={styles.filterSection}>
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('included')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.included ? '▼ ' : '▶ ')}What's Included
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearSection('features'); }}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              {expandedSections.included && <div className={styles.sectionContent}>
                {Object.entries(FEATURE_LABELS).map(([key, label]) =>
                  renderCheckbox('features', key, label)
                )}
              </div>}
            </div>

            {/* Practical Features */}
            <div className={styles.filterSection}>
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('practical')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.practical ? '▼ ' : '▶ ')}Practical Features
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearSection('practical'); }}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              {expandedSections.practical && <div className={styles.sectionContent}>
                {renderCheckbox('practicalFilters', 'takesCards', 'Takes Cards')}
                {renderCheckbox('practicalFilters', 'hasParking', 'Has Parking')}
                {renderCheckbox('practicalFilters', 'quickService', 'Quick Service')}
                {renderCheckbox('practicalFilters', 'groupFriendly', 'Group Friendly')}
                {renderCheckbox('practicalFilters', 'nearMetro', 'Near Metro')}
              </div>}
            </div>

            {/* Other */}
            <div className={styles.filterSection}>
              <div className={`${styles.sectionHeader} ${isMobile ? styles.clickable : ''}`} onClick={() => toggleSection('other')}>
                <h3 className={styles.sectionTitle}>
                  {isMobile && (expandedSections.other ? '▼ ' : '▶ ')}Other Options
                </h3>
                <button
                  onClick={(e) => { e.stopPropagation(); handleClearSection('other'); }}
                  className={styles.sectionClearButton}
                  type="button"
                >
                  Clear
                </button>
              </div>
              {expandedSections.other && <div className={styles.sectionContent}>
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
              </div>}
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