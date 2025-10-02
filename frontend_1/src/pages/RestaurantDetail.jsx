import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './RestaurantDetail.module.css';
import { restaurantsApi, reviewsApi, reportsApi, favoritesApi } from '../services/axiosApi';
import { favoriteRestaurants, restaurantVotes } from '../services/localStorage';
import { useAuth } from '../contexts/AuthContext';
import MenuRating from '../components/ui/MenuRating';
import EditButton from '../components/ui/EditButton';
import AddRestaurant from './AddRestaurant';
import PhotoGallery from '../components/ui/PhotoGallery';
import Notification from '../components/ui/Notification';
import { useNotification } from '../hooks/useNotification';
import { getEditSuggestions, voteOnEditSuggestion } from '../services/editSuggestionsService';
import { sortReviews } from '../utils/reviewSorting';
import ReviewCard from '../components/ui/ReviewCard';
import ReportModal from '../components/ui/ReportModal';
import DeleteConfirmationModal from '../components/ui/DeleteConfirmationModal';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { notification, showNotification, hideNotification } = useNotification();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuReviewsData, setMenuReviewsData] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'upvotes', 'rating', 'lowestRating', 'controversial'
  const [isFavorite, setIsFavorite] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSuggestions, setEditSuggestions] = useState([]);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportingReviewId, setReportingReviewId] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [pendingVotes, setPendingVotes] = useState(new Map()); // Track pending vote operations
  const [voteTimeouts, setVoteTimeouts] = useState(new Map()); // Track debounce timeouts
  const [localVotes, setLocalVotes] = useState(new Map()); // Track votes locally for offline experience
  const [userVoteHistory, setUserVoteHistory] = useState(new Map()); // Track user's voting history
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    restaurantsApi.getById(id).then(data => {
      setRestaurant(data);
      setLoading(false);
    });
    
    // Load menu reviews
    loadMenuReviews();

    // Load edit suggestions
    loadEditSuggestions();

    // Check if restaurant is favorited (only if user is logged in)
    if (user) {
      const favoriteIds = favoriteRestaurants.get();
      setIsFavorite(favoriteIds.includes(id));
      
      // Load user's vote history for this restaurant
      loadUserVoteHistory();
    } else {
      setIsFavorite(false);
    }

    // Load any pending local votes
    loadLocalVotes();
  }, [id, user]);

  // Cleanup timeouts on unmount and add visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // When tab becomes visible again, sync any pending votes
        syncPendingVotes();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      voteTimeouts.forEach(timeout => clearTimeout(timeout));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  const syncPendingVotes = async () => {
    const localVotesStorage = restaurantVotes.getLocalVotes(id);

    // If there are local votes to sync, refresh the reviews
    if (Object.keys(localVotesStorage).length > 0) {
      try {
        await loadMenuReviews();
        // Clear local votes after successful sync
        restaurantVotes.clearLocalVotes(id);
        setLocalVotes(new Map());
      } catch (error) {
        console.error('Error syncing pending votes:', error);
      }
    }
  };

  const loadMenuReviews = async () => {
    try {
      // Use reviewsApi to get menu reviews
      const reviews = await reviewsApi.getForRestaurant(id);
      setMenuReviewsData(reviews);
    } catch (error) {
      console.error('Error loading menu reviews:', error);
      // Fallback to empty array if API fails
      setMenuReviewsData([]);
    }
  };

  const loadUserVoteHistory = () => {
    if (!user) return;

    try {
      const savedVotes = restaurantVotes.getUserVoteHistory(user.email, id);
      setUserVoteHistory(new Map(Object.entries(savedVotes)));
    } catch (error) {
      console.error('Error loading user vote history:', error);
    }
  };

  const saveUserVoteHistory = (reviewId, voteType) => {
    if (!user) return;

    try {
      restaurantVotes.updateUserVote(user.email, id, reviewId, voteType);
      const updatedVotes = restaurantVotes.getUserVoteHistory(user.email, id);
      setUserVoteHistory(new Map(Object.entries(updatedVotes)));
    } catch (error) {
      console.error('Error saving user vote history:', error);
    }
  };

  const loadLocalVotes = () => {
    try {
      const savedVotes = restaurantVotes.getLocalVotes(id);
      setLocalVotes(new Map(Object.entries(savedVotes)));
    } catch (error) {
      console.error('Error loading local votes:', error);
    }
  };

  const saveLocalVotes = (reviewId, upvoteDelta, downvoteDelta) => {
    try {
      restaurantVotes.updateLocalVote(id, reviewId, upvoteDelta, downvoteDelta);
      const updatedVotes = restaurantVotes.getLocalVotes(id);
      setLocalVotes(new Map(Object.entries(updatedVotes)));
    } catch (error) {
      console.error('Error saving local votes:', error);
    }
  };

  const loadEditSuggestions = async () => {
    try {
      const suggestions = await getEditSuggestions(id, 'pending', user?.email);
      setEditSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading edit suggestions:', error);
    }
  };

  const getSortedReviews = () => {
    // Apply local votes to review data before sorting
    const reviewsWithLocalVotes = menuReviewsData.map(review => {
      const localVote = localVotes.get(review.id);
      if (localVote) {
        return {
          ...review,
          upvotes: (review.upvotes || 0) + localVote.upvotes,
          downvotes: (review.downvotes || 0) + localVote.downvotes
        };
      }
      return review;
    });

    return sortReviews(reviewsWithLocalVotes, sortBy);
  };

  const handleFavoriteToggle = async () => {
    if (!user) return;

    try {
      // Toggle on backend
      await favoritesApi.toggle(id, isFavorite);

      // Update local state
      const newFavoriteStatus = !isFavorite;
      setIsFavorite(newFavoriteStatus);

      // Also update localStorage for offline support
      favoriteRestaurants.toggle(id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification('Failed to update favorite. Please try again.', 'error');
    }
  };

  const handleRatingSubmitted = (newAverageRating) => {
    // Refresh menu reviews data
    loadMenuReviews();
  };

  const handleEditSuggestionSubmitted = () => {
    // Refresh edit suggestions
    loadEditSuggestions();
  };

  const handleVote = async (reviewId, voteType) => {
    if (!user) return;

    try {
      const result = await reviewsApi.vote(reviewId, voteType);
      if (result) {
        setMenuReviewsData(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId ? {
              ...review,
              upvotes: result.upvotes || 0,
              downvotes: result.downvotes || 0,
              userVotes: result.userVotes || {}
            } : review
          )
        );

        // Update local vote history for offline fallback
        saveUserVoteHistory(reviewId, result.userVotes?.currentUserVote);
      }
    } catch (error) {
      console.error('Error voting:', error);
      showNotification('Failed to record vote.', 'error');
    }
  };

  const handleUpvote = (reviewId) => handleVote(reviewId, 'up');
  const handleDownvote = (reviewId) => handleVote(reviewId, 'down');

  const handleReportReview = async (reviewId) => {
    if (!user) {
      showNotification('Please login to report reviews.', 'error');
      return;
    }

    setReportingReviewId(reviewId);
    setShowReportModal(true);
  };

  const submitReport = async () => {
    if (!reportReason.trim()) {
      return;
    }

    try {
      const result = await reportsApi.reportReview(reportingReviewId, id, reportReason.trim());
      if (result) {
        showNotification('Review reported successfully. Thank you for helping keep our community safe.', 'success');
        setShowReportModal(false);
        setReportReason('');
        setReportingReviewId(null);
      }
    } catch (error) {
      if (error.message === 'You have already reported this review') {
        showNotification('You have already reported this review.', 'error');
      } else {
        console.error('Error reporting review:', error);
        showNotification('Failed to report review. Please try again.', 'error');
      }
      setShowReportModal(false);
      setReportReason('');
      setReportingReviewId(null);
    }
  };

  const cancelReport = () => {
    setShowReportModal(false);
    setReportReason('');
    setReportingReviewId(null);
  };

  const handleVoteOnSuggestion = async (suggestionId, voteType) => {
    if (!user) return;

    try {
      const result = await voteOnEditSuggestion(suggestionId, user.email, voteType);

      if (result.success) {
        loadEditSuggestions(); // Refresh suggestions to show updated votes
      }
    } catch (error) {
      console.error('Error voting on suggestion:', error);
    }
  };

  const handleEditFormSubmit = async (formData) => {
    try {
      // Import the service function
      const { submitEditSuggestion } = await import('../services/editSuggestionsService');

      // CLEAR AND SIMPLE CHANGE DETECTION
      const changes = {};

      // Add a change with before/after values
      const addChange = (field, oldValue, newValue) => {
        changes[field] = { from: oldValue, to: newValue };
      };

      // Get current restaurant values (what's in database)
      const current = {
        name: restaurant.name,
        address: restaurant.address,
        district: restaurant.district,
        city: restaurant.city,
        menuPrice: restaurant.menuPrice,
        priceRange: restaurant.priceRange,
        foodType: restaurant.foodType,
        googleRating: restaurant.googleRating,
        googleReviews: restaurant.googleReviews,
        description: restaurant.description,
        numberOfDishes: restaurant.dishes?.length || 0,
        dishes: restaurant.dishes || [],
        whatsIncluded: restaurant.whatsIncluded || [],
        cardsAccepted: restaurant.practical?.cardsAccepted || false,
        quickService: restaurant.practical?.quickService || false,
        groupFriendly: restaurant.practical?.groupFriendly || false,
        parking: restaurant.practical?.parking || false
      };

      // Get form values (what user submitted)
      const form = {
        name: formData.name,
        address: formData.address,
        district: formData.district,
        city: formData.city,
        menuPrice: parseFloat(formData.menuPrice),
        priceRange: formData.priceRange,
        foodType: formData.foodType,
        googleRating: formData.googleRating ? parseFloat(formData.googleRating) : null,
        googleReviews: formData.googleReviews ? parseInt(formData.googleReviews) : null,
        description: formData.description,
        numberOfDishes: parseInt(formData.numberOfDishes) || 0,
        dishes: formData.dishes?.filter(dish => dish.trim()) || [],
        whatsIncluded: Object.keys(formData.included || {}).filter(key => formData.included[key]).sort(),
        cardsAccepted: formData.practical?.takesCards || false,
        quickService: formData.practical?.quickService || false,
        groupFriendly: formData.practical?.groupFriendly || false,
        parking: formData.practical?.hasParking || false
      };

      // Compare every field and log what we're comparing
      console.log('=== CHANGE DETECTION DEBUG ===');
      console.log('Current restaurant data:', current);
      console.log('Form data:', form);

      // Add ALL missing fields to form values
      form.priceRange = formData.priceRange;
      form.distance = formData.distance;
      form.restaurantPhotos = formData.restaurantPhotos || [];
      form.menuPhotos = formData.menuPhotos || [];

      // Add ALL missing fields to current values
      current.priceRange = restaurant.priceRange || '';
      current.distance = restaurant.distance || '';
      current.restaurantPhotos = restaurant.restaurantPhotos || [];
      current.menuPhotos = restaurant.menuPhotos || [];

      // Check ALL fields that exist in the form
      const fieldsToCheck = [
        'name', 'address', 'district', 'city', 'menuPrice', 'priceRange', 'distance',
        'foodType', 'googleRating', 'googleReviews', 'description', 'numberOfDishes',
        'cardsAccepted', 'quickService', 'groupFriendly', 'parking'
      ];

      fieldsToCheck.forEach(field => {
        if (current[field] !== form[field]) {
          console.log(`CHANGE DETECTED in ${field}: ${current[field]} → ${form[field]}`);
          addChange(field, current[field], form[field]);
        }
      });

      // Check arrays separately
      const currentIncluded = current.whatsIncluded.slice().sort();
      const formIncluded = form.whatsIncluded.slice().sort();

      if (JSON.stringify(currentIncluded) !== JSON.stringify(formIncluded)) {
        console.log(`CHANGE DETECTED in whatsIncluded: ${currentIncluded} → ${formIncluded}`);
        addChange('whatsIncluded', currentIncluded, formIncluded);
      }

      const currentDishes = current.dishes.slice().sort();
      const formDishes = form.dishes.slice().sort();

      if (JSON.stringify(currentDishes) !== JSON.stringify(formDishes)) {
        console.log(`CHANGE DETECTED in dishes: ${currentDishes} → ${formDishes}`);
        addChange('dishes', currentDishes, formDishes);
      }

      // Check photo arrays
      if (JSON.stringify(current.restaurantPhotos) !== JSON.stringify(form.restaurantPhotos)) {
        console.log(`CHANGE DETECTED in restaurantPhotos: ${current.restaurantPhotos.length} → ${form.restaurantPhotos.length}`);
        addChange('restaurantPhotos', current.restaurantPhotos, form.restaurantPhotos);
      }

      if (JSON.stringify(current.menuPhotos) !== JSON.stringify(form.menuPhotos)) {
        console.log(`CHANGE DETECTED in menuPhotos: ${current.menuPhotos.length} → ${form.menuPhotos.length}`);
        addChange('menuPhotos', current.menuPhotos, form.menuPhotos);
      }

      // Check if there are actually any changes
      if (Object.keys(changes).length === 0) {
        // Show notification that no changes were detected
        showNotification('No changes detected - suggestion not submitted', 'info', 3000);
        setShowEditModal(false);
        return;
      }

      console.log('Final changes detected:', changes);

      const result = await submitEditSuggestion(
        id,
        user?.email || 'anonymous',
        changes,
        formData.reason
      );
      
      if (result.success) {
        setShowEditModal(false);
        loadEditSuggestions(); // Refresh suggestions

        // Show success notification
        showNotification('Edit suggestion submitted successfully! 🎉', 'success', 4000);
      }
    } catch (error) {
      console.error('Error submitting edit suggestion:', error);
    }
  };

  const toggleReviewExpansion = (reviewId) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId);
    } else {
      newExpanded.add(reviewId);
    }
    setExpandedReviews(newExpanded);
  };

  const handleDeleteRestaurant = async () => {
    if (!user || !user.isReviewer) {
      showNotification('Only reviewers can delete restaurants.', 'error');
      return;
    }

    try {
      const result = await restaurantsApi.delete(id);
      if (result) {
        showNotification('Restaurant deleted successfully.', 'success');
        setShowDeleteModal(false);
        // Redirect to home page after deletion
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      showNotification('Failed to delete restaurant. Please try again.', 'error');
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const { name, city, district, menuPrice, whatsIncluded, photo, reviews, foodType, googleRating, googleReviews, menuReviews, menuPhoto, description } = restaurant;

  // Calculate Menu de Almoço average rating
  const calculateMenuRating = () => {
    if (!menuReviewsData || menuReviewsData.length === 0) {
      return { average: null, count: 0 };
    }

    const totalRating = menuReviewsData.reduce((sum, review) => sum + review.rating, 0);
    const average = totalRating / menuReviewsData.length;

    return {
      average: Math.round(average * 10) / 10, // Round to 1 decimal place
      count: menuReviewsData.length
    };
  };

  const menuRating = calculateMenuRating();
  const location = `${district}, ${city}`;

  return (
    <div className={styles.detailPage}>
      <header className={styles.header}>
        <div className={styles.imageContainer}>
          {photo ? (
            <img src={photo} alt={name} className={styles.image} />
          ) : (
            <div className={styles.placeholderImage}>
              <span>No image available</span>
            </div>
          )}
        </div>
        <div className={styles.info}>
          <div className={styles.titleSection}>
            <h1>{name}</h1>
            <div className={styles.actionButtons}>
              <EditButton
                onClick={() => setShowEditModal(true)}
                title="Suggest edit to restaurant information"
              />
              {user && (
                <button
                  className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
                  onClick={handleFavoriteToggle}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              )}
              {user && user.isReviewer && (
                <button
                  className={styles.deleteButton}
                  onClick={() => setShowDeleteModal(true)}
                  title="Delete restaurant (Admin only)"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
          <p>{location}</p>
          <p className={styles.price}>€{menuPrice.toFixed(2)}</p>
          <div className={styles.included}>
            <strong>Included:</strong> {whatsIncluded && whatsIncluded.join(' + ')}
          </div>
          <p><strong>Cuisine:</strong> {foodType}</p>
          {restaurant.hours && (
            <p><strong>Lunch Hours:</strong> {restaurant.hours}</p>
          )}
          <div className={styles.externalReviews}>
            {menuRating.average && (
              <div className={styles.externalReview}>
                <strong>Menu de Almoço:</strong> {menuRating.average}/5 ({menuRating.count} review{menuRating.count !== 1 ? 's' : ''})
              </div>
            )}
            {googleRating && <div className={styles.externalReview}><strong>Google:</strong> {googleRating}/5 ({googleReviews} reviews)</div>}
          </div>

          {/* Practical Information Section */}
          {restaurant.practical && (
            <div className={styles.practicalInfo}>
              <div className={styles.practicalItems}>
                {restaurant.practical.cardsAccepted && (
                  <span className={styles.practicalItem}>💳 Cards Accepted</span>
                )}
                {restaurant.practical.quickService && (
                  <span className={styles.practicalItem}>⚡ Quick Service</span>
                )}
                {restaurant.practical.groupFriendly && (
                  <span className={styles.practicalItem}>👥 Group Friendly</span>
                )}
                {restaurant.practical.parking && (
                  <span className={styles.practicalItem}>🅿️ Parking Available</span>
                )}
              </div>
            </div>
          )}

          {/* Daily Dishes Section */}
          {restaurant.dishes && restaurant.dishes.length > 0 && (
            <div className={styles.dishes}>
              <strong>Daily Dishes ({restaurant.dishes.length} available):</strong>
              <ul className={styles.dishesList}>
                {restaurant.dishes.map((dish, index) => {
                  // Clean up dish name by removing the specific contentReference markup
                  let cleanDish = dish;
                  if (dish.includes(':contentReference[oaicite:')) {
                    cleanDish = dish.split(':contentReference[oaicite:')[0].trim();
                  }
                  return (
                    <li key={index} className={styles.dishItem}>{cleanDish}</li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'overview' ? styles.active : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'photos' ? styles.active : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          Photos
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'reviews' ? styles.active : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div>
            <h2>About {name}</h2>
            {description ? (
              <p>{description}</p>
            ) : (
              <p>No additional description provided for this restaurant.</p>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <PhotoGallery restaurant={restaurant} />
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div>
              <div className={styles.reviewsPageHeader}>
                <h2>Menu de Almoço Reviews</h2>
                {user && (
                  <button
                    className={styles.addReviewButton}
                    onClick={() => setShowAddReview(!showAddReview)}
                  >
                    {showAddReview ? '✕ Cancel' : '✏️ Write a Review'}
                  </button>
                )}
              </div>

              {/* Show pending votes notification */}
              {localVotes.size > 0 && (
                <div className={`${styles.notification} ${styles.warning} ${styles.persistentNotification}`}>
                  <div className={styles.notificationContent}>
                    <span>You have {localVotes.size} pending vote{localVotes.size > 1 ? 's' : ''} that will sync when online.</span>
                    <button 
                      className={styles.syncButton}
                      onClick={syncPendingVotes}
                      title="Try to sync now"
                    >
                      🔄
                    </button>
                  </div>
                </div>
              )}

              {/* Add Review Section - Now at the top and collapsible */}
              {showAddReview && (
                <div className={styles.addReviewSection}>
                  <h3>Write a Review</h3>
                  <MenuRating
                    restaurantId={id}
                    restaurantName={name}
                    onRatingSubmitted={(newRating) => {
                      handleRatingSubmitted(newRating);
                      setShowAddReview(false); // Close form after submission
                    }}
                  />
                </div>
              )}

              {/* Display existing reviews */}
              {menuReviewsData.length > 0 ? (
                <div className={styles.menuRatingStats}>
                  <div className={styles.reviewsHeader}>
                    <h3>Reviews ({menuReviewsData.length})</h3>

                    <div className={styles.sortControls}>
                      <label className={styles.sortLabel}>Sort by:</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={styles.sortSelect}
                      >
                        <option value="recent">Most Recent</option>
                        <option value="upvotes">Best (Upvotes)</option>
                        <option value="rating">Highest Rating</option>
                        <option value="lowestRating">Lowest Rating</option>
                        <option value="controversial">Controversial</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.menuReviewsList}>
                    {getSortedReviews().map(review => {
                      const localVote = localVotes.get(review.id) || { upvotes: 0, downvotes: 0 };
                      // Use server-provided vote status if available, fallback to local storage
                      const userVote = review.userVotes?.currentUserVote || userVoteHistory.get(review.id);
                      const isPending = pendingVotes.get(review.id);

                      return (
                        <ReviewCard
                          key={review.id}
                          review={review}
                          user={user}
                          onUpvote={handleUpvote}
                          onDownvote={handleDownvote}
                          onReport={handleReportReview}
                          onToggleExpand={toggleReviewExpansion}
                          isExpanded={expandedReviews.has(review.id)}
                          userVote={userVote}
                          isPending={isPending}
                          localVotes={localVote}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={styles.noReviewsMessage}>
                  <p>No menu reviews yet. Be the first to rate this lunch menu!</p>
                  {!user && (
                    <p><strong>Login to write the first review!</strong></p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Suggestion Modal */}
      {showEditModal && (
        <AddRestaurant
          restaurant={restaurant}
          isEditMode={true}
          isModal={true}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditFormSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={handleDeleteRestaurant}
        restaurantName={name}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={cancelReport}
        onSubmit={submitReport}
        reportReason={reportReason}
        setReportReason={setReportReason}
      />

      {/* Notification */}
      {/* Notification Component */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
      />
    </div>
  );
};

export default RestaurantDetail;
