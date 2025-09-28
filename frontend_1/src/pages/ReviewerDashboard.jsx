import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import AddRestaurant from './AddRestaurant';
import EditButton from '../components/ui/EditButton';
import styles from './ReviewerDashboard.module.css';

const ReviewerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [reportedReviews, setReportedReviews] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadSubmissions();
    loadReportedReviews();
  }, []);

  const loadSubmissions = async () => {
    try {
      const submissions = await apiService.getSubmissions();
      setSubmissionsList(submissions);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportedReviews = async () => {
    try {
      const reports = await apiService.getReportedReviews();
      setReportedReviews(reports);
    } catch (error) {
      console.error('Error loading reported reviews:', error);
    }
  };

  const handleEditSubmission = (submissionData) => {
    // Update the submission with the edited data
    const updatedSubmission = {
      ...selectedSubmission,
      data: {
        ...submissionData,
        // Extract city and district from address
        city: submissionData.address.split(',').slice(-1)[0].trim(),
        district: submissionData.address.split(',').slice(-2, -1)[0]?.trim() || submissionData.address.split(',').slice(-1)[0].trim()
      }
    };

    // Update in backend
    const submissions = JSON.parse(localStorage.getItem('mmd_submissions') || '{}');
    submissions[selectedSubmission.id] = updatedSubmission;
    localStorage.setItem('mmd_submissions', JSON.stringify(submissions));

    // Refresh submissions list
    loadSubmissions();
    setShowEditModal(false);
    setSelectedSubmission(updatedSubmission);
  };

  // Transform submission data for the AddRestaurant form
  const getRestaurantDataForForm = (submission) => {
    if (!submission?.data) return null;

    return {
      id: submission.id,
      name: submission.data.name,
      address: submission.data.address,
      city: submission.data.city,
      district: submission.data.district,
      menuPrice: submission.data.menuPrice,
      priceRange: submission.data.priceRange,
      foodType: submission.data.foodType,
      googleRating: submission.data.googleRating,
      googleReviews: submission.data.googleReviews,
      description: submission.data.description,
      dishes: submission.data.dishes || [],
      whatsIncluded: submission.data.whatsIncluded || [],
      practical: submission.data.practical || {},
      photos: submission.data.photos || []
    };
  };

  const [reviewComment, setReviewComment] = useState('');

  const handleApprove = async (submissionId) => {
    try {
      const updatedSubmission = await apiService.reviewSubmission(submissionId, 'approve', '', user.email);
      if (updatedSubmission) {
        await loadSubmissions(); // Reload to get updated data
        setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Error approving submission:', error);
    }
  };

  const handleReject = async (submissionId, comment) => {
    try {
      const updatedSubmission = await apiService.reviewSubmission(submissionId, 'reject', comment, user.email);
      if (updatedSubmission) {
        await loadSubmissions(); // Reload to get updated data
        setSelectedSubmission(null);
        setReviewComment('');
      }
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  const handleRequestChanges = async (submissionId, comment) => {
    try {
      const updatedSubmission = await apiService.reviewSubmission(submissionId, 'request_changes', comment, user.email);
      if (updatedSubmission) {
        await loadSubmissions(); // Reload to get updated data
        setSelectedSubmission(null);
        setReviewComment('');
      }
    } catch (error) {
      console.error('Error requesting changes:', error);
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      const result = await apiService.resolveReport(reportId, user.email, action);
      if (result) {
        await loadReportedReviews(); // Reload reported reviews
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const filteredSubmissions = submissionsList.filter(sub => {
    if (activeTab === 'pending') return sub.status === 'pending';
    if (activeTab === 'approved') return sub.status === 'approved';
    if (activeTab === 'rejected') return sub.status === 'rejected';
    if (activeTab === 'needs_changes') return sub.status === 'needs_changes';
    return true;
  });

  const filteredReports = reportedReviews.filter(report => {
    if (activeTab === 'reports') return report.status === 'pending';
    return false;
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

  if (loading) {
    return (
      <div className={styles.dashboardContainer}>
        <h1 className={styles.title}>Reviewer Dashboard</h1>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading submissions...</div>
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
          onClick={() => {
            setActiveTab('pending');
            setSelectedSubmission(null);
            setSelectedReport(null);
          }}
        >
          Pending ({submissionsList.filter(s => s.status === 'pending').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'approved' ? styles.activeTab : ''}`}
          onClick={() => {
            setActiveTab('approved');
            setSelectedSubmission(null);
            setSelectedReport(null);
          }}
        >
          Approved ({submissionsList.filter(s => s.status === 'approved').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'rejected' ? styles.activeTab : ''}`}
          onClick={() => {
            setActiveTab('rejected');
            setSelectedSubmission(null);
            setSelectedReport(null);
          }}
        >
          Rejected ({submissionsList.filter(s => s.status === 'rejected').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'needs_changes' ? styles.activeTab : ''}`}
          onClick={() => {
            setActiveTab('needs_changes');
            setSelectedSubmission(null);
            setSelectedReport(null);
          }}
        >
          Needs Changes ({submissionsList.filter(s => s.status === 'needs_changes').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'reports' ? styles.activeTab : ''}`}
          onClick={() => {
            setActiveTab('reports');
            setSelectedSubmission(null);
            setSelectedReport(null);
          }}
        >
          Reported Reviews ({reportedReviews.filter(r => r.status === 'pending').length})
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.submissionsList}>
          {activeTab === 'reports' ? (
            <>
              {filteredReports.map(report => (
                <div
                  key={report.id}
                  className={`${styles.submissionCard} ${selectedReport?.id === report.id ? styles.selected : ''}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className={styles.submissionHeader}>
                    <h3>Review Report</h3>
                    <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                      PENDING
                    </span>
                  </div>
                  <p className={styles.submissionMeta}>
                    Reported by {report.reporterId} • {new Date(report.dateReported).toLocaleDateString()}
                  </p>
                  <p className={styles.submissionPreview}>
                    Reason: {report.reason}
                  </p>
                </div>
              ))}

              {filteredReports.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No pending reported reviews.</p>
                </div>
              )}
            </>
          ) : (
            <>
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
                    {submission.data?.address || 'No address'} • €{submission.data?.menuPrice || '0.00'}
                  </p>
                </div>
              ))}

              {filteredSubmissions.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No {activeTab} submissions.</p>
                </div>
              )}
            </>
          )}
        </div>

        {selectedReport && (
          <div className={styles.reviewPanel}>
            <div className={styles.reviewHeader}>
              <h2>Reported Review</h2>
              <span className={`${styles.statusBadge} ${styles.statusPending}`}>
                PENDING
              </span>
            </div>

            <div className={styles.submissionDetails}>
              <div className={styles.detailGroup}>
                <strong>Report Reason:</strong> {selectedReport.reason}
              </div>
              <div className={styles.detailGroup}>
                <strong>Reported By:</strong> {selectedReport.reporterId}
              </div>
              <div className={styles.detailGroup}>
                <strong>Report Date:</strong> {new Date(selectedReport.dateReported).toLocaleString()}
              </div>
              <div className={styles.detailGroup}>
                <strong>Restaurant ID:</strong> {selectedReport.restaurantId}
              </div>
            </div>

            <div className={styles.reportedReviewContent}>
              <h3>Reported Review Content</h3>
              <div className={styles.reviewContent}>
                <div className={styles.reviewMeta}>
                  <strong>Review By:</strong> {selectedReport.reviewContent.displayName}
                  <span> • {selectedReport.reviewContent.rating}/5 ★</span>
                  <span> • {new Date(selectedReport.reviewContent.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.reviewText}>
                  <p>{selectedReport.reviewContent.comment}</p>
                </div>
              </div>
            </div>

            <div className={styles.reviewActions}>
              <div className={styles.actionButtons}>
                <button
                  className={`${styles.actionButton} ${styles.changesButton}`}
                  onClick={() => handleResolveReport(selectedReport.id, 'dismissed')}
                >
                  Dismiss Report
                </button>
                <button
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={() => handleResolveReport(selectedReport.id, 'review_hidden')}
                >
                  Hide Review
                </button>
                <button
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={() => handleResolveReport(selectedReport.id, 'user_warned')}
                >
                  Warn User
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedSubmission && (
          <div className={styles.reviewPanel}>
            <div className={styles.reviewHeader}>
              <h2>{selectedSubmission.data.name}</h2>
              <div className={styles.headerActions}>
                {getStatusBadge(selectedSubmission.status)}
                <EditButton
                  onClick={() => setShowEditModal(true)}
                  title="Edit submission details"
                />
              </div>
            </div>

            <div className={styles.submissionDetails}>
              <div className={styles.detailGroup}>
                <strong>Address:</strong> {selectedSubmission.data?.address || 'No address provided'}
              </div>
              <div className={styles.detailGroup}>
                <strong>Price:</strong> €{selectedSubmission.data?.menuPrice || '0.00'} ({selectedSubmission.data?.priceRange || 'No range specified'})
              </div>
              <div className={styles.detailGroup}>
                <strong>Food Type:</strong> {selectedSubmission.data?.foodType || 'Not specified'}
              </div>
              <div className={styles.detailGroup}>
                <strong>Included:</strong> {selectedSubmission.data.whatsIncluded?.join(', ') || 'None specified'}
              </div>
              <div className={styles.detailGroup}>
                <strong>Features:</strong> {
                  selectedSubmission.data.practical
                    ? Object.entries(selectedSubmission.data.practical)
                        .filter(([key, value]) => value)
                        .map(([key]) => key)
                        .join(', ') || 'None specified'
                    : 'None specified'
                }
              </div>
              <div className={styles.detailGroup}>
                <strong>Description:</strong> {selectedSubmission.data.description || 'No description provided'}
              </div>
              <div className={styles.detailGroup}>
                <strong>Daily Dishes:</strong> {selectedSubmission.data.dishes?.join(', ') || 'None specified'}
              </div>
            </div>

            {/* Photos Section */}
            <div className={styles.photosSection}>
              <h3>Photos</h3>
              <div className={styles.photoGrid}>
                {selectedSubmission.data.restaurantPhoto && (
                  <div className={styles.photoItem}>
                    <img
                      src={selectedSubmission.data.restaurantPhoto}
                      alt="Restaurant"
                      className={styles.photo}
                    />
                    <p>Restaurant Photo</p>
                  </div>
                )}
                {selectedSubmission.data.menuPhoto && (
                  <div className={styles.photoItem}>
                    <img
                      src={selectedSubmission.data.menuPhoto}
                      alt="Menu"
                      className={styles.photo}
                    />
                    <p>Menu Photo</p>
                  </div>
                )}
                {!selectedSubmission.data.restaurantPhoto && !selectedSubmission.data.menuPhoto && (
                  <p>No photos uploaded</p>
                )}
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

      {/* Edit Submission Modal */}
      {showEditModal && selectedSubmission && (
        <AddRestaurant
          restaurant={getRestaurantDataForForm(selectedSubmission)}
          isEditMode={false} // Don't use edit mode since reviewers have full edit access
          isModal={true}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmission}
        />
      )}
    </div>
  );
};

export default ReviewerDashboard;