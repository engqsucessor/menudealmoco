import React, { useState } from 'react';
import { reviewerApplicationsApi } from '../services/reviewerApplicationsApi';
import styles from './ReviewerApplicationModal.module.css';

const ReviewerApplicationModal = ({ onClose, onSuccess }) => {
  const [motivation, setMotivation] = useState('');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (motivation.trim().length < 50) {
      setError('Motivation must be at least 50 characters');
      return;
    }

    setLoading(true);

    try {
      await reviewerApplicationsApi.apply(motivation, experience);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Apply to Become a Reviewer</h2>
        <p className={styles.subtitle}>
          Help us maintain quality by reviewing restaurant submissions and managing content.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="motivation">
              Why do you want to be a reviewer? *
              <span className={styles.charCount}>
                {motivation.length}/1000 (min 50)
              </span>
            </label>
            <textarea
              id="motivation"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              placeholder="Tell us why you'd like to become a reviewer and what makes you a good fit..."
              rows={5}
              maxLength={1000}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="experience">
              Relevant experience (optional)
              <span className={styles.charCount}>
                {experience.length}/1000
              </span>
            </label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Share any relevant experience (food industry, reviewing, moderation, etc.)..."
              rows={4}
              maxLength={1000}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading || motivation.length < 50}
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewerApplicationModal;
