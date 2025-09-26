// Mock API service for Menu Deal Moço
// Simulates backend functionality with realistic data

// Mock restaurant data based on MVP requirements
const mockRestaurants = [
  {
    id: 1,
    name: "Tasquinha do Joaquim",
    address: "Rua das Flores, 123, Porto",
    location: { lat: 41.1496, lng: -8.6109 },
    menuPrice: 8.50,
    priceRange: "€8-10",
    valueRating: 4.2,
    reviewCount: 87,
    foodType: "Traditional Portuguese",
    included: ["Soup", "Main", "Drink", "Coffee"],
    photos: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    menuPhoto: "/api/placeholder/600/400",
    description: "Authentic Portuguese cuisine in a cozy traditional setting. Known for their hearty portions and friendly service.",
    phone: "+351 22 123 4567",
    website: "www.tasquinhadojoaquim.pt",
    hours: {
      monday: "12:00-15:00",
      tuesday: "12:00-15:00",
      wednesday: "12:00-15:00",
      thursday: "12:00-15:00",
      friday: "12:00-15:00",
      saturday: "12:00-15:00",
      sunday: "Closed"
    },
    features: ["Open now", "Takes cards", "Group-friendly"],
    distance: 0.3,
    reviews: [
      {
        id: 1,
        author: "Maria Silva",
        rating: 4,
        date: "2025-01-15",
        comment: "Excellent value for money. The soup was delicious and the main course very satisfying.",
        photos: ["/api/placeholder/200/150"]
      },
      {
        id: 2,
        author: "João Santos",
        rating: 5,
        date: "2025-01-10",
        comment: "Best lunch deal in the area. Traditional Portuguese food at its finest.",
        photos: []
      }
    ]
  },
  {
    id: 2,
    name: "Cantina Moderna",
    address: "Avenida da Liberdade, 456, Lisboa",
    location: { lat: 38.7223, lng: -9.1393 },
    menuPrice: 12.00,
    priceRange: "€10-12",
    valueRating: 4.5,
    reviewCount: 142,
    foodType: "Modern/Contemporary",
    included: ["Main", "Drink", "Dessert"],
    photos: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    menuPhoto: "/api/placeholder/600/400",
    description: "Contemporary Portuguese cuisine with a modern twist. Fresh ingredients and innovative presentations.",
    phone: "+351 21 987 6543",
    website: "www.cantinamoderna.com",
    hours: {
      monday: "12:00-15:00, 19:00-23:00",
      tuesday: "12:00-15:00, 19:00-23:00",
      wednesday: "12:00-15:00, 19:00-23:00",
      thursday: "12:00-15:00, 19:00-23:00",
      friday: "12:00-15:00, 19:00-23:00",
      saturday: "12:00-15:00, 19:00-23:00",
      sunday: "12:00-15:00"
    },
    features: ["Takes cards", "Quick service", "Has parking"],
    distance: 0.7,
    reviews: [
      {
        id: 3,
        author: "Ana Costa",
        rating: 5,
        date: "2025-01-12",
        comment: "Amazing quality and presentation. Worth every euro!",
        photos: ["/api/placeholder/200/150", "/api/placeholder/200/150"]
      }
    ]
  },
  {
    id: 3,
    name: "Marisqueira do Cais",
    address: "Cais da Ribeira, 789, Porto",
    location: { lat: 41.1407, lng: -8.6129 },
    menuPrice: 15.50,
    priceRange: "€15+",
    valueRating: 4.0,
    reviewCount: 56,
    foodType: "Seafood specialist",
    included: ["Soup", "Main", "Wine", "Coffee"],
    photos: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    menuPhoto: "/api/placeholder/600/400",
    description: "Fresh seafood restaurant with spectacular views of the Douro River. Specializing in traditional Portuguese fish dishes.",
    phone: "+351 22 555 7890",
    website: "www.marisqueiradocais.pt",
    hours: {
      monday: "11:30-15:00, 18:30-23:00",
      tuesday: "11:30-15:00, 18:30-23:00",
      wednesday: "11:30-15:00, 18:30-23:00",
      thursday: "11:30-15:00, 18:30-23:00",
      friday: "11:30-15:00, 18:30-23:00",
      saturday: "11:30-15:00, 18:30-23:00",
      sunday: "11:30-15:00"
    },
    features: ["Takes cards", "Group-friendly", "Has parking"],
    distance: 1.2,
    reviews: [
      {
        id: 4,
        author: "Pedro Oliveira",
        rating: 4,
        date: "2025-01-08",
        comment: "Fresh fish and great location. A bit pricey but the quality justifies it.",
        photos: []
      }
    ]
  },
  {
    id: 4,
    name: "Vegetariano Verde",
    address: "Rua dos Clérigos, 321, Porto",
    location: { lat: 41.1458, lng: -8.6142 },
    menuPrice: 9.00,
    priceRange: "€8-10",
    valueRating: 4.3,
    reviewCount: 73,
    foodType: "Vegetarian-friendly",
    included: ["Soup", "Main", "Drink", "Fruit"],
    photos: [
      "/api/placeholder/400/300",
      "/api/placeholder/400/300"
    ],
    menuPhoto: "/api/placeholder/600/400",
    description: "Healthy vegetarian and vegan options with organic ingredients. Perfect for health-conscious diners.",
    phone: "+351 22 333 4444",
    website: "www.vegetarianoverde.com",
    hours: {
      monday: "12:00-15:00",
      tuesday: "12:00-15:00",
      wednesday: "12:00-15:00",
      thursday: "12:00-15:00",
      friday: "12:00-15:00",
      saturday: "12:00-15:00",
      sunday: "Closed"
    },
    features: ["Open now", "Quick service", "Near metro"],
    distance: 0.5,
    reviews: [
      {
        id: 5,
        author: "Sofia Ferreira",
        rating: 4,
        date: "2025-01-14",
        comment: "Great vegetarian options! Fresh and tasty, good value for money.",
        photos: ["/api/placeholder/200/150"]
      }
    ]
  },
  {
    id: 5,
    name: "Churrasqueira Popular",
    address: "Travessa do Cedofeita, 567, Porto",
    location: { lat: 41.1512, lng: -8.6180 },
    menuPrice: 7.50,
    priceRange: "€6-8",
    valueRating: 3.8,
    reviewCount: 124,
    foodType: "Meat-focused",
    included: ["Soup", "Main", "Drink"],
    photos: [
      "/api/placeholder/400/300"
    ],
    menuPhoto: "/api/placeholder/600/400",
    description: "Traditional grill house specializing in grilled meats and Portuguese classics. Great value for money.",
    phone: "+351 22 777 8888",
    website: null,
    hours: {
      monday: "11:30-15:00",
      tuesday: "11:30-15:00",
      wednesday: "11:30-15:00",
      thursday: "11:30-15:00",
      friday: "11:30-15:00",
      saturday: "11:30-15:00",
      sunday: "Closed"
    },
    features: ["Open now", "Takes cards"],
    distance: 0.8,
    reviews: [
      {
        id: 6,
        author: "Miguel Rocha",
        rating: 4,
        date: "2025-01-11",
        comment: "Simple but good. Great grilled chicken and very affordable.",
        photos: []
      }
    ]
  }
];

// Helper function to simulate API delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Search restaurants with filters
  async searchRestaurants(filters = {}) {
    await delay();

    let results = [...mockRestaurants];

    // Apply location filter (simplified)
    if (filters.location) {
      // In a real app, this would use geolocation and distance calculation
      results = results.filter(restaurant =>
        restaurant.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      results = results.filter(restaurant =>
        restaurant.priceRange === filters.priceRange
      );
    }

    // Apply food type filter
    if (filters.foodType && filters.foodType !== 'all') {
      results = results.filter(restaurant =>
        restaurant.foodType === filters.foodType
      );
    }

    // Apply features filter
    if (filters.features && filters.features.length > 0) {
      results = results.filter(restaurant =>
        filters.features.every(feature => restaurant.features.includes(feature))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          results.sort((a, b) => a.menuPrice - b.menuPrice);
          break;
        case 'price-high':
          results.sort((a, b) => b.menuPrice - a.menuPrice);
          break;
        case 'rating':
          results.sort((a, b) => b.valueRating - a.valueRating);
          break;
        case 'distance':
          results.sort((a, b) => a.distance - b.distance);
          break;
        default:
          // Default: sort by value rating
          results.sort((a, b) => b.valueRating - a.valueRating);
      }
    }

    return {
      restaurants: results,
      total: results.length,
      filters: filters
    };
  },

  // Get restaurant by ID
  async getRestaurant(id) {
    await delay();

    const restaurant = mockRestaurants.find(r => r.id === parseInt(id));
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    return restaurant;
  },

  // Submit new restaurant
  async submitRestaurant(restaurantData) {
    await delay(1200); // Longer delay for submission

    // Simulate validation
    if (!restaurantData.name || !restaurantData.address || !restaurantData.menuPrice) {
      throw new Error('Missing required fields');
    }

    // Simulate random approval/rejection (90% approval rate)
    const approved = Math.random() > 0.1;

    if (!approved) {
      throw new Error('Submission failed validation. Please check your information and try again.');
    }

    const newRestaurant = {
      id: mockRestaurants.length + 1,
      ...restaurantData,
      valueRating: 0,
      reviewCount: 0,
      reviews: [],
      distance: Math.random() * 2, // Random distance for demo
      features: restaurantData.features || []
    };

    // In a real app, this would be saved to database
    // For demo, we'll just return success

    return {
      success: true,
      restaurant: newRestaurant,
      message: 'Restaurant submitted successfully! It will be reviewed and published within 2-3 business days.'
    };
  },

  // Submit review
  async submitReview(restaurantId, reviewData) {
    await delay();

    const restaurant = mockRestaurants.find(r => r.id === parseInt(restaurantId));
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const newReview = {
      id: Date.now(),
      ...reviewData,
      date: new Date().toISOString().split('T')[0]
    };

    // In a real app, this would update the database
    // For demo, we'll simulate success

    return {
      success: true,
      review: newReview,
      message: 'Review submitted successfully!'
    };
  },

  // Get featured restaurants for homepage
  async getFeaturedRestaurants() {
    await delay(500);

    // Return top 3 rated restaurants
    const featured = [...mockRestaurants]
      .sort((a, b) => b.valueRating - a.valueRating)
      .slice(0, 3);

    return featured;
  },

  // Get nearby restaurants (mock geolocation)
  async getNearbyRestaurants(location = null) {
    await delay();

    // In a real app, this would use actual geolocation
    // For demo, just return restaurants sorted by distance
    const nearby = [...mockRestaurants]
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    return nearby;
  }
};

// Export filter options for components
export const filterOptions = {
  priceRanges: [
    { value: 'all', label: 'All Prices' },
    { value: '€6-8', label: '€6-8 (Budget)' },
    { value: '€8-10', label: '€8-10 (Standard)' },
    { value: '€10-12', label: '€10-12 (Good value)' },
    { value: '€12-15', label: '€12-15 (Premium)' },
    { value: '€15+', label: '€15+ (High-end)' }
  ],

  foodTypes: [
    { value: 'all', label: 'All Types' },
    { value: 'Traditional Portuguese', label: 'Traditional Portuguese' },
    { value: 'Modern/Contemporary', label: 'Modern/Contemporary' },
    { value: 'Seafood specialist', label: 'Seafood specialist' },
    { value: 'Meat-focused', label: 'Meat-focused' },
    { value: 'Vegetarian-friendly', label: 'Vegetarian-friendly' },
    { value: 'International', label: 'International' }
  ],

  features: [
    { value: 'Open now', label: 'Open now' },
    { value: 'Takes cards', label: 'Takes credit cards' },
    { value: 'Quick service', label: 'Quick service' },
    { value: 'Group-friendly', label: 'Group-friendly' },
    { value: 'Has parking', label: 'Has parking' },
    { value: 'Near metro', label: 'Near metro' }
  ],

  sortOptions: [
    { value: 'rating', label: 'Best Rating' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'distance', label: 'Distance' }
  ]
};

export default mockApi;