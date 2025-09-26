import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './UserProfile.module.css';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('reviews');

  if (!user) {
    return <p>Loading...</p>;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'reviews':
        return (
          <div className={styles.contentSection}>
            <h2>Your Reviews</h2>
            {user.reviews && user.reviews.length > 0 ? (
              user.reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <h3>{review.restaurant}</h3>
                  <p>{review.review}</p>
                  <p><strong>Upvotes:</strong> {review.upvotes}</p>
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
            <p>You haven't saved any favorite restaurants yet.</p>
          </div>
        );
      case 'settings':
        return (
          <div className={styles.contentSection}>
            <h2>Settings</h2>
            <div className={styles.profileInfo}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
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
