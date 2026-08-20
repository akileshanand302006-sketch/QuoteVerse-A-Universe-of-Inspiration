import { Heart, Trash2 } from 'lucide-react';
import QuoteCard from '../components/QuoteCard';
import EmptyState from '../components/EmptyState';

/**
 * Favorites Page — Displays all favorited quotes.
 * Data is passed via props from the parent App.
 */
function Favorites({ favorites, quotes, onFavorite, isFavoriteQuote, onSelectQuote }) {
  // Get full quote objects for favorites
  const favoriteQuotes = favorites
    .map(id => quotes.find(q => q.id === id))
    .filter(Boolean);

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            <Heart size={28} style={{ color: '#ef4444', marginRight: '0.5rem', verticalAlign: 'middle' }} fill="#ef4444" />
            Your Favorites
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {favoriteQuotes.length > 0
              ? `${favoriteQuotes.length} quote${favoriteQuotes.length !== 1 ? 's' : ''} saved`
              : 'Save the quotes that speak to you.'
            }
          </p>
        </div>

        {/* Conditional Rendering: empty vs populated */}
        {favoriteQuotes.length === 0 ? (
          <EmptyState
            icon="💜"
            title="No favorites yet."
            message="Save the quotes that speak to you."
            actionLabel="Discover Quotes"
            actionTo="/"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {favoriteQuotes.map((quote, index) => (
              <div
                key={quote.id}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.06}s` }}
              >
                <QuoteCard
                  quote={quote}
                  isFavorite={true}
                  onFavorite={onFavorite}
                  onSelect={onSelectQuote}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Favorites;
