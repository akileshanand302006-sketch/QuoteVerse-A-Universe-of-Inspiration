import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, Heart, History, Sun as SunIcon, Keyboard, Menu, X, Sparkles, LogIn, LogOut, User as UserIcon, Disc, Trophy, Palette, BarChart3 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

/**
 * Navbar — Premium glass navigation bar with Keyboard Shortcuts button and Auth controls.
 */
function Navbar({ theme, onToggleTheme, onShowShortcuts, user, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={15} /> },
    { path: '/roulette', label: 'Roulette', icon: <Disc size={15} /> },
    { path: '/challenge', label: 'Challenge', icon: <Trophy size={15} /> },
    { path: '/studio', label: 'Studio', icon: <Palette size={15} /> },
    { path: '/analytics', label: 'Analytics', icon: <BarChart3 size={15} /> },
    { path: '/quote-of-the-day', label: 'QOTD', icon: <SunIcon size={15} /> },
    { path: '/favorites', label: 'Favorites', icon: <Heart size={15} /> },
    { path: '/history', label: 'History', icon: <History size={15} /> }
  ];

  const toggleMobile = () => setMobileOpen(!mobileOpen);
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className="nav-slide-down" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--navbar-height)',
      background: 'var(--bg-glass)',
      backdropFilter: 'var(--glass-blur-strong)',
      WebkitBackdropFilter: 'var(--glass-blur-strong)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
    }}>
      <div className="container-fluid" style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
      }}>
        {/* Brand — Positioned at Far Left Corner */}
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          marginRight: 'auto',
          paddingLeft: '0.25rem',
          flexShrink: 0
        }} onClick={closeMobile}>
          <div style={{
            padding: '0.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--accent-gradient-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={22} style={{ color: 'var(--accent-primary)' }} />
          </div>
          <span className="navbar-brand-text" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 2px 10px rgba(139, 92, 246, 0.2)'
          }}>
            QuoteVerse
          </span>
        </Link>

        {/* Desktop Nav Links — 100% Equal Size Tabs */}
        <div className="d-none d-lg-flex" style={{
          alignItems: 'center',
          gap: '0.4rem',
          flex: 1,
          justifyContent: 'flex-end',
          marginLeft: '1.5rem'
        }}>
          <div className="nav-tabs-equal-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            flex: '1 1 auto',
            maxWidth: '820px'
          }}>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className="btn-glass nav-tab-equal"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  fontSize: '0.76rem',
                  padding: '0.45rem 0.5rem',
                  flex: '1 1 0px',
                  minWidth: '74px',
                  justifyContent: 'center',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  background: isActive ? 'var(--accent-gradient-subtle)' : undefined,
                  borderColor: isActive ? 'var(--border-accent)' : undefined,
                  color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 600
                })}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}

            {/* Equal Sized Shortcuts Tab Button */}
            <button
              className="btn-glass nav-tab-equal"
              onClick={onShowShortcuts}
              title="Keyboard Shortcuts"
              aria-label="Keyboard Shortcuts"
              style={{
                fontSize: '0.76rem',
                padding: '0.45rem 0.5rem',
                flex: '1 1 0px',
                minWidth: '74px',
                justifyContent: 'center',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                fontWeight: 600
              }}
            >
              <Keyboard size={15} />
              <span>Shortcuts</span>
            </button>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          {/* User Auth Profile / Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.25rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: 'var(--bg-glass-strong)',
                border: '1px solid var(--border-accent)',
                padding: '0.3rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                <UserIcon size={13} style={{ color: 'var(--accent-primary)' }} />
                <span>{user.name}</span>
              </div>
              <button
                className="btn-icon"
                onClick={onLogout}
                title="Sign Out"
                aria-label="Sign Out"
                style={{ width: '34px', height: '34px', color: '#ef4444' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="btn-accent"
              style={{
                textDecoration: 'none',
                fontSize: '0.8rem',
                padding: '0.45rem 0.85rem',
                marginLeft: '0.25rem'
              }}
            >
              <LogIn size={14} />
              Sign In
            </NavLink>
          )}
        </div>

        {/* Mobile / Tablet controls */}
        <div className="d-flex d-lg-none" style={{ gap: '0.5rem', alignItems: 'center' }}>
          <button
            className="btn-icon"
            onClick={onShowShortcuts}
            title="Keyboard Shortcuts"
            style={{ width: '36px', height: '36px' }}
          >
            <Keyboard size={18} />
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            className="btn-icon"
            onClick={toggleMobile}
            aria-label="Toggle menu"
            style={{ width: '36px', height: '36px' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div style={{
          position: 'absolute',
          top: 'var(--navbar-height)',
          left: 0,
          right: 0,
          background: 'var(--bg-glass-strong)',
          backdropFilter: 'var(--glass-blur-strong)',
          WebkitBackdropFilter: 'var(--glass-blur-strong)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          maxHeight: 'calc(100vh - var(--navbar-height))',
          overflowY: 'auto',
          animation: 'pageSlideIn 0.3s ease-out'
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={closeMobile}
              style={({ isActive }) => ({
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 500,
                background: isActive ? 'var(--accent-gradient-subtle)' : 'transparent',
                color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)'
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
          <button
            className="btn-glass"
            onClick={() => { onShowShortcuts(); closeMobile(); }}
            style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent', width: '100%' }}
          >
            <Keyboard size={16} />
            Keyboard Shortcuts
          </button>
          <NavLink
            to="/about"
            onClick={closeMobile}
            style={({ isActive }) => ({
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 500,
              background: isActive ? 'var(--accent-gradient-subtle)' : 'transparent',
              color: isActive ? 'var(--text-accent)' : 'var(--text-secondary)'
            })}
          >
            About
          </NavLink>
          {user ? (
            <button
              className="btn-glass"
              onClick={() => { onLogout(); closeMobile(); }}
              style={{ justifyContent: 'flex-start', color: '#ef4444', border: 'none', background: 'transparent' }}
            >
              <LogOut size={16} />
              Sign Out ({user.name})
            </button>
          ) : (
            <NavLink
              to="/login"
              onClick={closeMobile}
              className="btn-accent"
              style={{ justifyContent: 'center', marginTop: '0.5rem', textDecoration: 'none' }}
            >
              <LogIn size={16} />
              Sign In / Register
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
