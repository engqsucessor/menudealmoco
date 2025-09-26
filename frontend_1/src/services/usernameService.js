// usernameService.js - Reddit-style random username generator

const adjectives = [
  'Amazing', 'Brilliant', 'Clever', 'Dazzling', 'Epic', 'Fantastic', 'Great', 'Happy',
  'Incredible', 'Jolly', 'Kind', 'Lucky', 'Magnificent', 'Nice', 'Outstanding', 'Perfect',
  'Quick', 'Radiant', 'Super', 'Terrific', 'Unique', 'Vibrant', 'Wonderful', 'Excellent',
  'Zealous', 'Bold', 'Calm', 'Dynamic', 'Elegant', 'Fresh', 'Golden', 'Humble',
  'Inspired', 'Joyful', 'Keen', 'Lively', 'Modern', 'Noble', 'Optimistic', 'Peaceful',
  'Quiet', 'Refined', 'Smart', 'Thoughtful', 'Upbeat', 'Vivid', 'Wise', 'Young'
];

const nouns = [
  'Reviewer', 'Foodie', 'Critic', 'Explorer', 'Hunter', 'Seeker', 'Taster', 'Guide',
  'Expert', 'Connoisseur', 'Enthusiast', 'Lover', 'Fan', 'Devotee', 'Admirer', 'Patron',
  'Diner', 'Gourmet', 'Chef', 'Cook', 'Baker', 'Eater', 'Sampler', 'Judge',
  'Scholar', 'Student', 'Teacher', 'Master', 'Apprentice', 'Artist', 'Creator', 'Maker',
  'Writer', 'Blogger', 'Journalist', 'Reporter', 'Observer', 'Witness', 'Visitor', 'Guest',
  'Traveler', 'Wanderer', 'Navigator', 'Pioneer', 'Discoverer', 'Adventurer', 'Scout', 'Ranger'
];

export const generateRandomUsername = () => {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}${noun}${number}`;
};

export const getUserDisplayName = (userEmail) => {
  const storageKey = `displayName_${userEmail}`;
  let displayName = localStorage.getItem(storageKey);
  
  if (!displayName) {
    displayName = generateRandomUsername();
    localStorage.setItem(storageKey, displayName);
  }
  
  return displayName;
};

export const updateUserDisplayName = (userEmail, newDisplayName) => {
  const storageKey = `displayName_${userEmail}`;
  localStorage.setItem(storageKey, newDisplayName);
  return true;
};

export const getAllUserDisplayNames = () => {
  const displayNames = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('displayName_')) {
      const email = key.replace('displayName_', '');
      displayNames[email] = localStorage.getItem(key);
    }
  }
  return displayNames;
};