import React from 'react';
import { Link } from 'react-router-dom';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({
  restaurant,
  className = ''
}) => {
  const {
    id,
    name,
    location,
    menuPrice,
    valueRating,
    totalReviews,
    included = [],
    foodType,
    quickInfo = [],
    isOpen = true,
    verified = false,
    googleRating,
    googleReviews,
    zomatoRating,
    zomatoReviews,
    lastUpdated
  } = restaurant;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className={styles.stars}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '☆'}
        {'☆'.repeat(emptyStars)}
      </div>
    );
  };

  const cardClasses = [
    styles.restaurantCard,
    !isOpen && styles.closed,
    className
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClasses}>
      <Link to={`/restaurant/${id}`} className={styles.cardLink}>
        <div className={styles.contentSection}>
          <header className={styles.cardHeader}>
            <div className={styles.nameSection}>
              <h3 className={styles.restaurantName}>{name}</h3>
              <p className={styles.location}>{location}</p>
            </div>
            <div className={styles.priceSection}>
              <span className={styles.menuPrice}>€{menuPrice}</span>
              <span className={styles.priceLabel}>MENU</span>
            </div>
          </header>

          <div className={styles.ratingSection}>
            {renderStars(valueRating)}
            <span className={styles.ratingText}>
              {valueRating}/5 ({totalReviews} reviews)
            </span>
          </div>

          <div className={styles.externalRatings}>
            {googleRating && <span>G: {googleRating} ({googleReviews} reviews)</span>}
            {zomatoRating && <span>Z: {zomatoRating} ({zomatoReviews} reviews)</span>}
          </div>

          <div className={styles.includesSection}>
            <h4 className={styles.includesTitle}>WHAT'S INCLUDED:</h4>
            <p className={styles.includesText}>
              {included.join(' + ') || 'Menu details not specified'}
            </p>
          </div>

          <div className={styles.foodTypeSection}>
            <span className={styles.foodTypeLabel}>CUISINE:</span>
            <span className={styles.foodType}>{foodType}</span>
          </div>

          {quickInfo && quickInfo.length > 0 && (
            <div className={styles.quickInfoSection}>
              <div className={styles.tags}>
                {quickInfo.map((info, index) => (
                  <span key={index} className={styles.tag}>
                    {info}
                  </span>
                ))}
              </div>
            </div>
          )}

          {lastUpdated && <p className={styles.lastUpdated}>Last updated: {lastUpdated}</p>}
        </div>
      </Link>
    </article>
  );
};

export default RestaurantCard;
