import React, { useState } from 'react';
import Button from './Button';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({
  restaurant,
  onViewDetails,
  onGetDirections,
  className = ''
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    name,
    location,
    address,
    menuPrice,
    valueRating,
    totalReviews,
    whatsIncluded = [],
    foodType,
    quickInfo = [],
    photo,
    distance,
    isOpen = true,
    verified = false
  } = restaurant;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

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
      {/* Photo Section */}
      <div className={styles.photoSection}>
        {!imageError ? (
          <img
            src={photo || '/placeholder-restaurant.jpg'}
            alt={`${name} - Menu photo`}
            className={`${styles.photo} ${imageLoaded ? styles.loaded : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className={styles.photoPlaceholder}>
            <span className={styles.placeholderIcon}>🍽️</span>
            <span className={styles.placeholderText}>NO PHOTO</span>
          </div>
        )}

        {/* Overlay Info */}
        <div className={styles.photoOverlay}>
          {verified && (
            <span className={styles.verifiedBadge}>✓ VERIFIED</span>
          )}
          {distance && (
            <span className={styles.distanceBadge}>{distance}</span>
          )}
        </div>

        {/* Status Badge */}
        <div className={styles.statusBadge}>
          <span className={`${styles.status} ${isOpen ? styles.open : styles.closed}`}>
            {isOpen ? '● OPEN' : '● CLOSED'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        {/* Header */}
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

        {/* Rating */}
        <div className={styles.ratingSection}>
          {renderStars(valueRating)}
          <span className={styles.ratingText}>
            {valueRating}/5 ({totalReviews} reviews)
          </span>
        </div>

        {/* What's Included */}
        <div className={styles.includesSection}>
          <h4 className={styles.includesTitle}>WHAT'S INCLUDED:</h4>
          <p className={styles.includesText}>
            {whatsIncluded.join(' + ') || 'Menu details not specified'}
          </p>
        </div>

        {/* Food Type */}
        <div className={styles.foodTypeSection}>
          <span className={styles.foodTypeLabel}>CUISINE:</span>
          <span className={styles.foodType}>{foodType}</span>
        </div>

        {/* Quick Info Tags */}
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

        {/* Actions */}
        <div className={styles.actionsSection}>
          <Button
            variant="primary"
            size="small"
            onClick={() => onViewDetails?.(restaurant)}
            className={styles.detailsButton}
          >
            VIEW DETAILS
          </Button>

          <Button
            variant="outline"
            size="small"
            onClick={() => onGetDirections?.(restaurant)}
            className={styles.directionsButton}
          >
            DIRECTIONS
          </Button>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;