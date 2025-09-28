// editSuggestionsService.js - Wikipedia-style edit suggestions system

import { getUserDisplayName } from './usernameService';

const EDIT_SUGGESTIONS_KEY = 'editSuggestions';
const APPROVED_EDITS_KEY = 'approvedEdits';

// Helper functions
const getFromDB = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (error) {
    console.error('Error reading from edit suggestions DB:', error);
    return [];
  }
};

const saveToDB = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to edit suggestions DB:', error);
    return false;
  }
};

const generateId = () => {
  return `edit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Submit an edit suggestion
export const submitEditSuggestion = (restaurantId, userEmail, edits, reason = '') => {
  try {
    const suggestions = getFromDB(EDIT_SUGGESTIONS_KEY);
    const displayName = getUserDisplayName(userEmail);
    
    const newSuggestion = {
      id: generateId(),
      restaurantId: restaurantId.toString(),
      userEmail,
      displayName,
      edits, // Object containing the proposed changes
      reason,
      status: 'pending', // 'pending', 'approved', 'rejected'
      createdAt: new Date().toISOString(),
      votes: {
        upvotes: 0,
        downvotes: 0,
        upvotedBy: [],
        downvotedBy: []
      }
    };
    
    suggestions.push(newSuggestion);
    saveToDB(EDIT_SUGGESTIONS_KEY, suggestions);
    
    return {
      success: true,
      suggestion: newSuggestion
    };
  } catch (error) {
    console.error('Error submitting edit suggestion:', error);
    return { success: false, error: error.message };
  }
};

// Get all edit suggestions for a restaurant
export const getEditSuggestions = (restaurantId, status = 'all') => {
  try {
    const suggestions = getFromDB(EDIT_SUGGESTIONS_KEY);
    
    let filtered = suggestions.filter(s => s.restaurantId === restaurantId.toString());
    
    if (status !== 'all') {
      filtered = filtered.filter(s => s.status === status);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting edit suggestions:', error);
    return [];
  }
};

// Vote on an edit suggestion
export const voteOnEditSuggestion = (suggestionId, userEmail, voteType) => {
  try {
    const suggestions = getFromDB(EDIT_SUGGESTIONS_KEY);
    const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
    
    if (suggestionIndex === -1) {
      return { success: false, message: 'Suggestion not found' };
    }
    
    const suggestion = suggestions[suggestionIndex];
    
    // Remove existing votes from this user
    suggestion.votes.upvotedBy = suggestion.votes.upvotedBy.filter(email => email !== userEmail);
    suggestion.votes.downvotedBy = suggestion.votes.downvotedBy.filter(email => email !== userEmail);
    
    // Add new vote
    if (voteType === 'upvote') {
      suggestion.votes.upvotedBy.push(userEmail);
    } else if (voteType === 'downvote') {
      suggestion.votes.downvotedBy.push(userEmail);
    }
    
    // Update vote counts
    suggestion.votes.upvotes = suggestion.votes.upvotedBy.length;
    suggestion.votes.downvotes = suggestion.votes.downvotedBy.length;
    
    saveToDB(EDIT_SUGGESTIONS_KEY, suggestions);
    
    return {
      success: true,
      suggestion
    };
  } catch (error) {
    console.error('Error voting on edit suggestion:', error);
    return { success: false, error: error.message };
  }
};

// Approve an edit suggestion (for admins/reviewers)
export const approveEditSuggestion = (suggestionId, reviewerEmail) => {
  try {
    const suggestions = getFromDB(EDIT_SUGGESTIONS_KEY);
    const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
    
    if (suggestionIndex === -1) {
      return { success: false, message: 'Suggestion not found' };
    }
    
    const suggestion = suggestions[suggestionIndex];
    suggestion.status = 'approved';
    suggestion.approvedBy = reviewerEmail;
    suggestion.approvedAt = new Date().toISOString();
    
    // Save the approved edit
    const approvedEdits = getFromDB(APPROVED_EDITS_KEY);
    approvedEdits.push({
      ...suggestion,
      appliedAt: new Date().toISOString()
    });
    
    saveToDB(EDIT_SUGGESTIONS_KEY, suggestions);
    saveToDB(APPROVED_EDITS_KEY, approvedEdits);
    
    return {
      success: true,
      suggestion
    };
  } catch (error) {
    console.error('Error approving edit suggestion:', error);
    return { success: false, error: error.message };
  }
};

// Reject an edit suggestion
export const rejectEditSuggestion = (suggestionId, reviewerEmail, reason = '') => {
  try {
    const suggestions = getFromDB(EDIT_SUGGESTIONS_KEY);
    const suggestionIndex = suggestions.findIndex(s => s.id === suggestionId);
    
    if (suggestionIndex === -1) {
      return { success: false, message: 'Suggestion not found' };
    }
    
    const suggestion = suggestions[suggestionIndex];
    suggestion.status = 'rejected';
    suggestion.rejectedBy = reviewerEmail;
    suggestion.rejectedAt = new Date().toISOString();
    suggestion.rejectionReason = reason;
    
    saveToDB(EDIT_SUGGESTIONS_KEY, suggestions);
    
    return {
      success: true,
      suggestion
    };
  } catch (error) {
    console.error('Error rejecting edit suggestion:', error);
    return { success: false, error: error.message };
  }
};

// Get approved edits for a restaurant (to apply them)
export const getApprovedEdits = (restaurantId) => {
  try {
    const approvedEdits = getFromDB(APPROVED_EDITS_KEY);
    return approvedEdits
      .filter(edit => edit.restaurantId === restaurantId.toString())
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  } catch (error) {
    console.error('Error getting approved edits:', error);
    return [];
  }
};

// Get edit suggestions for moderation (for admin dashboard)
export const getAllPendingEditSuggestions = () => {
  try {
    const suggestions = getFromDB(EDIT_SUGGESTIONS_KEY);
    return suggestions
      .filter(s => s.status === 'pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error getting pending edit suggestions:', error);
    return [];
  }
};

// Apply approved edits to restaurant data (this would modify the restaurant data)
export const applyApprovedEdits = (restaurantData, restaurantId) => {
  try {
    const approvedEdits = getApprovedEdits(restaurantId);
    let updatedData = { ...restaurantData };
    
    // Apply edits in chronological order
    approvedEdits.reverse().forEach(edit => {
      Object.keys(edit.edits).forEach(field => {
        if (edit.edits[field] !== null && edit.edits[field] !== undefined) {
          updatedData[field] = edit.edits[field];
        }
      });
    });
    
    return updatedData;
  } catch (error) {
    console.error('Error applying approved edits:', error);
    return restaurantData;
  }
};

// Clear all edit suggestions (for development/testing)
export const clearEditSuggestions = () => {
  localStorage.removeItem(EDIT_SUGGESTIONS_KEY);
  localStorage.removeItem(APPROVED_EDITS_KEY);
  console.log('Edit suggestions database cleared');
};