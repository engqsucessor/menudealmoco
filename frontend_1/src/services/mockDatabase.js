// mockDatabase.js - Complete mock database system

import { getUserDisplayName } from './usernameService';

// Mock database structure
const DB_KEYS = {
  REVIEWS: 'mockdb_reviews',
  USERS: 'mockdb_users',
  RESTAURANTS: 'mockdb_restaurants'
};

// Initialize database if not exists
const initializeDB = () => {
  if (!localStorage.getItem(DB_KEYS.REVIEWS)) {
    localStorage.setItem(DB_KEYS.REVIEWS, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify({}));
  }
};

// Helper functions to interact with localStorage
const getFromDB = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || (key === DB_KEYS.USERS ? {} : []);
  } catch (error) {
    console.error('Error reading from mock DB:', error);
    return key === DB_KEYS.USERS ? {} : [];
  }
};

const saveToDB = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to mock DB:', error);
    return false;
  }
};

// Generate unique ID
const generateId = () => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// REVIEW FUNCTIONS

export const addMenuReview = (restaurantId, userEmail, rating, comment) => {
  initializeDB();
  
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  const displayName = getUserDisplayName(userEmail);
  
  const newReview = {
    id: generateId(),
    restaurantId: restaurantId.toString(),
    userEmail,
    displayName,
    rating: parseFloat(rating),
    comment: comment || '',
    createdAt: new Date().toISOString(),
    upvotes: 0,
    downvotes: 0,
    upvotedBy: [],
    downvotedBy: []
  };
  
  reviews.push(newReview);
  saveToDB(DB_KEYS.REVIEWS, reviews);
  
  return {
    success: true,
    review: newReview,
    newAverageRating: calculateAverageRating(restaurantId)
  };
};

export const getUserReviewsForRestaurant = (restaurantId, userEmail) => {
  initializeDB();
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  
  return reviews.filter(review => 
    review.restaurantId === restaurantId.toString() && 
    review.userEmail === userEmail
  );
};

export const getAllReviewsForRestaurant = (restaurantId) => {
  initializeDB();
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  
  return reviews
    .filter(review => review.restaurantId === restaurantId.toString())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const deleteReview = (reviewId, userEmail) => {
  initializeDB();
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  
  const reviewIndex = reviews.findIndex(review => 
    review.id === reviewId && review.userEmail === userEmail
  );
  
  if (reviewIndex === -1) {
    return { success: false, message: 'Review not found or unauthorized' };
  }
  
  const deletedReview = reviews.splice(reviewIndex, 1)[0];
  saveToDB(DB_KEYS.REVIEWS, reviews);
  
  return {
    success: true,
    deletedReview,
    newAverageRating: calculateAverageRating(deletedReview.restaurantId)
  };
};

export const updateReview = (reviewId, userEmail, rating, comment) => {
  initializeDB();
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  
  const reviewIndex = reviews.findIndex(review => 
    review.id === reviewId && review.userEmail === userEmail
  );
  
  if (reviewIndex === -1) {
    return { success: false, message: 'Review not found or unauthorized' };
  }
  
  reviews[reviewIndex] = {
    ...reviews[reviewIndex],
    rating: parseFloat(rating),
    comment: comment || '',
    updatedAt: new Date().toISOString()
  };
  
  saveToDB(DB_KEYS.REVIEWS, reviews);
  
  return {
    success: true,
    review: reviews[reviewIndex],
    newAverageRating: calculateAverageRating(reviews[reviewIndex].restaurantId)
  };
};

export const upvoteReview = (reviewId, userEmail) => {
  initializeDB();
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  
  const reviewIndex = reviews.findIndex(review => review.id === reviewId);
  
  if (reviewIndex === -1) {
    return { success: false, message: 'Review not found' };
  }
  
  const review = reviews[reviewIndex];
  
  // Remove from downvotes if present
  if (review.downvotedBy && review.downvotedBy.includes(userEmail)) {
    review.downvotedBy = review.downvotedBy.filter(email => email !== userEmail);
    review.downvotes = Math.max(0, review.downvotes - 1);
  }
  
  // Toggle upvote
  if (review.upvotedBy.includes(userEmail)) {
    // Remove upvote
    review.upvotedBy = review.upvotedBy.filter(email => email !== userEmail);
    review.upvotes = Math.max(0, review.upvotes - 1);
  } else {
    // Add upvote
    review.upvotedBy.push(userEmail);
    review.upvotes += 1;
  }
  
  saveToDB(DB_KEYS.REVIEWS, reviews);
  
  return {
    success: true,
    review,
    hasUpvoted: review.upvotedBy.includes(userEmail),
    hasDownvoted: review.downvotedBy ? review.downvotedBy.includes(userEmail) : false
  };
};

export const downvoteReview = (reviewId, userEmail) => {
  initializeDB();
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  
  const reviewIndex = reviews.findIndex(review => review.id === reviewId);
  
  if (reviewIndex === -1) {
    return { success: false, message: 'Review not found' };
  }
  
  const review = reviews[reviewIndex];
  
  // Initialize downvote arrays if they don't exist
  if (!review.downvotedBy) review.downvotedBy = [];
  if (!review.downvotes) review.downvotes = 0;
  
  // Remove from upvotes if present
  if (review.upvotedBy.includes(userEmail)) {
    review.upvotedBy = review.upvotedBy.filter(email => email !== userEmail);
    review.upvotes = Math.max(0, review.upvotes - 1);
  }
  
  // Toggle downvote
  if (review.downvotedBy.includes(userEmail)) {
    // Remove downvote
    review.downvotedBy = review.downvotedBy.filter(email => email !== userEmail);
    review.downvotes = Math.max(0, review.downvotes - 1);
  } else {
    // Add downvote
    review.downvotedBy.push(userEmail);
    review.downvotes += 1;
  }
  
  saveToDB(DB_KEYS.REVIEWS, reviews);
  
  return {
    success: true,
    review,
    hasUpvoted: review.upvotedBy.includes(userEmail),
    hasDownvoted: review.downvotedBy.includes(userEmail)
  };
};

// UTILITY FUNCTIONS

export const calculateAverageRating = (restaurantId) => {
  const reviews = getAllReviewsForRestaurant(restaurantId);
  
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return parseFloat((totalRating / reviews.length).toFixed(1));
};

export const getReviewStats = (restaurantId) => {
  const reviews = getAllReviewsForRestaurant(restaurantId);
  
  return {
    totalReviews: reviews.length,
    averageRating: calculateAverageRating(restaurantId),
    ratingDistribution: {
      5: reviews.filter(r => r.rating >= 4.5).length,
      4: reviews.filter(r => r.rating >= 3.5 && r.rating < 4.5).length,
      3: reviews.filter(r => r.rating >= 2.5 && r.rating < 3.5).length,
      2: reviews.filter(r => r.rating >= 1.5 && r.rating < 2.5).length,
      1: reviews.filter(r => r.rating < 1.5).length
    }
  };
};

// USER FUNCTIONS

export const getUserProfile = (userEmail) => {
  initializeDB();
  const users = getFromDB(DB_KEYS.USERS);
  const reviews = getFromDB(DB_KEYS.REVIEWS);
  
  const userReviews = reviews.filter(review => review.userEmail === userEmail);
  
  return {
    email: userEmail,
    displayName: getUserDisplayName(userEmail),
    totalReviews: userReviews.length,
    averageRating: userReviews.length > 0 
      ? parseFloat((userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length).toFixed(1))
      : 0,
    reviews: userReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  };
};

// DATABASE MANAGEMENT

export const clearDatabase = () => {
  localStorage.removeItem(DB_KEYS.REVIEWS);
  localStorage.removeItem(DB_KEYS.USERS);
  localStorage.removeItem(DB_KEYS.RESTAURANTS);
  console.log('Mock database cleared');
};

export const exportDatabase = () => {
  return {
    reviews: getFromDB(DB_KEYS.REVIEWS),
    users: getFromDB(DB_KEYS.USERS),
    timestamp: new Date().toISOString()
  };
};

export const importDatabase = (data) => {
  if (data.reviews) {
    saveToDB(DB_KEYS.REVIEWS, data.reviews);
  }
  if (data.users) {
    saveToDB(DB_KEYS.USERS, data.users);
  }
  console.log('Database imported successfully');
};