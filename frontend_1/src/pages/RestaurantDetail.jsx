import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './RestaurantDetail.module.css';
import { getRestaurant } from '../services/mockApi';
import { favoriteRestaurants } from '../services/localStorage';
import { useAuth } from '../contexts/AuthContext';
import MenuRating from '../components/ui/MenuRating';
import { getRestaurantMenuReviews, upvoteMenuReview, downvoteMenuReview } from '../services/menuRatingService';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuReviewsData, setMenuReviewsData] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'upvotes', 'rating', 'lowestRating', 'controversial'
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    getRestaurant(id).then(data => {
      setRestaurant(data);
      setLoading(false);
    });
    
    // Load menu reviews
    loadMenuReviews();

    // Check if restaurant is favorited
    setIsFavorite(favoriteRestaurants.isFavorite(id));
  }, [id]);

  const loadMenuReviews = async () => {
    try {
      const reviews = await getRestaurantMenuReviews(id);
      setMenuReviewsData(reviews);
    } catch (error) {
      console.error('Error loading menu reviews:', error);
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
    favoriteRestaurants.toggle(id);
    setIsFavorite(!isFavorite);
  };

  const handleRatingSubmitted = (newAverageRating) => {
    // Refresh menu reviews data
    loadMenuReviews();
  };

  const handleUpvote = async (reviewId) => {
    if (!user) return;
    
    try {
      const result = await upvoteMenuReview(reviewId, user.email);
      if (result.success) {
        loadMenuReviews(); // Refresh reviews to show updated votes
      }
    } catch (error) {
      console.error('Error upvoting review:', error);
    }
  };

  const handleDownvote = async (reviewId) => {
    if (!user) return;
    
    try {
      const result = await downvoteMenuReview(reviewId, user.email);
      if (result.success) {
        loadMenuReviews(); // Refresh reviews to show updated votes
      }
    } catch (error) {
      console.error('Error downvoting review:', error);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  const { name, city, district, menuPrice, whatsIncluded, photo, reviews, foodType, googleRating, googleReviews, zomatoRating, zomatoReviews, menuReviews } = restaurant;

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
            <button
              className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
              onClick={handleFavoriteToggle}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
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

        {activeTab === 'reviews' && (
          <div>
            <div>
              <h2>Menu de Almoço Reviews</h2>
              
              {/* Menu Rating Component */}
              <MenuRating 
                restaurantId={id} 
                restaurantName={name}
                onRatingSubmitted={handleRatingSubmitted}
              />
              
              {/* Display current average and reviews */}
              {menuReviewsData.length > 0 && (
                <div className={styles.menuRatingStats}>
                  <div className={styles.reviewsHeader}>
                    <h3>Menu de Almoço Reviews ({menuReviewsData.length})</h3>
                    
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
                      
                      return (
                        <div key={review.id} className={styles.review}>
                          <div className={styles.reviewHeader}>
                            <div className={styles.reviewInfo}>
                              <strong className={styles.username}>{review.displayName}</strong>
                              <span className={styles.rating}>
                                {'★'.repeat(Math.floor(review.rating))}
                                {review.rating % 1 !== 0 ? '☆' : ''}
                                {' '}({review.rating}/5)
                              </span>
                              <span className={styles.reviewDate}>
                                {new Date(review.createdAt).toLocaleDateString()}
                                {totalVotes > 0 && (
                                  <span className={styles.netScore}>
                                    {' • '}
                                    <span className={netScore > 0 ? styles.positiveScore : netScore < 0 ? styles.negativeScore : styles.neutralScore}>
                                      {netScore > 0 ? '+' : ''}{netScore} points
                                    </span>
                                  </span>
                                )}
                              </span>
                            </div>
                            
                            {user && (
                              <div className={styles.voteButtons}>
                                <button 
                                  className={`${styles.voteButton} ${styles.upvoteButton} ${review.upvotedBy?.includes(user.email) ? styles.voted : ''}`}
                                  onClick={() => handleUpvote(review.id)}
                                  title="Upvote this review"
                                >
                                  ▲ {review.upvotes || 0}
                                </button>
                                <button 
                                  className={`${styles.voteButton} ${styles.downvoteButton} ${review.downvotedBy?.includes(user.email) ? styles.voted : ''}`}
                                  onClick={() => handleDownvote(review.id)}
                                  title="Downvote this review"
                                >
                                  ▼ {review.downvotes || 0}
                                </button>
                              </div>
                            )}
                          </div>
                          {review.comment && <p className={styles.reviewComment}>{review.comment}</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {menuReviewsData.length === 0 && (
                <p>No menu reviews yet. Be the first to rate this lunch menu!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
