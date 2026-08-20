import { BarChart3, Sparkles, Heart, Search, BookOpen, User, Copy, Share2, Trophy, Clock } from 'lucide-react';

/**
 * Analytics Page — Dynamic visualization of user quote discovery stats.
 */
function Analytics({ stats, favorites, history }) {
  const totalExplored = stats.quotesExplored || 1;
  const totalFavorites = favorites.length || 0;
  const totalSearches = stats.searches || 0;
  const totalCategories = stats.categoriesExplored || 1;

  // Extract distinct authors discovered
  const authorsDiscovered = new Set(history.map(h => h.quote ? h.quote.author : null).filter(Boolean)).size;

  const statCards = [
    { title: 'Quotes Explored', value: totalExplored, icon: <Sparkles size={20} />, color: '#8b5cf6' },
    { title: 'Saved Favorites', value: totalFavorites, icon: <Heart size={20} />, color: '#ef4444' },
    { title: 'Total Searches', value: totalSearches, icon: <Search size={20} />, color: '#06b6d4' },
    { title: 'Categories Explored', value: totalCategories, icon: <BookOpen size={20} />, color: '#f59e0b' },
    { title: 'Authors Discovered', value: authorsDiscovered, icon: <User size={20} />, color: '#10b981' },
    { title: 'History Log Entries', value: history.length, icon: <Clock size={20} />, color: '#ec4899' }
  ];

  // Category distribution calculation
  const catDistribution = {};
  history.forEach(entry => {
    if (entry.quote && entry.quote.category) {
      catDistribution[entry.quote.category] = (catDistribution[entry.quote.category] || 0) + 1;
    }
  });

  const catEntries = Object.entries(catDistribution).sort((a, b) => b[1] - a[1]);

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <BarChart3 size={36} style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }} />
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>
            Personal Quote Analytics
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Comprehensive overview of your quote discovery habits and milestones
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2.5rem'
        }}>
          {statCards.map((item) => (
            <div key={item.title} className="glass-card" style={{ padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ color: item.color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                {item.icon}
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* Category Breakdown Progress Bars */}
        <div className="glass-card-static" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
            📊 Category Exploration Breakdown
          </h3>

          {catEntries.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Explore more quotes on the Home page to build your category breakdown!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {catEntries.slice(0, 5).map(([category, count]) => {
                const percentage = Math.round((count / history.length) * 100);
                return (
                  <div key={category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      <span>{category}</span>
                      <span>{count} quote{count !== 1 ? 's' : ''} ({percentage}%)</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--bg-glass)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${percentage}%`,
                        background: 'var(--accent-gradient)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Analytics;
