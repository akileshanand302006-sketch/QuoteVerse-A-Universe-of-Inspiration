/**
 * CategoryFilter — Attractive category chip selector.
 * Allows filtering quotes by category with visual feedback.
 */
function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="category-chips-container" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
      gap: '0.6rem',
      width: '100%',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <button
        className={`chip category-transition ${selectedCategory === 'All' ? 'active' : ''}`}
        onClick={() => onSelectCategory('All')}
        aria-label="Show all categories"
        style={{
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0.55rem 0.8rem',
          width: '100%'
        }}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={`chip category-transition ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
          aria-label={`Filter by ${category}`}
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0.55rem 0.8rem',
            width: '100%'
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
