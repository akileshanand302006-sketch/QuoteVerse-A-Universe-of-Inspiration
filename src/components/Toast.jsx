import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast — Notification component with auto-dismiss.
 * Displays success, error, or info messages.
 */
function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <Info size={18} />
  };

  const colors = {
    success: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', icon: '#22c55e' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', icon: '#ef4444' },
    info: { bg: 'rgba(139, 92, 246, 0.15)', border: 'rgba(139, 92, 246, 0.3)', icon: '#8b5cf6' }
  };

  const style = colors[type] || colors.info;

  return (
    <div
      className={isExiting ? 'toast-exit' : 'toast-enter'}
      style={{
        background: style.bg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${style.border}`,
        borderRadius: 'var(--radius-md)',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        minWidth: '280px',
        maxWidth: '400px',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--text-primary)',
        fontSize: '0.875rem',
        fontWeight: 500,
      }}
      role="alert"
    >
      <span style={{ color: style.icon, flexShrink: 0 }}>{icons[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={() => { setIsExiting(true); setTimeout(onClose, 300); }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          flexShrink: 0
        }}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default Toast;
