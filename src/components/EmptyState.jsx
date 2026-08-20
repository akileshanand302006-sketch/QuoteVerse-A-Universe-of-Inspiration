import { Link } from 'react-router-dom';

/**
 * EmptyState — Beautiful empty state component for when there's no data.
 * Used for favorites, history, search results, etc.
 */
function EmptyState({ icon, title, message, actionLabel, actionTo, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-text">{message}</p>
      {actionTo && (
        <Link to={actionTo} className="btn-accent" style={{ textDecoration: 'none' }}>
          {actionLabel}
        </Link>
      )}
      {onAction && !actionTo && (
        <button className="btn-accent" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
