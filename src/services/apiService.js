import axios from 'axios';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * API Service for managing all user data storages in MySQL Database:
 * Users/Login details, Favorites, History, Stats, Challenge Scores, Preferences
 */

// 1. Auth Services
export async function registerUser(fullName, email, password) {
  const res = await api.post('/api/auth/register', { fullName, email, password });
  return res.data;
}

export async function loginUser(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  return res.data;
}

// 2. Favorites Services
export async function fetchFavoritesApi(email) {
  try {
    const res = await api.get(`/api/favorites?email=${encodeURIComponent(email || 'guest')}`);
    return res.data;
  } catch (err) {
    console.error('Error loading favorites from MySQL:', err);
    return [];
  }
}

export async function toggleFavoriteApi(email, quoteId) {
  try {
    const res = await api.post('/api/favorites/toggle', { email: email || 'guest', quoteId });
    return res.data;
  } catch (err) {
    console.error('Error updating favorite in MySQL:', err);
  }
}

// 3. History Services
export async function fetchHistoryApi(email) {
  try {
    const res = await api.get(`/api/history?email=${encodeURIComponent(email || 'guest')}`);
    return res.data;
  } catch (err) {
    console.error('Error loading history from MySQL:', err);
    return [];
  }
}

export async function addHistoryApi(email, quoteId) {
  try {
    const res = await api.post('/api/history', { email: email || 'guest', quoteId });
    return res.data;
  } catch (err) {
    console.error('Error saving history item to MySQL:', err);
  }
}

export async function clearHistoryApi(email) {
  try {
    const res = await api.delete(`/api/history?email=${encodeURIComponent(email || 'guest')}`);
    return res.data;
  } catch (err) {
    console.error('Error clearing history in MySQL:', err);
  }
}

// 4. Stats Services
export async function fetchStatsApi(email) {
  try {
    const res = await api.get(`/api/stats?email=${encodeURIComponent(email || 'guest')}`);
    return res.data;
  } catch (err) {
    console.error('Error loading stats from MySQL:', err);
    return null;
  }
}

export async function saveStatsApi(email, statsData) {
  try {
    const res = await api.post('/api/stats', { email: email || 'guest', ...statsData });
    return res.data;
  } catch (err) {
    console.error('Error saving stats to MySQL:', err);
  }
}

// 5. Challenge Scores Services
export async function fetchBestScoreApi(email) {
  try {
    const res = await api.get(`/api/challenge/best?email=${encodeURIComponent(email || 'guest')}`);
    return res.data.bestScore || 0;
  } catch (err) {
    console.error('Error loading best challenge score from MySQL:', err);
    return 0;
  }
}

export async function saveBestScoreApi(email, score) {
  try {
    const res = await api.post('/api/challenge/score', { email: email || 'guest', score });
    return res.data;
  } catch (err) {
    console.error('Error saving best score to MySQL:', err);
  }
}

// 6. Preferences / Theme Services
export async function fetchPreferencesApi(email) {
  try {
    const res = await api.get(`/api/preferences?email=${encodeURIComponent(email || 'guest')}`);
    return res.data.theme || 'dark';
  } catch (err) {
    console.error('Error loading preferences from MySQL:', err);
    return 'dark';
  }
}

export async function savePreferencesApi(email, theme) {
  try {
    const res = await api.post('/api/preferences', { email: email || 'guest', theme });
    return res.data;
  } catch (err) {
    console.error('Error saving preferences to MySQL:', err);
  }
}
