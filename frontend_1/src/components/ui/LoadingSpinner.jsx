import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({
  size = 'medium',
  text = 'LOADING',
  variant = 'dots',
  className = ''
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[variant],
    className
  ].filter(Boolean).join(' ');

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={styles.dotsContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );

      case 'bars':
        return (
          <div className={styles.barsContainer}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        );

      case 'square':
        return (
          <div className={styles.squareContainer}>
            <div className={styles.square}></div>
          </div>
        );

      case 'text':
        return (
          <div className={styles.textContainer}>
            <span className={styles.loadingChar}>L</span>
            <span className={styles.loadingChar}>O</span>
            <span className={styles.loadingChar}>A</span>
            <span className={styles.loadingChar}>D</span>
            <span className={styles.loadingChar}>I</span>
            <span className={styles.loadingChar}>N</span>
            <span className={styles.loadingChar}>G</span>
            <span className={styles.loadingChar}>.</span>
            <span className={styles.loadingChar}>.</span>
            <span className={styles.loadingChar}>.</span>
          </div>
        );

      default:
        return (
          <div className={styles.dotsContainer}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );
    }
  };

  return (
    <div className={spinnerClasses}>
      {renderSpinner()}
      {text && variant !== 'text' && (
        <div className={styles.loadingText}>{text}</div>
      )}
    </div>
  );
};

export default LoadingSpinner;