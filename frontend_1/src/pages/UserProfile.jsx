import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { favoriteRestaurants } from '../services/localStorage';
import styles from './UserProfile.module.css';
import ReviewerDashboard from './ReviewerDashboard';

const UserProfile = () => {
  const { user, updateDisplayName } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reviews');
  const [userFavorites, setUserFavorites] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Load favorites from localStorage using the favoriteRestaurants service
      const favoriteIds = favoriteRestaurants.get();
      const response = await apiService.getRestaurants();
      // Handle both old format (array) and new format (object with restaurants array)
      const restaurants = Array.isArray(response) ? response : (response.restaurants || []);
      const favoriteRestaurantsList = restaurants.filter(restaurant =>
        favoriteIds.includes(restaurant.id)
      );
      setUserFavorites(favoriteRestaurantsList);

      // Load reviews
      const allReviews = {};
      for (const restaurant of restaurants) {
        try {
          const reviews = await apiService.getMenuReviews(restaurant.id);
          reviews.forEach(review => {
            if (review.userId === user.email) {
              allReviews[review.id] = {
                ...review,
                restaurantName: restaurant.name,
                restaurantId: restaurant.id
              };
            }
          });
        } catch (error) {
          console.warn(`Failed to load reviews for restaurant ${restaurant.id}:`, error);
        }
      }
      setUserReviews(Object.values(allReviews));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleRemoveFromFavorites = (restaurantId) => {
    favoriteRestaurants.remove(restaurantId);
    // Refresh the favorites list
    loadUserData();
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
                  <p>{review.review}</p>
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
            <button className={styles.reviewerButton}>Become a Reviewer</button>
          </div>
        );
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
            <button className={styles.reviewerButton}>Become a Reviewer</button>
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
            <li className={activeTab === 'settings' ? styles.active : ''} onClick={() => setActiveTab('settings')}>
              Settings
            </li>
          </ul>
        </nav>
      </div>
      <div className={styles.mainContent}>
        {renderContent()}
      </div>
    </div>
  );
};

export default UserProfile;
