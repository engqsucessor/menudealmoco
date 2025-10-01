import React from 'react';
import styles from './ReviewCard.module.css';

const ReviewCard = ({
  review,
  user,
  onUpvote,
  onDownvote,
  onReport,
  onToggleExpand,
  isExpanded,
  userVote,
  isPending,
  localVotes = { upvotes: 0, downvotes: 0 }
}) => {
  const displayUpvotes = (review.upvotes || 0) + localVotes.upvotes;
  const displayDownvotes = (review.downvotes || 0) + localVotes.downvotes;
  const netScore = displayUpvotes - displayDownvotes;
  const displayName = review.displayName || `AnonymousUser${review.id.slice(-3)}`;

  return (
    <div className={styles.review}>
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

      {review.comment && !isExpanded && (
        <div className={styles.reviewCommentSection}>
          <p className={styles.reviewComment}>
            {review.comment.length > 200
              ? review.comment.substring(0, 200) + '...'
              : review.comment
            }
          </p>
        </div>
      )}

      {review.comment && isExpanded && (
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
              className={`${styles.voteButton} ${styles.upvoteButton} ${userVote === 'up' ? styles.voted : ''} ${isPending ? styles.pending : ''}`}
              onClick={() => onUpvote(review.id)}
              title={userVote === 'up' ? "Remove upvote" : "Upvote"}
              disabled={isPending}
            >
              ↑ {isPending && isPending === 'up' ? '...' : ''}
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
              className={`${styles.voteButton} ${styles.downvoteButton} ${userVote === 'down' ? styles.voted : ''} ${isPending ? styles.pending : ''}`}
              onClick={() => onDownvote(review.id)}
              title={userVote === 'down' ? "Remove downvote" : "Downvote"}
              disabled={isPending}
            >
              ↓ {isPending && isPending === 'down' ? '...' : ''}
            </button>
          )}
        </div>

        <button
          className={styles.reportButton}
          onClick={() => onReport(review.id)}
        >
          Report
        </button>

        {review.comment && review.comment.length > 200 && (
          <button
            className={styles.actionButton}
            onClick={() => onToggleExpand(review.id)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
