import React from 'react';
import styles from './DeleteConfirmationModal.module.css';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  restaurantName
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.deleteModal}>
        <div className={styles.deleteModalHeader}>
          <h3>Delete Restaurant</h3>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className={styles.deleteModalBody}>
          <p><strong>Are you sure you want to delete "{restaurantName}"?</strong></p>
          <p>This action will permanently delete:</p>
          <ul>
            <li>The restaurant and all its information</li>
            <li>All reviews and ratings for this restaurant</li>
            <li>All user votes on reviews</li>
            <li>All reports related to reviews</li>
            <li>All user favorites for this restaurant</li>
          </ul>
          <p><strong>This action cannot be undone!</strong></p>
        </div>
        <div className={styles.deleteModalActions}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={styles.confirmDeleteButton}
            onClick={onConfirm}
          >
            Delete Restaurant
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
