/**
 * Submission Service - Mock Backend API for Menu Deal Moço
 * Simulates restaurant submission and validation functionality
 */

// Simulate network delay
const simulateDelay = (min = 500, max = 1500) => {
  return new Promise(resolve =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// Simulate random API failures (4% chance)
const simulateFailure = () => {
  if (Math.random() < 0.04) {
    throw new Error('Network error: Failed to submit restaurant');
  }
};

// Local storage keys
const STORAGE_KEYS = {
  SUBMISSIONS: 'menudealmoco_submissions',
  PENDING_SUBMISSIONS: 'menudealmoco_pending_submissions',
  REJECTED_SUBMISSIONS: 'menudealmoco_rejected_submissions',
  RESTAURANTS: 'menudealmoco_restaurants'
};

// Initialize local storage
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PENDING_SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.PENDING_SUBMISSIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REJECTED_SUBMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.REJECTED_SUBMISSIONS, JSON.stringify([]));
  }
};

// Get submissions from storage
const getSubmissionsFromStorage = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBMISSIONS) || '[]');
};

// Save submissions to storage
const saveSubmissionsToStorage = (submissions) => {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
};

// Get pending submissions from storage
const getPendingSubmissionsFromStorage = () => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_SUBMISSIONS) || '[]');
};

// Save pending submissions to storage
const savePendingSubmissionsToStorage = (submissions) => {
  localStorage.setItem(STORAGE_KEYS.PENDING_SUBMISSIONS, JSON.stringify(submissions));
};

// Generate unique submission ID
const generateSubmissionId = () => {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Validate required fields
const validateSubmission = (submissionData) => {
  const errors = [];

  // Required fields validation
  if (!submissionData.restaurantName || submissionData.restaurantName.trim().length < 2) {
    errors.push('Restaurant name must be at least 2 characters long');
  }

  if (!submissionData.address || submissionData.address.trim().length < 10) {
    errors.push('Full address is required (minimum 10 characters)');
  }

  if (!submissionData.menuPrice || submissionData.menuPrice < 5 || submissionData.menuPrice > 50) {
    errors.push('Menu price must be between €5 and €50');
  }

  if (!submissionData.whatsIncluded || submissionData.whatsIncluded.length === 0) {
    errors.push('What\'s included in the menu is required');
  }

  if (!submissionData.foodType) {
    errors.push('Food type/cuisine is required');
  }

  if (!submissionData.menuPhoto) {
    errors.push('Photo of menu board or price display is required');
  }

  if (!submissionData.submitterName || submissionData.submitterName.trim().length < 2) {
    errors.push('Submitter name is required');
  }

  if (!submissionData.submitterEmail || !isValidEmail(submissionData.submitterEmail)) {
    errors.push('Valid email address is required');
  }

  // Validate coordinates if provided
  if (submissionData.coordinates) {
    if (!submissionData.coordinates.lat || !submissionData.coordinates.lng) {
      errors.push('Both latitude and longitude are required for coordinates');
    }
    if (submissionData.coordinates.lat < -90 || submissionData.coordinates.lat > 90) {
      errors.push('Latitude must be between -90 and 90');
    }
    if (submissionData.coordinates.lng < -180 || submissionData.coordinates.lng > 180) {
      errors.push('Longitude must be between -180 and 180');
    }
  }

  // Validate business hours format if provided
  if (submissionData.businessHours) {
    const validationResult = validateBusinessHours(submissionData.businessHours);
    if (!validationResult.valid) {
      errors.push(`Business hours format error: ${validationResult.error}`);
    }
  }

  return errors;
};

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Business hours validation helper
const validateBusinessHours = (hours) => {
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  for (const day of validDays) {
    if (hours[day] && hours[day] !== 'closed') {
      // Check format like "12:00-15:00,19:00-22:30" or "12:00-15:00"
      const timePattern = /^(\d{1,2}:\d{2}-\d{1,2}:\d{2})(?:,\d{1,2}:\d{2}-\d{1,2}:\d{2})*$/;
      if (!timePattern.test(hours[day])) {
        return {
          valid: false,
          error: `Invalid time format for ${day}. Use format like "12:00-15:00" or "12:00-15:00,19:00-22:30"`
        };
      }
    }
  }

  return { valid: true };
};

// Check for duplicate restaurants
const checkForDuplicate = async (submissionData) => {
  const restaurants = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESTAURANTS) || '[]');
  const pendingSubmissions = getPendingSubmissionsFromStorage();

  // Check against existing restaurants
  const existingDuplicate = restaurants.find(restaurant =>
    restaurant.name.toLowerCase() === submissionData.restaurantName.toLowerCase() &&
    restaurant.address.toLowerCase().includes(submissionData.address.toLowerCase().split(',')[0])
  );

  if (existingDuplicate) {
    return {
      isDuplicate: true,
      type: 'existing',
      restaurant: existingDuplicate
    };
  }

  // Check against pending submissions
  const pendingDuplicate = pendingSubmissions.find(submission =>
    submission.restaurantName.toLowerCase() === submissionData.restaurantName.toLowerCase() &&
    submission.address.toLowerCase().includes(submissionData.address.toLowerCase().split(',')[0])
  );

  if (pendingDuplicate) {
    return {
      isDuplicate: true,
      type: 'pending',
      submission: pendingDuplicate
    };
  }

  return { isDuplicate: false };
};

// Simulate admin validation process
const simulateAdminValidation = async (submission) => {
  // Random validation outcome (85% approval rate)
  const isApproved = Math.random() > 0.15;

  if (isApproved) {
    return {
      status: 'approved',
      message: 'Restaurant verified and approved for listing',
      adminNotes: 'All information verified. Menu prices confirmed through online sources.'
    };
  } else {
    const rejectionReasons = [
      'Restaurant appears to be permanently closed',
      'Menu prices could not be verified',
      'Address does not match restaurant location',
      'Insufficient photo quality for menu verification',
      'Restaurant specializes in takeaway only, not sit-down meals'
    ];

    return {
      status: 'rejected',
      message: 'Submission rejected during validation',
      adminNotes: rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)]
    };
  }
};

// Convert submission to restaurant format
const convertSubmissionToRestaurant = (submission, validationResult) => {
  return {
    id: `rest_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name: submission.restaurantName,
    address: submission.address,
    coordinates: submission.coordinates || {
      lat: 41.1579 + (Math.random() - 0.5) * 0.2, // Random coords around Porto/Lisboa
      lng: -8.6291 + (Math.random() - 0.5) * 0.2
    },
    city: submission.city || extractCityFromAddress(submission.address),
    district: submission.district || 'Centro',
    menuPrice: parseFloat(submission.menuPrice),
    foodType: submission.foodType,
    whatsIncluded: submission.whatsIncluded,
    description: submission.description || `Traditional Portuguese restaurant serving ${submission.foodType.toLowerCase()} cuisine.`,
    photos: [submission.menuPhoto, ...(submission.additionalPhotos || [])],
    overallRating: 0, // New restaurants start with no rating
    totalReviews: 0,
    ratings: {
      valueForMoney: 0,
      foodQuality: 0,
      portionSize: 0,
      serviceSpeed: 0
    },
    businessHours: submission.businessHours || {
      monday: "12:00-15:00,19:00-22:00",
      tuesday: "12:00-15:00,19:00-22:00",
      wednesday: "12:00-15:00,19:00-22:00",
      thursday: "12:00-15:00,19:00-22:00",
      friday: "12:00-15:00,19:00-22:30",
      saturday: "12:00-15:00,19:00-22:30",
      sunday: "closed"
    },
    contact: {
      phone: submission.phone || null,
      email: submission.email || null,
      website: submission.website || null
    },
    practicalInfo: {
      takesCards: submission.takesCards || true,
      hasParking: submission.hasParking || false,
      quickService: submission.quickService || true,
      groupFriendly: submission.groupFriendly || true,
      nearMetro: submission.nearMetro || false,
      metroStation: submission.metroStation || null
    },
    features: {
      coffeeIncluded: submission.whatsIncluded.includes('coffee'),
      dessertIncluded: submission.whatsIncluded.includes('dessert'),
      wineAvailable: submission.wineAvailable || true,
      breadSoupIncluded: submission.whatsIncluded.includes('soup') || submission.whatsIncluded.includes('bread'),
      vegetarianOptions: submission.vegetarianOptions || false
    },
    isOpen: true,
    lastUpdated: new Date(),
    submittedBy: submission.submitterId,
    approved: true,
    validationNotes: validationResult.adminNotes
  };
};

// Extract city from address (simple implementation)
const extractCityFromAddress = (address) => {
  const cities = ['Porto', 'Lisboa', 'Coimbra', 'Braga', 'Aveiro', 'Faro'];
  const foundCity = cities.find(city => address.toLowerCase().includes(city.toLowerCase()));
  return foundCity || 'Porto'; // Default to Porto
};

/**
 * Submission Service API
 */
export const submissionService = {
  /**
   * Submit a new restaurant for review
   * @param {Object} submissionData - Restaurant submission data
   * @returns {Promise<Object>} Submission result
   */
  async submitRestaurant(submissionData) {
    await simulateDelay();
    simulateFailure();

    // Validate submission data
    const validationErrors = validateSubmission(submissionData);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Check for duplicates
    const duplicateCheck = await checkForDuplicate(submissionData);
    if (duplicateCheck.isDuplicate) {
      throw new Error(
        duplicateCheck.type === 'existing'
          ? 'This restaurant is already listed in our database'
          : 'This restaurant has already been submitted and is pending review'
      );
    }

    // Create submission object
    const submission = {
      id: generateSubmissionId(),
      ...submissionData,
      submittedAt: new Date(),
      status: 'pending', // pending, approved, rejected
      validationStage: 'submitted', // submitted, in_review, validated
      adminNotes: '',
      submitterId: submissionData.submitterId || `user_${Date.now()}`
    };

    // Save to pending submissions
    const pendingSubmissions = getPendingSubmissionsFromStorage();
    pendingSubmissions.push(submission);
    savePendingSubmissionsToStorage(pendingSubmissions);

    // Save to all submissions history
    const allSubmissions = getSubmissionsFromStorage();
    allSubmissions.push(submission);
    saveSubmissionsToStorage(allSubmissions);

    return {
      submissionId: submission.id,
      status: 'submitted',
      message: 'Restaurant submitted successfully! We will review your submission within 2-3 business days.',
      estimatedReviewTime: '2-3 business days',
      submissionData: {
        id: submission.id,
        restaurantName: submission.restaurantName,
        address: submission.address,
        submittedAt: submission.submittedAt
      }
    };
  },

  /**
   * Get submission status
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object>} Submission status
   */
  async getSubmissionStatus(submissionId) {
    await simulateDelay(200, 500);

    const allSubmissions = getSubmissionsFromStorage();
    const submission = allSubmissions.find(sub => sub.id === submissionId);

    if (!submission) {
      throw new Error('Submission not found');
    }

    return {
      id: submission.id,
      restaurantName: submission.restaurantName,
      status: submission.status,
      validationStage: submission.validationStage,
      submittedAt: submission.submittedAt,
      reviewedAt: submission.reviewedAt || null,
      adminNotes: submission.status === 'rejected' ? submission.adminNotes : '',
      estimatedCompletion: this.calculateEstimatedCompletion(submission)
    };
  },

  /**
   * Get user's submissions
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User's submissions
   */
  async getUserSubmissions(userId) {
    await simulateDelay(300, 600);

    const allSubmissions = getSubmissionsFromStorage();
    const userSubmissions = allSubmissions.filter(sub => sub.submitterId === userId);

    return userSubmissions.map(submission => ({
      id: submission.id,
      restaurantName: submission.restaurantName,
      address: submission.address,
      status: submission.status,
      submittedAt: submission.submittedAt,
      reviewedAt: submission.reviewedAt || null
    }));
  },

  /**
   * Update submission (for resubmission after rejection)
   * @param {string} submissionId - Submission ID
   * @param {string} userId - User ID
   * @param {Object} updateData - Updated submission data
   * @returns {Promise<Object>} Update result
   */
  async updateSubmission(submissionId, userId, updateData) {
    await simulateDelay(500, 1000);
    simulateFailure();

    const allSubmissions = getSubmissionsFromStorage();
    const submissionIndex = allSubmissions.findIndex(
      sub => sub.id === submissionId && sub.submitterId === userId
    );

    if (submissionIndex === -1) {
      throw new Error('Submission not found or you do not have permission to update it');
    }

    const submission = allSubmissions[submissionIndex];

    // Only allow updates on rejected submissions
    if (submission.status !== 'rejected') {
      throw new Error('Only rejected submissions can be updated');
    }

    // Validate updated data
    const validationErrors = validateSubmission({ ...submission, ...updateData });
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }

    // Update submission
    const updatedSubmission = {
      ...submission,
      ...updateData,
      status: 'pending',
      validationStage: 'submitted',
      resubmittedAt: new Date(),
      adminNotes: ''
    };

    allSubmissions[submissionIndex] = updatedSubmission;
    saveSubmissionsToStorage(allSubmissions);

    // Also update pending submissions
    const pendingSubmissions = getPendingSubmissionsFromStorage();
    pendingSubmissions.push(updatedSubmission);
    savePendingSubmissionsToStorage(pendingSubmissions);

    return {
      submissionId: updatedSubmission.id,
      status: 'resubmitted',
      message: 'Submission updated and resubmitted for review'
    };
  },

  /**
   * Simulate admin validation process (for demo purposes)
   * @param {string} submissionId - Submission ID
   * @returns {Promise<Object>} Validation result
   */
  async simulateValidation(submissionId) {
    await simulateDelay(2000, 4000); // Longer delay for validation

    const pendingSubmissions = getPendingSubmissionsFromStorage();
    const submissionIndex = pendingSubmissions.findIndex(sub => sub.id === submissionId);

    if (submissionIndex === -1) {
      throw new Error('Pending submission not found');
    }

    const submission = pendingSubmissions[submissionIndex];

    // Simulate validation process
    const validationResult = await simulateAdminValidation(submission);

    // Update submission with validation result
    const validatedSubmission = {
      ...submission,
      status: validationResult.status,
      validationStage: 'validated',
      reviewedAt: new Date(),
      adminNotes: validationResult.adminNotes
    };

    // Update in all submissions
    const allSubmissions = getSubmissionsFromStorage();
    const allSubmissionIndex = allSubmissions.findIndex(sub => sub.id === submissionId);
    if (allSubmissionIndex !== -1) {
      allSubmissions[allSubmissionIndex] = validatedSubmission;
      saveSubmissionsToStorage(allSubmissions);
    }

    // Remove from pending if approved (move to restaurants) or rejected
    pendingSubmissions.splice(submissionIndex, 1);
    savePendingSubmissionsToStorage(pendingSubmissions);

    if (validationResult.status === 'approved') {
      // Convert to restaurant and add to restaurants list
      const newRestaurant = convertSubmissionToRestaurant(submission, validationResult);
      const restaurants = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESTAURANTS) || '[]');
      restaurants.push(newRestaurant);
      localStorage.setItem(STORAGE_KEYS.RESTAURANTS, JSON.stringify(restaurants));

      return {
        status: 'approved',
        message: 'Restaurant approved and added to listings!',
        restaurantId: newRestaurant.id,
        restaurantData: newRestaurant
      };
    } else {
      // Save to rejected submissions
      const rejectedSubmissions = JSON.parse(localStorage.getItem(STORAGE_KEYS.REJECTED_SUBMISSIONS) || '[]');
      rejectedSubmissions.push(validatedSubmission);
      localStorage.setItem(STORAGE_KEYS.REJECTED_SUBMISSIONS, JSON.stringify(rejectedSubmissions));

      return {
        status: 'rejected',
        message: 'Submission rejected during validation',
        reason: validationResult.adminNotes
      };
    }
  },

  /**
   * Get validation guidelines
   * @returns {Promise<Object>} Validation guidelines and tips
   */
  async getSubmissionGuidelines() {
    await simulateDelay(100, 300);

    return {
      requiredFields: [
        {
          field: 'restaurantName',
          description: 'Full restaurant name as displayed on signage',
          examples: ['Tasquinha do João', 'Marisqueira Central']
        },
        {
          field: 'address',
          description: 'Complete address including street, number, postal code, and city',
          examples: ['Rua do Breiner, 85, 4050-124 Porto']
        },
        {
          field: 'menuPrice',
          description: 'Current lunch menu price in euros',
          examples: ['8.50', '12.00']
        },
        {
          field: 'whatsIncluded',
          description: 'What is included in the menu price',
          examples: [['soup', 'main', 'drink'], ['soup', 'main', 'dessert', 'coffee']]
        },
        {
          field: 'foodType',
          description: 'Type of cuisine or food specialty',
          examples: ['Traditional Portuguese', 'Seafood specialist', 'Modern/Contemporary']
        },
        {
          field: 'menuPhoto',
          description: 'Clear photo of menu board or price display showing lunch menu prices',
          requirements: 'Photo must be clear and show current prices'
        }
      ],
      validationCriteria: [
        'Restaurant must actually exist at the provided address',
        'Menu prices must be current and verifiable',
        'Restaurant must serve sit-down lunch meals (not takeaway only)',
        'Photos must be clear and show menu information',
        'All required information must be accurate and complete'
      ],
      tips: [
        'Take photos during daylight for better quality',
        'Include multiple photos if menu is spread across different boards',
        'Double-check address and postal code for accuracy',
        'Provide business hours if known to help verification',
        'Add any special notes about vegetarian options or unique features'
      ],
      processingTime: '2-3 business days',
      approvalRate: '85%'
    };
  },

  /**
   * Calculate estimated completion time
   * @param {Object} submission - Submission object
   * @returns {string} Estimated completion message
   */
  calculateEstimatedCompletion(submission) {
    const now = new Date();
    const submittedAt = new Date(submission.submittedAt);
    const hoursSinceSubmission = (now - submittedAt) / (1000 * 60 * 60);

    if (submission.status === 'pending') {
      if (hoursSinceSubmission < 24) {
        return 'Review will begin within 24 hours';
      } else if (hoursSinceSubmission < 48) {
        return 'Review in progress - expected completion within 24 hours';
      } else {
        return 'Review taking longer than expected - we will contact you soon';
      }
    }

    return null;
  }
};

export default submissionService;