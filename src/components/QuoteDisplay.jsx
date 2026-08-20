import { useState, useEffect } from 'react';
import QuoteActions from './QuoteActions';

/**
 * QuoteDisplay — The main quote card component.
 * Receives the current quote via PROPS from the parent.
 */
function QuoteDisplay({ quote, isFavorite, onFavorite, onCopy, onShare, onShowToast }) {
  const [animClass, setAnimClass] = useState('quote-fade-enter');

  useEffect(() => {
    setAnimClass('quote-fade-enter');
    const timer = setTimeout(() => setAnimClass(''), 600);
    return () => clearTimeout(timer);
  }, [quote?.id]);

  if (!quote) {
    return (
      <div className="glass-card-static glow-pulse quote-main-card" style={{
        padding: '2.5rem',
        maxWidth: '650px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center'
      }}>
        <div className="skeleton skeleton-title" style={{ margin: '0 auto 1.5rem auto' }}></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text short" style={{ margin: '0 auto' }}></div>
        <div className="skeleton skeleton-text shorter" style={{ margin: '1.5rem auto 0 auto' }}></div>
      </div>
    );
  }

  return (
    <div className="glass-card-static glow-pulse quote-main-card" style={{
      padding: '2.5rem 3rem',
      maxWidth: '650px',
      margin: '0 auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Floating quotation marks */}
      <span className="floating-mark left" aria-hidden="true">&ldquo;</span>
      <span className="floating-mark right" aria-hidden="true">&rdquo;</span>

      {/* Quote Content */}
      <div className={animClass}>
        <p className="quote-text-main" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.55rem',
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 1.6,
          textAlign: 'center',
          color: 'var(--text-primary)',
          marginBottom: '1.25rem',
          position: 'relative',
          zIndex: 1
        }}>
          &ldquo;{quote.text}&rdquo;
        </p>

        <p className="quote-author-main" style={{
          fontFamily: 'var(--font-primary)',
          fontSize: '1rem',
          fontWeight: 500,
          textAlign: 'center',
          color: 'var(--text-accent)',
          marginBottom: '1rem',
          position: 'relative',
          zIndex: 1
        }}>
          — {quote.author}
        </p>

        {/* Category badge & Tags */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <span className="chip active" style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}>
            {quote.category}
          </span>
          {quote.tags.map((tag) => (
            <span key={tag} className="chip" style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', cursor: 'default' }}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <QuoteActions
        quote={quote}
        isFavorite={isFavorite}
        onFavorite={onFavorite}
        onCopy={onCopy}
        onShare={onShare}
        onShowToast={onShowToast}
      />
    </div>
  );
}

export default QuoteDisplay;
