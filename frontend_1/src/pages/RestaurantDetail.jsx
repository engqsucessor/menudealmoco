import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './RestaurantDetail.module.css';
import { getRestaurant } from '../services/mockApi';
import { mockBackend } from '../services/mockBackend';
import { favoriteRestaurants } from '../services/localStorage';
import { useAuth } from '../contexts/AuthContext';
import MenuRating from '../components/ui/MenuRating';
import EditButton from '../components/ui/EditButton';
import AddRestaurant from './AddRestaurant';
import { getRestaurantMenuReviews, upvoteMenuReview, downvoteMenuReview } from '../services/menuRatingService';
import { getEditSuggestions, voteOnEditSuggestion } from '../services/editSuggestionsService';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
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
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [expandedReviews, setExpandedReviews] = useState(new Set());

  useEffect(() => {
    getRestaurant(id).then(data => {
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
    } else {
      setIsFavorite(false);
    }
  }, [id, user]);

  const loadMenuReviews = async () => {
    try {
      // Use mockBackend directly to get menu reviews
      const reviews = mockBackend.getMenuReviews(id);
      setMenuReviewsData(reviews);
    } catch (error) {
      console.error('Error loading menu reviews:', error);
    }
  };

  const loadEditSuggestions = async () => {
    try {
      const suggestions = getEditSuggestions(id, 'pending');
      setEditSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading edit suggestions:', error);
    }
  };

  const sortReviews = (reviews, sortType) => {
    const sortedReviews = [...reviews];
    
    switch (sortType) {
      case 'recent':
        return sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      case 'upvotes':
        return sortedReviews.sort((a, b) => {
          const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
          const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
          return scoreB - scoreA; // Highest score first
        });
      
      case 'rating':
        return sortedReviews.sort((a, b) => {
          if (b.rating !== a.rating) {
            return b.rating - a.rating; // Highest rating first
          }
          // If ratings are equal, sort by upvotes as tiebreaker
          const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
          const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
          return scoreB - scoreA;
        });
      
      case 'lowestRating':
        return sortedReviews.sort((a, b) => {
          if (a.rating !== b.rating) {
            return a.rating - b.rating; // Lowest rating first
          }
          // If ratings are equal, sort by downvotes (most downvoted first)
          const scoreA = (a.downvotes || 0) - (a.upvotes || 0);
          const scoreB = (b.downvotes || 0) - (b.upvotes || 0);
          return scoreB - scoreA;
        });
      
      case 'controversial':
        return sortedReviews.sort((a, b) => {
          // Controversial = high engagement (lots of both up and down votes)
          const engagementA = (a.upvotes || 0) + (a.downvotes || 0);
          const engagementB = (b.upvotes || 0) + (b.downvotes || 0);
          
          if (engagementB !== engagementA) {
            return engagementB - engagementA;
          }
          
          // Secondary sort: closer to 50/50 split = more controversial
          const ratioA = Math.abs(0.5 - ((a.upvotes || 0) / Math.max(1, engagementA)));
          const ratioB = Math.abs(0.5 - ((b.upvotes || 0) / Math.max(1, engagementB)));
          return ratioA - ratioB;
        });
      
      default:
        return sortedReviews;
    }
  };

  const getSortedReviews = () => {
    return sortReviews(menuReviewsData, sortBy);
  };

  const handleFavoriteToggle = () => {
    if (!user) return;

    // Toggle using the favoriteRestaurants service
    const newFavoriteStatus = favoriteRestaurants.toggle(id);
    setIsFavorite(newFavoriteStatus);
  };

  const handleRatingSubmitted = (newAverageRating) => {
    // Refresh menu reviews data
    loadMenuReviews();
  };

  const handleEditSuggestionSubmitted = () => {
    // Refresh edit suggestions
    loadEditSuggestions();
  };

  const handleUpvote = async (reviewId) => {
    if (!user) return;

    try {
      const result = mockBackend.voteOnReview(reviewId, id, user.email, 'up');
      if (result) {
        loadMenuReviews(); // Refresh reviews to show updated votes
      }
    } catch (error) {
      console.error('Error upvoting review:', error);
    }
  };

  const handleDownvote = async (reviewId) => {
    if (!user) return;

    try {
      const result = mockBackend.voteOnReview(reviewId, id, user.email, 'down');
      if (result) {
        loadMenuReviews(); // Refresh reviews to show updated votes
      }
    } catch (error) {
      console.error('Error downvoting review:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

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
      const result = mockBackend.reportReview(reportingReviewId, id, user.email, reportReason.trim());
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
      const result = await voteOnEditSuggestion(suggestionId, user.displayName || user.email, voteType);
      
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
      
      // Transform form data into changes object
      const changes = {};
      
      // Check each field for changes
      if (formData.name !== restaurant.name) changes.name = formData.name;
      if (parseFloat(formData.menuPrice) !== restaurant.menuPrice) changes.menuPrice = parseFloat(formData.menuPrice);
      if (formData.foodType !== restaurant.foodType) changes.foodType = formData.foodType;
      if (formData.googleRating !== restaurant.googleRating) changes.googleRating = formData.googleRating;
      if (formData.googleReviews !== restaurant.googleReviews) changes.googleReviews = formData.googleReviews;
      if (formData.description !== restaurant.description) changes.description = formData.description;
      
      // Handle address (combine district and city)
      const currentAddress = `${restaurant.district}, ${restaurant.city}`;
      if (formData.address !== currentAddress) {
        const [district, city] = formData.address.split(',').map(s => s.trim());
        if (district) changes.district = district;
        if (city) changes.city = city;
      }
      
      // Handle included items
      const currentIncluded = restaurant.whatsIncluded || [];
      const newIncluded = Object.entries(formData.included)
        .filter(([key, value]) => value)
        .map(([key]) => key);
      
      if (JSON.stringify(currentIncluded.sort()) !== JSON.stringify(newIncluded.sort())) {
        changes.whatsIncluded = newIncluded;
      }
      
      // Handle practical features
      if (formData.practical.takesCards !== restaurant.practical?.cardsAccepted) {
        changes.practical = { ...changes.practical, cardsAccepted: formData.practical.takesCards };
      }
      if (formData.practical.quickService !== restaurant.practical?.quickService) {
        changes.practical = { ...changes.practical, quickService: formData.practical.quickService };
      }
      if (formData.practical.groupFriendly !== restaurant.practical?.groupFriendly) {
        changes.practical = { ...changes.practical, groupFriendly: formData.practical.groupFriendly };
      }
      if (formData.practical.hasParking !== restaurant.practical?.parking) {
        changes.practical = { ...changes.practical, parking: formData.practical.hasParking };
      }
      
      const result = await submitEditSuggestion(
        id, 
        user.email, 
        changes, 
        formData.reason
      );
      
      if (result.success) {
        setShowEditModal(false);
        loadEditSuggestions(); // Refresh suggestions
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

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const { name, city, district, menuPrice, whatsIncluded, photo, reviews, foodType, googleRating, googleReviews, zomatoRating, zomatoReviews, menuReviews, menuPhoto } = restaurant;

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
            </div>
          </div>
          <p>{location}</p>
          <p className={styles.price}>€{menuPrice.toFixed(2)}</p>
          <div className={styles.included}>
            <strong>Included:</strong> {whatsIncluded && whatsIncluded.join(' + ')}
          </div>
          <p><strong>Cuisine:</strong> {foodType}</p>
          <div className={styles.externalReviews}>
            {googleRating && <div className={styles.externalReview}><strong>Google:</strong> {googleRating}/5 ({googleReviews} reviews)</div>}
            {zomatoRating && <div className={styles.externalReview}><strong>Zomato:</strong> {zomatoRating}/5 ({zomatoReviews} reviews)</div>}
          </div>
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
            <p>More details about the restaurant would go here, such as a description, opening hours, and contact information.</p>
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <h2>Photos</h2>
            
            {/* Restaurant Photo */}
            {photo && (
              <div className={styles.photoSection}>
                <h3 className={styles.photoSectionTitle}>Restaurant</h3>
                <div className={styles.photoContainer}>
                  <img 
                    src={photo} 
                    alt={`${name} - Restaurant`} 
                    className={styles.restaurantPhoto}
                  />
                </div>
              </div>
            )}

            {/* Menu de Almoço Photo */}
            <div className={styles.photoSection}>
              <h3 className={styles.photoSectionTitle}>Menu de Almoço</h3>
              <div className={styles.photoContainer}>
                {menuPhoto ? (
                  <>
                    <img 
                      src={menuPhoto} 
                      alt={`${name} - Menu de Almoço`} 
                      className={styles.menuPhoto}
                    />
                    <p className={styles.menuPhotoCaption}>
                      Current lunch menu with prices - €{menuPrice.toFixed(2)}
                    </p>
                  </>
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>No menu photo available</span>
                  </div>
                )}
              </div>
            </div>
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
                      const netScore = (review.upvotes || 0) - (review.downvotes || 0);
                      const totalVotes = (review.upvotes || 0) + (review.downvotes || 0);
                      
                      // Use the displayName stored in the review (set at review creation time)
                      const displayName = review.displayName || `AnonymousUser${review.id.slice(-3)}`;

                      return (
                        <div key={review.id} className={styles.review}>
                          <div className={styles.reviewMeta}>
                            <strong className={styles.username}>{displayName}</strong>
                            <span className={styles.reviewDate}>
                              • {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                            <span className={styles.rating}>
                              • {review.rating}/5 ★
                            </span>
                          </div>
                          
                          {review.comment && !expandedReviews.has(review.id) && (
                            <div className={styles.reviewCommentSection}>
                              <p className={styles.reviewComment}>
                                {review.comment.length > 200 
                                  ? review.comment.substring(0, 200) + '...'
                                  : review.comment
                                }
                              </p>
                            </div>
                          )}

                          {review.comment && expandedReviews.has(review.id) && (
                            <div className={styles.reviewCommentSection}>
                              <p className={styles.reviewComment}>
                                {review.comment}
                              </p>
                            </div>
                          )}

                          <div className={styles.reviewActions}>
                            <div className={styles.voteButtons}>
                              {user && (
                                <button
                                  className={`${styles.voteButton} ${styles.upvoteButton} ${review.upvotedBy?.includes(user.email) ? styles.voted : ''}`}
                                  onClick={() => handleUpvote(review.id)}
                                  title="Upvote"
                                >
                                  ↑
                                </button>
                              )}
                              <span className={`${styles.scoreDisplay} ${
                                netScore > 0 ? styles.positiveScore :
                                netScore < 0 ? styles.negativeScore :
                                styles.neutralScore
                              }`}>
                                {netScore > 0 ? '+' : ''}{netScore}
                              </span>
                              {user && (
                                <button
                                  className={`${styles.voteButton} ${styles.downvoteButton} ${review.downvotedBy?.includes(user.email) ? styles.voted : ''}`}
                                  onClick={() => handleDownvote(review.id)}
                                  title="Downvote"
                                >
                                  ↓
                                </button>
                              )}
                            </div>

                            <button
                              className={styles.reportButton}
                              onClick={() => handleReportReview(review.id)}
                            >
                              Report
                            </button>

                            {review.comment && review.comment.length > 200 && (
                              <button 
                                className={styles.actionButton}
                                onClick={() => toggleReviewExpansion(review.id)}
                              >
                                {expandedReviews.has(review.id) ? 'Collapse' : 'Expand'}
                              </button>
                            )}
                          </div>
                        </div>
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

      {/* Report Modal */}
      {showReportModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.reportModal}>
            <div className={styles.reportModalHeader}>
              <h3>Report Review</h3>
              <button 
                className={styles.closeButton}
                onClick={cancelReport}
              >
                ✕
              </button>
            </div>
            <div className={styles.reportModalBody}>
              <p>Please provide a reason for reporting this review:</p>
              <div className={styles.reportReasons}>
                <label className={styles.reasonOption}>
                  <input 
                    type="radio" 
                    name="reportReason" 
                    value="spam"
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Spam or irrelevant content</span>
                </label>
                <label className={styles.reasonOption}>
                  <input 
                    type="radio" 
                    name="reportReason" 
                    value="inappropriate"
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Inappropriate or offensive language</span>
                </label>
                <label className={styles.reasonOption}>
                  <input 
                    type="radio" 
                    name="reportReason" 
                    value="fake"
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Fake or misleading review</span>
                </label>
                <label className={styles.reasonOption}>
                  <input 
                    type="radio" 
                    name="reportReason" 
                    value="other"
                    onChange={(e) => setReportReason(e.target.value)}
                  />
                  <span>Other</span>
                </label>
              </div>
              {reportReason === 'other' && (
                <textarea
                  className={styles.otherReasonText}
                  placeholder="Please specify..."
                  value={reportReason === 'other' ? '' : reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                />
              )}
            </div>
            <div className={styles.reportModalActions}>
              <button 
                className={styles.cancelButton}
                onClick={cancelReport}
              >
                Cancel
              </button>
              <button 
                className={styles.submitReportButton}
                onClick={submitReport}
                disabled={!reportReason.trim()}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            <span>{notification.message}</span>
            <button 
              className={styles.notificationClose}
              onClick={() => setNotification({ show: false, message: '', type: '' })}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;
