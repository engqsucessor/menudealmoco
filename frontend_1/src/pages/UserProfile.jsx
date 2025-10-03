import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { restaurantsApi, favoritesApi, reviewsApi } from '../services/axiosApi';
import { reviewerApplicationsApi } from '../services/reviewerApplicationsApi';
import { favoriteRestaurants } from '../services/localStorage';
import styles from './UserProfile.module.css';
import ReviewerDashboard from './ReviewerDashboard';
import ReviewerApplicationModal from '../components/ReviewerApplicationModal';
import AdminDashboard from '../components/AdminDashboard';

const UserProfile = () => {
  const { user, updateDisplayName } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reviews');
  const [userFavorites, setUserFavorites] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [myApplication, setMyApplication] = useState(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      loadApplicationStatus();
    }
  }, [user]);

  const loadApplicationStatus = async () => {
    if (!user || user.isReviewer) return;

    try {
      const application = await reviewerApplicationsApi.getMyApplication();
      setMyApplication(application);
    } catch (error) {
      console.error('Error loading application:', error);
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      const favoriteIds = favoriteRestaurants.get();
      let favoriteRestaurantsList = [];

      try {
        const favoritesResponse = await favoritesApi.getRestaurants();
        const backendFavorites = Array.isArray(favoritesResponse?.restaurants)
          ? favoritesResponse.restaurants
          : Array.isArray(favoritesResponse)
            ? favoritesResponse
            : [];

        favoriteRestaurantsList = backendFavorites;

        backendFavorites.forEach((restaurant) => {
          if (restaurant?.id && !favoriteIds.includes(restaurant.id)) {
            favoriteRestaurants.add(restaurant.id);
          }
        });
      } catch (favoritesError) {
        console.warn('Failed to load favorites from backend, falling back to cached values.', favoritesError);
        if (favoriteIds.length > 0) {
          try {
            const response = await restaurantsApi.getAll({ limit: 1000 });
            const restaurants = Array.isArray(response) ? response : (response.restaurants || []);
            favoriteRestaurantsList = restaurants.filter((restaurant) => favoriteIds.includes(restaurant.id));
          } catch (fallbackError) {
            console.error('Error loading favorites fallback:', fallbackError);
            favoriteRestaurantsList = [];
          }
        }
      }

      setUserFavorites(favoriteRestaurantsList);

      try {
        const reviews = await reviewsApi.getMyReviews();
        setUserReviews(Array.isArray(reviews) ? reviews : []);
      } catch (reviewsError) {
        console.error('Error loading user reviews:', reviewsError);
        setUserReviews([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserFavorites([]);
      setUserReviews([]);
    }
  };

  const handleRemoveFromFavorites = async (restaurantId) => {
    if (!restaurantId) return;

    favoriteRestaurants.remove(restaurantId);
    setUserFavorites((prev) => prev.filter((restaurant) => restaurant.id !== restaurantId));

    try {
      await favoritesApi.remove(restaurantId);
    } catch (error) {
      console.error(`Error removing favorite ${restaurantId}:`, error);
      favoriteRestaurants.add(restaurantId);
      await loadUserData();
    }
  };

  const handleViewRestaurant = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
  };

  const startEditingDisplayName = () => {
    setNewDisplayName(user.displayName || '');
    setIsEditingDisplayName(true);
    setDisplayNameError('');
  };

  const cancelEditingDisplayName = () => {
    setIsEditingDisplayName(false);
    setNewDisplayName('');
    setDisplayNameError('');
  };

  const handleUpdateDisplayName = async (e) => {
    e.preventDefault();
    if (!newDisplayName.trim()) {
      setDisplayNameError('Display name cannot be empty');
      return;
    }

    const success = await updateDisplayName(newDisplayName.trim());
    if (success) {
      setIsEditingDisplayName(false);
      setDisplayNameError('');
    } else {
      setDisplayNameError('Failed to update display name. Please try again.');
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'reviews':
        return (
          <div className={styles.contentSection}>
            <h2>Your Reviews</h2>
            {userReviews.length > 0 ? (
              userReviews.map((review) => (
                <div 
                  key={review.id} 
                  className={styles.reviewCard}
                  onClick={() => handleViewRestaurant(review.restaurantId)}
                  title="Click to view restaurant"
                >
                  <h3>{review.restaurantName}</h3>
                  <div className={styles.rating}>
                    {'★'.repeat(Math.floor(review.rating))} ({review.rating}/5)
                  </div>
                  <p>{review.comment || review.review || ''}</p>
                  <p><strong>Upvotes:</strong> {review.upvotes || 0} | <strong>Downvotes:</strong> {review.downvotes || 0}</p>
                  <p><strong>Posted:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p>You haven't written any reviews yet.</p>
            )}
          </div>
        );
      case 'favorites':
        return (
          <div className={styles.contentSection}>
            <h2>Your Favorites</h2>
            {userFavorites.length > 0 ? (
              <div className={styles.favoritesGrid}>
                {userFavorites.map((restaurant) => (
                  <div key={restaurant.id} className={styles.favoriteCard}>
                    <div className={styles.favoriteHeader}>
                      <h3>{restaurant.name}</h3>
                      <button 
                        className={styles.heartButton}
                        onClick={() => handleRemoveFromFavorites(restaurant.id)}
                        title="Remove from favorites"
                      >
                        ❤️
                      </button>
                    </div>
                    <p>{restaurant.city}</p>
                    <p><strong>Price:</strong> €{restaurant.menuPrice}</p>
                    <p><strong>Type:</strong> {restaurant.foodType}</p>
                    <div className={styles.favoriteActions}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => handleViewRestaurant(restaurant.id)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>You haven't saved any favorite restaurants yet.</p>
            )}
          </div>
        );
      case 'reviewer':
        return user.isReviewer ? (
          <div className={styles.contentSection}>
            <ReviewerDashboard />
          </div>
        ) : (
          <div className={styles.contentSection}>
            <h2>Reviewer Access</h2>
            <p>You need reviewer permissions to access this section.</p>
            {myApplication ? (
              <div className={styles.applicationStatus}>
                <p><strong>Application Status:</strong> {myApplication.status}</p>
                {myApplication.status === 'pending' && (
                  <p>Your application is being reviewed by our admins.</p>
                )}
                {myApplication.status === 'approved' && (
                  <p>Congratulations! Your application was approved. Please refresh the page.</p>
                )}
                {myApplication.status === 'rejected' && (
                  <>
                    <p>Your application was not approved at this time.</p>
                    {myApplication.adminNotes && (
                      <p><strong>Admin Notes:</strong> {myApplication.adminNotes}</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <button
                className={styles.reviewerButton}
                onClick={() => setShowApplicationModal(true)}
              >
                Become a Reviewer
              </button>
            )}
          </div>
        );
      case 'admin':
        return user.isAdmin ? (
          <div className={styles.contentSection}>
            <AdminDashboard />
          </div>
        ) : null;
      case 'settings':
        return (
          <div className={styles.contentSection}>
            <h2>Settings</h2>
            <div className={styles.profileInfo}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>

              <div className={styles.displayNameSection}>
                <p><strong>Display Name:</strong></p>
                {!isEditingDisplayName ? (
                  <div className={styles.displayNameView}>
                    <span className={styles.displayNameValue}>{user.displayName}</span>
                    <button
                      className={styles.editButton}
                      onClick={startEditingDisplayName}
                    >
                      Edit
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateDisplayName} className={styles.displayNameForm}>
                    <input
                      type="text"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      placeholder="Enter new display name"
                      className={styles.displayNameInput}
                      autoFocus
                    />
                    <div className={styles.displayNameButtons}>
                      <button type="submit" className={styles.saveButton}>
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditingDisplayName}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                    {displayNameError && (
                      <p className={styles.errorMessage}>{displayNameError}</p>
                    )}
                  </form>
                )}
              </div>
            </div>
            <button
              className={styles.reviewerButton}
              onClick={() => setShowApplicationModal(true)}
            >
              Become a Reviewer
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <ul>
            <li className={activeTab === 'reviews' ? styles.active : ''} onClick={() => setActiveTab('reviews')}>
              My Reviews
            </li>
            <li className={activeTab === 'favorites' ? styles.active : ''} onClick={() => setActiveTab('favorites')}>
              My Favorites
            </li>
            {user.isReviewer && (
              <li className={activeTab === 'reviewer' ? styles.active : ''} onClick={() => setActiveTab('reviewer')}>
                Reviewer
              </li>
            )}
            {user.isAdmin && (
              <li className={activeTab === 'admin' ? styles.active : ''} onClick={() => setActiveTab('admin')}>
                Admin
              </li>
            )}
            <li className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>
              Settings
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.mainContent}>
        {renderContent()}
      </div>

      {showApplicationModal && (
        <ReviewerApplicationModal
          onClose={() => setShowApplicationModal(false)}
          onSuccess={() => {
            setShowApplicationModal(false);
            loadApplicationStatus();
          }}
        />
      )}
    </div>
  );
};

export default UserProfile;

