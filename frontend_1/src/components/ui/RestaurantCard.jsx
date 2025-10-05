import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteRestaurants } from '../../services/localStorage';
import { getPracticalFeatureLabel } from '../../constants/labels';
import { useAuth } from '../../contexts/AuthContext';
import { favoritesApi } from '../../services/axiosApi';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({ restaurant, style, onFavoriteToggle }) => {
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
    totalReviews,
    whatsIncluded = [],
    foodType,
    photos = [],
    isOpenNow,
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

  const handleFavoriteToggle = async (e) => {
    e.preventDefault(); // Prevent navigation to restaurant detail
    e.stopPropagation(); // Stop event bubbling

    const newFavoriteStatus = favoriteRestaurants.toggle(id);
    setIsFavorite(newFavoriteStatus);

    // Sync with backend if user is logged in
    if (user) {
      try {
        if (newFavoriteStatus) {
          await favoritesApi.add(id);
        } else {
          await favoritesApi.remove(id);
        }
      } catch (error) {
        console.error('Error syncing favorite with backend:', error);
        // Revert localStorage change if API call failed
        favoriteRestaurants.toggle(id);
        setIsFavorite(!newFavoriteStatus);
      }
    }

    if (typeof onFavoriteToggle === 'function') {
      onFavoriteToggle(id, newFavoriteStatus);
    }
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

  // Process practical features
  const practicalFeatures = [];
  if (restaurant.practical?.cardsAccepted || restaurant.cardsAccepted) practicalFeatures.push(getPracticalFeatureLabel('cardsAccepted'));
  if (restaurant.practical?.quickService || restaurant.quickService) practicalFeatures.push(getPracticalFeatureLabel('quickService'));
  if (restaurant.practical?.groupFriendly || restaurant.groupFriendly) practicalFeatures.push(getPracticalFeatureLabel('groupFriendly'));
  if (restaurant.practical?.parking || restaurant.parking) practicalFeatures.push(getPracticalFeatureLabel('parking'));

  // Process food features for included items
  const foodFeatures = [];
  if (restaurant.included?.couvert) foodFeatures.push('Couvert');
  if (restaurant.included?.soup) foodFeatures.push('Soup');
  if (restaurant.included?.main) foodFeatures.push('Main');
  if (restaurant.included?.drink) foodFeatures.push('Drink');

  // Combine what's included with food features
  const allIncluded = foodFeatures.length > 0 ? foodFeatures : (whatsIncluded || []);

  // Use photo count from backend (lightweight metadata, no base64 data)
  const photoCount = restaurant.photoCount || 0;

  return (
    <article className={cardClasses} style={style}>
      <Link to={`/restaurant/${id}`} className={styles.cardLink}>
        {/* Content Section */}
        <div className={styles.contentSection}>
          {/* Header */}
          <header className={styles.cardHeader} data-price={menuPrice}>
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
                {(restaurant.menuRating || overallRating) ? (
                  <>
                    {renderStars(restaurant.menuRating || overallRating)}
                    <span className={styles.ratingValue}>
                      {restaurant.menuRating || overallRating}/5
                    </span>
                    <span className={styles.reviewCount}>
                      ({restaurant.menuReviews || totalReviews || 0} reviews)
                    </span>
                  </>
                ) : (
                  <span className={styles.noRating}>No ratings yet</span>
                )}
              </div>
            </div>

            {/* Google Rating Box */}
            {googleRating && (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>GOOGLE</h4>
                <div className={styles.boxContent}>
                  <div className={styles.ratingRow}>
                    {renderStars(googleRating)}
                    <span className={styles.ratingValue}>{googleRating}</span>
                  </div>
                  {restaurant.googleReviews && (
                    <span className={styles.reviewCount}>({restaurant.googleReviews} reviews)</span>
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
            {practicalFeatures.length > 0 ? (
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
            ) : null}

            {/* Hours Box */}
            {restaurant.hours && (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>LUNCH HOURS</h4>
                <div className={styles.boxContent}>
                  <span className={styles.hoursText}>{restaurant.hours}</span>
                </div>
              </div>
            )}

            {/* Distance Box */}
            {distance != null && distance !== '' ? (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>DISTANCE</h4>
                <div className={styles.boxContent}>
                  <span className={styles.distanceText}>
                    {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                  </span>
                </div>
              </div>
            ) : null}

            {/* Photos Count Box */}
            {photoCount > 0 ? (
              <div className={styles.infoBox}>
                <h4 className={styles.boxTitle}>PHOTOS</h4>
                <div className={styles.boxContent}>
                  <div className={styles.photoInfo}>
                    <span className={styles.photoCount}>📷 {photoCount} photo{photoCount > 1 ? 's' : ''}</span>
                    {photoCount > 1 ? (
                      <div className={styles.photoThumbnails}>
                        {Array.from({length: Math.min(photoCount, 3)}, (_, i) => (
                          <div key={i} className={styles.photoThumbnail}>
                            <span className={styles.thumbnailNumber}>{i + 1}</span>
                          </div>
                        ))}
                        {photoCount > 3 ? (
                          <div className={styles.photoThumbnail}>
                            <span className={styles.thumbnailNumber}>+{photoCount - 3}</span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default RestaurantCard;
