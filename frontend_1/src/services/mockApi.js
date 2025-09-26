// Test file to verify server is working
console.log('Test mockApi loaded successfully!');

export const test = () => {
  console.log('MockAPI test function called');
  return 'Working!';
};

export const getRestaurants = (filters = {}) => {
  console.log('getRestaurants called with filters:', filters);
  
  const allRestaurants = [
    {
      id: "1",
      name: "Tasquinha do João", 
      district: "Cedofeita",
      city: "Porto",
      menuPrice: 8.50,
      foodType: "Traditional Portuguese",
      whatsIncluded: ["soup", "main", "drink", "coffee"],
      overallRating: 4.3,
      menuRating: 4.5,
      menuReviews: 92,
      googleRating: 4.2,
      googleReviews: 89,
      zomatoRating: 4.4,
      zomatoReviews: 38,
      totalReviews: 127,
      practical: {
        cardsAccepted: true,
        parking: false,
        quickService: true,
        groupFriendly: true
      },
      isOpenNow: true
    },
    {
      id: "2",
      name: "Mesa Real",
      district: "Chiado", 
      city: "Lisboa",
      menuPrice: 15.50,
      foodType: "Modern/Contemporary",
      whatsIncluded: ["soup", "main", "dessert", "coffee"],
      overallRating: 4.6,
      menuRating: 4.7,
      menuReviews: 45,
      googleRating: 4.4,
      googleReviews: 142,
      zomatoRating: 4.6,
      zomatoReviews: 78,
      totalReviews: 67,
      practical: {
        cardsAccepted: true,
        parking: false,
        quickService: false,
        groupFriendly: false
      },
      isOpenNow: true
    },
    {
      id: "3",
      name: "Cantina Universitária",
      district: "Asprela",
      city: "Porto", 
      menuPrice: 6.80,
      foodType: "Traditional Portuguese",
      whatsIncluded: ["soup", "main", "salad", "drink"],
      overallRating: 3.8,
      menuRating: 4.1,
      menuReviews: 156,
      googleRating: 3.9,
      googleReviews: 203,
      zomatoRating: 3.7,
      zomatoReviews: 94,
      totalReviews: 203,
      practical: {
        cardsAccepted: false,
        parking: true,
        quickService: true,
        groupFriendly: true
      },
      isOpenNow: true
    }
  ];

  let filteredRestaurants = allRestaurants;

  // Filter by location (city or district)
  if (filters.location) {
    const searchLocation = filters.location.toLowerCase();
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.city.toLowerCase().includes(searchLocation) ||
      restaurant.district.toLowerCase().includes(searchLocation)
    );
    console.log(`Filtered by location "${filters.location}":`, filteredRestaurants.length, 'restaurants');
  }

  // Filter by search query (name or other fields)
  if (filters.query) {
    const searchQuery = filters.query.toLowerCase();
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(searchQuery) ||
      restaurant.foodType.toLowerCase().includes(searchQuery) ||
      restaurant.district.toLowerCase().includes(searchQuery) ||
      restaurant.city.toLowerCase().includes(searchQuery)
    );
  }

  // Filter by open now
  if (filters.openNow) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.isOpenNow);
  }

  // Filter by price range
  if (filters.minPrice && filters.maxPrice) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.menuPrice >= filters.minPrice && restaurant.menuPrice <= filters.maxPrice
    );
  }

  // Filter by food types
  if (filters.foodTypes && filters.foodTypes.length > 0) {
    filteredRestaurants = filteredRestaurants.filter(restaurant =>
      filters.foodTypes.some(type => 
        restaurant.foodType.toLowerCase().includes(type.toLowerCase())
      )
    );
  }

  // Filter by minimum Google rating
  if (filters.minGoogleRating && filters.minGoogleRating > 0) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.googleRating && restaurant.googleRating >= filters.minGoogleRating
    );
  }

  // Filter by minimum Zomato rating
  if (filters.minZomatoRating && filters.minZomatoRating > 0) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.zomatoRating && restaurant.zomatoRating >= filters.minZomatoRating
    );
  }

  // Filter by overall rating
  if (filters.overallRating && filters.overallRating > 0) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.overallRating >= filters.overallRating
    );
  }

  // Filter by practical features
  if (filters.practicalFilters) {
    Object.entries(filters.practicalFilters).forEach(([key, value]) => {
      if (value) {
        const practicalMap = {
          takesCards: 'cardsAccepted',
          hasParking: 'parking',
          quickService: 'quickService',
          groupFriendly: 'groupFriendly'
        };
        const practicalKey = practicalMap[key];
        if (practicalKey) {
          filteredRestaurants = filteredRestaurants.filter(restaurant =>
            restaurant.practical && restaurant.practical[practicalKey]
          );
        }
      }
    });
  }

  // Sorting
  if (filters.sortBy) {
    filteredRestaurants.sort((a, b) => {
      let aValue, bValue;
      
      switch (filters.sortBy) {
        case 'rating':
          aValue = a.menuRating || a.overallRating || 0;
          bValue = b.menuRating || b.overallRating || 0;
          break;
        case 'price':
          aValue = a.menuPrice || 0;
          bValue = b.menuPrice || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          aValue = a.menuRating || 0;
          bValue = b.menuRating || 0;
      }

      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      if (aValue < bValue) return -order;
      if (aValue > bValue) return order;
      return 0;
    });
  }

  console.log(`Final filtered results: ${filteredRestaurants.length} restaurants`);
  return Promise.resolve(filteredRestaurants);
};

export const getRestaurant = (id) => {
  console.log('getRestaurant called with id:', id);
  const restaurants = [
    {
      id: "1",
      name: "Tasquinha do João", 
      district: "Cedofeita",
      city: "Porto",
      menuPrice: 8.50,
      foodType: "Traditional Portuguese",
      whatsIncluded: ["soup", "main", "drink", "coffee"],
      overallRating: 4.3,
      menuRating: 4.5,
      menuReviews: 92,
      googleRating: 4.2,
      googleReviews: 89,
      zomatoRating: 4.4,
      zomatoReviews: 38,
      totalReviews: 127,
      practical: {
        cardsAccepted: true,
        parking: false,
        quickService: true,
        groupFriendly: true
      },
      isOpenNow: true
    },
    {
      id: "2",
      name: "Mesa Real",
      district: "Chiado", 
      city: "Lisboa",
      menuPrice: 15.50,
      foodType: "Modern/Contemporary",
      whatsIncluded: ["soup", "main", "dessert", "coffee"],
      overallRating: 4.6,
      menuRating: 4.7,
      menuReviews: 45,
      googleRating: 4.4,
      googleReviews: 142,
      zomatoRating: 4.6,
      zomatoReviews: 78,
      totalReviews: 67,
      practical: {
        cardsAccepted: true,
        parking: false,
        quickService: false,
        groupFriendly: false
      },
      isOpenNow: true
    },
    {
      id: "3",
      name: "Cantina Universitária",
      district: "Asprela",
      city: "Porto", 
      menuPrice: 6.80,
      foodType: "Traditional Portuguese",
      whatsIncluded: ["soup", "main", "salad", "drink"],
      overallRating: 3.8,
      menuRating: 4.1,
      menuReviews: 156,
      googleRating: 3.9,
      googleReviews: 203,
      zomatoRating: 3.7,
      zomatoReviews: 94,
      totalReviews: 203,
      practical: {
        cardsAccepted: false,
        parking: true,
        quickService: true,
        groupFriendly: true
      },
      isOpenNow: true
    }
  ];
  
  return Promise.resolve(restaurants.find(r => r.id === id) || restaurants[0]);
};

export const login = (email, password) => {
  console.log('login called');
  return Promise.resolve({
    success: true,
    user: { name: "Test User", email: email }
  });
};

export const signup = (name, email, password) => {
  console.log('signup called');
  return Promise.resolve({
    success: true,
    user: { name: name, email: email }
  });
};