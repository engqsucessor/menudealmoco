import React from 'react';
import styles from './BudgetSlider.module.css';

const BudgetSlider = ({ 
  min = 6, 
  max = 400, 
  value = [6, 400], 
  onChange, 
  step = 1,
  label = "Your budget (per night)"
}) => {
  
  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    const newValue = [Math.min(newMin, value[1] - step), value[1]];
    onChange(newValue);
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    const newValue = [value[0], Math.max(newMax, value[0] + step)];
    onChange(newValue);
  };

  const formatValue = (val) => {
    if (val >= max) return `€${val}+`;
    return `€${val}`;
  };

  const minPercent = ((value[0] - min) / (max - min)) * 100;
  const maxPercent = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className={styles.budgetSlider}>
      <div className={styles.header}>
        <h4 className={styles.label}>Filter by:</h4>
        <h3 className={styles.title}>{label}</h3>
        <div className={styles.valueDisplay}>
          {formatValue(value[0])} - {formatValue(value[1])}
        </div>
      </div>
      
      <div className={styles.sliderContainer}>
        <div className={styles.track}>
          <div 
            className={styles.activeTrack}
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`
            }}
          />
        </div>
        
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          step={step}
          onChange={handleMinChange}
          className={`${styles.slider} ${styles.sliderMin}`}
        />
        
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          step={step}
          onChange={handleMaxChange}
          className={`${styles.slider} ${styles.sliderMax}`}
        />
      </div>
    </div>
  );
};

export default BudgetSlider;