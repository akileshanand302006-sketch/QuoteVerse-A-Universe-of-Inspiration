import { Sparkles, Heart, Search, BookOpen } from 'lucide-react';

/**
 * QuoteStats — Analytics section showing quote exploration statistics.
 * All stats are passed via props; persisted in parent via localStorage.
 */
function QuoteStats({ stats }) {
  const items = [
    {
      icon: <Sparkles size={22} />,
      label: 'Quotes Explored',
      value: stats.quotesExplored || 0,
      color: '#8b5cf6'
    },
    {
      icon: <Heart size={22} />,
      label: 'Favorites',
      value: stats.favorites || 0,
      color: '#ef4444'
    },
    {
      icon: <Search size={22} />,
      label: 'Searches',
      value: stats.searches || 0,
      color: '#06b6d4'
    },
    {
      icon: <BookOpen size={22} />,
      label: 'Categories Explored',
      value: stats.categoriesExplored || 0,
      color: '#f59e0b'
    }
  ];

  return (
    <div className="stats-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '1rem'
    }}>
      {items.map((item) => (
        <div key={item.label} className="glass-card stat-card" style={{
          padding: '1.25rem',
          textAlign: 'center',
          cursor: 'default'
        }}>
          <div style={{ color: item.color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
            {item.icon}
          </div>
          <div className="stat-number" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            lineHeight: 1
          }}>
            {item.value}
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginTop: '0.35rem',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuoteStats;
