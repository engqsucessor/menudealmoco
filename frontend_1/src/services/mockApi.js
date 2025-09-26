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
    reviews: [],
    menuReviews: [
      { id: 2, author: 'Mary Poppins', rating: 4, comment: 'Good value for the price.' }
    ]
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

        if (filters.cuisine) {
          filteredRestaurants = filteredRestaurants.filter(r => 
            r.foodType === filters.cuisine
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
