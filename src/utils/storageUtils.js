/**
 * Storage utility functions for QuoteVerse
 */

const STORAGE_KEYS = {
  FAVORITES: 'quoteverse_favorites',
  HISTORY: 'quoteverse_history',
  THEME: 'quoteverse_theme',
  STATS: 'quoteverse_stats',
  PREFERENCES: 'quoteverse_preferences'
};

/**
 * Get item from localStorage with JSON parsing
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Parsed value or default
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading from localStorage [${key}]:`, error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage with JSON serialization
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing to localStorage [${key}]:`, error);
  }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing from localStorage [${key}]:`, error);
  }
}

export { STORAGE_KEYS };
