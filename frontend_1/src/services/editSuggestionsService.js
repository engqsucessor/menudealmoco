// editSuggestionsService.js - API-based edit suggestions system

import { apiService } from './api';

// Submit an edit suggestion
export const submitEditSuggestion = async (restaurantId, userEmail, edits, reason = '') => {
  try {
    const response = await apiService.request(`/restaurants/${restaurantId}/edit-suggestions`, {
      method: 'POST',
      headers: {
        'X-User-Email': userEmail
      },
      body: JSON.stringify({
        changes: edits,
        reason: reason
      })
    });

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
    const params = new URLSearchParams();
    if (status !== 'all') {
      params.append('status', status);
    }

    const headers = userEmail ? { 'X-User-Email': userEmail } : {};
    const endpoint = `/restaurants/${restaurantId}/edit-suggestions${params.toString() ? '?' + params.toString() : ''}`;

    const response = await apiService.request(endpoint, { headers });
    return response;
  } catch (error) {
    console.error('Error getting edit suggestions:', error);
    return [];
  }
};

// Vote on an edit suggestion
export const voteOnEditSuggestion = async (suggestionId, userEmail, voteType) => {
  try {
    const response = await apiService.request(`/edit-suggestions/${suggestionId}/vote`, {
      method: 'POST',
      headers: {
        'X-User-Email': userEmail
      },
      body: JSON.stringify({
        vote_type: voteType
      })
    });

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
    const response = await apiService.request(`/edit-suggestions/${suggestionId}/approve`, {
      method: 'POST',
      headers: {
        'X-User-Email': reviewerEmail
      }
    });

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
    const response = await apiService.request(`/edit-suggestions/${suggestionId}/reject`, {
      method: 'POST',
      headers: {
        'X-User-Email': reviewerEmail
      },
      body: JSON.stringify({
        reason: reason
      })
    });

    return {
      success: true,
      suggestion: response
    };
  } catch (error) {
    console.error('Error rejecting edit suggestion:', error);
    return { success: false, error: error.message };
  }
};