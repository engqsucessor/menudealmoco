import React from 'react';
import styles from './HorizontalFilterBar.module.css';
import Button from './Button';

const HorizontalFilterBar = ({ onToggleAllFilters, onFilterChange, activeFilters }) => {

  const handleQuickFilter = (category, key, value) => {
    onFilterChange(category, key, value);
  };

  const handleFoodTypeToggle = (foodType) => {
    onFilterChange('foodTypes', null, foodType);
  };

  const getActiveFilterTags = () => {
    const tags = [];
    const createTag = (key, label, onRemove) => ({ key, label, onRemove });

    if (activeFilters?.minPrice !== 6 || activeFilters?.maxPrice !== 25) {
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
        const labels = {
          coffeeIncluded: 'Coffee Included', dessertIncluded: 'Dessert Included',
          wineAvailable: 'Wine Available', breadSoupIncluded: 'Bread/Soup Included',
          vegetarianOptions: 'Vegetarian Options'
        };
        tags.push(createTag(`feature-${key}`, labels[key], () => handleQuickFilter('features', key, false)));
      }
    });

    Object.entries(activeFilters?.practicalFilters || {}).forEach(([key, value]) => {
      if (value) {
        const labels = {
          takesCards: 'Takes Cards', hasParking: 'Has Parking', quickService: 'Quick Service',
          groupFriendly: 'Group Friendly', nearMetro: 'Near Metro'
        };
        tags.push(createTag(`practical-${key}`, labels[key], () => handleQuickFilter('practicalFilters', key, false)));
      }
    });
    
    if (activeFilters?.openNow) {
        tags.push(createTag('openNow', 'Open Now', () => handleQuickFilter('openNow', null, false)));
    }
    if (activeFilters?.overallRating > 0) {
      tags.push(createTag('overall-rating', `Rating ${activeFilters.overallRating}+`, () => onFilterChange('overallRating', null, 0)));
    }
    if (activeFilters?.minGoogleRating > 0) {
      tags.push(createTag('google-rating', `Google ${activeFilters.minGoogleRating}+`, () => onFilterChange('minGoogleRating', null, 0)));
    }
    if (activeFilters?.minZomatoRating > 0) {
      tags.push(createTag('zomato-rating', `Zomato ${activeFilters.minZomatoRating}+`, () => onFilterChange('minZomatoRating', null, 0)));
    }
    if (activeFilters?.hasMenuReviews) {
      tags.push(createTag('menu-reviews', 'Menu Reviews', () => onFilterChange('hasMenuReviews', null, false)));
    }
    if (activeFilters?.lastUpdatedDays) {
      const dayLabels = {
        '7': 'Last Week',
        '30': 'Last Month',
        '90': 'Last 3 Months'
      };
      const label = dayLabels[activeFilters.lastUpdatedDays] || `${activeFilters.lastUpdatedDays} days`;
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
        <Button
            variant={activeFilters.minPrice > 6 || activeFilters.maxPrice < 25 ? "primary" : "secondary"}
            onClick={() => {
              // Toggle between budget prices and all prices
              const isBudgetActive = activeFilters.minPrice === 6 && activeFilters.maxPrice === 10;
              if (isBudgetActive) {
                onFilterChange('priceRange', null, 'any');
              } else {
                onFilterChange('priceRange', null, 'budget');
              }
            }}
        >
            Budget (€6-10)
        </Button>
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
