import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './RestaurantDetail.module.css';
import { getRestaurant } from '../services/mockApi';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewType, setReviewType] = useState('menu');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mocked login state

  useEffect(() => {
    getRestaurant(id).then(data => {
      setRestaurant(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const { name, location, menuPrice, included, photo, reviews, foodType, googleRating, googleReviews, zomatoRating, zomatoReviews, menuReviews } = restaurant;

  return (
    <div className={styles.detailPage}>
      <header className={styles.header}>
        <div className={styles.imageContainer}>
          <img src={photo} alt={name} className={styles.image} />
        </div>
        <div className={styles.info}>
          <h1>{name}</h1>
          <p>{location}</p>
          <p className={styles.price}>€{menuPrice.toFixed(2)}</p>
          <div className={styles.included}>
            <strong>Included:</strong> {included.join(' + ')}
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
                  <h2>Menu Reviews</h2>
                  {isLoggedIn ? (
                    <p>Add your review here...</p>
                  ) : (
                    <p><Link to="/login">Login</Link> to add a menu review.</p>
                  )}
                  {menuReviews && menuReviews.length > 0 ? (
                    menuReviews.map(review => (
                      <div key={review.id} className={styles.review}>
                        <h3>{review.author} - {review.rating}/5</h3>
                        <p>{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p>No menu reviews yet.</p>
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
