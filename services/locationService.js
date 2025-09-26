/**
 * Location Service - Mock Backend API for Menu Deal Moço
 * Simulates location search, geocoding, and "near me" functionality
 */

// Simulate network delay
const simulateDelay = (min = 200, max = 800) => {
  return new Promise(resolve =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// Simulate random API failures (2% chance)
const simulateFailure = () => {
  if (Math.random() < 0.02) {
    throw new Error('Network error: Location service unavailable');
  }
};

// Mock Portuguese cities and districts data
const portugueseCities = [
  {
    city: 'Porto',
    district: 'Porto',
    coordinates: { lat: 41.1579, lng: -8.6291 },
    districts: [
      { name: 'Ribeira', coordinates: { lat: 41.1427, lng: -8.6071 } },
      { name: 'Cedofeita', coordinates: { lat: 41.1547, lng: -8.6201 } },
      { name: 'Vitória', coordinates: { lat: 41.1507, lng: -8.6154 } },
      { name: 'Santo Ildefonso', coordinates: { lat: 41.1496, lng: -8.6109 } },
      { name: 'Asprela', coordinates: { lat: 41.1782, lng: -8.5980 } },
      { name: 'Matosinhos', coordinates: { lat: 41.1844, lng: -8.6918 } },
      { name: 'Lordelo do Ouro', coordinates: { lat: 41.1588, lng: -8.6394 } }
    ]
  },
  {
    city: 'Lisboa',
    district: 'Lisboa',
    coordinates: { lat: 38.7223, lng: -9.1393 },
    districts: [
      { name: 'Chiado', coordinates: { lat: 38.7112, lng: -9.1456 } },
      { name: 'Bairro Alto', coordinates: { lat: 38.7107, lng: -9.1448 } },
      { name: 'Príncipe Real', coordinates: { lat: 38.7071, lng: -9.1458 } },
      { name: 'Estrela', coordinates: { lat: 38.7040, lng: -9.1654 } },
      { name: 'Belém', coordinates: { lat: 38.6979, lng: -9.2063 } },
      { name: 'Misericórdia', coordinates: { lat: 38.7131, lng: -9.1441 } },
      { name: 'Avenidas Novas', coordinates: { lat: 38.7172, lng: -9.1522 } }
    ]
  },
  {
    city: 'Coimbra',
    district: 'Coimbra',
    coordinates: { lat: 40.2033, lng: -8.4103 },
    districts: [
      { name: 'Baixa', coordinates: { lat: 40.2061, lng: -8.4203 } },
      { name: 'Alta', coordinates: { lat: 40.2073, lng: -8.4264 } },
      { name: 'Celas', coordinates: { lat: 40.2189, lng: -8.4167 } }
    ]
  },
  {
    city: 'Braga',
    district: 'Braga',
    coordinates: { lat: 41.5518, lng: -8.4229 },
    districts: [
      { name: 'Centro', coordinates: { lat: 41.5518, lng: -8.4229 } },
      { name: 'Maximinos', coordinates: { lat: 41.5478, lng: -8.4189 } }
    ]
  },
  {
    city: 'Aveiro',
    district: 'Aveiro',
    coordinates: { lat: 40.6443, lng: -8.6455 },
    districts: [
      { name: 'Centro', coordinates: { lat: 40.6443, lng: -8.6455 } }
    ]
  }
];

// Mock metro/transport stations
const transportStations = [
  // Porto Metro
  { name: 'São Bento', city: 'Porto', type: 'metro', coordinates: { lat: 41.1457, lng: -8.6108 } },
  { name: 'Bolhão', city: 'Porto', type: 'metro', coordinates: { lat: 41.1517, lng: -8.6063 } },
  { name: 'Marquês', city: 'Porto', type: 'metro', coordinates: { lat: 41.1523, lng: -8.6145 } },
  { name: '24 de Agosto', city: 'Porto', type: 'metro', coordinates: { lat: 41.1547, lng: -8.6201 } },
  { name: 'Casa da Música', city: 'Porto', type: 'metro', coordinates: { lat: 41.1588, lng: -8.6394 } },
  { name: 'Matosinhos Sul', city: 'Porto', type: 'metro', coordinates: { lat: 41.1844, lng: -8.6918 } },

  // Lisboa Metro
  { name: 'Baixa-Chiado', city: 'Lisboa', type: 'metro', coordinates: { lat: 38.7112, lng: -9.1456 } },
  { name: 'Avenida', city: 'Lisboa', type: 'metro', coordinates: { lat: 38.7138, lng: -9.1486 } },
  { name: 'Rato', city: 'Lisboa', type: 'metro', coordinates: { lat: 38.7071, lng: -9.1458 } },
  { name: 'Marquês de Pombal', city: 'Lisboa', type: 'metro', coordinates: { lat: 38.7172, lng: -9.1522 } }
];

// Local storage keys
const STORAGE_KEYS = {
  USER_LOCATION: 'menudealmoco_user_location',
  RECENT_LOCATIONS: 'menudealmoco_recent_locations',
  LOCATION_PERMISSIONS: 'menudealmoco_location_permissions'
};

// Initialize local storage
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS)) {
    localStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOCATION_PERMISSIONS)) {
    localStorage.setItem(STORAGE_KEYS.LOCATION_PERMISSIONS, JSON.stringify({}));
  }
};

// Distance calculation (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Simulate geocoding (address to coordinates)
const geocodeAddress = async (address) => {
  await simulateDelay(300, 800);

  const addressLower = address.toLowerCase();

  // Try to find exact matches first
  for (const cityData of portugueseCities) {
    if (addressLower.includes(cityData.city.toLowerCase())) {
      // Check for district matches
      for (const district of cityData.districts) {
        if (addressLower.includes(district.name.toLowerCase())) {
          return {
            address: `${district.name}, ${cityData.city}`,
            coordinates: district.coordinates,
            city: cityData.city,
            district: district.name,
            confidence: 0.9
          };
        }
      }

      // Return city center if no district match
      return {
        address: `${cityData.city}, Portugal`,
        coordinates: cityData.coordinates,
        city: cityData.city,
        district: 'Centro',
        confidence: 0.8
      };
    }
  }

  // Try partial matches
  for (const cityData of portugueseCities) {
    for (const district of cityData.districts) {
      if (addressLower.includes(district.name.toLowerCase())) {
        return {
          address: `${district.name}, ${cityData.city}`,
          coordinates: district.coordinates,
          city: cityData.city,
          district: district.name,
          confidence: 0.7
        };
      }
    }
  }

  // If no match found, return Porto as default (with low confidence)
  return {
    address: 'Porto, Portugal (estimated)',
    coordinates: { lat: 41.1579, lng: -8.6291 },
    city: 'Porto',
    district: 'Centro',
    confidence: 0.3
  };
};

// Simulate reverse geocoding (coordinates to address)
const reverseGeocode = async (lat, lng) => {
  await simulateDelay(200, 600);

  let closestLocation = null;
  let minDistance = Infinity;

  // Find closest city/district
  for (const cityData of portugueseCities) {
    const cityDistance = calculateDistance(lat, lng, cityData.coordinates.lat, cityData.coordinates.lng);
    if (cityDistance < minDistance) {
      minDistance = cityDistance;
      closestLocation = {
        address: `${cityData.city}, Portugal`,
        city: cityData.city,
        district: 'Centro',
        coordinates: cityData.coordinates
      };
    }

    // Check districts
    for (const district of cityData.districts) {
      const districtDistance = calculateDistance(lat, lng, district.coordinates.lat, district.coordinates.lng);
      if (districtDistance < minDistance) {
        minDistance = districtDistance;
        closestLocation = {
          address: `${district.name}, ${cityData.city}`,
          city: cityData.city,
          district: district.name,
          coordinates: district.coordinates
        };
      }
    }
  }

  return {
    ...closestLocation,
    distance: minDistance,
    accuracy: minDistance < 1 ? 'high' : minDistance < 5 ? 'medium' : 'low'
  };
};

// Save recent location search
const saveRecentLocation = (locationData) => {
  initializeStorage();
  const recentLocations = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS) || '[]');

  // Remove if already exists
  const filtered = recentLocations.filter(loc => loc.address !== locationData.address);

  // Add to front
  filtered.unshift({
    ...locationData,
    searchedAt: new Date()
  });

  // Keep only last 10 searches
  const trimmed = filtered.slice(0, 10);
  localStorage.setItem(STORAGE_KEYS.RECENT_LOCATIONS, JSON.stringify(trimmed));
};

/**
 * Location Service API
 */
export const locationService = {
  /**
   * Get user's current location using browser geolocation
   * @param {Object} options - Geolocation options
   * @returns {Promise<Object>} Current location data
   */
  async getCurrentLocation(options = {}) {
    await simulateDelay(500, 1500);
    simulateFailure();

    const {
      enableHighAccuracy = true,
      timeout = 10000,
      maximumAge = 300000 // 5 minutes
    } = options;

    // Check if geolocation is supported
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          try {
            // Reverse geocode to get address
            const locationData = await reverseGeocode(latitude, longitude);

            // Save user location
            const userLocation = {
              coordinates: { lat: latitude, lng: longitude },
              accuracy,
              timestamp: new Date(),
              ...locationData
            };

            localStorage.setItem(STORAGE_KEYS.USER_LOCATION, JSON.stringify(userLocation));

            resolve({
              coordinates: { lat: latitude, lng: longitude },
              address: locationData.address,
              city: locationData.city,
              district: locationData.district,
              accuracy,
              method: 'gps'
            });
          } catch (error) {
            reject(new Error('Failed to determine location address'));
          }
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'Unknown location error';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy,
          timeout,
          maximumAge
        }
      );
    });
  },

  /**
   * Search for locations by text query
   * @param {string} query - Search query
   * @returns {Promise<Array>} Location suggestions
   */
  async searchLocations(query) {
    await simulateDelay();
    simulateFailure();

    if (!query || query.trim().length < 2) {
      return [];
    }

    const queryLower = query.toLowerCase();
    const suggestions = [];

    // Search cities
    for (const cityData of portugueseCities) {
      if (cityData.city.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'city',
          name: cityData.city,
          fullName: `${cityData.city}, Portugal`,
          coordinates: cityData.coordinates,
          city: cityData.city,
          district: 'Centro'
        });
      }

      // Search districts
      for (const district of cityData.districts) {
        if (district.name.toLowerCase().includes(queryLower)) {
          suggestions.push({
            type: 'district',
            name: district.name,
            fullName: `${district.name}, ${cityData.city}`,
            coordinates: district.coordinates,
            city: cityData.city,
            district: district.name
          });
        }
      }
    }

    // Search transport stations
    for (const station of transportStations) {
      if (station.name.toLowerCase().includes(queryLower)) {
        suggestions.push({
          type: 'transport',
          name: station.name,
          fullName: `${station.name} (${station.type})`,
          coordinates: station.coordinates,
          city: station.city,
          transportType: station.type
        });
      }
    }

    // Sort by relevance (exact matches first, then partial matches)
    suggestions.sort((a, b) => {
      const aExact = a.name.toLowerCase() === queryLower;
      const bExact = b.name.toLowerCase() === queryLower;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      return a.name.localeCompare(b.name);
    });

    return suggestions.slice(0, 10); // Limit to 10 suggestions
  },

  /**
   * Geocode an address to coordinates
   * @param {string} address - Address to geocode
   * @returns {Promise<Object>} Geocoded location data
   */
  async geocodeAddress(address) {
    await simulateDelay();
    simulateFailure();

    if (!address || address.trim().length < 3) {
      throw new Error('Address must be at least 3 characters long');
    }

    const result = await geocodeAddress(address);

    // Save to recent locations
    saveRecentLocation(result);

    return result;
  },

  /**
   * Reverse geocode coordinates to address
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @returns {Promise<Object>} Address data
   */
  async reverseGeocodeCoordinates(lat, lng) {
    await simulateDelay();
    simulateFailure();

    if (!lat || !lng || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Invalid coordinates provided');
    }

    return await reverseGeocode(lat, lng);
  },

  /**
   * Find nearby restaurants based on location
   * @param {Object} location - Location object with coordinates
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Nearby restaurants
   */
  async findNearbyRestaurants(location, options = {}) {
    await simulateDelay();

    const {
      radius = 5, // km
      limit = 20,
      sortByDistance = true
    } = options;

    // Get restaurants from storage (would normally come from restaurant service)
    const restaurants = JSON.parse(localStorage.getItem('menudealmoco_restaurants') || '[]');

    // Calculate distances and filter by radius
    const nearbyRestaurants = restaurants
      .map(restaurant => ({
        ...restaurant,
        distance: calculateDistance(
          location.coordinates.lat,
          location.coordinates.lng,
          restaurant.coordinates.lat,
          restaurant.coordinates.lng
        )
      }))
      .filter(restaurant => restaurant.distance <= radius);

    // Sort by distance if requested
    if (sortByDistance) {
      nearbyRestaurants.sort((a, b) => a.distance - b.distance);
    }

    return nearbyRestaurants.slice(0, limit);
  },

  /**
   * Get recent location searches
   * @returns {Promise<Array>} Recent locations
   */
  async getRecentLocations() {
    await simulateDelay(100, 300);
    initializeStorage();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_LOCATIONS) || '[]');
  },

  /**
   * Get saved user location
   * @returns {Promise<Object|null>} Saved user location
   */
  async getSavedUserLocation() {
    await simulateDelay(100, 200);
    const saved = localStorage.getItem(STORAGE_KEYS.USER_LOCATION);
    return saved ? JSON.parse(saved) : null;
  },

  /**
   * Clear saved user location
   * @returns {Promise<boolean>} Success status
   */
  async clearSavedLocation() {
    await simulateDelay(100, 200);
    localStorage.removeItem(STORAGE_KEYS.USER_LOCATION);
    return true;
  },

  /**
   * Get available cities
   * @returns {Promise<Array>} List of available cities
   */
  async getAvailableCities() {
    await simulateDelay(100, 300);
    return portugueseCities.map(cityData => ({
      city: cityData.city,
      district: cityData.district,
      coordinates: cityData.coordinates,
      districtsCount: cityData.districts.length
    }));
  },

  /**
   * Get districts for a specific city
   * @param {string} cityName - City name
   * @returns {Promise<Array>} Districts in the city
   */
  async getCityDistricts(cityName) {
    await simulateDelay(100, 300);

    const cityData = portugueseCities.find(
      city => city.city.toLowerCase() === cityName.toLowerCase()
    );

    if (!cityData) {
      throw new Error(`City ${cityName} not found`);
    }

    return cityData.districts;
  },

  /**
   * Calculate travel time and distance between two points
   * @param {Object} origin - Origin coordinates
   * @param {Object} destination - Destination coordinates
   * @param {string} mode - Travel mode ('walking', 'driving', 'transit')
   * @returns {Promise<Object>} Travel information
   */
  async calculateTravelInfo(origin, destination, mode = 'walking') {
    await simulateDelay(400, 800);

    const distance = calculateDistance(
      origin.lat,
      origin.lng,
      destination.lat,
      destination.lng
    );

    let travelTime, instructions;

    switch (mode) {
      case 'walking':
        travelTime = Math.ceil(distance * 12); // ~5 km/h walking speed
        instructions = `Walk ${Math.round(distance * 100) / 100} km (approximately ${travelTime} minutes)`;
        break;
      case 'driving':
        travelTime = Math.ceil(distance * 2); // ~30 km/h average city speed
        instructions = `Drive ${Math.round(distance * 100) / 100} km (approximately ${travelTime} minutes)`;
        break;
      case 'transit':
        travelTime = Math.ceil(distance * 4); // ~15 km/h average transit speed
        instructions = `Public transport ${Math.round(distance * 100) / 100} km (approximately ${travelTime} minutes)`;
        break;
      default:
        throw new Error('Invalid travel mode');
    }

    return {
      distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
      travelTime,
      mode,
      instructions
    };
  },

  /**
   * Check if location services are available
   * @returns {Promise<Object>} Availability status
   */
  async checkLocationServicesAvailability() {
    await simulateDelay(100, 200);

    return {
      geolocationSupported: 'geolocation' in navigator,
      permissionStatus: 'unknown', // Would normally check actual permission
      accuracyLevel: 'high', // Would be determined by device capabilities
      servicesAvailable: true
    };
  }
};

export default locationService;