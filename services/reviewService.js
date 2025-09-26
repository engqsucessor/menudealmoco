/**
 * Review Service - Mock Backend API for Menu Deal Moço
 * Simulates review and rating functionality
 */

import { mockReviews, getReviewsByRestaurant, calculateAverageRatings } from './data/mockReviews.js';

// Simulate network delay
const simulateDelay = (min = 300, max = 800) => {
  return new Promise(resolve =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// Simulate random API failures (3% chance)
const simulateFailure = () => {
  if (Math.random() < 0.03) {
    throw new Error('Network error: Failed to process review request');
  }
};

// Local storage keys
const STORAGE_KEYS = {
  REVIEWS: 'menudealmoco_reviews',
  USER_REVIEWS: 'menudealmoco_user_reviews',
  HELPFUL_VOTES: 'menudealmoco_helpful_votes',
  REPORTED_REVIEWS: 'menudealmoco_reported_reviews'
};

// Initialize local storage with mock data
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(mockReviews));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER_REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HELPFUL_VOTES)) {
    localStorage.setItem(STORAGE_KEYS.HELPFUL_VOTES, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REPORTED_REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REPORTED_REVIEWS, JSON.stringify([]));
  }
};

// Get reviews from storage
const getReviewsFromStorage = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
};

// Save reviews to storage
const saveReviewsToStorage = (reviews) => {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

// Get user reviews from storage
const getUserReviewsFromStorage = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_REVIEWS) || '[]');
};

// Save user reviews to storage
const saveUserReviewsToStorage = (userReviews) => {
  localStorage.setItem(STORAGE_KEYS.USER_REVIEWS, JSON.stringify(userReviews));
};

// Get helpful votes from storage
const getHelpfulVotesFromStorage = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.HELPFUL_VOTES) || '{}');
};

// Save helpful votes to storage
const saveHelpfulVotesToStorage = (votes) => {
  localStorage.setItem(STORAGE_KEYS.HELPFUL_VOTES, JSON.stringify(votes));
};

// Generate unique review ID
const generateReviewId = () => {
  return `rev_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validate review data
const validateReview = (reviewData) => {
  const errors = [];

  if (!reviewData.restaurantId) {
    errors.push('Restaurant ID is required');
  }

  if (!reviewData.rating || typeof reviewData.rating !== 'object') {
    errors.push('Rating object is required');
  } else {
    const { overall, valueForMoney, foodQuality, portionSize, serviceSpeed } = reviewData.rating;

    if (!overall || overall < 1 || overall > 5) {
      errors.push('Overall rating must be between 1 and 5');
    }
    if (!valueForMoney || valueForMoney < 1 || valueForMoney > 5) {
      errors.push('Value for money rating must be between 1 and 5');
    }
    if (!foodQuality || foodQuality < 1 || foodQuality > 5) {
      errors.push('Food quality rating must be between 1 and 5');
    }
    if (!portionSize || portionSize < 1 || portionSize > 5) {
      errors.push('Portion size rating must be between 1 and 5');
    }
    if (!serviceSpeed || serviceSpeed < 1 || serviceSpeed > 5) {
      errors.push('Service speed rating must be between 1 and 5');
    }
  }

  if (!reviewData.userId) {
    errors.push('User ID is required');
  }

  if (!reviewData.userName || reviewData.userName.trim().length < 2) {
    errors.push('User name must be at least 2 characters');
  }

  if (reviewData.reviewText && reviewData.reviewText.length > 1000) {
    errors.push('Review text cannot exceed 1000 characters');
  }

  if (!reviewData.dateVisited) {
    errors.push('Date visited is required');
  } else {
    const visitedDate = new Date(reviewData.dateVisited);
    const now = new Date();
    if (visitedDate > now) {
      errors.push('Date visited cannot be in the future');
    }
  }

  return errors;
};

// Filter inappropriate content (basic implementation)
const filterContent = (text) => {
  if (!text) return text;

  const inappropriateWords = ['spam', 'fake', 'advertisement'];
  let filtered = text;

  inappropriateWords.forEach(word => {
    const regex = new RegExp(word, 'gi');
    filtered = filtered.replace(regex, '***');
  });

  return filtered;
};

/**
 * Review Service API
 */
export const reviewService = {
  /**
   * Get reviews for a specific restaurant
   * @param {string} restaurantId - Restaurant ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Reviews and metadata
   */
  async getRestaurantReviews(restaurantId, options = {}) {
    await simulateDelay();
    simulateFailure();

    const {
      page = 1,
      limit = 10,
      sortBy = 'datePosted', // datePosted, rating, helpful
      sortOrder = 'desc',
      ratingFilter = null, // 1-5 to filter by specific rating
      verifiedOnly = false
    } = options;

    const allReviews = getReviewsFromStorage();
    const userReviews = getUserReviewsFromStorage();

    // Combine mock reviews with user reviews
    const combinedReviews = [...allReviews, ...userReviews];

    let reviews = combinedReviews.filter(review => review.restaurantId === restaurantId);

    // Filter by rating if specified
    if (ratingFilter) {
      reviews = reviews.filter(review => review.rating.overall === ratingFilter);
    }

    // Filter by verified only
    if (verifiedOnly) {
      reviews = reviews.filter(review => review.verified);
    }

    // Sort reviews
    reviews.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'datePosted':
          comparison = new Date(a.datePosted) - new Date(b.datePosted);
          break;
        case 'rating':
          comparison = a.rating.overall - b.rating.overall;
          break;
        case 'helpful':
          comparison = a.helpful - b.helpful;
          break;
        default:
          comparison = new Date(a.datePosted) - new Date(b.datePosted);
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    // Calculate statistics
    const stats = this.calculateReviewStats(reviews);

    // Pagination
    const total = reviews.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);

    return {
      reviews: paginatedReviews,
      stats,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1
      }
    };
  },

  /**
   * Calculate review statistics
   * @param {Array} reviews - Array of reviews
   * @returns {Object} Review statistics
   */
  calculateReviewStats(reviews) {
    if (!reviews || reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        averageRatings: {
          overall: 0,
          valueForMoney: 0,
          foodQuality: 0,
          portionSize: 0,
          serviceSpeed: 0
        },
        verifiedPercentage: 0
      };
    }

    const totalReviews = reviews.length;

    // Calculate rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      ratingDistribution[review.rating.overall]++;
    });

    // Calculate average ratings
    const averageRatings = calculateAverageRatings(reviews);

    // Calculate verified percentage
    const verifiedCount = reviews.filter(review => review.verified).length;
    const verifiedPercentage = Math.round((verifiedCount / totalReviews) * 100);

    return {
      totalReviews,
      averageRating: averageRatings.overall,
      ratingDistribution,
      averageRatings,
      verifiedPercentage
    };
  },

  /**
   * Add a new review
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} Created review
   */
  async addReview(reviewData) {
    await simulateDelay(500, 1200);
    simulateFailure();

    // Validate review data
    const validationErrors = validateReview(reviewData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Check for duplicate review from same user for same restaurant
    const userReviews = getUserReviewsFromStorage();
    const existingReview = userReviews.find(
      review => review.userId === reviewData.userId && review.restaurantId === reviewData.restaurantId
    );

    if (existingReview) {
      throw new Error('You have already reviewed this restaurant. You can edit your existing review instead.');
    }

    // Create new review object
    const newReview = {
      id: generateReviewId(),
      restaurantId: reviewData.restaurantId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      userAvatar: reviewData.userAvatar || '/avatars/default.jpg',
      rating: {
        overall: parseInt(reviewData.rating.overall),
        valueForMoney: parseInt(reviewData.rating.valueForMoney),
        foodQuality: parseInt(reviewData.rating.foodQuality),
        portionSize: parseInt(reviewData.rating.portionSize),
        serviceSpeed: parseInt(reviewData.rating.serviceSpeed)
      },
      reviewText: filterContent(reviewData.reviewText || ''),
      dateVisited: new Date(reviewData.dateVisited),
      datePosted: new Date(),
      helpful: 0,
      photos: reviewData.photos || [],
      verified: false, // User reviews start as unverified
      dishOrdered: reviewData.dishOrdered || ''
    };

    // Save to user reviews storage
    userReviews.push(newReview);
    saveUserReviewsToStorage(userReviews);

    return newReview;
  },

  /**
   * Update an existing review
   * @param {string} reviewId - Review ID
   * @param {string} userId - User ID (for authorization)
   * @param {Object} updateData - Updated review data
   * @returns {Promise<Object>} Updated review
   */
  async updateReview(reviewId, userId, updateData) {
    await simulateDelay(400, 800);
    simulateFailure();

    const userReviews = getUserReviewsFromStorage();
    const reviewIndex = userReviews.findIndex(
      review => review.id === reviewId && review.userId === userId
    );

    if (reviewIndex === -1) {
      throw new Error('Review not found or you do not have permission to edit this review');
    }

    // Validate update data
    const validationErrors = validateReview({
      ...userReviews[reviewIndex],
      ...updateData
    });
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Update review
    const updatedReview = {
      ...userReviews[reviewIndex],
      ...updateData,
      reviewText: filterContent(updateData.reviewText || userReviews[reviewIndex].reviewText),
      dateUpdated: new Date()
    };

    userReviews[reviewIndex] = updatedReview;
    saveUserReviewsToStorage(userReviews);

    return updatedReview;
  },

  /**
   * Delete a review
   * @param {string} reviewId - Review ID
   * @param {string} userId - User ID (for authorization)
   * @returns {Promise<boolean>} Success status
   */
  async deleteReview(reviewId, userId) {
    await simulateDelay(300, 600);
    simulateFailure();

    const userReviews = getUserReviewsFromStorage();
    const reviewIndex = userReviews.findIndex(
      review => review.id === reviewId && review.userId === userId
    );

    if (reviewIndex === -1) {
      throw new Error('Review not found or you do not have permission to delete this review');
    }

    userReviews.splice(reviewIndex, 1);
    saveUserReviewsToStorage(userReviews);

    return true;
  },

  /**
   * Mark review as helpful
   * @param {string} reviewId - Review ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated helpful count
   */
  async markReviewHelpful(reviewId, userId) {
    await simulateDelay(200, 400);
    simulateFailure();

    const helpfulVotes = getHelpfulVotesFromStorage();
    const voteKey = `${reviewId}_${userId}`;

    // Check if user already voted
    if (helpfulVotes[voteKey]) {
      throw new Error('You have already marked this review as helpful');
    }

    // Find review in storage
    const allReviews = getReviewsFromStorage();
    const userReviews = getUserReviewsFromStorage();

    let reviewFound = false;
    let updatedCount = 0;

    // Check in mock reviews
    const mockReviewIndex = allReviews.findIndex(review => review.id === reviewId);
    if (mockReviewIndex !== -1) {
      allReviews[mockReviewIndex].helpful++;
      updatedCount = allReviews[mockReviewIndex].helpful;
      saveReviewsToStorage(allReviews);
      reviewFound = true;
    }

    // Check in user reviews
    const userReviewIndex = userReviews.findIndex(review => review.id === reviewId);
    if (userReviewIndex !== -1) {
      userReviews[userReviewIndex].helpful++;
      updatedCount = userReviews[userReviewIndex].helpful;
      saveUserReviewsToStorage(userReviews);
      reviewFound = true;
    }

    if (!reviewFound) {
      throw new Error('Review not found');
    }

    // Record the vote
    helpfulVotes[voteKey] = true;
    saveHelpfulVotesToStorage(helpfulVotes);

    return { helpful: updatedCount };
  },

  /**
   * Report a review
   * @param {string} reviewId - Review ID
   * @param {string} userId - Reporter user ID
   * @param {string} reason - Report reason
   * @returns {Promise<boolean>} Success status
   */
  async reportReview(reviewId, userId, reason) {
    await simulateDelay(300, 600);
    simulateFailure();

    const reportedReviews = JSON.parse(localStorage.getItem(STORAGE_KEYS.REPORTED_REVIEWS) || '[]');

    // Check if user already reported this review
    const existingReport = reportedReviews.find(
      report => report.reviewId === reviewId && report.reporterId === userId
    );

    if (existingReport) {
      throw new Error('You have already reported this review');
    }

    // Add new report
    const newReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reviewId,
      reporterId: userId,
      reason,
      dateReported: new Date(),
      status: 'pending' // pending, reviewed, resolved
    };

    reportedReviews.push(newReport);
    localStorage.setItem(STORAGE_KEYS.REPORTED_REVIEWS, JSON.stringify(reportedReviews));

    return true;
  },

  /**
   * Get user's reviews
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's reviews
   */
  async getUserReviews(userId) {
    await simulateDelay(200, 500);

    const userReviews = getUserReviewsFromStorage();
    return userReviews.filter(review => review.userId === userId);
  },

  /**
   * Get review statistics for a restaurant (for restaurant owners)
   * @param {string} restaurantId - Restaurant ID
   * @returns {Promise<Object>} Detailed statistics
   */
  async getRestaurantReviewStats(restaurantId) {
    await simulateDelay(300, 600);

    const allReviews = getReviewsFromStorage();
    const userReviews = getUserReviewsFromStorage();
    const combinedReviews = [...allReviews, ...userReviews];

    const restaurantReviews = combinedReviews.filter(review => review.restaurantId === restaurantId);

    if (restaurantReviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        monthlyTrend: [],
        topKeywords: [],
        responseRate: 0
      };
    }

    // Calculate monthly trend (last 6 months)
    const monthlyTrend = this.calculateMonthlyTrend(restaurantReviews);

    // Extract top keywords from reviews
    const topKeywords = this.extractTopKeywords(restaurantReviews);

    const stats = this.calculateReviewStats(restaurantReviews);

    return {
      ...stats,
      monthlyTrend,
      topKeywords,
      responseRate: 0 // Would be calculated based on owner responses
    };
  },

  /**
   * Calculate monthly review trend
   * @param {Array} reviews - Reviews array
   * @returns {Array} Monthly trend data
   */
  calculateMonthlyTrend(reviews) {
    const monthlyData = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = { count: 0, totalRating: 0 };
    }

    // Count reviews by month
    reviews.forEach(review => {
      const reviewDate = new Date(review.datePosted);
      const monthKey = `${reviewDate.getFullYear()}-${String(reviewDate.getMonth() + 1).padStart(2, '0')}`;

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].count++;
        monthlyData[monthKey].totalRating += review.rating.overall;
      }
    });

    // Convert to array format
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      count: data.count,
      averageRating: data.count > 0 ? Math.round((data.totalRating / data.count) * 10) / 10 : 0
    }));
  },

  /**
   * Extract top keywords from review texts
   * @param {Array} reviews - Reviews array
   * @returns {Array} Top keywords with frequency
   */
  extractTopKeywords(reviews) {
    const keywords = {};
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'very', 'good', 'great'];

    reviews.forEach(review => {
      if (review.reviewText) {
        const words = review.reviewText
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .split(/\s+/)
          .filter(word => word.length > 3 && !commonWords.includes(word));

        words.forEach(word => {
          keywords[word] = (keywords[word] || 0) + 1;
        });
      }
    });

    return Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }
};

export default reviewService;