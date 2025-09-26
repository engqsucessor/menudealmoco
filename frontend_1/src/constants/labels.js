// Centralized labels and emojis for consistent UI across the app

// Practical features with emojis and labels
export const PRACTICAL_FEATURES = {
  takesCards: {
    emoji: '💳',
    label: 'Takes Cards',
    shortLabel: 'Cards'
  },
  hasParking: {
    emoji: '🚗', 
    label: 'Has Parking',
    shortLabel: 'Parking'
  },
  quickService: {
    emoji: '⚡',
    label: 'Quick Service',
    shortLabel: 'Quick Service'
  },
  groupFriendly: {
    emoji: '👥',
    label: 'Group Friendly', 
    shortLabel: 'Group Friendly'
  },
  nearMetro: {
    emoji: '🚇',
    label: 'Near Metro',
    shortLabel: 'Near Metro'
  }
};

// Food included features
export const INCLUDED_FEATURES = {
  soup: {
    emoji: '🍲',
    label: 'Soup'
  },
  main: {
    emoji: '🍽️',
    label: 'Main Course'
  },
  drink: {
    emoji: '🥤',
    label: 'Drink'
  },
  coffee: {
    emoji: '☕',
    label: 'Coffee'
  },
  dessert: {
    emoji: '🍰',
    label: 'Dessert'
  },
  wine: {
    emoji: '🍷',
    label: 'Wine'
  },
  bread: {
    emoji: '🥖',
    label: 'Bread'
  }
};

// Other UI labels
export const UI_LABELS = {
  favorites: '❤️',
  openNow: '● OPEN',
  closed: '● CLOSED'
};

// Helper functions
export const getPracticalFeatureLabel = (key, includeEmoji = true, useShort = false) => {
  const feature = PRACTICAL_FEATURES[key];
  if (!feature) return key;
  
  const label = useShort ? feature.shortLabel : feature.label;
  return includeEmoji ? `${feature.emoji} ${label}` : label;
};

export const getIncludedFeatureLabel = (key, includeEmoji = true) => {
  const feature = INCLUDED_FEATURES[key];
  if (!feature) return key;
  
  return includeEmoji ? `${feature.emoji} ${feature.label}` : feature.label;
};