import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProfileSettings.module.css';

const ProfileSettings = () => {
  const { user, updateDisplayName } = useAuth();
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = () => {
    if (newDisplayName.trim() && newDisplayName !== user.displayName) {
      const success = updateDisplayName(newDisplayName);
      if (success) {
        setMessage('Display name updated!');
        setIsEditing(false);
        setTimeout(() => setMessage(''), 3000);
      }
    } else {
      setIsEditing(false);
      setNewDisplayName(user.displayName);
    }
  };

  const handleCancel = () => {
    setNewDisplayName(user.displayName);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className={styles.profileSettings}>
      <h3 className={styles.title}>Profile Settings</h3>
      
      <div className={styles.field}>
        <label className={styles.label}>Display Name:</label>
        {isEditing ? (
          <div className={styles.editMode}>
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              className={styles.input}
              placeholder="Enter new display name..."
              maxLength={30}
            />
            <div className={styles.buttons}>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.displayMode}>
            <span className={styles.currentName}>{user.displayName}</span>
            <button 
              onClick={() => setIsEditing(true)} 
              className={styles.editButton}
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {message && (
        <div className={styles.message}>
          {message}
        </div>
      )}

      <div className={styles.info}>
        <p>This is how your name will appear on reviews and ratings.</p>
        <p>Your email ({user.email}) remains private.</p>
      </div>
    </div>
  );
};

export default ProfileSettings;