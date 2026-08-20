import { Sun, Moon } from 'lucide-react';

/**
 * ThemeToggle — Premium light/dark mode toggle.
 * Uses props for current theme and toggle handler.
 */
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="btn-icon"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <span
        style={{
          display: 'flex',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
        }}
      >
        {theme === 'dark' ? (
          <Moon size={18} style={{ color: '#a78bfa' }} />
        ) : (
          <Sun size={18} style={{ color: '#f59e0b' }} />
        )}
      </span>
    </button>
  );
}

export default ThemeToggle;
