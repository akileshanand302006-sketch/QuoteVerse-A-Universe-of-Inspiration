import { useState, useEffect } from 'react';
import { Sun, Calendar } from 'lucide-react';
import QuoteDisplay from '../components/QuoteDisplay';
import { getDailyQuoteIndex } from '../utils/quoteUtils';

/**
 * DailyQuote Page — Displays the "Quote of the Day".
 * Uses the current date to deterministically select a quote.
 * The same quote appears all day.
 */
function DailyQuote({ quotes, onFavorite, isFavoriteQuote, onShowToast }) {
  const [dailyQuote, setDailyQuote] = useState(null);

  useEffect(() => {
    if (quotes.length > 0) {
      const index = getDailyQuoteIndex(quotes.length);
      setDailyQuote(quotes[index]);
    }
  }, [quotes]);

  const today = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dateString = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const handleCopy = () => {
    onShowToast('Daily quote copied!', 'success');
  };

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '0.75rem'
          }}>
            ☀️
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            Quote of the Day
          </h1>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            color: 'var(--text-muted)',
            fontSize: '0.9rem'
          }}>
            <Calendar size={16} />
            <span>{dateString}</span>
          </div>
        </div>

        {/* Daily Quote Display */}
        {dailyQuote ? (
          <div className="daily-quote-card">
            <QuoteDisplay
              quote={dailyQuote}
              isFavorite={isFavoriteQuote(dailyQuote.id)}
              onFavorite={onFavorite}
              onCopy={handleCopy}
            />
          </div>
        ) : (
          <div className="text-center" style={{ padding: '3rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading today&apos;s thought...</p>
          </div>
        )}

        {/* Info */}
        <div className="glass-card-static" style={{
          padding: '1.5rem',
          marginTop: '2rem',
          maxWidth: '500px',
          margin: '2rem auto 0 auto',
          textAlign: 'center'
        }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            A new quote is selected every day. Come back tomorrow for a fresh thought!
          </p>
        </div>

      </div>
    </div>
  );
}

export default DailyQuote;
