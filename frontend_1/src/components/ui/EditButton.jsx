import React from 'react';
import styles from './EditButton.module.css';

const EditButton = ({ 
  onClick, 
  title = "Edit", 
  className = "", 
  disabled = false,
  children 
}) => {
  return (
    <button
      className={`${styles.editButton} ${className}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children || (
        <>
          ✏️ Edit
        </>
      )}
    </button>
  );
};

export default EditButton;