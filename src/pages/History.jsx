import { History as HistoryIcon, Trash2 } from 'lucide-react';
import QuoteCard from '../components/QuoteCard';
import EmptyState from '../components/EmptyState';

/**
 * History Page — Shows the user's quote viewing history.
 * Each history entry includes timestamp and quote data.
 */
function History({ history, onClearHistory, isFavoriteQuote, onFavorite, onSelectQuote }) {
  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)' }}>

        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            <HistoryIcon size={28} style={{ color: 'var(--accent-primary)', marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Quote History
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {history.length > 0
              ? `${history.length} quote${history.length !== 1 ? 's' : ''} explored`
              : 'Your quote journey starts here.'
            }
          </p>
        </div>

        {/* Clear History Button */}
        {history.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button
              className="btn-glass"
              onClick={onClearHistory}
              style={{ color: '#ef4444', fontSize: '0.85rem' }}
            >
              <Trash2 size={16} />
              Clear History
            </button>
          </div>
        )}

        {/* Conditional Rendering */}
        {history.length === 0 ? (
          <EmptyState
            icon="📖"
            title="Your quote journey starts here."
            message="Generate quotes to build your history."
            actionLabel="Generate Quote"
            actionTo="/"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Using map() to render history — most recent first */}
            {[...history].reverse().map((entry, index) => (
              <div
                key={`${entry.quote.id}-${entry.timestamp}`}
                className="stagger-item"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <QuoteCard
                  quote={entry.quote}
                  isFavorite={isFavoriteQuote(entry.quote.id)}
                  onFavorite={onFavorite}
                  onSelect={onSelectQuote}
                  showTime={true}
                  timestamp={entry.timestamp}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default History;
