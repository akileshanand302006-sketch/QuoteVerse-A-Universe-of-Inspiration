import axios from 'axios';
import quotesData from '../data/quotes';

/**
 * QuoteService — Communicates with the MySQL Express Backend API.
 */
const apiClient = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Fetch all quotes from MySQL database
 * @returns {Promise<{data: Array, status: number}>} Array of quote objects
 */
export async function fetchAllQuotes() {
  try {
    const res = await apiClient.get('/api/quotes');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return { data: res.data, status: 200 };
    }
    return { data: quotesData, status: 200 };
  } catch (error) {
    console.warn('Backend API unavailable, falling back to static quote dataset:', error);
    return { data: quotesData, status: 200 };
  }
}

/**
 * Fetch a quote by ID from MySQL database
 * @param {number} id - Quote ID
 * @returns {Promise<{data: Object, status: number}>} Quote object
 */
export async function fetchQuoteById(id) {
  try {
    const res = await apiClient.get(`/api/quotes/${id}`);
    return { data: res.data, status: 200 };
  } catch (error) {
    console.error('Error fetching quote by ID:', error);
    const quote = quotesData.find(q => q.id === id);
    if (!quote) throw new Error('Quote not found');
    return { data: quote, status: 200 };
  }
}

/**
 * Fetch quotes by category from MySQL database
 * @param {string} category - Category name
 * @returns {Promise<{data: Array, status: number}>} Filtered quotes
 */
export async function fetchQuotesByCategory(category) {
  try {
    const res = await apiClient.get(`/api/quotes?category=${encodeURIComponent(category)}`);
    return { data: res.data, status: 200 };
  } catch (error) {
    console.error('Error fetching quotes by category:', error);
    const filtered = quotesData.filter(q => q.category === category);
    return { data: filtered, status: 200 };
  }
}

/**
 * Fetch a random quote from MySQL database
 * @returns {Promise<{data: Object, status: number}>} Random quote
 */
export async function fetchRandomQuote() {
  try {
    const res = await apiClient.get('/api/quotes/random');
    return { data: res.data, status: 200 };
  } catch (error) {
    console.error('Error fetching random quote:', error);
    const randomIndex = Math.floor(Math.random() * quotesData.length);
    return { data: quotesData[randomIndex], status: 200 };
  }
}

export { apiClient };
