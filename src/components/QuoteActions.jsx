import { useState } from 'react';
import { Heart, Copy, Share2, Check } from 'lucide-react';
import ReadAloudButton from './ReadAloudButton';
import { formatQuoteForSharing } from '../utils/quoteUtils';

/**
 * QuoteActions — Action buttons for a quote (favorite, copy, share, read aloud).
 * Receives handlers via props from parent components.
 */
function QuoteActions({ quote, isFavorite, onFavorite, onCopy, onShare, onShowToast }) {
  const [copied, setCopied] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const handleCopy = async () => {
    if (!quote) return;
    try {
      await navigator.clipboard.writeText(formatQuoteForSharing(quote));
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleFavorite = () => {
    if (!quote) return;
    setHeartAnim(true);
    onFavorite(quote);
    setTimeout(() => setHeartAnim(false), 500);
  };

  const handleShare = async () => {
    if (!quote) return;
    const shareData = {
      title: 'QuoteVerse',
      text: formatQuoteForSharing(quote),
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      if (onShare) {
        onShare(quote);
      } else {
        handleCopy();
      }
    }
  };

  return (
    <div className="quote-actions-row" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap'
    }}>
      <button
        className={`btn-glass ${heartAnim ? 'heart-pop' : ''}`}
        onClick={handleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        style={{
          color: isFavorite ? '#ef4444' : 'var(--text-secondary)'
        }}
      >
        <Heart size={18} fill={isFavorite ? '#ef4444' : 'none'} />
        <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
      </button>

      <button
        className={`btn-glass ${copied ? 'copy-success' : ''}`}
        onClick={handleCopy}
        aria-label="Copy quote"
        title="Copy quote to clipboard"
      >
        {copied ? <Check size={18} style={{ color: '#22c55e' }} /> : <Copy size={18} />}
        <span>{copied ? 'Copied!' : 'Copy'}</span>
      </button>

      {/* Read Aloud Button with Web Speech API */}
      <ReadAloudButton quote={quote} onShowToast={onShowToast} />

      <button
        className="btn-glass"
        onClick={handleShare}
        aria-label="Share quote"
        title="Share quote"
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>
    </div>
  );
}

export default QuoteActions;
