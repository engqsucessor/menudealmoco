import { useState } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState({ 
    show: false, 
    message: '', 
    type: 'success' 
  });

  const showNotification = (message, type = 'success', duration = 4000) => {
    setNotification({ show: true, message, type });
    
    if (duration > 0) {
      setTimeout(() => {
        setNotification({ show: false, message: '', type: 'success' });
      }, duration);
    }
  };

  const hideNotification = () => {
    setNotification({ show: false, message: '', type: 'success' });
  };

  return {
    notification,
    showNotification,
    hideNotification
  };
};