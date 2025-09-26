# Menu Deal Moço - Mock Backend Services

This directory contains comprehensive mock backend services that simulate a full API for the Menu Deal Moço application. All services use localStorage for persistence and include realistic Portuguese restaurant data.

## 🚀 Quick Start

```javascript
import { initializeServices, restaurantService, reviewService } from './services/index.js';

// Initialize services (call once at app startup)
initializeServices();

// Use services
const restaurants = await restaurantService.searchRestaurants({
  location: 'Porto',
  priceRange: ['budget', 'standard']
});
```

## 📁 Service Structure

```
services/
├── data/
│   ├── mockRestaurants.js    # 21 authentic Portuguese restaurants
│   └── mockReviews.js        # Realistic reviews in Portuguese
├── utils/
│   └── index.js              # Common utilities and helpers
├── restaurantService.js      # Restaurant search, filtering, details
├── reviewService.js          # Reviews and ratings management
├── submissionService.js      # New restaurant submissions
├── locationService.js        # Location search and "near me"
├── index.js                  # Main export file
└── README.md                 # This documentation
```

## 🔧 Services Overview

### Restaurant Service (`restaurantService.js`)

Handles restaurant search, filtering, and details with comprehensive Portuguese data.

**Key Features:**
- Advanced search with multiple filters
- Location-based search with distance calculation
- Price range filtering (€6-15+ range)
- Food type filtering (Traditional Portuguese, Seafood, etc.)
- Practical filters (cards accepted, parking, metro access)
- Favorites management
- Similar restaurants suggestion

**Example Usage:**
```javascript
// Search restaurants
const results = await restaurantService.searchRestaurants({
  query: 'tasquinha',
  location: 'Porto',
  priceRange: ['budget', 'standard'],
  foodTypes: ['Traditional Portuguese'],
  openNow: true,
  sortBy: 'rating',
  page: 1,
  limit: 20
});

// Get restaurant details
const restaurant = await restaurantService.getRestaurantById('1');

// Add to favorites
await restaurantService.addToFavorites('1');
```

### Review Service (`reviewService.js`)

Manages restaurant reviews and ratings with validation and moderation.

**Key Features:**
- Add, update, delete reviews
- 5-star rating system (overall, value, quality, portion, speed)
- Review validation and content filtering
- Helpful votes system
- Review reporting and moderation
- Statistics and analytics

**Example Usage:**
```javascript
// Get restaurant reviews
const reviewData = await reviewService.getRestaurantReviews('1', {
  page: 1,
  limit: 10,
  sortBy: 'datePosted'
});

// Add new review
const newReview = await reviewService.addReview({
  restaurantId: '1',
  userId: 'user123',
  userName: 'Maria Santos',
  rating: {
    overall: 4,
    valueForMoney: 5,
    foodQuality: 4,
    portionSize: 4,
    serviceSpeed: 4
  },
  reviewText: 'Excelente relação qualidade-preço!',
  dateVisited: new Date('2024-12-10'),
  dishOrdered: 'Francesinha completa'
});

// Mark review as helpful
await reviewService.markReviewHelpful('rev_1', 'user123');
```

### Submission Service (`submissionService.js`)

Handles new restaurant submissions with validation and approval workflow.

**Key Features:**
- Restaurant submission with required/optional fields
- Validation and duplicate checking
- Simulated admin approval process
- Submission status tracking
- Resubmission for rejected entries
- Guidelines and tips

**Example Usage:**
```javascript
// Submit new restaurant
const submission = await submissionService.submitRestaurant({
  restaurantName: 'Nova Tasquinha',
  address: 'Rua Nova, 123, 4000-123 Porto',
  menuPrice: 9.50,
  whatsIncluded: ['soup', 'main', 'drink'],
  foodType: 'Traditional Portuguese',
  menuPhoto: '/uploads/menu-photo.jpg',
  submitterName: 'João Silva',
  submitterEmail: 'joao@email.com'
});

// Check submission status
const status = await submissionService.getSubmissionStatus(submission.submissionId);

// Get submission guidelines
const guidelines = await submissionService.getSubmissionGuidelines();
```

### Location Service (`locationService.js`)

Provides location-based functionality with Portuguese geography data.

**Key Features:**
- Current location detection (GPS)
- Address geocoding and reverse geocoding
- Location search with suggestions
- Portuguese cities and districts
- Distance calculations
- Travel time estimates
- Metro/transport station data

**Example Usage:**
```javascript
// Get current location
const currentLocation = await locationService.getCurrentLocation();

// Search locations
const suggestions = await locationService.searchLocations('Porto');

// Geocode address
const location = await locationService.geocodeAddress('Rua de Santa Catarina, Porto');

// Find nearby restaurants
const nearby = await locationService.findNearbyRestaurants(
  { coordinates: { lat: 41.1579, lng: -8.6291 } },
  { radius: 5, limit: 10 }
);
```

## 📊 Mock Data

### Restaurant Data (21 restaurants)
- **Porto**: 12 restaurants across different districts
- **Lisboa**: 9 restaurants in various neighborhoods
- **Price Range**: €6.80 - €16.00 (authentic Portuguese pricing)
- **Food Types**: Traditional Portuguese, Seafood, Modern, International, Vegetarian
- **Complete Info**: Hours, contact, practical info, ratings, reviews

### Review Data
- 17 detailed reviews in Portuguese
- Realistic rating distributions
- Authentic Portuguese review content
- Verified and unverified reviews
- Various review dates and helpfulness scores

## 🛠 Utilities (`utils/index.js`)

Common utilities used across all services:

- **Distance calculations** (Haversine formula)
- **Date/time formatting** (Portuguese locale)
- **Price formatting** (Euro currency)
- **Validation helpers** (email, phone, coordinates)
- **Content filtering** (inappropriate content removal)
- **Local storage wrapper** with error handling
- **Debounce/throttle** functions
- **Error handling** utilities

## 🎛 Configuration

### API Simulation
- **Delay Range**: 200-1500ms (configurable per service)
- **Failure Rate**: 2-5% (simulates real network issues)
- **Pagination**: Default 20 items per page
- **Search**: Debounced with 300ms delay

### Storage Keys
All data is stored in localStorage with prefixed keys:
- `menudealmoco_restaurants` - Restaurant data
- `menudealmoco_reviews` - Review data
- `menudealmoco_user_reviews` - User-generated reviews
- `menudealmoco_submissions` - Restaurant submissions
- `menudealmoco_favorites` - User favorites
- `menudealmoco_recent_searches` - Recent search history
- `menudealmoco_recent_locations` - Recent location searches

## 🔍 Filtering Capabilities

### Restaurant Filters
- **Location**: City, district, address search
- **Price Range**: Budget (€6-8), Standard (€8-10), Good (€10-12), Premium (€12-15), High-end (€15+)
- **Food Type**: Traditional Portuguese, Modern, Seafood, Meat-focused, Vegetarian-friendly, International
- **Features**: Coffee included, dessert included, wine available, bread/soup included
- **Practical**: Takes cards, has parking, quick service, group-friendly, near metro
- **Status**: Open now, distance from user

### Search Capabilities
- **Text Search**: Name, description, address, district
- **Location Search**: GPS coordinates, address, city/district
- **Sorting**: Rating, price, distance, name (ascending/descending)
- **Pagination**: Full pagination support

## 🚨 Error Handling

All services include comprehensive error handling:
- Network simulation errors
- Validation errors with detailed messages
- Permission errors (favorites, reviews)
- Not found errors
- User-friendly Portuguese error messages

## 🧪 Testing Features

### Development Helpers
```javascript
import { clearAllData, getServiceStatus } from './services/index.js';

// Clear all data for testing
clearAllData();

// Check service status
const status = getServiceStatus();
console.log(status);
```

### Simulation Controls
```javascript
// Simulate admin validation (for demo)
const result = await submissionService.simulateValidation('submission_id');

// Force different failure rates
simulateFailure(0.1); // 10% failure rate
```

## 📱 Frontend Integration

The services are designed to work seamlessly with React applications:

```javascript
// In your React component
import { restaurantService } from './services';

const SearchResults = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (searchParams) => {
    setLoading(true);
    try {
      const results = await restaurantService.searchRestaurants(searchParams);
      setRestaurants(results.restaurants);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Component render logic...
};
```

## 🌍 Portuguese Localization

All content and data is localized for Portuguese users:
- Restaurant names and descriptions in Portuguese
- Review content in Portuguese
- Error messages in Portuguese
- Date/time formatting using Portuguese locale
- Currency formatting in Euros
- Portuguese phone number validation
- Portuguese city and district names

## 🔄 Data Persistence

All user actions are persisted in localStorage:
- Search history
- Favorite restaurants
- User reviews and ratings
- Recent locations
- Submission history

Data survives browser sessions and can be cleared programmatically for testing.

---

This mock backend provides a comprehensive foundation for developing the Menu Deal Moço frontend with realistic data and fully functional API simulation.