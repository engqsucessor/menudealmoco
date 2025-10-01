import React from 'react';
import styles from './Notification.module.css';

const Notification = ({ 
  show, 
  message, 
  type = 'success', 
  onClose, 
  duration = 4000,
  persistent = false 
}) => {
  // Auto-hide notification after duration unless persistent
  React.useEffect(() => {
    if (show && !persistent && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, persistent, duration, onClose]);

  if (!show) return null;

  return (
    <div className={`${styles.notification} ${styles[type]}`}>
      <div className={styles.notificationContent}>
        <span>{message}</span>
        <button 
          className={styles.notificationClose}
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;