import React from 'react';
import styles from './MinimumRatingSlider.module.css';

const MinimumRatingSlider = ({ 
  min = 0, 
  max = 5, 
  value = 0, 
  onChange, 
  step = 0.1, // Much more flexible step
  label = "Minimum Rating"
}) => {
  
  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  const formatValue = (val) => {
    if (val === 0) return "Any Rating";
    // Show one decimal place for precision, but clean up .0
    const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1);
    return `${formatted}+ stars`;
  };

  const percent = (value / max) * 100;

  // Generate tick marks for 0.5 intervals (visual only)
  const renderTickMarks = () => {
    const ticks = [];
    const tickStep = 0.5; // Visual ticks every 0.5
    const totalTicks = (max - min) / tickStep; // 10 visual ticks for 0 to 5
    
    for (let i = 0; i <= totalTicks; i++) {
      const tickValue = min + (i * tickStep);
      const tickPercent = (tickValue / max) * 100;
      const isWhole = tickValue % 1 === 0;
      
      ticks.push(
        <div
          key={i}
          className={`${styles.tick} ${isWhole ? styles.majorTick : styles.minorTick}`}
          style={{ left: `${tickPercent}%` }}
        >
          <div className={styles.tickMark} />
          {isWhole && (
            <span className={styles.tickLabel}>
              {tickValue}
            </span>
          )}
        </div>
      );
    }
    
    return ticks;
  };

  return (
    <div className={styles.ratingSlider}>
      <div className={styles.header}>
        <h4 className={styles.label}>Filter by:</h4>
        <h3 className={styles.title}>{label}</h3>
        <div className={styles.valueDisplay}>
          {formatValue(value)}
        </div>
      </div>
      
      <div className={styles.sliderContainer}>
        <div className={styles.track}>
          <div 
            className={styles.activeTrack}
            style={{ width: `${percent}%` }}
          />
        </div>
        
        {/* Tick marks */}
        <div className={styles.tickContainer}>
          {renderTickMarks()}
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleChange}
          className={styles.slider}
        />
      </div>
    </div>
  );
};

export default MinimumRatingSlider;