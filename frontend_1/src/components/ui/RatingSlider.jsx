import React, { useMemo } from 'react';
import styles from './RatingSlider.module.css';

const RatingSlider = ({
  value = 0,
  onChange,
  label = "Rating",
  className = '',
  ...props
}) => {
  // Generate star display based on current value
  const renderStars = useMemo(() => {
    const stars = [];
    const fullStars = Math.floor(value);
    const hasHalfStar = value % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <span key={i} className={`${styles.star} ${styles.filled}`}>
            ★
          </span>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <span key={i} className={`${styles.star} ${styles.half}`}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className={`${styles.star} ${styles.empty}`}>
            ☆
          </span>
        );
      }
    }

    return stars;
  }, [value]);

  // Generate tick marks and labels
  const tickMarks = useMemo(() => {
    const marks = [];
    for (let i = 0; i <= 10; i++) {
      const tickValue = i * 0.5;
      const isFullStar = i % 2 === 0;
      const position = (i / 10) * 100;

      marks.push(
        <div
          key={i}
          className={`${styles.tick} ${isFullStar ? styles.fullTick : styles.halfTick}`}
          style={{ left: `${position}%` }}
        >
          <div className={styles.tickMark} />
          {isFullStar && (
            <div className={styles.tickLabel}>
              {tickValue === 0 ? '0' : tickValue}
            </div>
          )}
        </div>
      );
    }
    return marks;
  }, []);

  // Format display text
  const getDisplayText = (val) => {
    if (val === 0) return 'Any Rating';
    const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1);
    return `${formatted}+ Stars`;
  };

  const handleSliderChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange?.(newValue);
  };

  const sliderClasses = [
    styles.container,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={sliderClasses} {...props}>
      {/* Label */}
      <div className={styles.header}>
        <label className={styles.label} htmlFor={`rating-slider-${label}`}>
          {label}
        </label>
        <div className={styles.valueDisplay}>
          {getDisplayText(value)}
        </div>
      </div>

      {/* Stars Display */}
      <div className={styles.starsContainer}>
        {renderStars}
      </div>

      {/* Slider Container */}
      <div className={styles.sliderContainer}>
        {/* Tick Marks */}
        <div className={styles.tickContainer}>
          {tickMarks}
        </div>

        {/* Range Input */}
        <input
          type="range"
          id={`rating-slider-${label}`}
          min="0"
          max="5"
          step="0.5"
          value={value}
          onChange={handleSliderChange}
          className={styles.slider}
          aria-label={`${label}: ${getDisplayText(value)}`}
        />

        {/* Track Styling */}
        <div className={styles.track}>
          <div
            className={styles.progress}
            style={{ width: `${(value / 5) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RatingSlider;