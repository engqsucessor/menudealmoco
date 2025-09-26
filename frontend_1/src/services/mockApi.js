const restaurants = [
  {
    id: 1,
    name: 'Tasca do Zé',
    location: 'Porto, Portugal',
    menuPrice: 8.50,
    valueRating: 4.5,
    totalReviews: 120,
    included: ['Soup', 'Main Course', 'Drink', 'Coffee'],
    foodType: 'Traditional Portuguese',
    quickInfo: ['Cash only', 'Lively atmosphere'],
    photo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.4,
    googleReviews: 512,
    zomatoRating: 4.1,
    zomatoReviews: 320,
    isOpen: true,
    takesCards: false,
    lastUpdated: '2024-01-15',
    reviews: [
      { id: 1, author: 'John Doe', rating: 5, comment: 'Amazing food and great value!' },
      { id: 2, author: 'Jane Smith', rating: 4, comment: 'Very good, but a bit crowded.' }
    ],
    menuReviews: [
      { id: 1, author: 'Peter Pan', rating: 5, comment: 'The menu is a great deal!' }
    ]
  },
  {
    id: 2,
    name: 'Cantinho do Avillez',
    location: 'Lisbon, Portugal',
    menuPrice: 15.00,
    valueRating: 4.8,
    totalReviews: 350,
    included: ['Main Course', 'Dessert', 'Drink'],
    foodType: 'Modern/Contemporary',
    quickInfo: ['Accepts cards', 'Reservation recommended'],
    photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.7,
    googleReviews: 1245,
    zomatoRating: 4.5,
    zomatoReviews: 890,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-20',
    reviews: [
      { id: 3, author: 'Peter Jones', rating: 5, comment: 'A bit pricey, but worth it.' }
    ],
    menuReviews: []
  },
  {
    id: 3,
    name: 'Marisqueira Antiga',
    location: 'Faro, Portugal',
    menuPrice: 12.00,
    valueRating: 4.2,
    totalReviews: 210,
    included: ['Soup', 'Main Course (Fish)', 'Drink'],
    foodType: 'Seafood',
    quickInfo: ['Fresh seafood', 'Ocean view'],
    photo: 'https://images.unsplash.com/photo-1562967005-a3c8b31582a9?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.0,
    googleReviews: 321,
    zomatoRating: 4.2,
    zomatoReviews: 250,
    isOpen: false,
    takesCards: true,
    lastUpdated: '2024-01-10',
    reviews: [],
    menuReviews: [
      { id: 2, author: 'Mary Poppins', rating: 4, comment: 'Good value for the price.' }
    ]
  },
  {
    id: 4,
    name: 'Pizzaria Napolitana',
    location: 'Porto, Portugal',
    menuPrice: 9.00,
    valueRating: 4.0,
    totalReviews: 80,
    included: ['Pizza Slice', 'Drink'],
    foodType: 'Italian',
    quickInfo: ['Quick service', 'Vegetarian options'],
    photo: 'https://images.unsplash.com/photo-1593560704563-f1a66c66d2c1?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.2,
    googleReviews: 400,
    zomatoRating: 3.9,
    zomatoReviews: 280,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-22',
    reviews: [],
    menuReviews: []
  },
  {
    id: 5,
    name: 'Hamburgueria Artesanal',
    location: 'Lisbon, Portugal',
    menuPrice: 11.00,
    valueRating: 4.6,
    totalReviews: 250,
    included: ['Burger', 'Fries', 'Drink'],
    foodType: 'American',
    quickInfo: ['Craft beer', 'Outdoor seating'],
    photo: 'https://images.unsplash.com/photo-1568901346379-8ce8c6c89597?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.6,
    googleReviews: 900,
    zomatoRating: 4.4,
    zomatoReviews: 600,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-25',
    reviews: [],
    menuReviews: []
  },
  {
    id: 6,
    name: 'Restaurante Indiano',
    location: 'Porto, Portugal',
    menuPrice: 10.00,
    valueRating: 4.3,
    totalReviews: 150,
    included: ['Curry', 'Rice', 'Naan', 'Drink'],
    foodType: 'Indian',
    quickInfo: ['Spicy food', 'Vegan options'],
    photo: 'https://images.unsplash.com/photo-1589302168068-964722f8729d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.3,
    googleReviews: 600,
    zomatoRating: 4.0,
    zomatoReviews: 350,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-18',
    reviews: [],
    menuReviews: []
  },
  {
    id: 7,
    name: 'Sushi Bar',
    location: 'Lisbon, Portugal',
    menuPrice: 14.00,
    valueRating: 4.7,
    totalReviews: 300,
    included: ['Sushi Selection', 'Miso Soup', 'Drink'],
    foodType: 'Japanese',
    quickInfo: ['Fresh fish', 'Modern decor'],
    photo: 'https://images.unsplash.com/photo-1579871128703-911870249e82?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.8,
    googleReviews: 1100,
    zomatoRating: 4.6,
    zomatoReviews: 700,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-28',
    reviews: [],
    menuReviews: []
  },
  {
    id: 8,
    name: 'Taberna Espanhola',
    location: 'Faro, Portugal',
    menuPrice: 10.50,
    valueRating: 4.1,
    totalReviews: 90,
    included: ['Tapas Selection', 'Drink'],
    foodType: 'Spanish',
    quickInfo: ['Authentic tapas', 'Lively atmosphere'],
    photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.1,
    googleReviews: 350,
    zomatoRating: 3.8,
    zomatoReviews: 200,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-19',
    reviews: [],
    menuReviews: []
  },
  {
    id: 9,
    name: 'Vegan Delight',
    location: 'Porto, Portugal',
    menuPrice: 11.50,
    valueRating: 4.4,
    totalReviews: 110,
    included: ['Vegan Dish', 'Juice', 'Dessert'],
    foodType: 'Vegan',
    quickInfo: ['Organic ingredients', 'Healthy options'],
    photo: 'https://images.unsplash.com/photo-1512621776951-a579eddc87f2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 4.5,
    googleReviews: 500,
    zomatoRating: 4.3,
    zomatoReviews: 300,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-26',
    reviews: [],
    menuReviews: []
  },
  {
    id: 10,
    name: 'Café Central',
    location: 'Lisbon, Portugal',
    menuPrice: 7.00,
    valueRating: 3.9,
    totalReviews: 200,
    included: ['Sandwich', 'Soup', 'Coffee'],
    foodType: 'Café',
    quickInfo: ['Breakfast served', 'Good for quick bite'],
    photo: 'https://images.unsplash.com/photo-1501729771831-b7107ee86570?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    googleRating: 3.8,
    googleReviews: 700,
    zomatoRating: 3.7,
    zomatoReviews: 400,
    isOpen: true,
    takesCards: true,
    lastUpdated: '2024-01-21',
    reviews: [],
    menuReviews: []
  }
];

export const getRestaurants = (filters) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredRestaurants = restaurants;

      if (filters) {
        if (filters.location) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }

        if (filters.price) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.menuPrice <= parseFloat(filters.price)
          );
        }

        if (filters.foodType) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.foodType === filters.foodType
          );
        }

        if (filters.coffee) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.included.includes('Coffee')
          );
        }

        if (filters.dessert) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.included.includes('Dessert')
          );
        }

        if (filters.openNow) {
          filteredRestaurants = filteredRestaurants.filter(r => r.isOpen);
        }

        if (filters.takesCards) {
          filteredRestaurants = filteredRestaurants.filter(r => r.takesCards);
        }

        if (filters.googleRating) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.googleRating >= parseFloat(filters.googleRating)
          );
        }

        if (filters.zomatoRating) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.zomatoRating >= parseFloat(filters.zomatoRating)
          );
        }
      }

      resolve(filteredRestaurants);
    }, 500);
  });
};

export const getRestaurant = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const restaurant = restaurants.find(r => r.id === parseInt(id));
      resolve(restaurant);
    }, 500);
  });
};

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'test@test.com' && password === 'password') {
        resolve({ success: true, user: { name: 'Test User', email: 'test@test.com' } });
      } else {
        reject({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

export const signup = (name, email, password) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: { name, email } });
    }, 500);
  });
};