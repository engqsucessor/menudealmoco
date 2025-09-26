import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './ReviewerDashboard.module.css';

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Mock data for submissions
  const submissions = [
    {
      id: 1,
      type: 'restaurant',
      restaurantName: 'Tasca do João',
      submittedBy: 'maria.santos@example.com',
      submittedAt: '2025-09-25T14:30:00Z',
      status: 'pending',
      data: {
        name: 'Tasca do João',
        address: 'Rua do Norte, 45, Porto',
        menuPrice: '9.50',
        priceRange: '8-10',
        foodType: 'Traditional Portuguese',
        included: ['soup', 'main', 'drink'],
        practical: ['takesCards', 'groupFriendly'],
        description: 'Small family restaurant with daily specials',
        dishes: ['Bacalhau à Brás', 'Francesinha', 'Caldo Verde']
      },
      reviewerComments: []
    },
    {
      id: 2,
      type: 'restaurant',
      restaurantName: 'Burger Palace',
      submittedBy: 'joao.silva@example.com',
      submittedAt: '2025-09-24T16:45:00Z',
      status: 'pending',
      data: {
        name: 'Burger Palace',
        address: 'Avenida da Liberdade, 123, Lisboa',
        menuPrice: '12.00',
        priceRange: '10-12',
        foodType: 'International',
        included: ['main', 'drink'],
        practical: ['quickService', 'hasParking'],
        description: 'Modern burger joint with craft options',
        dishes: ['Classic Burger', 'Veggie Burger', 'Chicken Deluxe']
      },
      reviewerComments: []
    }
  ];

  const [submissionsList, setSubmissionsList] = useState(submissions);
  const [reviewComment, setReviewComment] = useState('');

  const handleApprove = (submissionId) => {
    setSubmissionsList(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: 'approved', reviewedBy: user.email, reviewedAt: new Date().toISOString() }
          : sub
      )
    );
    setSelectedSubmission(null);
  };

  const handleReject = (submissionId, comment) => {
    setSubmissionsList(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { 
              ...sub, 
              status: 'rejected', 
              reviewedBy: user.email, 
              reviewedAt: new Date().toISOString(),
              reviewerComments: [...sub.reviewerComments, { comment, timestamp: new Date().toISOString() }]
            }
          : sub
      )
    );
    setSelectedSubmission(null);
    setReviewComment('');
  };

  const handleRequestChanges = (submissionId, comment) => {
    setSubmissionsList(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { 
              ...sub, 
              status: 'needs_changes', 
              reviewedBy: user.email, 
              reviewedAt: new Date().toISOString(),
              reviewerComments: [...sub.reviewerComments, { comment, timestamp: new Date().toISOString() }]
            }
          : sub
      )
    );
    setSelectedSubmission(null);
    setReviewComment('');
  };

  const filteredSubmissions = submissionsList.filter(sub => {
    if (activeTab === 'pending') return sub.status === 'pending';
    if (activeTab === 'approved') return sub.status === 'approved';
    if (activeTab === 'rejected') return sub.status === 'rejected';
    if (activeTab === 'needs_changes') return sub.status === 'needs_changes';
    return true;
  });

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: styles.statusPending,
      approved: styles.statusApproved,
      rejected: styles.statusRejected,
      needs_changes: styles.statusNeedsChanges
    };
    
    return (
      <span className={`${styles.statusBadge} ${statusClasses[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (!user || !user.isReviewer) {
    return (
      <div className={styles.accessDenied}>
        <h2>Access Denied</h2>
        <p>You need reviewer permissions to access this page.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.title}>Reviewer Dashboard</h1>
      <p className={styles.subtitle}>Review and approve restaurant submissions</p>

      <div className={styles.tabNavigation}>
        <button 
          className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({submissionsList.filter(s => s.status === 'pending').length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'approved' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved ({submissionsList.filter(s => s.status === 'approved').length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected ({submissionsList.filter(s => s.status === 'rejected').length})
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'needs_changes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('needs_changes')}
        >
          Needs Changes ({submissionsList.filter(s => s.status === 'needs_changes').length})
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.submissionsList}>
          {filteredSubmissions.map(submission => (
            <div 
              key={submission.id} 
              className={`${styles.submissionCard} ${selectedSubmission?.id === submission.id ? styles.selected : ''}`}
              onClick={() => setSelectedSubmission(submission)}
            >
              <div className={styles.submissionHeader}>
                <h3>{submission.data.name}</h3>
                {getStatusBadge(submission.status)}
              </div>
              <p className={styles.submissionMeta}>
                Submitted by {submission.submittedBy} • {new Date(submission.submittedAt).toLocaleDateString()}
              </p>
              <p className={styles.submissionPreview}>
                {submission.data.address} • €{submission.data.menuPrice}
              </p>
            </div>
          ))}
          
          {filteredSubmissions.length === 0 && (
            <div className={styles.emptyState}>
              <p>No {activeTab} submissions.</p>
            </div>
          )}
        </div>

        {selectedSubmission && (
          <div className={styles.reviewPanel}>
            <div className={styles.reviewHeader}>
              <h2>{selectedSubmission.data.name}</h2>
              {getStatusBadge(selectedSubmission.status)}
            </div>

            <div className={styles.submissionDetails}>
              <div className={styles.detailGroup}>
                <strong>Address:</strong> {selectedSubmission.data.address}
              </div>
              <div className={styles.detailGroup}>
                <strong>Price:</strong> €{selectedSubmission.data.menuPrice} ({selectedSubmission.data.priceRange})
              </div>
              <div className={styles.detailGroup}>
                <strong>Food Type:</strong> {selectedSubmission.data.foodType}
              </div>
              <div className={styles.detailGroup}>
                <strong>Included:</strong> {selectedSubmission.data.included.join(', ')}
              </div>
              <div className={styles.detailGroup}>
                <strong>Features:</strong> {selectedSubmission.data.practical.join(', ')}
              </div>
              <div className={styles.detailGroup}>
                <strong>Description:</strong> {selectedSubmission.data.description}
              </div>
              <div className={styles.detailGroup}>
                <strong>Daily Dishes:</strong> {selectedSubmission.data.dishes.join(', ')}
              </div>
            </div>

            {selectedSubmission.status === 'pending' && (
              <div className={styles.reviewActions}>
                <div className={styles.commentSection}>
                  <label htmlFor="reviewComment">Comment (optional for approval, required for rejection/changes):</label>
                  <textarea
                    id="reviewComment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add feedback for the submitter..."
                    className={styles.commentTextarea}
                  />
                </div>
                
                <div className={styles.actionButtons}>
                  <button 
                    className={`${styles.actionButton} ${styles.approveButton}`}
                    onClick={() => handleApprove(selectedSubmission.id)}
                  >
                    Approve
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.changesButton}`}
                    onClick={() => handleRequestChanges(selectedSubmission.id, reviewComment)}
                    disabled={!reviewComment.trim()}
                  >
                    Request Changes
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.rejectButton}`}
                    onClick={() => handleReject(selectedSubmission.id, reviewComment)}
                    disabled={!reviewComment.trim()}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {selectedSubmission.reviewerComments.length > 0 && (
              <div className={styles.commentsHistory}>
                <h4>Review History</h4>
                {selectedSubmission.reviewerComments.map((comment, index) => (
                  <div key={index} className={styles.commentItem}>
                    <p>{comment.comment}</p>
                    <small>{new Date(comment.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewerDashboard;