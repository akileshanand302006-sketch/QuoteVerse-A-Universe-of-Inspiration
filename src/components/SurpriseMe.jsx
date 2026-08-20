import { useState } from 'react';
import { Sparkles, Dices, Layers, Palette } from 'lucide-react';
import QuoteDisplay from './QuoteDisplay';

/**
 * SurpriseMe — Reveal sequence picking random Category -> Background -> Visual Theme -> Quote.
 */
function SurpriseMe({ quotes, isFavoriteQuote, onFavorite, onShowToast }) {
  const [isRevealing, setIsRevealing] = useState(false);
  const [step, setStep] = useState(0);
  const [surpriseData, setSurpriseData] = useState(null);

  const triggerSurprise = () => {
    if (!quotes || quotes.length === 0 || isRevealing) return;

    setIsRevealing(true);
    setStep(1);

    // Pick random quote, theme style, and background tone
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const themes = [
      { name: 'Nebula Glow', gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)' },
      { name: 'Aurora Sunset', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
      { name: 'Cosmic Cyan', gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)' },
      { name: 'Emerald Serenity', gradient: 'linear-gradient(135deg, #10b981, #059669)' }
    ];
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    setTimeout(() => setStep(2), 500);
    setTimeout(() => setStep(3), 1000);
    setTimeout(() => {
      setStep(4);
      setSurpriseData({ quote: randomQuote, theme: randomTheme });
      setIsRevealing(false);
      if (onShowToast) onShowToast(`Surprise Experience Unlocked: ${randomQuote.category}! ✨`, 'success');
    }, 1500);
  };

  return (
    <div className="glass-card-static" style={{
      padding: '2rem',
      borderRadius: 'var(--radius-xl)',
      textAlign: 'center',
      marginTop: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>
          <Sparkles size={22} style={{ color: 'var(--accent-primary)', verticalAlign: 'middle', marginRight: '0.4rem' }} />
          Surprise Me Experience
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Let QuoteVerse curate a completely unique quote experience for you
        </p>
      </div>

      <button
        className="btn-accent"
        onClick={triggerSurprise}
        disabled={isRevealing}
        style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
      >
        <Dices size={20} className={isRevealing ? 'spinner' : ''} />
        {isRevealing ? 'Curating Experience...' : '✨ SURPRISE ME'}
      </button>

      {/* Reveal Sequence Animation Steps */}
      {isRevealing && (
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <span className="chip" style={{ background: step >= 1 ? 'var(--accent-primary)' : undefined, color: step >= 1 ? '#fff' : undefined }}>
            🎭 Category Selected
          </span>
          <span className="chip" style={{ background: step >= 2 ? 'var(--accent-primary)' : undefined, color: step >= 2 ? '#fff' : undefined }}>
            🌄 Background Rendered
          </span>
          <span className="chip" style={{ background: step >= 3 ? 'var(--accent-primary)' : undefined, color: step >= 3 ? '#fff' : undefined }}>
            ✨ Theme Applied
          </span>
        </div>
      )}

      {/* Surprise Result */}
      {surpriseData && !isRevealing && (
        <div className="quote-fade-enter" style={{ marginTop: '2rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: surpriseData.theme.gradient,
            color: '#fff',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '1rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            Theme: {surpriseData.theme.name}
          </div>

          <QuoteDisplay
            quote={surpriseData.quote}
            isFavorite={isFavoriteQuote(surpriseData.quote.id)}
            onFavorite={onFavorite}
            onShowToast={onShowToast}
          />
        </div>
      )}
    </div>
  );
}

export default SurpriseMe;
