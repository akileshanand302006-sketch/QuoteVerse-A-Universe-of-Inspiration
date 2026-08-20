import { useState, useEffect } from 'react';

/**
 * Custom React Hook for syncing state with localStorage.
 * Provides a useState-like API with automatic persistence.
 *
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Default value if nothing is stored
 * @returns {[*, Function]} - [storedValue, setValue]
 */
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
