import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { submitMenuRating, updateMenuRating, getUserMenuRating } from '../../services/menuRatingService';
import styles from './MenuRating.module.css';

const MenuRating = ({ restaurantId, restaurantName, onRatingSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasExistingRating, setHasExistingRating] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    if (user && restaurantId) {
      loadExistingRating();
    }
  }, [user, restaurantId]);

  const loadExistingRating = async () => {
    try {
      const existing = await getUserMenuRating(restaurantId, user.email);
      if (existing) {
        setExistingRating(existing);
        setRating(existing.rating);
        setComment(existing.comment);
        setHasExistingRating(true);
      }
    } catch (error) {
      console.error('Error loading existing rating:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to rate menus');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (hasExistingRating) {
        result = await updateMenuRating(restaurantId, user.email, rating, comment);
      } else {
        result = await submitMenuRating(restaurantId, user.email, rating, comment);
      }

      if (result.success) {
        alert(hasExistingRating ? 'Rating updated successfully!' : 'Rating submitted successfully!');
        setHasExistingRating(true);
        if (onRatingSubmitted) {
          onRatingSubmitted(result.newAverageRating);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Error submitting rating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (starRating) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <p>Please login to rate the lunch menu at {restaurantName}</p>
      </div>
    );
  }

  return (
    <div className={styles.menuRating}>
      <h3 className={styles.title}>
        {hasExistingRating ? 'Update Your' : 'Rate the'} Menu de Almoço
      </h3>
      <p className={styles.subtitle}>at {restaurantName}</p>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.starSection}>
          <label className={styles.label}>Your Rating:</label>
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.star} ${
                  star <= (hoverRating || rating) ? styles.filled : styles.empty
                }`}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => handleStarHover(star)}
                onMouseLeave={handleStarLeave}
              >
                ★
              </button>
            ))}
          </div>
          <span className={styles.ratingText}>
            {rating > 0 && (
              <>
                {rating}/5 - {
                  rating === 1 ? 'Poor' :
                  rating === 2 ? 'Fair' :
                  rating === 3 ? 'Good' :
                  rating === 4 ? 'Very Good' :
                  'Excellent'
                }
              </>
            )}
          </span>
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
          {loading ? 'Submitting...' : hasExistingRating ? 'Update Rating' : 'Submit Rating'}
        </button>
      </form>
    </div>
  );
};

export default MenuRating;