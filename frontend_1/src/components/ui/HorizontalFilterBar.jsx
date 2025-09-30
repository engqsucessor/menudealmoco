import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPracticalFeatureLabel } from '../../constants/labels';
import { isDefaultPriceRange, FEATURE_LABELS, DATA_FRESHNESS_OPTIONS } from '../../constants/filterConfig';
import styles from './HorizontalFilterBar.module.css';
import Button from './Button';

const HorizontalFilterBar = ({ onToggleAllFilters, onFilterChange, activeFilters }) => {
  const { user } = useAuth();

  const handleQuickFilter = (category, key, value) => {
    onFilterChange(category, key, value);
  };

  const handleFoodTypeToggle = (foodType) => {
    onFilterChange('foodTypes', null, foodType);
  };

  const getActiveFilterTags = () => {
    const tags = [];
    const createTag = (key, label, onRemove) => ({ key, label, onRemove });

    // Only show price filter if it's not set to default 'any'
    if (activeFilters?.priceRange && !isDefaultPriceRange(activeFilters.priceRange)) {
      tags.push(createTag(
        'price',
        `€${activeFilters.minPrice}-${activeFilters.maxPrice}`,
        () => {
          onFilterChange('priceRange', null, 'any');
        }
      ));
    }

    (activeFilters?.foodTypes || []).forEach(type => {
      tags.push(createTag(`food-${type}`, type, () => handleFoodTypeToggle(type)));
    });

    Object.entries(activeFilters?.features || {}).forEach(([key, value]) => {
      if (value) {
        const label = FEATURE_LABELS[key] || key;
        tags.push(createTag(`feature-${key}`, label, () => handleQuickFilter('features', key, false)));
      }
    });

    Object.entries(activeFilters?.practicalFilters || {}).forEach(([key, value]) => {
      if (value) {
        const label = getPracticalFeatureLabel(key, false, false); // No emoji, full label
        tags.push(createTag(`practical-${key}`, label, () => handleQuickFilter('practicalFilters', key, false)));
      }
    });
    
    if (activeFilters?.openNow) {
        tags.push(createTag('openNow', 'Open Now', () => handleQuickFilter('openNow', null, false)));
    }
    if (activeFilters?.showOnlyFavorites) {
        tags.push(createTag('favorites', 'Favorites ❤️', () => onFilterChange('showOnlyFavorites', null, false)));
    }
    if (activeFilters?.overallRating > 0) {
      tags.push(createTag('overall-rating', `Rating ${activeFilters.overallRating}+`, () => onFilterChange('overallRating', null, 0)));
    }
    if (activeFilters?.minGoogleRating > 0) {
      tags.push(createTag('google-rating', `Google ${activeFilters.minGoogleRating}+`, () => onFilterChange('minGoogleRating', null, 0)));
    }
    if (activeFilters?.hasMenuReviews) {
      tags.push(createTag('menu-reviews', 'Menu Reviews', () => onFilterChange('hasMenuReviews', null, false)));
    }
    if (activeFilters?.lastUpdatedDays) {
      const freshOption = DATA_FRESHNESS_OPTIONS.find(option => option.value === activeFilters.lastUpdatedDays);
      const label = freshOption ? freshOption.label : `${activeFilters.lastUpdatedDays} days`;
      tags.push(createTag('data-freshness', label, () => onFilterChange('lastUpdatedDays', null, '')));
    }

    return tags;
  };

  const activeFilterTags = getActiveFilterTags();
  const activeFiltersCount = activeFilterTags.length;

  const clearAllFilters = () => {
    // Call the parent's clear all function directly
    onFilterChange('clearAll', null, true);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.actions}>
        <Button
          variant="secondary"
          onClick={onToggleAllFilters}
          className={styles.filterButton}
        >
          {`Filters ${activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}`}
        </Button>
        <Button
            variant={activeFilters.openNow ? "primary" : "secondary"}
            onClick={() => onFilterChange('openNow', null, !activeFilters.openNow)}
        >
            Open Now
        </Button>
        {user && (
          <Button
              variant={activeFilters.showOnlyFavorites ? "primary" : "secondary"}
              onClick={() => onFilterChange('showOnlyFavorites', null, !activeFilters.showOnlyFavorites)}
          >
              Favorites ❤️
          </Button>
        )}
      </div>

      <div className={styles.activeFiltersContainer}>
        {activeFiltersCount > 0 && (
          <div className={styles.activeFilters}>
            {activeFilterTags.map((tag) => (
              <div key={tag.key} className={styles.filterTag}>
                <span className={styles.tagLabel}>{tag.label}</span>
                <button
                  onClick={tag.onRemove}
                  className={styles.tagRemove}
                  aria-label={`Remove ${tag.label} filter`}
                >
                  &times;
                </button>
              </div>
            ))}
            <button onClick={clearAllFilters} className={styles.clearAllButton}>
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalFilterBar;
