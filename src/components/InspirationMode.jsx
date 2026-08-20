import { useState } from 'react';
import { X, Heart, Copy, Check, Sparkles } from 'lucide-react';
import { formatQuoteForSharing } from '../utils/quoteUtils';

/**
 * InspirationMode — Immersive distraction-free reading view.
 * Enlarges the quote with dark cinematic backdrop and slow floating animations.
 */
function InspirationMode({ quote, isFavorite, onFavorite, onExit, onNextQuote, onShowToast }) {
  const [copied, setCopied] = useState(false);

  if (!quote) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatQuoteForSharing(quote));
      setCopied(true);
      if (onShowToast) onShowToast('Quote copied in Inspiration Mode!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="inspiration-mode">
      <div className="inspiration-icon">✨</div>

      <div className="quote-text-inspiration">
        &ldquo;{quote.text}&rdquo;
      </div>

      <div className="quote-author-inspiration">
        — {quote.author}
      </div>

      <div style={{ marginTop: '0.75rem' }}>
        <span className="chip active" style={{ fontSize: '0.8rem' }}>
          {quote.category}
        </span>
      </div>

      <div className="inspiration-controls">
        <button
          className="btn-glass"
          onClick={() => onFavorite(quote)}
          style={{ color: isFavorite ? '#ef4444' : 'var(--text-primary)' }}
        >
          <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
          {isFavorite ? 'Favorited' : 'Favorite'}
        </button>

        <button className="btn-glass" onClick={handleCopy}>
          {copied ? <Check size={18} style={{ color: '#22c55e' }} /> : <Copy size={18} />}
          {copied ? 'Copied' : 'Copy'}
        </button>

        <button className="btn-accent" onClick={onNextQuote}>
          <Sparkles size={18} />
          Next Thought
        </button>

        <button
          className="btn-glass"
          onClick={onExit}
          style={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
        >
          <X size={18} />
          Exit Mode
        </button>
      </div>

      <p style={{
        position: 'absolute',
        bottom: '2rem',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '0.8rem'
      }}>
        Press ESC to exit
      </p>
    </div>
  );
}

export default InspirationMode;
