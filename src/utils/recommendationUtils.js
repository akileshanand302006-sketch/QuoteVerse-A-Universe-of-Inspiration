/**
 * Smart Quote Recommendation Engine
 * Calculates user interest scores based on interaction history, searches, and categories explored.
 */

export function getRecommendedQuotes(quotes, stats = {}, favorites = [], history = []) {
  if (!quotes || quotes.length === 0) return [];

  // Count category frequency from history & favorites
  const categoryFreq = {};

  history.forEach(entry => {
    if (entry.quote && entry.quote.category) {
      categoryFreq[entry.quote.category] = (categoryFreq[entry.quote.category] || 0) + 1;
    }
  });

  favorites.forEach(favId => {
    const q = quotes.find(item => item.id === favId);
    if (q && q.category) {
      categoryFreq[q.category] = (categoryFreq[q.category] || 0) + 3; // Favorites weighted higher
    }
  });

  // Calculate score for each quote
  const scoredQuotes = quotes.map(quote => {
    let score = 0;

    // 1. Category preference (+3 per frequency point)
    const catScore = categoryFreq[quote.category] || 0;
    score += catScore * 3;

    // 2. Favorite status bonus
    if (favorites.includes(quote.id)) {
      score += 2;
    }

    // 3. Unexplored quotes get slight discovery boost if user has explored many
    const viewedCount = history.filter(h => h.quote && h.quote.id === quote.id).length;
    if (viewedCount === 0) {
      score += 4; // Boost undiscovered content
    }

    return { quote, score };
  });

  // Sort by score descending
  scoredQuotes.sort((a, b) => b.score - a.score);

  // Return top 4 recommended quote objects
  return scoredQuotes.slice(0, 4).map(item => item.quote);
}
