import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

/**
 * NotFound (404) Page — Beautiful error state for unknown routes.
 */
function NotFound() {
  return (
    <div className="page-enter" style={{
      padding: '2rem 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - var(--navbar-height) - 100px)'
    }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)', textAlign: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem', opacity: 0.5 }}>
          🌌
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 700,
          marginBottom: '0.5rem'
        }}>
          <span className="gradient-text">404</span>
        </h1>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          color: 'var(--text-secondary)',
          marginBottom: '0.5rem'
        }}>
          This thought doesn&apos;t exist yet.
        </p>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          marginBottom: '2rem'
        }}>
          The page you&apos;re looking for has wandered off into the cosmos.
        </p>
        <Link to="/" className="btn-accent" style={{ textDecoration: 'none' }}>
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
