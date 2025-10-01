import React from 'react';
import styles from './ReportModal.module.css';

const ReportModal = ({
  isOpen,
  onClose,
  onSubmit,
  reportReason,
  setReportReason
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.reportModal}>
        <div className={styles.reportModalHeader}>
          <h3>Report Review</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
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
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.submitReportButton}
            onClick={onSubmit}
            disabled={!reportReason.trim()}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
