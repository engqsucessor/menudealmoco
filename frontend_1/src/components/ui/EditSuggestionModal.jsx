import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { submitEditSuggestion } from '../../services/editSuggestionsService';
import styles from './EditSuggestionModal.module.css';

const EditSuggestionModal = ({ restaurant, isOpen, onClose, onSubmitted }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    menuPrice: restaurant?.menuPrice || '',
    whatsIncluded: restaurant?.whatsIncluded?.join(', ') || '',
    foodType: restaurant?.foodType || '',
    city: restaurant?.city || '',
    district: restaurant?.district || '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const hasChanges = () => {
    return (
      formData.name !== restaurant?.name ||
      parseFloat(formData.menuPrice) !== restaurant?.menuPrice ||
      formData.whatsIncluded !== restaurant?.whatsIncluded?.join(', ') ||
      formData.foodType !== restaurant?.foodType ||
      formData.city !== restaurant?.city ||
      formData.district !== restaurant?.district
    );
  };

  const getChanges = () => {
    const changes = {};
    
    if (formData.name !== restaurant?.name) {
      changes.name = formData.name;
    }
    if (parseFloat(formData.menuPrice) !== restaurant?.menuPrice) {
      changes.menuPrice = parseFloat(formData.menuPrice);
    }
    if (formData.whatsIncluded !== restaurant?.whatsIncluded?.join(', ')) {
      changes.whatsIncluded = formData.whatsIncluded.split(',').map(item => item.trim()).filter(item => item);
    }
    if (formData.foodType !== restaurant?.foodType) {
      changes.foodType = formData.foodType;
    }
    if (formData.city !== restaurant?.city) {
      changes.city = formData.city;
    }
    if (formData.district !== restaurant?.district) {
      changes.district = formData.district;
    }
    
    return changes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to suggest edits');
      return;
    }

    if (!hasChanges()) {
      alert('No changes detected');
      return;
    }

    if (!formData.reason.trim()) {
      alert('Please provide a reason for your edit suggestion');
      return;
    }

    setLoading(true);

    try {
      const changes = getChanges();
      const result = await submitEditSuggestion(
        restaurant.id,
        user.email,
        changes,
        formData.reason.trim()
      );

      if (result.success) {
        onSubmitted && onSubmitted();
        onClose();
        // Reset form
        setFormData({
          name: restaurant?.name || '',
          menuPrice: restaurant?.menuPrice || '',
          whatsIncluded: restaurant?.whatsIncluded?.join(', ') || '',
          foodType: restaurant?.foodType || '',
          city: restaurant?.city || '',
          district: restaurant?.district || '',
          reason: ''
        });
      }
    } catch (error) {
      console.error('Error submitting edit suggestion:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Suggest Edit</h2>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Restaurant Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Menu Price (€):</label>
            <input
              type="number"
              step="0.01"
              name="menuPrice"
              value={formData.menuPrice}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>What's Included (comma-separated):</label>
            <input
              type="text"
              name="whatsIncluded"
              value={formData.whatsIncluded}
              onChange={handleChange}
              className={styles.input}
              placeholder="e.g. Soup, Main Course, Drink"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Food Type:</label>
            <input
              type="text"
              name="foodType"
              value={formData.foodType}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          <div className={styles.fieldsRow}>
            <div className={styles.field}>
              <label className={styles.label}>City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>District:</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Reason for edit (required):</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Please explain why you're suggesting these changes..."
              rows={3}
              required
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !hasChanges()}
              className={styles.submitButton}
            >
              {loading ? 'Submitting...' : 'Submit Edit Suggestion'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSuggestionModal;