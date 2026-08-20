import { X, Keyboard, Sparkles } from 'lucide-react';

/**
 * ShortcutsModal — Modal displaying all keyboard shortcuts with Ctrl + Key combinations.
 */
function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + N', action: 'Generate New Quote' },
    { key: 'Ctrl + F', action: 'Toggle Favorite Current Quote' },
    { key: 'Ctrl + C', action: 'Copy Current Quote to Clipboard' },
    { key: 'Ctrl + R', action: 'Read Quote Aloud (Web Speech API)' },
    { key: 'Ctrl + S', action: 'Focus Search Input' },
    { key: 'Ctrl + D', action: 'Toggle Day / Night Theme Mode' },
    { key: 'Ctrl + I', action: 'Toggle Immersive Inspiration Mode' },
    { key: 'Ctrl + O', action: 'Navigate to Quote Roulette' },
    { key: 'Ctrl + M', action: 'Navigate to Quote Challenge' },
    { key: 'Ctrl + P', action: 'Navigate to Quote Card Studio' },
    { key: 'Ctrl + A', action: 'Navigate to Personal Analytics' },
    { key: 'Ctrl + Q', action: 'Navigate to Quote of the Day' },
    { key: 'Ctrl + B', action: 'Navigate to Favorites' },
    { key: 'Ctrl + H', action: 'Navigate to History' },
    { key: 'Ctrl + K', action: 'Open Navigation Command Palette' },
    { key: 'Esc', action: 'Close Modal / Exit Inspiration Mode' }
  ];

  return (
    <div
      className="modal-backdrop-enter"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card-static modal-content-enter custom-modal-content"
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '2rem',
          position: 'relative',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--bg-glass-strong)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-gradient-subtle)',
              color: 'var(--accent-primary)'
            }}>
              <Keyboard size={22} />
            </div>
            <div>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                margin: 0,
                color: 'var(--text-primary)'
              }}>
                Keyboard Shortcuts
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Full Ctrl + Key combinations for quick actions & navigation
              </span>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={onClose}
            aria-label="Close shortcuts modal"
            style={{ width: '34px', height: '34px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Shortcuts List Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {shortcuts.map((sc) => (
            <div
              key={sc.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-color)'
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {sc.action}
              </span>
              <kbd style={{
                background: 'var(--accent-gradient-subtle)',
                border: '1px solid var(--border-accent)',
                color: 'var(--text-accent)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap'
              }}>
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem'
        }}>
          <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
          <span>Press Esc to close any active modal or inspiration overlay</span>
        </div>
      </div>
    </div>
  );
}

export default ShortcutsModal;
