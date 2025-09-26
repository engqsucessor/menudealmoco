import React from 'react';
import styles from './Slider.module.css';

const Slider = ({ min, max, value, onChange, step = 1, range = false }) => {
  const handleChange = (e) => {
    if (range && Array.isArray(value)) {
      const newValue = [...value];
      const index = e.target.dataset.index === "1" ? 1 : 0;
      newValue[index] = Number(e.target.value);
      onChange(newValue);
    } else {
      onChange(Number(e.target.value));
    }
  };

  if (range) {
    return (
      <div className={styles.rangeSliderContainer}>
        <div className={styles.values}>
          <span>{value[0]}€</span>
          <span>{value[1]}€</span>
        </div>
        <div className={styles.sliders}>
          <input
            type="range"
            min={min}
            max={max}
            value={value[0]}
            step={step}
            data-index="0"
            onChange={handleChange}
            className={styles.slider}
          />
          <input
            type="range"
            min={min}
            max={max}
            value={value[1]}
            step={step}
            data-index="1"
            onChange={handleChange}
            className={styles.slider}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleChange}
        className={styles.slider}
      />
      <div className={styles.values}>
        <span>{min}</span>
        <span>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Slider;