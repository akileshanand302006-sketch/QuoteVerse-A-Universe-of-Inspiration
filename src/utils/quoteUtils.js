/**
 * Quote utility functions for QuoteVerse
 */

/**
 * Get a random quote index, avoiding the previous index to prevent repeats.
 * @param {number} totalQuotes - Total number of quotes
 * @param {number} currentIndex - Current quote index to avoid
 * @returns {number} New random index
 */
export function getRandomQuoteIndex(totalQuotes, currentIndex = -1) {
  if (totalQuotes <= 1) return 0;
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * totalQuotes);
  } while (newIndex === currentIndex);
  return newIndex;
}

/**
 * Get the "Quote of the Day" index based on the current date.
 * Same quote is shown for the entire day.
 * @param {number} totalQuotes - Total number of quotes
 * @returns {number} Index for today's quote
 */
export function getDailyQuoteIndex(totalQuotes) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % totalQuotes;
}

/**
 * Search quotes by text, author, category, or tags.
 * @param {Array} quotes - Array of quote objects
 * @param {string} searchTerm - Term to search for
 * @returns {Array} Filtered quotes
 */
export function searchQuotes(quotes, searchTerm) {
  if (!searchTerm || !searchTerm.trim()) return quotes;
  const term = searchTerm.trim().toLowerCase();
  return quotes.filter(quote =>
    quote.text.toLowerCase().includes(term) ||
    quote.author.toLowerCase().includes(term) ||
    quote.category.toLowerCase().includes(term) ||
    quote.tags.some(tag => tag.toLowerCase().includes(term))
  );
}

/**
 * Filter quotes by category.
 * @param {Array} quotes - Array of quote objects
 * @param {string} category - Category to filter by (empty or "All" for no filter)
 * @returns {Array} Filtered quotes
 */
export function filterByCategory(quotes, category) {
  if (!category || category === 'All') return quotes;
  return quotes.filter(q => q.category === category);
}

/**
 * Filter quotes by mood.
 * @param {Array} quotes - Array of quote objects
 * @param {string} moodId - Mood ID to filter by
 * @returns {Array} Filtered quotes
 */
export function filterByMood(quotes, moodId) {
  if (!moodId) return quotes;
  return quotes.filter(q => q.mood === moodId);
}

/**
 * Format a quote for copying or sharing.
 * @param {object} quote - Quote object
 * @returns {string} Formatted quote string
 */
export function formatQuoteForSharing(quote) {
  return `"${quote.text}"\n— ${quote.author}`;
}
