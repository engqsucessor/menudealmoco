import React from 'react';
import styles from './PhotoModal.module.css';

const PhotoModal = ({ isOpen, onClose, photo, photoNumber, title }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.photoContainer}>
          <img src={photo} alt={title} className={styles.photo} />
          <div className={styles.photoInfo}>
            <span className={styles.photoNumber}>Photo {photoNumber}</span>
            <span className={styles.photoTitle}>{title}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;