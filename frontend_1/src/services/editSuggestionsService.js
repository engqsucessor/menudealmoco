// editSuggestionsService.js - API-based edit suggestions system

import { editSuggestionsApi } from './axiosApi';

// Submit an edit suggestion
export const submitEditSuggestion = async (restaurantId, userEmail, edits, reason = '') => {
  try {
    const response = await editSuggestionsApi.submit(restaurantId, edits, reason);
    return {
      success: true,
      suggestion: response
    };
  } catch (error) {
    console.error('Error submitting edit suggestion:', error);
    return { success: false, error: error.message };
  }
};

// Get all edit suggestions for a restaurant
export const getEditSuggestions = async (restaurantId, status = 'all', userEmail = null) => {
  try {
    return await editSuggestionsApi.getForRestaurant(restaurantId, status);
  } catch (error) {
    console.error('Error getting edit suggestions:', error);
    return [];
  }
};

// Vote on an edit suggestion
export const voteOnEditSuggestion = async (suggestionId, userEmail, voteType) => {
  try {
    const response = await editSuggestionsApi.vote(suggestionId, voteType);
    return {
      success: true,
      suggestion: response
    };
  } catch (error) {
    console.error('Error voting on edit suggestion:', error);
    return { success: false, error: error.message };
  }
};

// Approve an edit suggestion (for admins/reviewers)
export const approveEditSuggestion = async (suggestionId, reviewerEmail) => {
  try {
    const response = await editSuggestionsApi.approve(suggestionId);
    return {
      success: true,
      suggestion: response
    };
  } catch (error) {
    console.error('Error approving edit suggestion:', error);
    return { success: false, error: error.message };
  }
};

// Reject an edit suggestion
export const rejectEditSuggestion = async (suggestionId, reviewerEmail, reason = '') => {
  try {
    const response = await editSuggestionsApi.reject(suggestionId, reason);
    return {
      success: true,
      suggestion: response
    };
  } catch (error) {
    console.error('Error rejecting edit suggestion:', error);
    return { success: false, error: error.message };
  }
};