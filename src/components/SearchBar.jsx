import { Search, X } from 'lucide-react';

/**
 * SearchBar — Animated search input with clear button and result count.
 * Searches across quote text, author, category, and tags.
 */
function SearchBar({ searchTerm, onSearch, resultCount, totalCount }) {
  const handleChange = (e) => {
    onSearch(e.target.value);
  };

  const handleClear = () => {
    onSearch('');
  };

  return (
    <div className="search-container" style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
            transition: 'color var(--transition-normal)'
          }}
        />
        <input
          type="text"
          className="input-glass"
          placeholder="Search quotes, authors, categories..."
          value={searchTerm}
          onChange={handleChange}
          aria-label="Search quotes"
          id="quote-search-input"
          style={{
            paddingLeft: '2.8rem',
            paddingRight: searchTerm ? '2.8rem' : '1rem',
          }}
        />
        {searchTerm && (
          <button
            onClick={handleClear}
            style={{
              position: 'absolute',
              right: '0.8rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color var(--transition-fast)'
            }}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {searchTerm.trim() && (
        <div style={{
          textAlign: 'center',
          marginTop: '0.6rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontWeight: 500
        }}>
          {resultCount === 0 ? (
            <span>No quotes found</span>
          ) : (
            <span>
              <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>{resultCount}</span>
              {' '}quote{resultCount !== 1 ? 's' : ''} found
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
