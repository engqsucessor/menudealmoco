import { mockBackend } from './mockBackend';

export const getRestaurants = (filters = {}) => {
  return Promise.resolve(mockBackend.getRestaurants(filters));
};

export const getRestaurant = (id) => {
  return Promise.resolve(mockBackend.getRestaurant(id));
};