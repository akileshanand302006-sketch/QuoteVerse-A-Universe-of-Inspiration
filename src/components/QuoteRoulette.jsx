import { useState } from 'react';
import { Disc, Sparkles, RefreshCw } from 'lucide-react';
import QuoteDisplay from './QuoteDisplay';
import { categories } from '../data/quotes';

/**
 * QuoteRoulette — Interactive circular category roulette wheel.
 */
function QuoteRoulette({ quotes, isFavoriteQuote, onFavorite, onShowToast }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [rouletteQuote, setRouletteQuote] = useState(null);

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setRouletteQuote(null);

    // Random extra rotations (3 to 6 full turns) + random category landing offset
    const extraRotations = 360 * (3 + Math.floor(Math.random() * 4));
    const randomCategoryIndex = Math.floor(Math.random() * categories.length);
    const targetCategory = categories[randomCategoryIndex];

    const anglePerCategory = 360 / categories.length;
    const finalRotation = rotation + extraRotations + (randomCategoryIndex * anglePerCategory);

    setRotation(finalRotation);

    // Wait for wheel spin animation to complete (3 seconds)
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedCategory(targetCategory);

      // Find matching quotes for category
      const matchingQuotes = quotes.filter(q => q.category === targetCategory);
      if (matchingQuotes.length > 0) {
        const randomQ = matchingQuotes[Math.floor(Math.random() * matchingQuotes.length)];
        setRouletteQuote(randomQ);
        if (onShowToast) onShowToast(`Roulette landed on ${targetCategory}! 🎲`, 'success');
      }
    }, 3000);
  };

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)', textAlign: 'center' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Disc size={36} className={isSpinning ? 'spinner' : ''} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
            Quote Roulette
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Spin the wheel to discover thoughts from random categories
          </p>
        </div>

        {/* Circular Roulette Wheel */}
        <div style={{
          position: 'relative',
          width: '320px',
          height: '320px',
          margin: '0 auto 2.5rem auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Wheel Indicator Pointer */}
          <div style={{
            position: 'absolute',
            top: '-15px',
            zIndex: 10,
            width: 0,
            height: 0,
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderTop: '20px solid var(--accent-primary)',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.4))'
          }} />

          {/* Rotating Disc */}
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: 'var(--bg-glass-strong)',
              backdropFilter: 'var(--glass-blur-strong)',
              border: '4px solid var(--border-accent)',
              boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
              position: 'relative',
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 3s cubic-bezier(0.15, 0.9, 0.2, 1)' : 'none',
              overflow: 'hidden'
            }}
          >
            {categories.map((cat, idx) => {
              const angle = (idx * 360) / categories.length;
              return (
                <div
                  key={cat}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '130px',
                    height: '30px',
                    marginTop: '-15px',
                    marginLeft: '-65px',
                    transformOrigin: 'center center',
                    transform: `rotate(${angle}deg) translate(95px) rotate(-${angle}deg)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span className="chip" style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    background: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--bg-glass)',
                    color: selectedCategory === cat ? '#fff' : 'var(--text-primary)'
                  }}>
                    {cat}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Center Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning}
            style={{
              position: 'absolute',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--accent-gradient)',
              border: '3px solid #fff',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: isSpinning ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px var(--accent-glow)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
              transition: 'all 0.3s ease'
            }}
          >
            <Sparkles size={18} />
            <span>{isSpinning ? 'SPINNING' : 'SPIN!'}</span>
          </button>
        </div>

        {/* Selected Quote Result */}
        {rouletteQuote && (
          <div className="quote-fade-enter" style={{ marginTop: '2rem' }}>
            <p style={{ color: 'var(--text-accent)', fontWeight: 600, marginBottom: '1rem' }}>
              🎯 Landed on: {selectedCategory}
            </p>
            <QuoteDisplay
              quote={rouletteQuote}
              isFavorite={isFavoriteQuote(rouletteQuote.id)}
              onFavorite={onFavorite}
              onShowToast={onShowToast}
            />
          </div>
        )}

      </div>
    </div>
  );
}

export default QuoteRoulette;
