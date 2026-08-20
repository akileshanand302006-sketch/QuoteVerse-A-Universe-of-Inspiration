import { useState, useEffect } from 'react';
import { Sun, Calendar, Clock, Sparkles } from 'lucide-react';
import QuoteDisplay from '../components/QuoteDisplay';
import { getDailyQuoteIndex } from '../utils/quoteUtils';

/**
 * QuoteOfTheDay Page — Dedicated QOTD page with countdown to midnight.
 * Route: /quote-of-the-day
 */
function QuoteOfTheDay({ quotes, onFavorite, isFavoriteQuote, onNewQuote, onShowToast }) {
  const [dailyQuote, setDailyQuote] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      const index = getDailyQuoteIndex(quotes.length);
      setDailyQuote(quotes[index]);
    }
  }, [quotes]);

  // Midnight Countdown Timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const today = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dateString = `${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`;

  const handleCopy = () => {
    if (onShowToast) onShowToast('Daily quote copied!', 'success');
  };

  const handleGenerateSimilar = () => {
    if (!dailyQuote) return;
    const categoryQuotes = quotes.filter(q => q.category === dailyQuote.category && q.id !== dailyQuote.id);
    if (categoryQuotes.length > 0) {
      const randomSimilar = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
      onNewQuote(randomSimilar);
      if (onShowToast) onShowToast(`Generated similar quote in ${dailyQuote.category}!`, 'info');
    }
  };

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)', textAlign: 'center' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>☀️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 700 }}>
            Quote of the Day
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            <Calendar size={16} />
            <span>{dateString}</span>
          </div>

          {/* Countdown to Midnight */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-gradient-subtle)',
            border: '1px solid var(--border-accent)',
            fontSize: '0.85rem',
            color: 'var(--text-accent)',
            fontWeight: 600
          }}>
            <Clock size={15} />
            <span>New Quote in {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
          </div>
        </div>

        {/* Daily Quote Display */}
        {dailyQuote ? (
          <div>
            <QuoteDisplay
              quote={dailyQuote}
              isFavorite={isFavoriteQuote(dailyQuote.id)}
              onFavorite={onFavorite}
              onCopy={handleCopy}
              onShowToast={onShowToast}
            />

            <div style={{ marginTop: '1.5rem' }}>
              <button className="btn-glass" onClick={handleGenerateSimilar}>
                <Sparkles size={16} /> Generate Similar Quote
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center" style={{ padding: '3rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Loading today&apos;s thought...</p>
          </div>
        )}

      </div>
    </div>
  );
}

export default QuoteOfTheDay;
