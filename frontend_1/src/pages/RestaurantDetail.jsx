import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './RestaurantDetail.module.css';
import { getRestaurant } from '../services/mockApi';
import MenuRating from '../components/ui/MenuRating';
import { getMenuRatings } from '../services/menuRatingService';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewType, setReviewType] = useState('menu');
  const [menuRatingData, setMenuRatingData] = useState(null);

  useEffect(() => {
    getRestaurant(id).then(data => {
      setRestaurant(data);
      setLoading(false);
    });
    
    // Load menu ratings
    getMenuRatings(id).then(data => {
      setMenuRatingData(data);
    });
  }, [id]);

  const handleRatingSubmitted = (newAverageRating) => {
    // Refresh menu ratings data
    getMenuRatings(id).then(data => {
      setMenuRatingData(data);
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const { name, city, district, menuPrice, whatsIncluded, photo, reviews, foodType, googleRating, googleReviews, zomatoRating, zomatoReviews, menuReviews } = restaurant;

  const location = `${district}, ${city}`;

  return (
    <div className={styles.detailPage}>
      <header className={styles.header}>
        <div className={styles.imageContainer}>
          {photo ? (
            <img src={photo} alt={name} className={styles.image} />
          ) : (
            <div className={styles.placeholderImage}>
              <span>No image available</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <h1>{name}</h1>
          <p>{location}</p>
          <p className={styles.price}>€{menuPrice.toFixed(2)}</p>
          <div className={styles.included}>
            <strong>Included:</strong> {whatsIncluded && whatsIncluded.join(' + ')}
          </div>
          <p><strong>Cuisine:</strong> {foodType}</p>
          <div className={styles.externalReviews}>
            {googleRating && <div className={styles.externalReview}><strong>Google:</strong> {googleRating}/5 ({googleReviews} reviews)</div>}
            {zomatoRating && <div className={styles.externalReview}><strong>Zomato:</strong> {zomatoRating}/5 ({zomatoReviews} reviews)</div>}
          </div>
        </div>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div>
            <h2>About {name}</h2>
            <p>More details about the restaurant would go here, such as a description, opening hours, and contact information.</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div className={styles.reviewTypeSelector}>
              <button 
                className={`${styles.reviewTypeButton} ${reviewType === 'menu' ? styles.active : ''}`}
                onClick={() => setReviewType('menu')}
              >
                Menu Reviews
              </button>
              <button 
                className={`${styles.reviewTypeButton} ${reviewType === 'general' ? styles.active : ''}`}
                onClick={() => setReviewType('general')}
              >
                General Reviews
              </button>
            </div>
            <div className={styles.reviewsList}>
              {reviewType === 'menu' && (
                <div>
                  <h2>Menu de Almoço Reviews</h2>
                  
                  {/* Menu Rating Component */}
                  <MenuRating 
                    restaurantId={id} 
                    restaurantName={name}
                    onRatingSubmitted={handleRatingSubmitted}
                  />
                  
                  {/* Display current average and reviews */}
                  {menuRatingData && menuRatingData.totalReviews > 0 && (
                    <div className={styles.menuRatingStats}>
                      <h3>Current Menu Rating: {menuRatingData.averageRating}/5</h3>
                      <p>Based on {menuRatingData.totalReviews} reviews</p>
                      
                      <div className={styles.menuReviewsList}>
                        {menuRatingData.ratings.map(rating => (
                          <div key={rating.id} className={styles.review}>
                            <div className={styles.reviewHeader}>
                              <strong>{rating.userId}</strong> - {rating.rating}/5 stars
                              <span className={styles.reviewDate}>
                                {new Date(rating.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            {rating.comment && <p>{rating.comment}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {menuRatingData && menuRatingData.totalReviews === 0 && (
                    <p>No menu reviews yet. Be the first to rate this lunch menu!</p>
                  )}
                </div>
              )}
              {reviewType === 'general' && (
                <div>
                  <h2>General Reviews</h2>
                  {reviews && reviews.length > 0 ? (
                    reviews.map(review => (
                      <div key={review.id} className={styles.review}>
                        <h3>{review.author} - {review.rating}/5</h3>
                        <p>{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No general reviews yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
