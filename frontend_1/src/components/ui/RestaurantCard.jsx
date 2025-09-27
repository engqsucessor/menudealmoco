import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteRestaurants } from '../../services/localStorage';
import { getPracticalFeatureLabel } from '../../constants/labels';
import { useAuth } from '../../contexts/AuthContext';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({ restaurant, style }) => {
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const {
    id,
    name,
    district,
    city,
    address,
    menuPrice,
    overallRating,
    googleRating,
    zomatoRating,
    totalReviews,
    whatsIncluded = [],
    foodType,
    photos = [],
    isOpenNow = true,
    distance,
    features = {},
    description = '',
  } = restaurant;

  // Check if this restaurant is already favorited (only if user is logged in)
  useEffect(() => {
    if (user) {
      setIsFavorite(favoriteRestaurants.isFavorite(id));
    } else {
      setIsFavorite(false);
    }
  }, [id, user]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleFavoriteToggle = (e) => {
    e.preventDefault(); // Prevent navigation to restaurant detail
    e.stopPropagation(); // Stop event bubbling
    
    const newFavoriteStatus = favoriteRestaurants.toggle(id);
    setIsFavorite(newFavoriteStatus);
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
    !isOpenNow && styles.closed
  ].filter(Boolean).join(' ');

  // Get practical features and amenities
  const practicalFeatures = [];
  if (restaurant.practical?.cardsAccepted) practicalFeatures.push(getPracticalFeatureLabel('takesCards', true, true));
  if (restaurant.practical?.parking) practicalFeatures.push(getPracticalFeatureLabel('hasParking', true, true));
  if (restaurant.practical?.quickService) practicalFeatures.push(getPracticalFeatureLabel('quickService', true, true));
  if (restaurant.practical?.groupFriendly) practicalFeatures.push(getPracticalFeatureLabel('groupFriendly', true, true));

  // Get food features from included
  const foodFeatures = [];
  if (restaurant.included?.coffee) foodFeatures.push('Coffee');
  if (restaurant.included?.dessert) foodFeatures.push('Dessert');
  if (restaurant.included?.wine) foodFeatures.push('Wine');
  if (restaurant.included?.bread) foodFeatures.push('Bread');
  if (restaurant.included?.soup) foodFeatures.push('Soup');
  if (restaurant.included?.main) foodFeatures.push('Main');
  if (restaurant.included?.drink) foodFeatures.push('Drink');

  // Combine what's included with food features
  const allIncluded = foodFeatures.length > 0 ? foodFeatures : (whatsIncluded || []);

  return (
    <article className={cardClasses} style={style}>
      <Link to={`/restaurant/${id}`} className={styles.cardLink}>
        {/* Content Section */}
        <div className={styles.contentSection}>
          {/* Header */}
          <header className={styles.cardHeader}>
            <div className={styles.nameSection}>
              <h3 className={styles.restaurantName}>{name}</h3>
              <p className={styles.location}>{district}, {city}</p>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.menuPrice}>€{menuPrice}</span>
              <span className={styles.priceLabel}>MENU</span>
            </div>

            <div className={styles.headerActions}>
              {user && (
                <button
                  className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
                  onClick={handleFavoriteToggle}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              )}
              
              <div className={styles.statusSection}>
                <span className={`${styles.status} ${isOpenNow ? styles.open : styles.closed}`}>
                  {isOpenNow ? '● OPEN' : '● CLOSED'}
                </span>
              </div>
            </div>
          </header>

          {/* Info Boxes Grid */}
          <div className={styles.infoBoxes}>
            {/* Menu de Almoço Rating Box */}
            <div className={styles.infoBox}>
              <h4 className={styles.boxTitle}>MENU DE ALMOÇO RATING</h4>
              <div className={styles.boxContent}>
                {renderStars(restaurant.menuRating || overallRating)}
                <span className={styles.ratingValue}>{(restaurant.menuRating || overallRating)}/5</span>
                <span className={styles.reviewCount}>({restaurant.menuReviews || totalReviews} reviews)</span>
              </div>
            </div>

            {/* Google Rating Box */}
            {googleRating && (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>GOOGLE</h4>
                <div className={styles.boxContent}>
                  <div className={styles.ratingRow}>
                    {renderStars(googleRating)}
                    <span className={styles.ratingValue}>{googleRating}/5</span>
                  </div>
                  {restaurant.googleReviews && (
                    <span className={styles.reviewCount}>({restaurant.googleReviews} reviews)</span>
                  )}
                </div>
              </div>
            )}

            {/* Zomato Rating Box */}
            {zomatoRating && (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>ZOMATO</h4>
                <div className={styles.boxContent}>
                  <div className={styles.ratingRow}>
                    {renderStars(zomatoRating)}
                    <span className={styles.ratingValue}>{zomatoRating}/5</span>
                  </div>
                  {restaurant.zomatoReviews && (
                    <span className={styles.reviewCount}>({restaurant.zomatoReviews} reviews)</span>
                  )}
                </div>
              </div>
            )}

            {/* Menu & Includes Box */}
            <div className={styles.infoBox}>
              <h4 className={styles.boxTitle}>MENU & INCLUDES</h4>
              <div className={styles.boxContent}>
                <span className={styles.includesText}>
                  {allIncluded.length > 0 ? allIncluded.join(' + ') : 'Menu details not specified'}
                </span>
              </div>
            </div>

            {/* Cuisine Type Box */}
            <div className={styles.infoBox}>
              <h4 className={styles.boxTitle}>CUISINE TYPE</h4>
              <div className={styles.boxContent}>
                <span className={styles.cuisineText}>{foodType}</span>
              </div>
            </div>

            {/* Practical Features Box */}
            {practicalFeatures.length > 0 && (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>AMENITIES</h4>
                <div className={styles.boxContent}>
                  <div className={styles.tags}>
                    {practicalFeatures.map((feature, index) => (
                      <span key={index} className={styles.tag}>
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Distance Box */}
            {distance && (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>DISTANCE</h4>
                <div className={styles.boxContent}>
                  <span className={styles.distanceText}>
                    {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default RestaurantCard;