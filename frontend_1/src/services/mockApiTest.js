// Test file to verify server is working
console.log('Test mockApi loaded successfully!');

export const test = () => {
  console.log('MockAPI test function called');
  return 'Working!';
};

export const getRestaurants = () => {
  console.log('getRestaurants called');
  return Promise.resolve([{
    id: "1",
    name: "Test Restaurant", 
    menuRating: 4.5
  }]);
};

export const getRestaurant = (id) => {
  console.log('getRestaurant called with id:', id);
  return Promise.resolve({
    id: "1",
    name: "Test Restaurant", 
    menuRating: 4.5
  });
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