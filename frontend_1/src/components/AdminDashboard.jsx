import React, { useState, useEffect } from 'react';
import { reviewerApplicationsApi } from '../services/reviewerApplicationsApi';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [reviewingApp, setReviewingApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadApplications();
    loadStats();
  }, [filter]);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await reviewerApplicationsApi.getAllApplications(filter);
      setApplications(data);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await reviewerApplicationsApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleReview = async (applicationId, status) => {
    try {
      await reviewerApplicationsApi.reviewApplication(applicationId, status, adminNotes);
      setReviewingApp(null);
      setAdminNotes('');
      loadApplications();
      loadStats();
      alert(`Application ${status}!`);
    } catch (error) {
      alert('Failed to review application: ' + (error.response?.data?.detail || error.message));
    }
  };

  const openReviewDialog = (app) => {
    setReviewingApp(app);
    setAdminNotes('');
  };

  return (
    <div className={styles.adminDashboard}>
      <h2>Admin Dashboard - Reviewer Applications</h2>

      {stats && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>{stats.total}</h3>
            <p>Total</p>
          </div>
          <div className={styles.statCard}>
            <h3>{stats.pending}</h3>
            <p>Pending</p>
          </div>
          <div className={styles.statCard}>
            <h3>{stats.approved}</h3>
            <p>Approved</p>
          </div>
          <div className={styles.statCard}>
            <h3>{stats.rejected}</h3>
            <p>Rejected</p>
          </div>
        </div>
      )}

      <div className={styles.filters}>
        <button
          className={filter === 'all' ? styles.active : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'pending' ? styles.active : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={filter === 'approved' ? styles.active : ''}
          onClick={() => setFilter('approved')}
        >
          Approved
        </button>
        <button
          className={filter === 'rejected' ? styles.active : ''}
          onClick={() => setFilter('rejected')}
        >
          Rejected
        </button>
      </div>

      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className={styles.applicationsList}>
          {applications.map((app) => (
            <div key={app.id} className={styles.applicationCard}>
              <div className={styles.applicationHeader}>
                <div>
                  <h3>{app.userName}</h3>
                  <p className={styles.email}>{app.userEmail}</p>
                </div>
                <span className={`${styles.status} ${styles[app.status]}`}>
                  {app.status}
                </span>
              </div>

              <div className={styles.applicationBody}>
                <div className={styles.section}>
                  <strong>Motivation:</strong>
                  <p>{app.motivation}</p>
                </div>

                {app.experience && (
                  <div className={styles.section}>
                    <strong>Experience:</strong>
                    <p>{app.experience}</p>
                  </div>
                )}

                <div className={styles.meta}>
                  <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleString()}</p>
                  {app.reviewedAt && (
                    <p><strong>Reviewed:</strong> {new Date(app.reviewedAt).toLocaleString()}</p>
                  )}
                  {app.adminNotes && (
                    <p><strong>Admin Notes:</strong> {app.adminNotes}</p>
                  )}
                </div>

                {app.status === 'pending' && (
                  <div className={styles.actions}>
                    <button
                      className={styles.approveButton}
                      onClick={() => openReviewDialog(app)}
                    >
                      Review Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {reviewingApp && (
        <div className={styles.modalOverlay} onClick={() => setReviewingApp(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Review Application - {reviewingApp.userName}</h3>

            <div className={styles.formGroup}>
              <label>Admin Notes (optional):</label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about your decision..."
                rows={3}
                maxLength={500}
              />
            </div>

            <div className={styles.reviewButtons}>
              <button
                className={styles.rejectButton}
                onClick={() => handleReview(reviewingApp.id, 'rejected')}
              >
                Reject
              </button>
              <button
                className={styles.approveButton}
                onClick={() => handleReview(reviewingApp.id, 'approved')}
              >
                Approve
              </button>
            </div>

            <button
              className={styles.cancelButton}
              onClick={() => setReviewingApp(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
