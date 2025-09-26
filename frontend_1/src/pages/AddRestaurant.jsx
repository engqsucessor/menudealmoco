import React, { useState } from 'react';
import styles from './AddRestaurant.module.css';

const AddRestaurant = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    menuPrice: '',
    foodType: '',
    googleRating: '',
    googleReviews: '',
    description: '',
    numberOfDishes: '',
    dishes: [],
    included: {
      soup: false,
      main: true,
      drink: false,
      coffee: false,
      dessert: false,
      wine: false,
      bread: false,
    },
    practical: {
      takesCards: false,
      quickService: false,
      groupFriendly: false,
      hasParking: false,
    },
    priceRange: '',
    distance: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [category, field] = name.split('.');
    
    if (category === 'included' || category === 'practical') {
      setFormData(prev => ({
        ...prev,
        [category]: { ...prev[category], [field]: checked },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [category]: { ...prev[category], [name]: checked },
      }));
    }
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    const intValue = value === '' ? '' : Math.max(0, Math.min(5, parseInt(value, 10)));
    setFormData(prev => ({ ...prev, [name]: intValue }));
  };
  
  const handleNumberOfDishesChange = (e) => {
    const count = Math.max(0, parseInt(e.target.value, 10) || 0);
    setFormData(prev => ({
      ...prev,
      numberOfDishes: count,
      dishes: Array(count).fill(''),
    }));
  };

  const handleDishNameChange = (index, value) => {
    const newDishes = [...formData.dishes];
    newDishes[index] = value;
    setFormData(prev => ({ ...prev, dishes: newDishes }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        {/* Section 1: Basic Info & Location */}
        <fieldset className={`${styles.fieldset} ${styles.gridSpan2}`}>
          <legend className={styles.legend}>Basic Information</legend>
          <div className={styles.formGroup}>
            <label htmlFor="name">Restaurant Name *</label>
            <input id="name" type="text" name="name" className={styles.input} value={formData.name} onChange={handleInputChange} placeholder="e.g., Tasca do Zé" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Address *</label>
            <input id="address" type="text" name="address" className={styles.input} value={formData.address} onChange={handleInputChange} placeholder="e.g., Rua da Alegria, 123, Porto" required />
          </div>
        </fieldset>

        {/* Section 2: Deal Details */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Deal Details</legend>
          <div className={styles.formGroup}>
            <label htmlFor="menuPrice">Menu Price (€) *</label>
            <input id="menuPrice" type="number" name="menuPrice" className={styles.input} value={formData.menuPrice} onChange={handleInputChange} required step="0.01" placeholder="e.g., 12.50" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="priceRange">Price Range *</label>
            <select id="priceRange" name="priceRange" className={styles.select} value={formData.priceRange} onChange={handleInputChange} required>
              <option value="">Select range</option>
              <option value="6-8">€6-8 (Budget deals)</option>
              <option value="8-10">€8-10 (Standard)</option>
              <option value="10-12">€10-12 (Good value)</option>
              <option value="12-15">€12-15 (Premium)</option>
              <option value="15+">€15+ (High-end)</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>What's Included? *</label>
            <div className={styles.checkboxGroup}>
              {Object.keys(formData.included).map(item => (
                <label key={item} className={styles.checkboxLabel}>
                  <input type="checkbox" name={`included.${item}`} checked={formData.included[item]} onChange={handleCheckboxChange} />
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Section 3: Food & Ratings */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Cuisine & Ratings</legend>
          <div className={styles.formGroup}>
            <label htmlFor="foodType">Food Type *</label>
            <select id="foodType" name="foodType" className={styles.select} value={formData.foodType} onChange={handleInputChange} required>
              <option value="">Select a type</option>
              <option value="Traditional Portuguese">Traditional Portuguese</option>
              <option value="Modern/Contemporary">Modern/Contemporary</option>
              <option value="Seafood specialist">Seafood specialist</option>
              <option value="Meat-focused">Meat-focused</option>
              <option value="Vegetarian-friendly">Vegetarian-friendly</option>
              <option value="International">International</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="googleRating">Google Rating (0-5)</label>
            <input id="googleRating" type="number" name="googleRating" className={styles.input} value={formData.googleRating} onChange={handleRatingChange} placeholder="e.g., 4" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="googleReviews">Number of Google Reviews</label>
            <input id="googleReviews" type="number" name="googleReviews" className={styles.input} value={formData.googleReviews} onChange={handleInputChange} placeholder="e.g., 128" />
          </div>
          <div className={styles.formGroup}>
            <label>Practical Features</label>
            <div className={styles.checkboxGroup}>
              {Object.keys(formData.practical).map(item => (
                <label key={item} className={styles.checkboxLabel}>
                  <input type="checkbox" name={`practical.${item}`} checked={formData.practical[item]} onChange={handleCheckboxChange} />
                  {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Section 4: Description */}
        <fieldset className={`${styles.fieldset} ${styles.gridSpan2}`}>
          <legend className={styles.legend}>Description</legend>
          <div className={styles.formGroup}>
            <label htmlFor="description">General Notes</label>
            <textarea id="description" name="description" className={styles.textarea} value={formData.description} onChange={handleInputChange} placeholder="e.g., They usually have 5 daily specials. Great for groups." />
          </div>
        </fieldset>

        {/* Section 5: Daily Dishes */}
        <fieldset className={`${styles.fieldset} ${styles.gridSpan2}`}>
          <legend className={styles.legend}>Daily Dishes</legend>
          <div className={styles.formGroup}>
            <label htmlFor="numberOfDishes">How many daily dishes are usually available?</label>
            <input id="numberOfDishes" type="number" name="numberOfDishes" className={styles.input} value={formData.numberOfDishes} onChange={handleNumberOfDishesChange} placeholder="e.g., 3" />
          </div>
          {formData.dishes.map((dish, index) => (
            <div key={index} className={styles.formGroup}>
              <label htmlFor={`dish-${index}`}>Dish #{index + 1}</label>
              <input id={`dish-${index}`} type="text" value={dish} onChange={(e) => handleDishNameChange(index, e.target.value)} className={styles.input} placeholder={`Name of dish ${index + 1}`} />
            </div>
          ))}
        </fieldset>

        {/* Section 6: Submission */}
        <fieldset className={`${styles.fieldset} ${styles.gridSpan2}`}>
          <legend className={styles.legend}>Photos & Submission</legend>
          <div className={styles.formGroup}>
            <label htmlFor="restaurantPhoto">Restaurant Photo (Optional)</label>
            <input id="restaurantPhoto" type="file" name="restaurantPhoto" className={styles.input} accept="image/*" />
            <small className={styles.helpText}>Upload a photo of the restaurant exterior or interior</small>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="menuPhoto">Photo of Menu (Required)</label>
            <input id="menuPhoto" type="file" name="menuPhoto" className={styles.input} accept="image/*" required />
            <small className={styles.helpText}>Upload a clear photo of the lunch menu with prices</small>
          </div>
          <button type="submit" className={styles.submitButton}>Submit Restaurant</button>
        </fieldset>
      </form>
    </div>
  );
};

export default AddRestaurant;