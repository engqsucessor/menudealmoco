import React, { useState } from 'react';
import styles from './AddRestaurant.module.css';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    menuPrice: '',
    included: '',
    foodType: '',
    googleRating: '',
    googleReviews: '',
    zomatoRating: '',
    zomatoReviews: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to a server
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={styles.submittedMessage}>
        <h2>Thank you!</h2>
        <p>Your submission has been received and will be reviewed by our team.</p>
      </div>
    );
  }

  return (
    <div className={styles.addRestaurantPage}>
      <h1 className={styles.title}>Add a Restaurant</h1>
      <p className={styles.subtitle}>Help the community find new lunch deals.</p>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Restaurant Name *</label>
          <input
            id="name"
            type="text"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Address *</label>
          <input
            id="address"
            type="text"
            name="address"
            className={styles.input}
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="menuPrice">Menu Price (€) *</label>
          <input
            id="menuPrice"
            type="number"
            name="menuPrice"
            className={styles.input}
            value={formData.menuPrice}
            onChange={handleInputChange}
            required
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="included">What's Included? *</label>
          <input
            id="included"
            type="text"
            name="included"
            className={styles.input}
            placeholder="e.g., Soup + Main + Drink + Coffee"
            value={formData.included}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="foodType">Food Type *</label>
          <select
            id="foodType"
            name="foodType"
            className={styles.select}
            value={formData.foodType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a type</option>
            <option value="Traditional Portuguese">Traditional Portuguese</option>
            <option value="Modern/Contemporary">Modern/Contemporary</option>
            <option value="Seafood">Seafood</option>
            <option value="Meat-focused">Meat-focused</option>
            <option value="Vegetarian-friendly">Vegetarian-friendly</option>
            <option value="International">International</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="googleRating">Google Rating</label>
          <input
            id="googleRating"
            type="number"
            name="googleRating"
            className={styles.input}
            value={formData.googleRating}
            onChange={handleInputChange}
            step="0.1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="googleReviews">Number of Google Reviews</label>
          <input
            id="googleReviews"
            type="number"
            name="googleReviews"
            className={styles.input}
            value={formData.googleReviews}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="zomatoRating">Zomato Rating</label>
          <input
            id="zomatoRating"
            type="number"
            name="zomatoRating"
            className={styles.input}
            value={formData.zomatoRating}
            onChange={handleInputChange}
            step="0.1"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="zomatoReviews">Number of Zomato Reviews</label>
          <input
            id="zomatoReviews"
            type="number"
            name="zomatoReviews"
            className={styles.input}
            value={formData.zomatoReviews}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="photo">Photo of Menu (Required)</label>
          <input
            id="photo"
            type="file"
            name="photo"
            className={styles.input}
            accept="image/*"
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>Submit Restaurant</button>
      </form>
    </div>
  );
};

export default AddRestaurant;