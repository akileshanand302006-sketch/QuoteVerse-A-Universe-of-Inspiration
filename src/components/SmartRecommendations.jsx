import { useMemo } from 'react';
import { Sparkles, ThumbsUp } from 'lucide-react';
import QuoteCard from './QuoteCard';
import { getRecommendedQuotes } from '../utils/recommendationUtils';

/**
 * SmartRecommendations — "Recommended For You" section based on user interaction scoring.
 */
function SmartRecommendations({ quotes, stats, favorites, history, onFavorite, isFavoriteQuote, onSelectQuote }) {
  const recommendations = useMemo(() => {
    return getRecommendedQuotes(quotes, stats, favorites, history);
  }, [quotes, stats, favorites, history]);

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <ThumbsUp size={20} style={{ color: 'var(--accent-primary)' }} />
        <h2 className="section-title" style={{ margin: 0 }}>
          Recommended For You
        </h2>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Curated based on your quote discovery habits and interests
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {recommendations.map((quote, idx) => (
          <div key={quote.id} className="stagger-item" style={{ animationDelay: `${idx * 0.08}s` }}>
            <QuoteCard
              quote={quote}
              isFavorite={isFavoriteQuote(quote.id)}
              onFavorite={onFavorite}
              onSelect={onSelectQuote}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SmartRecommendations;
