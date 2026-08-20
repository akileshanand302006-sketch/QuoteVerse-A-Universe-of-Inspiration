import { moods } from '../data/quotes';

/**
 * MoodPicker — Allows users to select a mood and see matching quotes.
 * Maps moods to quote categories/tags for filtering.
 */
function MoodPicker({ selectedMood, onSelectMood }) {
  return (
    <div>
      <div className="mood-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '0.75rem'
      }}>
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`glass-card category-transition`}
            onClick={() => onSelectMood(selectedMood === mood.id ? null : mood.id)}
            style={{
              padding: '1rem 0.75rem',
              textAlign: 'center',
              cursor: 'pointer',
              border: selectedMood === mood.id
                ? '2px solid var(--accent-primary)'
                : '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              background: selectedMood === mood.id
                ? 'var(--accent-gradient-subtle)'
                : 'var(--bg-card)',
              transform: selectedMood === mood.id ? 'scale(1.03)' : 'scale(1)',
              transition: 'all var(--transition-normal)'
            }}
            aria-label={`Select ${mood.label} mood`}
          >
            <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{mood.emoji}</div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: selectedMood === mood.id ? 'var(--text-accent)' : 'var(--text-secondary)'
            }}>
              {mood.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MoodPicker;
