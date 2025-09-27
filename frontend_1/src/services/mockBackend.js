// Mock Backend Service - Simulates a real backend with localStorage persistence
// Import the username service
import { generateRandomUsername } from './usernameService';

class MockBackend {
  constructor() {
    this.initializeData();
  }

  // Initialize default data if not exists
  initializeData() {
    // Users
    if (!localStorage.getItem('mmd_users')) {
      const defaultUsers = {
        'john.doe@example.com': {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password',
          displayName: 'BrilliantFoodie542',
          isReviewer: true,
          joinedAt: '2025-01-01T10:00:00Z',
          reviews: []
        },
        'maria.santos@example.com': {
          id: '2',
          name: 'Maria Santos',
          email: 'maria.santos@example.com',
          password: 'password123',
          displayName: 'AmazingExplorer891',
          isReviewer: false,
          joinedAt: '2025-01-15T14:30:00Z',
          reviews: []
        },
        'admin@menudealmoco.com': {
          id: '3',
          name: 'Admin User',
          email: 'admin@menudealmoco.com',
          password: 'admin123',
          displayName: 'SuperReviewer007',
          isReviewer: true,
          joinedAt: '2024-12-01T09:00:00Z',
          reviews: []
        }
      };
      localStorage.setItem('mmd_users', JSON.stringify(defaultUsers));
    }

    // Restaurants
    if (!localStorage.getItem('mmd_restaurants')) {
      const defaultRestaurants = {
        '1': {
          id: '1',
          name: 'Tasca do João',
          address: 'Rua do Norte, 45, Porto',
          city: 'Porto',
          district: 'Porto',
          menuPrice: 9.50,
          priceRange: '8-10',
          foodType: 'Traditional Portuguese',
          whatsIncluded: ['soup', 'main', 'drink'],
          practical: { cardsAccepted: true, quickService: false, groupFriendly: true, parking: false },
          googleRating: 4.3,
          googleReviews: 127,
          description: 'Small family restaurant with daily specials',
          dishes: ['Bacalhau à Brás', 'Francesinha', 'Caldo Verde'],
          photos: [],
          status: 'approved',
          submittedBy: 'maria.santos@example.com',
          submittedAt: '2025-01-10T12:00:00Z',
          approvedBy: 'john.doe@example.com',
          approvedAt: '2025-01-11T09:00:00Z'
        },
        '2': {
          id: '2',
          name: 'Burger Palace',
          address: 'Avenida da Liberdade, 123, Lisboa',
          city: 'Lisboa',
          district: 'Lisboa',
          menuPrice: 12.00,
          priceRange: '10-12',
          foodType: 'International',
          whatsIncluded: ['main', 'drink'],
          practical: { cardsAccepted: true, quickService: true, groupFriendly: false, parking: true },
          googleRating: 4.1,
          googleReviews: 89,
          description: 'Modern burger joint with craft options',
          dishes: ['Classic Burger', 'Veggie Burger', 'Chicken Deluxe'],
          photos: [],
          status: 'approved',
          submittedBy: 'john.doe@example.com',
          submittedAt: '2025-01-05T15:30:00Z',
          approvedBy: 'admin@menudealmoco.com',
          approvedAt: '2025-01-06T10:15:00Z'
        },
        '3': {
          id: '3',
          name: 'Vegetarian Garden',
          address: 'Praça da República, 67, Braga',
          city: 'Braga',
          district: 'Braga',
          menuPrice: 8.50,
          priceRange: '8-10',
          foodType: 'Vegetarian-friendly',
          whatsIncluded: ['soup', 'main', 'dessert'],
          practical: { cardsAccepted: true, quickService: false, groupFriendly: true, parking: false },
          googleRating: 4.5,
          googleReviews: 156,
          description: 'Fresh vegetarian meals with organic ingredients',
          dishes: ['Quinoa Bowl', 'Veggie Lasagna', 'Green Smoothie'],
          photos: [],
          status: 'approved',
          submittedBy: 'maria.santos@example.com',
          submittedAt: '2025-01-08T11:20:00Z',
          approvedBy: 'john.doe@example.com',
          approvedAt: '2025-01-09T14:45:00Z'
        }
      };
      localStorage.setItem('mmd_restaurants', JSON.stringify(defaultRestaurants));
    }

    // Restaurant Submissions
    if (!localStorage.getItem('mmd_submissions')) {
      const defaultSubmissions = {
        '1': {
          id: '1',
          type: 'restaurant',
          restaurantName: 'Marisqueira do Porto',
          submittedBy: 'maria.santos@example.com',
          submittedAt: '2025-01-20T14:30:00Z',
          status: 'pending',
          data: {
            name: 'Marisqueira do Porto',
            address: 'Rua dos Navegantes, 89, Porto',
            city: 'Porto',
            district: 'Porto',
            menuPrice: 15.00,
            priceRange: '12-15',
            foodType: 'Seafood specialist',
            whatsIncluded: ['soup', 'main', 'drink', 'coffee'],
            practical: { cardsAccepted: true, quickService: false, groupFriendly: true, parking: true },
            googleRating: 4.4,
            googleReviews: 203,
            description: 'Fresh seafood restaurant near the harbor',
            dishes: ['Grilled Fish', 'Seafood Rice', 'Octopus Salad']
          },
          reviewerComments: []
        }
      };
      localStorage.setItem('mmd_submissions', JSON.stringify(defaultSubmissions));
    }

    // Menu Reviews
    if (!localStorage.getItem('mmd_menu_reviews')) {
      const defaultMenuReviews = {
        '1': [
          {
            id: '1',
            userId: 'maria.santos@example.com',
            restaurantId: '1',
            rating: 4,
            review: 'Great value for money! The bacalhau was excellent.',
            upvotes: 5,
            downvotes: 1,
            createdAt: '2025-01-15T12:30:00Z',
            userVotes: { 'john.doe@example.com': 'up' }
          }
        ],
        '2': [
          {
            id: '2',
            userId: 'john.doe@example.com',
            restaurantId: '2',
            rating: 3,
            review: 'Good burgers but a bit pricey for lunch.',
            upvotes: 2,
            downvotes: 0,
            createdAt: '2025-01-12T18:45:00Z',
            userVotes: {}
          }
        ]
      };
      localStorage.setItem('mmd_menu_reviews', JSON.stringify(defaultMenuReviews));
    }
  }

  // User Authentication
  async login(email, password) {
    const users = JSON.parse(localStorage.getItem('mmd_users') || '{}');
    const user = users[email];

    if (user && user.password === password) {
      // Load user's reviews and favorites
      const userWithData = { ...user };
      delete userWithData.password; // Don't return password

      // Get user's reviews
      const menuReviews = JSON.parse(localStorage.getItem('mmd_menu_reviews') || '{}');
      userWithData.reviews = [];
      Object.values(menuReviews).flat().forEach(review => {
        if (review.userId === email) {
          userWithData.reviews.push({
            id: review.id,
            restaurant: this.getRestaurant(review.restaurantId)?.name || 'Unknown',
            review: review.review,
            upvotes: review.upvotes || 0,
            rating: review.rating
          });
        }
      });

      return userWithData;
    }
    return null;
  }

  async signup(name, email, password) {
    const users = JSON.parse(localStorage.getItem('mmd_users') || '{}');

    if (users[email]) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      displayName: generateRandomUsername(), // Generate Reddit-style username at signup
      isReviewer: false,
      joinedAt: new Date().toISOString(),
      reviews: []
    };

    users[email] = newUser;
    localStorage.setItem('mmd_users', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    return userWithoutPassword;
  }

  // Restaurant Management
  getRestaurants(filters = {}) {
    const restaurants = JSON.parse(localStorage.getItem('mmd_restaurants') || '{}');
    let results = Object.values(restaurants).filter(r => r.status === 'approved');

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.dishes.some(dish => dish.toLowerCase().includes(query))
      );
    }

    if (filters.location) {
      const location = filters.location.toLowerCase();
      results = results.filter(r =>
        r.city.toLowerCase().includes(location) ||
        r.district.toLowerCase().includes(location) ||
        r.address.toLowerCase().includes(location)
      );
    }

    if (filters.foodTypes && filters.foodTypes.length > 0) {
      results = results.filter(r => filters.foodTypes.includes(r.foodType));
    }

    if (filters.minPrice || filters.maxPrice) {
      results = results.filter(r => {
        const price = r.menuPrice;
        const min = filters.minPrice || 0;
        const max = filters.maxPrice || Infinity;
        return price >= min && price <= max;
      });
    }

    // Handle favorites filtering
    if (filters.showOnlyFavorites) {
      const favoriteRestaurants = JSON.parse(localStorage.getItem('menudealmoco_favorites') || '[]');
      results = results.filter(r => favoriteRestaurants.includes(r.id));
    }

    // Apply sorting with favorites priority
    results.sort((a, b) => {
      // If showing favorites, prioritize them
      if (filters.showOnlyFavorites) {
        // All results are already favorites, so just use normal sorting
      } else {
        // If not filtering favorites, prioritize favorited restaurants at the top
        const favoriteRestaurants = JSON.parse(localStorage.getItem('menudealmoco_favorites') || '[]');
        const aIsFavorite = favoriteRestaurants.includes(a.id);
        const bIsFavorite = favoriteRestaurants.includes(b.id);
        
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
      }

      // Apply regular sorting
      if (filters.sortBy) {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        switch (filters.sortBy) {
          case 'price':
            return (a.menuPrice - b.menuPrice) * order;
          case 'rating':
            return (a.googleRating - b.googleRating) * order;
          case 'name':
            return a.name.localeCompare(b.name) * order;
          default:
            return 0;
        }
      }
      
      return 0;
    });

    return results;
  }

  getRestaurant(id) {
    const restaurants = JSON.parse(localStorage.getItem('mmd_restaurants') || '{}');
    return restaurants[id] || null;
  }

  // Restaurant Submissions
  submitRestaurant(data, userEmail) {
    const submissions = JSON.parse(localStorage.getItem('mmd_submissions') || '{}');
    const newId = Date.now().toString();

    // Extract city and district from address
    const addressParts = data.address.split(',').map(part => part.trim());
    const city = addressParts.length > 1 ? addressParts[addressParts.length - 1] : 'Unknown';
    const district = addressParts.length > 2 ? addressParts[addressParts.length - 2] : city;

    const submission = {
      id: newId,
      type: 'restaurant',
      restaurantName: data.name,
      submittedBy: userEmail,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      data: {
        ...data,
        city: city,
        district: district
      },
      reviewerComments: []
    };

    submissions[newId] = submission;
    localStorage.setItem('mmd_submissions', JSON.stringify(submissions));
    return submission;
  }

  getSubmissions(status = 'all') {
    const submissions = JSON.parse(localStorage.getItem('mmd_submissions') || '{}');
    let results = Object.values(submissions);

    if (status !== 'all') {
      results = results.filter(s => s.status === status);
    }

    return results;
  }

  reviewSubmission(submissionId, action, comment = '', reviewerEmail) {
    const submissions = JSON.parse(localStorage.getItem('mmd_submissions') || '{}');
    const submission = submissions[submissionId];

    if (!submission) return null;

    submission.reviewedBy = reviewerEmail;
    submission.reviewedAt = new Date().toISOString();

    if (comment) {
      submission.reviewerComments.push({
        comment,
        timestamp: new Date().toISOString(),
        reviewer: reviewerEmail
      });
    }

    switch (action) {
      case 'approve':
        submission.status = 'approved';
        // Add to restaurants
        this.addApprovedRestaurant(submission);
        break;
      case 'reject':
        submission.status = 'rejected';
        break;
      case 'request_changes':
        submission.status = 'needs_changes';
        break;
    }

    submissions[submissionId] = submission;
    localStorage.setItem('mmd_submissions', JSON.stringify(submissions));
    return submission;
  }

  addApprovedRestaurant(submission) {
    const restaurants = JSON.parse(localStorage.getItem('mmd_restaurants') || '{}');
    const newId = Date.now().toString();

    const restaurant = {
      id: newId,
      ...submission.data,
      status: 'approved',
      submittedBy: submission.submittedBy,
      submittedAt: submission.submittedAt,
      approvedBy: submission.reviewedBy,
      approvedAt: submission.reviewedAt,
      photos: []
    };

    restaurants[newId] = restaurant;
    localStorage.setItem('mmd_restaurants', JSON.stringify(restaurants));
    return restaurant;
  }

  // Menu Reviews
  getMenuReviews(restaurantId) {
    const menuReviews = JSON.parse(localStorage.getItem('mmd_menu_reviews') || '{}');
    return menuReviews[restaurantId] || [];
  }

  addMenuReview(restaurantId, userId, rating, comment, displayName) {
    const menuReviews = JSON.parse(localStorage.getItem('mmd_menu_reviews') || '{}');
    const newId = Date.now().toString();

    if (!menuReviews[restaurantId]) {
      menuReviews[restaurantId] = [];
    }

    const newReview = {
      id: newId,
      userId,
      restaurantId,
      rating,
      comment, // Use comment instead of review
      displayName: displayName || `User${Math.floor(Math.random() * 10000)}`, // Reddit-style fallback
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
      createdAt: new Date().toISOString(),
      userVotes: {}
    };

    menuReviews[restaurantId].push(newReview);
    localStorage.setItem('mmd_menu_reviews', JSON.stringify(menuReviews));
    return newReview;
  }

  voteOnReview(reviewId, restaurantId, userId, voteType) {
    const menuReviews = JSON.parse(localStorage.getItem('mmd_menu_reviews') || '{}');
    const reviews = menuReviews[restaurantId] || [];
    const review = reviews.find(r => r.id === reviewId);

    if (!review) return null;

    // Remove previous vote if exists
    const previousVote = review.userVotes[userId];
    if (previousVote === 'up') review.upvotes--;
    if (previousVote === 'down') review.downvotes--;

    // Add new vote
    if (voteType === 'up') {
      review.upvotes++;
      review.userVotes[userId] = 'up';
    } else if (voteType === 'down') {
      review.downvotes++;
      review.userVotes[userId] = 'down';
    } else {
      delete review.userVotes[userId];
    }

    localStorage.setItem('mmd_menu_reviews', JSON.stringify(menuReviews));
    return review;
  }

  // Report a review
  reportReview(reviewId, restaurantId, reporterId, reason) {
    const reports = JSON.parse(localStorage.getItem('mmd_reported_reviews') || '[]');

    // Check if user already reported this review
    const existingReport = reports.find(
      report => report.reviewId === reviewId && report.reporterId === reporterId
    );

    if (existingReport) {
      throw new Error('You have already reported this review');
    }

    // Get the review details for context
    const menuReviews = JSON.parse(localStorage.getItem('mmd_menu_reviews') || '{}');
    const reviewList = menuReviews[restaurantId] || [];
    const review = reviewList.find(r => r.id === reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    // Create new report
    const newReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      reviewId,
      restaurantId,
      reporterId,
      reason,
      dateReported: new Date().toISOString(),
      status: 'pending', // pending, reviewed, resolved
      reviewContent: {
        userId: review.userId,
        displayName: review.displayName,
        comment: review.comment,
        rating: review.rating,
        createdAt: review.createdAt
      }
    };

    reports.push(newReport);
    localStorage.setItem('mmd_reported_reviews', JSON.stringify(reports));

    return true;
  }

  // Get reported reviews (for reviewers/admins)
  getReportedReviews() {
    return JSON.parse(localStorage.getItem('mmd_reported_reviews') || '[]');
  }

  // Resolve a report
  resolveReport(reportId, reviewerId, action) {
    const reports = JSON.parse(localStorage.getItem('mmd_reported_reviews') || '[]');
    const reportIndex = reports.findIndex(report => report.id === reportId);

    if (reportIndex === -1) {
      throw new Error('Report not found');
    }

    reports[reportIndex].status = 'resolved';
    reports[reportIndex].resolvedBy = reviewerId;
    reports[reportIndex].resolvedAt = new Date().toISOString();
    reports[reportIndex].action = action; // 'dismissed', 'review_hidden', 'user_warned', etc.

    localStorage.setItem('mmd_reported_reviews', JSON.stringify(reports));
    return true;
  }
}

// Export singleton instance
export const mockBackend = new MockBackend();