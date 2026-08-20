import { useState } from 'react';
import { Heart, Copy, Check, ExternalLink } from 'lucide-react';
import { formatQuoteForSharing } from '../utils/quoteUtils';

/**
 * QuoteCard — A smaller card used in lists (favorites, history, search results).
 * Receives the quote data via props.
 */
function QuoteCard({ quote, isFavorite, onFavorite, onSelect, showTime, timestamp, style: cardStyle = {} }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(formatQuoteForSharing(quote));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (onFavorite) onFavorite(quote);
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const date = new Date(ts);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      className="glass-card quote-list-card"
      style={{
        padding: '1.25rem 1.5rem',
        cursor: onSelect ? 'pointer' : 'default',
        ...cardStyle
      }}
      onClick={() => onSelect && onSelect(quote)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onSelect && onSelect(quote)}
    >
      <p style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontStyle: 'italic',
        color: 'var(--text-primary)',
        lineHeight: 1.5,
        marginBottom: '0.6rem'
      }}>
        &ldquo;{quote.text}&rdquo;
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          <span style={{
            fontWeight: 500,
            color: 'var(--text-accent)',
            fontSize: '0.85rem'
          }}>
            — {quote.author}
          </span>
          <span className="chip" style={{
            marginLeft: '0.5rem',
            fontSize: '0.7rem',
            padding: '0.15rem 0.5rem',
            cursor: 'default'
          }}>
            {quote.category}
          </span>
          {showTime && timestamp && (
            <span style={{
              marginLeft: '0.5rem',
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}>
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {onFavorite && (
            <button
              className="btn-icon"
              onClick={handleFavorite}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              style={{ width: '34px', height: '34px', color: isFavorite ? '#ef4444' : 'var(--text-secondary)' }}
            >
              <Heart size={15} fill={isFavorite ? '#ef4444' : 'none'} />
            </button>
          )}
          <button
            className="btn-icon"
            onClick={handleCopy}
            aria-label="Copy quote"
            style={{ width: '34px', height: '34px' }}
          >
            {copied ? <Check size={15} style={{ color: '#22c55e' }} /> : <Copy size={15} />}
          </button>
          {onSelect && (
            <button
              className="btn-icon"
              onClick={(e) => { e.stopPropagation(); onSelect(quote); }}
              aria-label="View quote"
              style={{ width: '34px', height: '34px' }}
            >
              <ExternalLink size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuoteCard;
