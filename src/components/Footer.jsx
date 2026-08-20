import { Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Footer — Premium footer with tagline, navigation links, and copyright.
 */
function Footer() {
  return (
    <footer style={{
      background: 'var(--bg-glass)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      borderTop: '1px solid var(--border-color)',
      padding: '2rem 1.5rem',
      marginTop: 'auto',
      position: 'relative',
      zIndex: 10
    }}>
      <div className="container" style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto'
      }}>
        <div className="footer-content" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.1rem',
              background: 'var(--accent-gradient)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              QuoteVerse
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
              &bull; &ldquo;A thought worth discovering.&rdquo;
            </span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem' }}>
            <Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link>
            <Link to="/favorites" style={{ color: 'var(--text-secondary)' }}>Favorites</Link>
            <Link to="/history" style={{ color: 'var(--text-secondary)' }}>History</Link>
            <Link to="/daily" style={{ color: 'var(--text-secondary)' }}>Daily Quote</Link>
            <Link to="/about" style={{ color: 'var(--text-secondary)' }}>About</Link>
          </div>

          {/* Copyright */}
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={14} style={{ color: '#ef4444' }} fill="#ef4444" /> using React.js
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
