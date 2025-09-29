import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { reviewsApi } from '../../services/axiosApi';
import styles from './MenuRating.module.css';

const MenuRating = ({ restaurantId, restaurantName, onRatingSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userReviews, setUserReviews] = useState([]);

  useEffect(() => {
    if (user && restaurantId) {
      loadUserReviews();
    }
  }, [user, restaurantId]);

  const loadUserReviews = async () => {
    try {
      // Get all reviews for this restaurant and filter by current user
      const allReviews = await reviewsApi.getForRestaurant(restaurantId);
      const userReviews = allReviews.filter(review => review.userId === user.email);
      setUserReviews(userReviews);
    } catch (error) {
      console.error('Error loading user reviews:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    if (rating === 0) {
      alert('Please select a rating before submitting.');
      return;
    }

    // Comments are optional - only validate if user wants to prevent truly empty submissions
    // Removed comment requirement to allow rating-only reviews

    setLoading(true);
    try {
      // Use the displayName from the user object (generated at signup)
      const displayName = user.displayName || `User${Math.floor(Math.random() * 10000)}`;
      
      const result = await reviewsApi.add(restaurantId, rating, comment);

      if (result) {
        // Reset form
        setRating(0);
        setComment('');
        // Reload user reviews
        await loadUserReviews();
        if (onRatingSubmitted) {
          onRatingSubmitted(rating); // Pass the rating that was just submitted
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starNumber, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = clickX < starWidth / 2;
    
    const newRating = isLeftHalf ? starNumber - 0.5 : starNumber;
    setRating(newRating);
  };

  const handleStarHover = (starNumber, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = hoverX < starWidth / 2;
    
    const newRating = isLeftHalf ? starNumber - 0.5 : starNumber;
    setHoverRating(newRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const renderStars = () => {
    const stars = [];
    const currentRating = hoverRating || rating;
    
    for (let i = 1; i <= 5; i++) {
      const isFullStar = currentRating >= i;
      const isHalfStar = currentRating >= (i - 0.5) && currentRating < i;
      
      stars.push(
        <button
          key={i}
          type="button"
          className={`${styles.starButton} ${(isFullStar || isHalfStar) ? styles.filled : styles.empty}`}
          onClick={(e) => handleStarClick(i, e)}
          onMouseMove={(e) => handleStarHover(i, e)}
          onMouseLeave={handleStarLeave}
          title={`Click left half for ${i-0.5} stars, right half for ${i} stars`}
        >
          <span className={`${styles.starIcon} ${isHalfStar ? styles.halfFilled : ''}`}>★</span>
        </button>
      );
    }
    return stars;
  };

  const getRatingText = (rating) => {
    if (rating === 0) return '';
    if (rating <= 1) return 'Poor';
    if (rating <= 1.5) return 'Below Average';
    if (rating <= 2.5) return 'Fair';
    if (rating <= 3) return 'Average';
    if (rating <= 3.5) return 'Good';
    if (rating <= 4) return 'Very Good';
    if (rating <= 4.5) return 'Great';
    return 'Excellent';
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <p>Please login to rate the lunch menu at {restaurantName}</p>
        <Link 
          to={`/auth?redirect=${encodeURIComponent(window.location.pathname)}`}
          className={styles.loginButton}
        >
          Login Here
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.menuRating}>
      <h3 className={styles.title}>
        Rate the Menu de Almoço
      </h3>
      <p className={styles.subtitle}>at {restaurantName}</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.starSection}>
          <label className={styles.label}>Your Rating:</label>
          <div className={styles.stars}>
            {renderStars()}
          </div>
          {(hoverRating > 0 || rating > 0) && (
            <span className={`${styles.ratingText} ${hoverRating > 0 ? styles.hovering : ''}`}>
              {hoverRating > 0 ? hoverRating : rating}/5 - {getRatingText(hoverRating > 0 ? hoverRating : rating)}
            </span>
          )}
        </div>

        <div className={styles.commentSection}>
          <label className={styles.label} htmlFor="comment">
            Comment (optional):
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others about your experience with the lunch menu..."
            className={styles.textarea}
            rows={4}
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className={styles.submitButton}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>

      {userReviews.length > 0 && (
        <div className={styles.userReviews}>
          <h4 className={styles.reviewsTitle}>Your Previous Reviews ({userReviews.length})</h4>
          {userReviews.map((review) => (
            <div key={review.id} className={styles.userReview}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewRating}>
                  {'★'.repeat(Math.floor(review.rating))}
                  {review.rating % 1 !== 0 ? '☆' : ''}
                  {' '}({review.rating}/5)
                </span>
                <span className={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className={styles.reviewComment}>{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuRating;