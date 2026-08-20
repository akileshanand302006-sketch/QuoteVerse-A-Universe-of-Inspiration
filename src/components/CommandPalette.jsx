import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Trophy, Disc, Calendar, Palette, BarChart3, Eye, Sun, Volume2, Heart, History as HistoryIcon, X } from 'lucide-react';

/**
 * CommandPalette — Searchable Quick Action Command Palette with Ctrl + Key shortcuts for all options.
 */
function CommandPalette({ isOpen, onClose, onNewQuote, onToggleTheme, onEnterInspiration, onShowToast }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'new-quote',
      label: 'Generate New Quote',
      icon: <Sparkles size={16} />,
      shortcut: 'Ctrl + N',
      action: () => { onNewQuote(); navigate('/'); }
    },
    {
      id: 'roulette',
      label: 'Spin Quote Roulette',
      icon: <Disc size={16} />,
      shortcut: 'Ctrl + O',
      action: () => { navigate('/roulette'); }
    },
    {
      id: 'challenge',
      label: 'Play Quote Challenge',
      icon: <Trophy size={16} />,
      shortcut: 'Ctrl + M',
      action: () => { navigate('/challenge'); }
    },
    {
      id: 'studio',
      label: 'Quote Card Studio',
      icon: <Palette size={16} />,
      shortcut: 'Ctrl + P',
      action: () => { navigate('/studio'); }
    },
    {
      id: 'analytics',
      label: 'Personal Quote Analytics',
      icon: <BarChart3 size={16} />,
      shortcut: 'Ctrl + A',
      action: () => { navigate('/analytics'); }
    },
    {
      id: 'qotd',
      label: 'Quote of the Day',
      icon: <Calendar size={16} />,
      shortcut: 'Ctrl + Q',
      action: () => { navigate('/quote-of-the-day'); }
    },
    {
      id: 'favorites',
      label: 'View Favorites',
      icon: <Heart size={16} />,
      shortcut: 'Ctrl + B',
      action: () => { navigate('/favorites'); }
    },
    {
      id: 'history',
      label: 'View History',
      icon: <HistoryIcon size={16} />,
      shortcut: 'Ctrl + H',
      action: () => { navigate('/history'); }
    },
    {
      id: 'inspiration',
      label: 'Enter Inspiration Mode',
      icon: <Eye size={16} />,
      shortcut: 'Ctrl + I',
      action: () => { onEnterInspiration(); }
    },
    {
      id: 'theme',
      label: 'Toggle Day / Night Mode',
      icon: <Sun size={16} />,
      shortcut: 'Ctrl + D',
      action: () => { onToggleTheme(); }
    }
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const executeCommand = (cmd) => {
    cmd.action();
    onClose();
  };

  return (
    <div
      className="modal-backdrop-enter"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5rem 1rem 1rem 1rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card-static modal-content-enter"
        style={{
          width: '100%',
          maxWidth: '580px',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg), var(--shadow-glow)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{
          position: 'relative',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <Search size={20} style={{ color: 'var(--accent-primary)' }} />
          <input
            type="text"
            placeholder="Type a command or navigate..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              width: '100%',
              fontFamily: 'var(--font-primary)'
            }}
          />
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Command List */}
        <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.5rem' }}>
          {filteredCommands.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No navigation commands found
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <div
                key={cmd.id}
                onClick={() => executeCommand(cmd)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                  margin: '2px 0'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-gradient-subtle)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                  <span style={{ color: 'var(--accent-primary)' }}>{cmd.icon}</span>
                  <span>{cmd.label}</span>
                </div>
                {cmd.shortcut && (
                  <kbd style={{
                    background: 'var(--accent-gradient-subtle)',
                    border: '1px solid var(--border-accent)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-accent)',
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    {cmd.shortcut}
                  </kbd>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.6rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span>Press <strong>ESC</strong> to exit</span>
          <span>QuoteVerse Navigation Palette</span>
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;
