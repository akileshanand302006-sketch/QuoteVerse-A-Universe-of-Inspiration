import { useState, useEffect } from 'react';
import { Sparkles, Eye, Disc, Trophy, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveClock from '../components/LiveClock';
import QuoteDisplay from '../components/QuoteDisplay';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import QuoteStats from '../components/QuoteStats';
import MoodPicker from '../components/MoodPicker';
import QuoteCard from '../components/QuoteCard';
import EmptyState from '../components/EmptyState';
import SmartRecommendations from '../components/SmartRecommendations';
import SurpriseMe from '../components/SurpriseMe';

import { categories } from '../data/quotes';
import { getRandomQuoteIndex, searchQuotes, filterByCategory, filterByMood } from '../utils/quoteUtils';

/**
 * Home Page — Main landing page featuring:
 * - Live Clock
 * - Thought of the Moment (QuoteDisplay via Props)
 * - Quick Action Chips (Roulette, Challenge, Studio, QOTD)
 * - Smart Recommendations engine
 * - Surprise Me experience
 * - Search, Category filter, Mood picker, and Stats
 */
function Home({
  quotes,
  currentQuote,
  currentIndex,
  onNewQuote,
  onFavorite,
  isFavoriteQuote,
  stats,
  onUpdateStats,
  favorites,
  history,
  onAddToHistory,
  onShowToast,
  onEnterInspiration,
  loading,
  error
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMood, setSelectedMood] = useState(null);
  const [filteredQuotes, setFilteredQuotes] = useState([]);

  useEffect(() => {
    let results = quotes;
    results = filterByCategory(results, selectedCategory);
    if (selectedMood) {
      results = filterByMood(results, selectedMood);
    }
    if (searchTerm.trim()) {
      results = searchQuotes(results, searchTerm);
    }
    setFilteredQuotes(results);
  }, [quotes, searchTerm, selectedCategory, selectedMood]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category !== 'All') {
      onUpdateStats(prev => {
        const explored = new Set(prev.exploredCategories || []);
        explored.add(category);
        return { ...prev, categoriesExplored: explored.size, exploredCategories: [...explored] };
      });
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim()) {
      onUpdateStats(prev => ({ ...prev, searches: (prev.searches || 0) + 1 }));
    }
  };

  const handleNewQuote = () => {
    if (currentQuote) onAddToHistory(currentQuote);
    onNewQuote();
  };

  const handleCopy = () => {
    onShowToast('Quote copied to clipboard!', 'success');
  };

  const handleShare = () => {
    onShowToast('Share link copied!', 'info');
  };

  const isSearchActive = searchTerm.trim() || selectedCategory !== 'All' || selectedMood;

  if (loading) {
    return (
      <div className="page-enter" style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: 'var(--container-max)' }}>
          <div className="text-center" style={{ padding: '4rem 0' }}>
            <div className="spinner" style={{ margin: '0 auto 1.5rem auto' }}></div>
            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Loading your next thought...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-enter" style={{ padding: '2rem 0' }}>
        <div className="container" style={{ maxWidth: 'var(--container-max)' }}>
          <EmptyState
            icon="⚠️"
            title="The thoughts are taking a little longer to arrive."
            message={error}
            actionLabel="Try Again"
            onAction={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: 'var(--container-max)' }}>

        {/* Live Clock */}
        <LiveClock />

        {/* Quick Discovery Navigation Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <Link to="/roulette" className="chip" style={{ textDecoration: 'none' }}>
            <Disc size={14} /> Roulette
          </Link>
          <Link to="/challenge" className="chip" style={{ textDecoration: 'none' }}>
            <Trophy size={14} /> Challenge
          </Link>
          <Link to="/studio" className="chip" style={{ textDecoration: 'none' }}>
            <Palette size={14} /> Studio
          </Link>
          <Link to="/quote-of-the-day" className="chip" style={{ textDecoration: 'none' }}>
            ☀️ QOTD
          </Link>
        </div>

        {/* Section Label */}
        <p style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '1.5rem',
          fontWeight: 500
        }}>
          Thought of the Moment
        </p>

        {/* Main Quote Display */}
        <QuoteDisplay
          quote={currentQuote}
          isFavorite={currentQuote ? isFavoriteQuote(currentQuote.id) : false}
          onFavorite={onFavorite}
          onCopy={handleCopy}
          onShare={handleShare}
          onShowToast={onShowToast}
        />

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.75rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <button className="btn-accent" onClick={handleNewQuote} id="new-quote-btn">
            <Sparkles size={18} />
            New Quote
          </button>
          <button className="btn-glass" onClick={onEnterInspiration} id="inspiration-btn">
            <Eye size={18} />
            Inspiration Mode
          </button>
        </div>

        {/* Category Label */}
        {currentQuote && (
          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Category: <span style={{ color: 'var(--text-accent)', fontWeight: 600 }}>{currentQuote.category}</span>
          </p>
        )}

        {/* Smart Recommendations */}
        <SmartRecommendations
          quotes={quotes}
          stats={stats}
          favorites={favorites}
          history={history}
          onFavorite={onFavorite}
          isFavoriteQuote={isFavoriteQuote}
          onSelectQuote={(q) => {
            if (currentQuote) onAddToHistory(currentQuote);
            onNewQuote(q);
          }}
        />

        {/* Surprise Me Experience */}
        <SurpriseMe
          quotes={quotes}
          isFavoriteQuote={isFavoriteQuote}
          onFavorite={onFavorite}
          onShowToast={onShowToast}
        />

        {/* Search Section */}
        <div className="section-spacing">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={handleSearch}
            resultCount={filteredQuotes.length}
            totalCount={quotes.length}
          />
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>
            Popular Categories
          </h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Mood Picker */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="section-title" style={{ justifyContent: 'center' }}>
            🎭 How are you feeling?
          </h2>
          <MoodPicker
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
          />
        </div>

        {/* Search/Filter Results */}
        {isSearchActive && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 className="section-title">
              {searchTerm.trim() ? `Search Results` : selectedMood ? 'Mood Quotes' : `${selectedCategory} Quotes`}
            </h2>
            {filteredQuotes.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No thoughts matched your search."
                message="Try a different keyword or category."
                actionLabel="Clear Search"
                onAction={() => { setSearchTerm(''); setSelectedCategory('All'); setSelectedMood(null); }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {filteredQuotes.map((quote, index) => (
                  <div key={quote.id} className="stagger-item" style={{ animationDelay: `${index * 0.05}s` }}>
                    <QuoteCard
                      quote={quote}
                      isFavorite={isFavoriteQuote(quote.id)}
                      onFavorite={onFavorite}
                      onSelect={(q) => {
                        if (currentQuote) onAddToHistory(currentQuote);
                        onNewQuote(q);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        <div className="section-spacing">
          <h2 className="section-title" style={{ justifyContent: 'center' }}>
            ✨ Your Quote Journey
          </h2>
          <QuoteStats stats={stats} />
        </div>

      </div>
    </div>
  );
}

export default Home;
