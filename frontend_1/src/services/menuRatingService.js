// menuRatingService.js - Service for handling menu ratings and reviews
import { 
  addMenuReview, 
  getUserReviewsForRestaurant, 
  getAllReviewsForRestaurant,
  deleteReview,
  updateReview,
  upvoteReview,
  downvoteReview,
  calculateAverageRating,
  getReviewStats
} from './mockDatabase';

export const submitMenuRating = async (restaurantId, userEmail, rating, comment) => {
  try {
    const result = addMenuReview(restaurantId, userEmail, rating, comment);
    return result;
  } catch (error) {
    console.error('Error submitting menu rating:', error);
    return { success: false, error: error.message };
  }
};

export const getUserMenuReviews = async (restaurantId, userEmail) => {
  try {
    const reviews = getUserReviewsForRestaurant(restaurantId, userEmail);
    return reviews;
  } catch (error) {
    console.error('Error getting user menu reviews:', error);
    return [];
  }
};

export const getRestaurantMenuReviews = async (restaurantId) => {
  try {
    const reviews = getAllReviewsForRestaurant(restaurantId);
    return reviews;
  } catch (error) {
    console.error('Error getting restaurant menu reviews:', error);
    return [];
  }
};

export const deleteMenuReview = async (reviewId, userEmail) => {
  try {
    const result = deleteReview(reviewId, userEmail);
    return result;
  } catch (error) {
    console.error('Error deleting menu review:', error);
    return { success: false, error: error.message };
  }
};

export const updateMenuReview = async (reviewId, userEmail, rating, comment) => {
  try {
    const result = updateReview(reviewId, userEmail, rating, comment);
    return result;
  } catch (error) {
    console.error('Error updating menu review:', error);
    return { success: false, error: error.message };
  }
};

export const upvoteMenuReview = async (reviewId, userEmail) => {
  try {
    const result = upvoteReview(reviewId, userEmail);
    return result;
  } catch (error) {
    console.error('Error upvoting menu review:', error);
    return { success: false, error: error.message };
  }
};

export const downvoteMenuReview = async (reviewId, userEmail) => {
  try {
    const result = downvoteReview(reviewId, userEmail);
    return result;
  } catch (error) {
    console.error('Error downvoting menu review:', error);
    return { success: false, error: error.message };
  }
};

export const getMenuRatingStats = async (restaurantId) => {
  try {
    const stats = getReviewStats(restaurantId);
    return stats;
  } catch (error) {
    console.error('Error getting menu rating stats:', error);
    return { totalReviews: 0, averageRating: 0, ratingDistribution: {} };
  }
};

// Legacy function for backward compatibility
export const getUserMenuRating = async (restaurantId, userEmail) => {
  try {
    const reviews = getUserReviewsForRestaurant(restaurantId, userEmail);
    return reviews.length > 0 ? reviews[0] : null; // Return most recent review
  } catch (error) {
    console.error('Error getting user menu rating:', error);
    return null;
  }
};

// Legacy function for backward compatibility  
export const updateMenuRating = async (restaurantId, userEmail, rating, comment) => {
  try {
    // For backward compatibility, this will create a new review
    return await submitMenuRating(restaurantId, userEmail, rating, comment);
  } catch (error) {
    console.error('Error updating menu rating:', error);
    return { success: false, error: error.message };
  }
};

// Legacy functions to maintain compatibility
export const getMenuRatings = async (restaurantId) => {
  try {
    const reviews = getAllReviewsForRestaurant(restaurantId);
    const stats = getReviewStats(restaurantId);
    
    return {
      ratings: reviews,
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews
    };
  } catch (error) {
    console.error('Error getting menu ratings:', error);
    return { ratings: [], averageRating: 0, totalReviews: 0 };
  }
};