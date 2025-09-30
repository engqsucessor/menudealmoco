import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { restaurantsApi, reportsApi, editSuggestionsApi } from '../services/axiosApi';
import { approveEditSuggestion, rejectEditSuggestion } from '../services/editSuggestionsService';
import AddRestaurant from './AddRestaurant';
import EditButton from '../components/ui/EditButton';
import styles from './ReviewerDashboard.module.css';

const ReviewerDashboard = () => {
  const { user } = useAuth();

  const normalizeSubmission = (submission) => {
    if (!submission) {
      return null;
    }

    const reviewerComments = Array.isArray(submission.reviewerComments)
      ? submission.reviewerComments
      : Array.isArray(submission.reviewer_comments)
        ? submission.reviewer_comments
        : [];

    return {
      ...submission,
      reviewerComments,
    };
  };

  // Helper function to check if a value is an image URL
  const isImageUrl = (value) => {
    if (typeof value !== 'string') return false;
    return value.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) ||
           value.includes('blob:') ||
           value.includes('data:image');
  };

  // Helper function to format values for display
  const formatValue = (value) => {
    if (value === null || value === undefined) return 'null';
    if (Array.isArray(value)) return value.join(', ') || '(empty)';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    if (typeof value === 'boolean') return value ? 'true' : 'false';
    return String(value);
  };
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [reportedReviews, setReportedReviews] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editSuggestions, setEditSuggestions] = useState([]);
  const [selectedEditSuggestion, setSelectedEditSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadSubmissions();
    loadReportedReviews();
    loadEditSuggestions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const submissions = await restaurantsApi.getSubmissions();
      const normalized = submissions
        .map(normalizeSubmission)
        .filter(Boolean);
      setSubmissionsList(normalized);
      setSelectedSubmission((current) => {
        if (!current) {
          return current;
        }
        const next = normalized.find((submission) => submission.id === current.id);
        return next || null;
      });
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReportedReviews = async () => {
    try {
      const reports = await reportsApi.getReportedReviews();
      setReportedReviews(reports);
    } catch (error) {
      console.error('Error loading reported reviews:', error);
    }
  };

  const loadEditSuggestions = async () => {
    try {
      // Get all edit suggestions across all restaurants
      const suggestions = await editSuggestionsApi.getAll();
      setEditSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading edit suggestions:', error);
      setEditSuggestions([]);
    }
  };

  const handleEditSubmission = (submissionData) => {
    // Update the submission with the edited data
    const updatedSubmission = normalizeSubmission({
      ...selectedSubmission,
      data: {
        ...submissionData,
        // Extract city and district from address
        city: submissionData.address.split(',').slice(-1)[0].trim(),
        district: submissionData.address.split(',').slice(-2, -1)[0]?.trim() || submissionData.address.split(',').slice(-1)[0].trim()
      },
    });

    if (!updatedSubmission) {
      return;
    }

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
      const updatedSubmission = await restaurantsApi.reviewSubmission(submissionId, 'approve', '');
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
      const updatedSubmission = await restaurantsApi.reviewSubmission(submissionId, 'reject', comment);
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
      const updatedSubmission = await restaurantsApi.reviewSubmission(submissionId, 'request_changes', comment);
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
      const result = await reportsApi.resolveReport(reportId, action);
      if (result) {
        await loadReportedReviews(); // Reload reported reviews
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const handleApproveEditSuggestion = async (suggestionId) => {
    try {
      const result = await approveEditSuggestion(suggestionId, user.email);
      if (result.success) {
        await loadEditSuggestions(); // Reload edit suggestions
        setSelectedEditSuggestion(null);
        // Switch to approved tab to show the approved suggestion
        setActiveTab('edit-suggestions-approved');
        alert('Edit suggestion approved successfully! Changes have been applied to the restaurant.');
      }
    } catch (error) {
      console.error('Error approving edit suggestion:', error);
      alert('Failed to approve edit suggestion. Please try again.');
    }
  };

  const handleRejectEditSuggestion = async (suggestionId, reason) => {
    try {
      const result = await rejectEditSuggestion(suggestionId, user.email, reason);
      if (result.success) {
        await loadEditSuggestions(); // Reload edit suggestions
        setSelectedEditSuggestion(null);
        setReviewComment('');
        // Switch to rejected tab to show the rejected suggestion
        setActiveTab('edit-suggestions-rejected');
        alert('Edit suggestion rejected successfully.');
      }
    } catch (error) {
      console.error('Error rejecting edit suggestion:', error);
      alert('Failed to reject edit suggestion. Please try again.');
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

  const filteredEditSuggestions = editSuggestions.filter(suggestion => {
    if (activeTab === 'edit-suggestions-pending') return suggestion.status === 'pending';
    if (activeTab === 'edit-suggestions-approved') return suggestion.status === 'approved';
    if (activeTab === 'edit-suggestions-rejected') return suggestion.status === 'rejected';
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
            setSelectedEditSuggestion(null);
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
            setSelectedEditSuggestion(null);
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
            setSelectedEditSuggestion(null);
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
            setSelectedEditSuggestion(null);
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
            setSelectedEditSuggestion(null);
          }}
        >
          Reported Reviews ({reportedReviews.filter(r => r.status === 'pending').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'edit-suggestions-pending' ? styles.activeTab : ''}`}
          onClick={() => {
            setActiveTab('edit-suggestions-pending');
            setSelectedSubmission(null);
            setSelectedReport(null);
            setSelectedEditSuggestion(null);
          }}
        >
          Edit Suggestions - Pending ({editSuggestions.filter(s => s.status === 'pending').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'edit-suggestions-approved' ? styles.activeTab : ''}`}
          onClick={() => {
            setActiveTab('edit-suggestions-approved');
            setSelectedSubmission(null);
            setSelectedReport(null);
            setSelectedEditSuggestion(null);
          }}
        >
          Edit Suggestions - Approved ({editSuggestions.filter(s => s.status === 'approved').length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'edit-suggestions-rejected' ? styles.activeTab : ''}`}
          onClick={() => {
            setActiveTab('edit-suggestions-rejected');
            setSelectedSubmission(null);
            setSelectedReport(null);
            setSelectedEditSuggestion(null);
          }}
        >
          Edit Suggestions - Rejected ({editSuggestions.filter(s => s.status === 'rejected').length})
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
          ) : activeTab.startsWith('edit-suggestions') ? (
            <>
              {filteredEditSuggestions.map(suggestion => (
                <div
                  key={suggestion.id}
                  className={`${styles.submissionCard} ${selectedEditSuggestion?.id === suggestion.id ? styles.selected : ''}`}
                  onClick={() => setSelectedEditSuggestion(suggestion)}
                >
                  <div className={styles.submissionHeader}>
                    <h3>{suggestion.restaurant_name}</h3>
                    {getStatusBadge(suggestion.status)}
                  </div>
                  <p className={styles.submissionMeta}>
                    Suggested by {suggestion.display_name} • {new Date(suggestion.created_at).toLocaleDateString()}
                  </p>
                  <p className={styles.submissionPreview}>
                    {suggestion.reason || 'No reason provided'} • ↑{suggestion.upvotes} ↓{suggestion.downvotes}
                  </p>
                </div>
              ))}

              {filteredEditSuggestions.length === 0 && (
                <div className={styles.emptyState}>
                  <p>No {activeTab.replace('edit-suggestions-', '')} edit suggestions.</p>
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

        {selectedEditSuggestion && (
          <div className={styles.reviewPanel}>
            <div className={styles.reviewHeader}>
              <h2>Edit Suggestion for {selectedEditSuggestion.restaurant_name}</h2>
              {getStatusBadge(selectedEditSuggestion.status)}
            </div>

            <div className={styles.submissionDetails}>
              <div className={styles.detailGroup}>
                <strong>Suggested by:</strong> {selectedEditSuggestion.display_name} ({selectedEditSuggestion.user_email})
              </div>
              <div className={styles.detailGroup}>
                <strong>Date:</strong> {new Date(selectedEditSuggestion.created_at).toLocaleString()}
              </div>
              <div className={styles.detailGroup}>
                <strong>Reason:</strong> {selectedEditSuggestion.reason || 'No reason provided'}
              </div>
              <div className={styles.detailGroup}>
                <strong>Votes:</strong> ↑{selectedEditSuggestion.upvotes} ↓{selectedEditSuggestion.downvotes}
              </div>
            </div>

            <div className={styles.suggestedChanges}>
              <h3>Suggested Changes</h3>
              <div className={styles.changesContent}>
                {Object.entries(selectedEditSuggestion.suggested_changes).map(([field, value]) => (
                  <div key={field} className={styles.changeItem}>
                    <strong className={styles.fieldName}>{field}:</strong>
                    {value && typeof value === 'object' && value.from !== undefined && value.to !== undefined ? (
                      <div className={styles.diffView}>
                        {/* Check if it's an image field */}
                        {isImageUrl(value.from) || isImageUrl(value.to) ? (
                          <div className={styles.imageDiff}>
                            <div className={styles.imageDiffItem}>
                              <span className={styles.diffLabel}>Before:</span>
                              {value.from ? (
                                <img src={value.from} alt="Before" className={styles.diffImage} />
                              ) : (
                                <span className={styles.noImage}>No image</span>
                              )}
                            </div>
                            <div className={styles.imageDiffItem}>
                              <span className={styles.diffLabel}>After:</span>
                              {value.to ? (
                                <img src={value.to} alt="After" className={styles.diffImage} />
                              ) : (
                                <span className={styles.noImage}>No image</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={styles.diffLine}>
                              <span className={styles.diffRemoved}>- {formatValue(value.from)}</span>
                            </div>
                            <div className={styles.diffLine}>
                              <span className={styles.diffAdded}>+ {formatValue(value.to)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className={styles.fallbackValue}>
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {selectedEditSuggestion.status === 'pending' && (
              <div className={styles.reviewActions}>
                <div className={styles.commentSection}>
                  <label htmlFor="rejectionReason">Rejection reason (required for rejection):</label>
                  <textarea
                    id="rejectionReason"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add reason for rejection..."
                    className={styles.commentTextarea}
                  />
                </div>

                <div className={styles.actionButtons}>
                  <button
                    className={`${styles.actionButton} ${styles.approveButton}`}
                    onClick={() => handleApproveEditSuggestion(selectedEditSuggestion.id)}
                  >
                    Approve
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.rejectButton}`}
                    onClick={() => handleRejectEditSuggestion(selectedEditSuggestion.id, reviewComment)}
                    disabled={!reviewComment.trim()}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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

            {Array.isArray(selectedSubmission?.reviewerComments) && selectedSubmission.reviewerComments.length > 0 && (
              <div className={styles.commentsHistory}>
                <h4>Review History</h4>
                {selectedSubmission.reviewerComments?.map((comment, index) => (
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

