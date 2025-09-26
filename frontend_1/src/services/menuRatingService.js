/**
 * Menu Rating Service
 * Handles user ratings specifically for "Menu de Almoço" (Lunch Menu)
 */

// Mock storage for menu ratings (in real app, this would be a database)
let menuRatings = {};

export const submitMenuRating = (restaurantId, userId, rating, comment = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!menuRatings[restaurantId]) {
        menuRatings[restaurantId] = [];
      }
      
      const newRating = {
        id: Date.now(),
        userId,
        rating,
        comment,
        timestamp: new Date().toISOString(),
        verified: true // In real app, would verify user actually visited
      };
      
      menuRatings[restaurantId].push(newRating);
      
      resolve({
        success: true,
        rating: newRating,
        newAverageRating: calculateAverageRating(restaurantId)
      });
    }, 500);
  });
};

export const getMenuRatings = (restaurantId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ratings = menuRatings[restaurantId] || [];
      const averageRating = calculateAverageRating(restaurantId);
      
      resolve({
        ratings,
        averageRating,
        totalReviews: ratings.length
      });
    }, 300);
  });
};

export const getUserMenuRating = (restaurantId, userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurantRatings = menuRatings[restaurantId] || [];
      const userRating = restaurantRatings.find(r => r.userId === userId);
      
      resolve(userRating || null);
    }, 200);
  });
};

export const updateMenuRating = (restaurantId, userId, rating, comment = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!menuRatings[restaurantId]) {
        menuRatings[restaurantId] = [];
      }
      
      const existingRatingIndex = menuRatings[restaurantId].findIndex(r => r.userId === userId);
      
      if (existingRatingIndex >= 0) {
        menuRatings[restaurantId][existingRatingIndex] = {
          ...menuRatings[restaurantId][existingRatingIndex],
          rating,
          comment,
          timestamp: new Date().toISOString()
        };
      } else {
        // If no existing rating, create new one
        const newRating = {
          id: Date.now(),
          userId,
          rating,
          comment,
          timestamp: new Date().toISOString(),
          verified: true
        };
        menuRatings[restaurantId].push(newRating);
      }
      
      resolve({
        success: true,
        newAverageRating: calculateAverageRating(restaurantId)
      });
    }, 500);
  });
};

const calculateAverageRating = (restaurantId) => {
  const ratings = menuRatings[restaurantId] || [];
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal place
};

export const getTopRatedMenus = (limit = 10) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurantAverages = Object.keys(menuRatings).map(restaurantId => ({
        restaurantId,
        averageRating: calculateAverageRating(restaurantId),
        totalReviews: menuRatings[restaurantId].length
      }));
      
      const sorted = restaurantAverages
        .filter(r => r.totalReviews >= 5) // Minimum 5 reviews to be included
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, limit);
      
      resolve(sorted);
    }, 400);
  });
};

// Initialize with some mock data
menuRatings = {
  "1": [
    { id: 1, userId: "user1", rating: 5, comment: "Amazing value for money! The francesinha is incredible.", timestamp: "2024-12-10T12:00:00Z", verified: true },
    { id: 2, userId: "user2", rating: 4, comment: "Good traditional food, very filling portions.", timestamp: "2024-12-11T14:30:00Z", verified: true },
    { id: 3, userId: "user3", rating: 5, comment: "Best lunch deal in Porto!", timestamp: "2024-12-12T13:15:00Z", verified: true }
  ],
  "9": [
    { id: 4, userId: "user1", rating: 5, comment: "Excellent modern take on Portuguese cuisine. Worth every euro!", timestamp: "2024-12-08T19:45:00Z", verified: true },
    { id: 5, userId: "user4", rating: 4, comment: "High quality ingredients, creative presentation.", timestamp: "2024-12-09T20:30:00Z", verified: true }
  ]
};