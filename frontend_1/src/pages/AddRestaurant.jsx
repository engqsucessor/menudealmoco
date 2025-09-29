import React, { useState } from 'react';
import { PRACTICAL_FEATURES, INCLUDED_FEATURES, getPracticalFeatureLabel, getIncludedFeatureLabel } from '../constants/labels';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import styles from './AddRestaurant.module.css';

const AddRestaurant = ({
  restaurant = null,
  isEditMode = false,
  isModal = false,
  onClose = null,
  onSubmit = null
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: restaurant?.name || '',
    address: restaurant?.address || '',
    district: restaurant?.district || '',
    city: restaurant?.city || '',
    menuPrice: restaurant?.menuPrice || '',
    foodType: restaurant?.foodType || '',
    googleRating: restaurant?.googleRating || '',
    googleReviews: restaurant?.googleReviews || '',
    description: restaurant?.description || '',
    numberOfDishes: restaurant?.dishes?.length || '',
    dishes: restaurant?.dishes || [],
    provideDishNames: (restaurant?.dishes?.length > 0 && restaurant?.dishes.some(dish => dish.trim())) || false,
    included: {
      soup: restaurant?.whatsIncluded?.includes('soup') || false,
      main: restaurant?.whatsIncluded?.includes('main') || true,
      drink: restaurant?.whatsIncluded?.includes('drink') || false,
      coffee: restaurant?.whatsIncluded?.includes('coffee') || false,
      dessert: restaurant?.whatsIncluded?.includes('dessert') || false,
      wine: restaurant?.whatsIncluded?.includes('wine') || false,
      bread: restaurant?.whatsIncluded?.includes('bread') || false,
    },
    practical: {
      takesCards: restaurant?.practical?.cardsAccepted || false,
      quickService: restaurant?.practical?.quickService || false,
      groupFriendly: restaurant?.practical?.groupFriendly || false,
      hasParking: restaurant?.practical?.parking || false,
    },
    priceRange: restaurant?.priceRange || '',
    distance: restaurant?.distance || '',
    // Edit-specific fields
    reason: '',
    // Image fields
    restaurantPhoto: restaurant?.restaurantPhoto || '',
    menuPhoto: restaurant?.menuPhoto || ''
  });

  const [imagePreviews, setImagePreviews] = useState({
    restaurantPhoto: restaurant?.restaurantPhoto || '',
    menuPhoto: restaurant?.menuPhoto || ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

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
    const floatValue = value === '' ? '' : Math.max(0, Math.min(5, parseFloat(value)));
    setFormData(prev => ({ ...prev, [name]: floatValue }));
  };
  
  const handleNumberOfDishesChange = (e) => {
    const count = Math.max(0, parseInt(e.target.value, 10) || 0);
    const currentDishes = formData.dishes || [];

    // Only create/modify dishes array if provideDishNames is true
    let newDishes;
    if (formData.provideDishNames) {
      if (count > currentDishes.length) {
        // Adding dishes - keep existing and add empty ones
        newDishes = [...currentDishes, ...Array(count - currentDishes.length).fill('')];
      } else {
        // Reducing dishes - keep only the first 'count' dishes
        newDishes = currentDishes.slice(0, count);
      }
    } else {
      // If not providing dish names, just keep an empty array
      newDishes = [];
    }

    setFormData(prev => ({
      ...prev,
      numberOfDishes: count,
      dishes: newDishes,
    }));
  };

  const handleProvideDishNamesChange = (e) => {
    const { checked } = e.target;
    setFormData(prev => {
      let newDishes;
      if (checked && prev.numberOfDishes > 0) {
        // If enabling dish names and we have a count, create empty dish array
        newDishes = Array(prev.numberOfDishes).fill('');
      } else {
        // If disabling dish names, clear the dishes array
        newDishes = [];
      }
      
      return {
        ...prev,
        provideDishNames: checked,
        dishes: newDishes
      };
    });
  };

  const handleDishNameChange = (index, value) => {
    const newDishes = [...formData.dishes];
    newDishes[index] = value;
    setFormData(prev => ({ ...prev, dishes: newDishes }));
  };

  const handleImageUpload = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        setImagePreviews(prev => ({ ...prev, [imageType]: imageUrl }));
        setFormData(prev => ({ ...prev, [imageType]: imageUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showNotification('You must be logged in to submit a restaurant', 'error');
      return;
    }

    if (isEditMode) {
      // Handle edit mode
      if (!formData.reason.trim()) {
        showNotification('Please provide a reason for your edit suggestion', 'error');
        return;
      }

      // Call the onSubmit callback if provided (for modal mode)
      if (onSubmit) {
        onSubmit(formData);
        return;
      }
    }

    try {
      // Prepare submission data
      const submissionData = {
        name: formData.name,
        address: formData.address,
        district: formData.district,
        city: formData.city,
        menuPrice: parseFloat(formData.menuPrice),
        priceRange: formData.priceRange,
        foodType: formData.foodType,
        googleRating: formData.googleRating ? parseFloat(formData.googleRating) : null,
        googleReviews: formData.googleReviews ? parseInt(formData.googleReviews) : null,
        description: formData.description,
        numberOfDishes: parseInt(formData.numberOfDishes) || 0,
        dishes: formData.dishes.filter(dish => dish.trim()),
        whatsIncluded: Object.keys(formData.included).filter(key => formData.included[key]),
        practical: formData.practical,
        restaurantPhoto: formData.restaurantPhoto,
        menuPhoto: formData.menuPhoto,
        reason: formData.reason
      };

      // If called from modal (like reviewer dashboard), use the callback
      if (onSubmit) {
        onSubmit(submissionData);
        return;
      }

      // Otherwise, submit to backend normally
      const submission = await apiService.submitRestaurant(submissionData, user.email);
      setSubmitted(true);
      showNotification('Restaurant submitted successfully!', 'success');
    } catch (error) {
      console.error('Error submitting restaurant:', error);
      showNotification('Error submitting restaurant. Please try again.', 'error');
    }
  };

  if (submitted) {
    return (
      <div className={styles.submittedMessage}>
        <h2>Thank you!</h2>
        <p>Your {isEditMode ? 'edit suggestion' : 'submission'} has been received and will be reviewed by our team.</p>
        {isModal && (
          <button onClick={onClose} className={styles.closeButton}>Close</button>
        )}
      </div>
    );
  }

  const content = (
    <>
      {!isModal && (
        <>
          <h1 className={styles.title}>{isEditMode ? 'Suggest Restaurant Edit' : 'Add a Restaurant'}</h1>
          <p className={styles.subtitle}>
            {isEditMode 
              ? 'Suggest improvements to help keep restaurant information accurate.' 
              : 'Help the community find new lunch deals.'}
          </p>
        </>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Section 1: Basic Info & Location */}
        <fieldset className={`${styles.fieldset} ${styles.gridSpan2}`}>
          <legend className={styles.legend}>Basic Information</legend>
          <div className={styles.formGroup}>
            <label htmlFor="name">Restaurant Name *</label>
            <input id="name" type="text" name="name" className={styles.input} value={formData.name} onChange={handleInputChange} placeholder="e.g., Tasca do Zé" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">Street Address</label>
            <input id="address" type="text" name="address" className={styles.input} value={formData.address} onChange={handleInputChange} placeholder="e.g., Rua da Alegria, 123" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="district">District *</label>
            <input id="district" type="text" name="district" className={styles.input} value={formData.district} onChange={handleInputChange} placeholder="e.g., Chiado, Bairro Alto" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="city">City *</label>
            <input id="city" type="text" name="city" className={styles.input} value={formData.city} onChange={handleInputChange} placeholder="e.g., Lisboa, Porto" required />
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
                  {getIncludedFeatureLabel(item, true)}
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
            <input id="googleRating" type="number" name="googleRating" className={styles.input} value={formData.googleRating} onChange={handleRatingChange} placeholder="e.g., 4.1" step="0.1" min="0" max="5" />
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
                  {getPracticalFeatureLabel(item, true, false)}
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
            <input 
              id="numberOfDishes" 
              type="number" 
              name="numberOfDishes" 
              className={styles.input} 
              value={formData.numberOfDishes} 
              onChange={handleNumberOfDishesChange} 
              placeholder="e.g., 3" 
              min="0"
              max="20"
            />
            <small className={styles.helpText}>
              Daily dishes change each day, so we only need to know the typical number available.
            </small>
          </div>

          {/* Checkbox to choose whether to provide dish names */}
          {formData.numberOfDishes > 0 && (
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="checkbox" 
                  checked={formData.provideDishNames}
                  onChange={handleProvideDishNamesChange}
                />
                I want to provide example dish names
              </label>
              <small className={styles.helpText}>
                Check this if you want to provide specific dish name examples. Otherwise, we'll just record the number of dishes available.
              </small>
            </div>
          )}

          {/* Dynamic dish name inputs */}
          {formData.numberOfDishes > 0 && formData.provideDishNames && (
            <div className={styles.formGroup}>
              <label>Dish Names (Optional Examples)</label>
              <small className={styles.helpText}>
                You can provide example dish names to help people understand what type of food is available.
              </small>
              {Array.from({ length: formData.numberOfDishes }, (_, index) => (
                <input
                  key={index}
                  type="text"
                  className={styles.input}
                  value={formData.dishes[index] || ''}
                  onChange={(e) => handleDishNameChange(index, e.target.value)}
                  placeholder={`Example dish ${index + 1} (e.g., Grilled Salmon, Chicken Curry)`}
                  style={{ marginBottom: '0.5rem' }}
                />
              ))}
            </div>
          )}
        </fieldset>

        {/* Section 6: Submission */}
        <fieldset className={`${styles.fieldset} ${styles.gridSpan2}`}>
          <legend className={styles.legend}>Photos & Submission</legend>
          <div className={styles.formGroup}>
            <label htmlFor="restaurantPhoto">Restaurant Photo (Optional)</label>
            <input
              id="restaurantPhoto"
              type="file"
              name="restaurantPhoto"
              className={styles.input}
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'restaurantPhoto')}
            />
            <small className={styles.helpText}>Upload a photo of the restaurant exterior or interior</small>
            {imagePreviews.restaurantPhoto && (
              <div className={styles.imagePreview}>
                <img src={imagePreviews.restaurantPhoto} alt="Restaurant preview" className={styles.previewImage} />
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="menuPhoto">{isEditMode ? 'New Menu de Almoço Photo (Optional)' : 'Photo of Menu (Required)'}</label>
            <input
              id="menuPhoto"
              type="file"
              name="menuPhoto"
              className={styles.input}
              accept="image/*"
              required={!isEditMode && !imagePreviews.menuPhoto}
              onChange={(e) => handleImageUpload(e, 'menuPhoto')}
            />
            <small className={styles.helpText}>
              {isEditMode
                ? 'Upload a new photo of the lunch menu with prices (leave empty to keep current photo)'
                : 'Upload a clear photo of the lunch menu with prices'}
            </small>
            {imagePreviews.menuPhoto && (
              <div className={styles.imagePreview}>
                <img src={imagePreviews.menuPhoto} alt="Menu preview" className={styles.previewImage} />
              </div>
            )}
          </div>
          {isEditMode && (
            <div className={styles.formGroup}>
              <label htmlFor="reason">Reason for Edit (Required) *</label>
              <textarea 
                id="reason" 
                name="reason" 
                className={styles.textarea} 
                value={formData.reason} 
                onChange={handleInputChange}
                placeholder="Please explain why you're suggesting these changes..."
                rows={3}
                required
              />
            </div>
          )}
          <div className={styles.buttonGroup}>
            {isModal && (
              <button type="button" onClick={onClose} className={styles.cancelButton}>
                Cancel
              </button>
            )}
            <button type="submit" className={styles.submitButton}>
              {isEditMode ? 'Submit Edit Suggestion' : 'Submit Restaurant'}
            </button>
          </div>
        </fieldset>
      </form>
    </>
  );

  if (isModal) {
    return (
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.title}>
              {isEditMode ? 'Suggest Restaurant Edit' : 'Add Restaurant'}
            </h2>
            <button onClick={onClose} className={styles.closeButton}>×</button>
          </div>
          {content}
          
          {/* Notification for modal */}
          {notification.show && (
            <div className={`${styles.notification} ${styles[notification.type]}`}>
              <div className={styles.notificationContent}>
                <span>{notification.message}</span>
                <button 
                  className={styles.notificationClose}
                  onClick={() => setNotification({ show: false, message: '', type: '' })}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.addRestaurantPage}>
      {content}
      
      {/* Notification */}
      {notification.show && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          <div className={styles.notificationContent}>
            <span>{notification.message}</span>
            <button 
              className={styles.notificationClose}
              onClick={() => setNotification({ show: false, message: '', type: '' })}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRestaurant;