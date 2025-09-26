import React, { useState } from 'react';
import styles from './HorizontalFilterBar.module.css';
import Button from './Button';

const HorizontalFilterBar = ({ onToggleAllFilters, onFilterChange, activeFilters }) => {
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [selectedPeople, setSelectedPeople] = useState('2');

  const handleQuickFilter = (filter, key, value) => {
    onFilterChange(filter, key, value);
  };

  return (
    <div className={styles.filterBar}>
      {/* Left section - Selectors */}
      <div className={styles.selectors}>
        <select 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)}
          className={styles.selector}
        >
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="thisWeek">This Week</option>
        </select>

        <select 
          value={selectedTime} 
          onChange={(e) => setSelectedTime(e.target.value)}
          className={styles.selector}
        >
          <option value="12:00">12:00</option>
          <option value="12:30">12:30</option>
          <option value="13:00">13:00</option>
          <option value="13:30">13:30</option>
          <option value="14:00">14:00</option>
        </select>

        <select 
          value={selectedPeople} 
          onChange={(e) => setSelectedPeople(e.target.value)}
          className={styles.selector}
        >
          <option value="1">1 person</option>
          <option value="2">2 people</option>
          <option value="3">3 people</option>
          <option value="4">4 people</option>
          <option value="5+">5+ people</option>
        </select>
      </div>

      {/* Right section - Filter buttons */}
      <div className={styles.filters}>
        <Button
          variant="secondary"
          onClick={onToggleAllFilters}
          className={styles.filterButton}
        >
          <span className={styles.filterIcon}>📊</span> All Filters
        </Button>

        <Button
          variant={activeFilters?.includes?.coffee ? 'primary' : 'secondary'}
          onClick={() => handleQuickFilter('includes', 'coffee', !activeFilters?.includes?.coffee)}
          className={styles.filterButton}
        >
          <span className={styles.filterIcon}>☕</span> Coffee Included
        </Button>

        <Button
          variant={activeFilters?.practical?.openNow ? 'primary' : 'secondary'}
          onClick={() => handleQuickFilter('practical', 'openNow', !activeFilters?.practical?.openNow)}
          className={styles.filterButton}
        >
          <span className={styles.filterIcon}>🕐</span> Available Now
        </Button>

        <Button
          variant={activeFilters?.minGoogleRating ? 'primary' : 'secondary'}
          onClick={() => handleQuickFilter('minGoogleRating', null, activeFilters?.minGoogleRating ? '' : '4.0')}
          className={styles.filterButton}
        >
          <span className={styles.filterIcon}>⭐</span> Best Rated
        </Button>

        <select 
          className={`${styles.selector} ${styles.cuisineSelector}`}
          value={activeFilters?.foodType?.[0] || ''}
          onChange={(e) => handleQuickFilter('foodType', null, e.target.value ? [e.target.value] : [])}
        >
          <option value="">Cuisine Type</option>
          <option value="Traditional Portuguese">Traditional Portuguese</option>
          <option value="Modern/Contemporary">Modern/Contemporary</option>
          <option value="Seafood specialist">Seafood</option>
          <option value="International">International</option>
        </select>
      </div>
    </div>
  );
};

export default HorizontalFilterBar;
