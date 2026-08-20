import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

// Hooks & Utilities
import useLocalStorage from './hooks/useLocalStorage';
import { getRandomQuoteIndex, formatQuoteForSharing } from './utils/quoteUtils';
import { STORAGE_KEYS } from './utils/storageUtils';
import { fetchAllQuotes } from './services/quoteService';
import { speechService } from './utils/speechUtils';
import {
  fetchFavoritesApi,
  toggleFavoriteApi,
  fetchHistoryApi,
  addHistoryApi,
  clearHistoryApi,
  fetchStatsApi,
  saveStatsApi,
  fetchPreferencesApi,
  savePreferencesApi
} from './services/apiService';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import ShortcutsModal from './components/ShortcutsModal';
import InspirationMode from './components/InspirationMode';
import CommandPalette from './components/CommandPalette';

// Pages
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import History from './pages/History';
import DailyQuote from './pages/DailyQuote';
import QuoteOfTheDay from './pages/QuoteOfTheDay';
import QuoteChallenge from './pages/QuoteChallenge';
import QuoteStudio from './pages/QuoteStudio';
import Analytics from './pages/Analytics';
import QuoteRoulette from './components/QuoteRoulette';
import About from './pages/About';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Default Quotes fallback
import defaultQuotesData from './data/quotes';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Primary Application State
  const [quotes, setQuotes] = useState(defaultQuotesData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User Auth State (persisted with localStorage & verified in MySQL users table)
  const [user, setUser] = useLocalStorage('quoteverse_user', null);

  // MySQL Database Synced States
  const [theme, setTheme] = useState('dark');
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    quotesExplored: 1,
    favorites: 0,
    searches: 0,
    categoriesExplored: 1,
    exploredCategories: ['Motivation']
  });

  // UI Modal & Mode States
  const [toast, setToast] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isInspirationMode, setIsInspirationMode] = useState(false);

  // Load quote data from MySQL backend database
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetchAllQuotes();
        if (res && res.data && res.data.length > 0) {
          setQuotes(res.data);
          const initialIndex = getRandomQuoteIndex(res.data.length);
          setCurrentIndex(initialIndex);
        }
      } catch (err) {
        console.warn('Axios load warning, falling back to static dataset:', err);
        setQuotes(defaultQuotesData);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync user data (favorites, history, stats, theme) from MySQL database on user change or initial mount
  useEffect(() => {
    async function syncUserDataFromMySQL() {
      const email = user?.email || 'guest';
      try {
        const [favIds, histItems, dbStats, dbTheme] = await Promise.all([
          fetchFavoritesApi(email),
          fetchHistoryApi(email),
          fetchStatsApi(email),
          fetchPreferencesApi(email)
        ]);

        setFavorites(favIds || []);
        setHistory(histItems || []);
        if (dbStats) {
          setStats(dbStats);
        }
        if (dbTheme) {
          setTheme(dbTheme);
        }
      } catch (err) {
        console.error('Error syncing user data from MySQL:', err);
      }
    }
    syncUserDataFromMySQL();
  }, [user]);

  // Sync html data-theme attribute with state
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync favorites count in stats
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      favorites: favorites.length
    }));
  }, [favorites]);

  const showToastMessage = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleToggleTheme = useCallback(async () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToastMessage(`Switched to ${nextTheme} mode`, 'info');
    await savePreferencesApi(user?.email, nextTheme);
  }, [theme, user, showToastMessage]);

  const handleLoginSuccess = (userObj) => {
    setUser(userObj);
  };

  const handleLogout = () => {
    setUser(null);
    showToastMessage('Logged out successfully', 'info');
  };

  // Add quote to MySQL history
  const handleAddToHistory = useCallback(async (quoteObj) => {
    if (!quoteObj) return;
    const email = user?.email || 'guest';
    setHistory(prev => {
      if (prev.length > 0 && prev[0].quote?.id === quoteObj.id) {
        return prev;
      }
      return [{ quote: quoteObj, timestamp: new Date().toISOString() }, ...prev];
    });
    await addHistoryApi(email, quoteObj.id);
  }, [user]);

  // Generate new random quote & save stats to MySQL
  const handleNewQuote = useCallback((targetQuote = null) => {
    if (quotes.length === 0) return;

    let nextIdx;
    if (targetQuote) {
      nextIdx = quotes.findIndex(q => q.id === targetQuote.id);
      if (nextIdx === -1) nextIdx = 0;
    } else {
      nextIdx = getRandomQuoteIndex(quotes.length, currentIndex);
    }

    setCurrentIndex(nextIdx);

    // Update statistics in MySQL
    setStats(prev => {
      const currentCat = quotes[nextIdx]?.category;
      const explored = new Set(prev.exploredCategories || []);
      if (currentCat) explored.add(currentCat);
      const updated = {
        ...prev,
        quotesExplored: (prev.quotesExplored || 0) + 1,
        categoriesExplored: explored.size,
        exploredCategories: [...explored]
      };
      saveStatsApi(user?.email, updated);
      return updated;
    });
  }, [quotes, currentIndex, user]);

  // Toggle favorite quote in MySQL
  const handleFavoriteToggle = useCallback(async (quoteObj) => {
    if (!quoteObj) return;
    const email = user?.email || 'guest';
    const isFav = favorites.includes(quoteObj.id);

    if (isFav) {
      showToastMessage('Removed from favorites', 'info');
      setFavorites(prev => prev.filter(id => id !== quoteObj.id));
    } else {
      showToastMessage('Added to favorites! ❤️', 'success');
      setFavorites(prev => [...prev, quoteObj.id]);
    }

    await toggleFavoriteApi(email, quoteObj.id);
  }, [favorites, user, showToastMessage]);

  const isFavoriteQuote = useCallback((id) => {
    return favorites.includes(id);
  }, [favorites]);

  const handleClearHistory = async () => {
    setHistory([]);
    showToastMessage('Quote history cleared', 'info');
    await clearHistoryApi(user?.email);
  };

  // Comprehensive Keyboard Shortcuts Listener (Ctrl + Key & Single Key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow escaping inputs with ESC key
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
        }
        return;
      }

      const key = e.key.toLowerCase();
      const isCtrl = e.ctrlKey || e.metaKey;

      // 1. Ctrl + K -> Command Palette
      if (isCtrl && key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
        return;
      }

      // 2. Escape Key -> Close Modals / Inspiration
      if (e.key === 'Escape') {
        if (showShortcuts) setShowShortcuts(false);
        if (showCommandPalette) setShowCommandPalette(false);
        if (isInspirationMode) setIsInspirationMode(false);
        return;
      }

      // 3. New Quote (Ctrl + N or N)
      if (key === 'n') {
        e.preventDefault();
        const currentQ = quotes[currentIndex];
        if (currentQ) handleAddToHistory(currentQ);
        handleNewQuote();
        if (location.pathname !== '/') navigate('/');
      }

      // 4. Favorite (Ctrl + F or F)
      else if (key === 'f') {
        e.preventDefault();
        const currentQ = quotes[currentIndex];
        if (currentQ) handleFavoriteToggle(currentQ);
      }

      // 5. Copy Quote (Ctrl + C or C)
      else if (key === 'c') {
        const currentQ = quotes[currentIndex];
        if (currentQ) {
          navigator.clipboard.writeText(formatQuoteForSharing(currentQ));
          showToastMessage('Quote copied via shortcut! 📋', 'success');
        }
      }

      // 6. Focus Search (Ctrl + S or S)
      else if (key === 's') {
        e.preventDefault();
        navigate('/');
        setTimeout(() => {
          const searchInput = document.getElementById('quote-search-input');
          if (searchInput) searchInput.focus();
        }, 100);
      }

      // 7. Toggle Theme (Ctrl + D or D)
      else if (key === 'd') {
        e.preventDefault();
        handleToggleTheme();
      }

      // 8. Inspiration Mode (Ctrl + I or I)
      else if (key === 'i') {
        e.preventDefault();
        setIsInspirationMode(prev => !prev);
      }

      // 9. Read Aloud (Ctrl + R or R)
      else if (key === 'r') {
        e.preventDefault();
        const currentQ = quotes[currentIndex];
        if (currentQ) {
          speechService.speak(
            `"${currentQ.text}". By ${currentQ.author}.`,
            () => showToastMessage('Reading quote aloud... 🔊', 'info'),
            () => {},
            (err) => showToastMessage(typeof err === 'string' ? err : 'Speech error', 'error')
          );
        }
      }

      // 10. Navigation Shortcuts
      else if (isCtrl && key === 'o') {
        e.preventDefault();
        navigate('/roulette');
      } else if (isCtrl && key === 'm') {
        e.preventDefault();
        navigate('/challenge');
      } else if (isCtrl && key === 'p') {
        e.preventDefault();
        navigate('/studio');
      } else if (isCtrl && key === 'a') {
        e.preventDefault();
        navigate('/analytics');
      } else if (isCtrl && key === 'q') {
        e.preventDefault();
        navigate('/quote-of-the-day');
      } else if (isCtrl && key === 'b') {
        e.preventDefault();
        navigate('/favorites');
      } else if (isCtrl && key === 'h') {
        e.preventDefault();
        navigate('/history');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quotes, currentIndex, location.pathname, handleAddToHistory, handleNewQuote, handleFavoriteToggle, navigate, showShortcuts, showCommandPalette, isInspirationMode, handleToggleTheme, showToastMessage]);

  const currentQuote = quotes[currentIndex] || null;

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Live Animated Background Layer */}
      <div className="app-background-container" aria-hidden="true">
        <div className="app-background" />
      </div>

      {/* Floating Ambient Particles */}
      <div className="particles-container" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onShowShortcuts={() => setShowShortcuts(true)}
        onOpenCommandPalette={() => setShowCommandPalette(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Routes */}
      <main className="app-content" style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                quotes={quotes}
                currentQuote={currentQuote}
                currentIndex={currentIndex}
                onNewQuote={handleNewQuote}
                onFavorite={handleFavoriteToggle}
                isFavoriteQuote={isFavoriteQuote}
                stats={stats}
                onUpdateStats={setStats}
                favorites={favorites}
                history={history}
                onAddToHistory={handleAddToHistory}
                onShowToast={showToastMessage}
                onEnterInspiration={() => setIsInspirationMode(true)}
                loading={loading}
                error={error}
              />
            }
          />
          <Route
            path="/roulette"
            element={
              <QuoteRoulette
                quotes={quotes}
                isFavoriteQuote={isFavoriteQuote}
                onFavorite={handleFavoriteToggle}
                onShowToast={showToastMessage}
              />
            }
          />
          <Route
            path="/challenge"
            element={
              <QuoteChallenge
                quotes={quotes}
                onShowToast={showToastMessage}
                user={user}
              />
            }
          />
          <Route
            path="/studio"
            element={
              <QuoteStudio
                quote={currentQuote}
                quotes={quotes}
                onShowToast={showToastMessage}
              />
            }
          />
          <Route
            path="/analytics"
            element={
              <Analytics
                stats={stats}
                favorites={favorites}
                history={history}
              />
            }
          />
          <Route
            path="/quote-of-the-day"
            element={
              <QuoteOfTheDay
                quotes={quotes}
                onFavorite={handleFavoriteToggle}
                isFavoriteQuote={isFavoriteQuote}
                onNewQuote={(q) => {
                  if (currentQuote) handleAddToHistory(currentQuote);
                  handleNewQuote(q);
                  navigate('/');
                }}
                onShowToast={showToastMessage}
              />
            }
          />
          <Route
            path="/daily"
            element={
              <QuoteOfTheDay
                quotes={quotes}
                onFavorite={handleFavoriteToggle}
                isFavoriteQuote={isFavoriteQuote}
                onNewQuote={(q) => {
                  if (currentQuote) handleAddToHistory(currentQuote);
                  handleNewQuote(q);
                  navigate('/');
                }}
                onShowToast={showToastMessage}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <Favorites
                favorites={favorites}
                quotes={quotes}
                onFavorite={handleFavoriteToggle}
                isFavoriteQuote={isFavoriteQuote}
                onSelectQuote={(q) => {
                  if (currentQuote) handleAddToHistory(currentQuote);
                  handleNewQuote(q);
                  navigate('/');
                }}
              />
            }
          />
          <Route
            path="/history"
            element={
              <History
                history={history}
                onClearHistory={handleClearHistory}
                isFavoriteQuote={isFavoriteQuote}
                onFavorite={handleFavoriteToggle}
                onSelectQuote={(q) => {
                  if (currentQuote) handleAddToHistory(currentQuote);
                  handleNewQuote(q);
                  navigate('/');
                }}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/login"
            element={
              <Login
                onLoginSuccess={handleLoginSuccess}
                onShowToast={showToastMessage}
              />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Quick Quote FAB */}
      <button
        className="quick-quote-fab"
        onClick={() => {
          if (currentQuote) handleAddToHistory(currentQuote);
          handleNewQuote();
          showToastMessage('✨ Quick Quote generated!');
        }}
        aria-label="Quick Quote"
        title="Quick Quote (N)"
      >
        <Zap size={22} />
      </button>

      {/* Footer */}
      <Footer />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNewQuote={handleNewQuote}
        onToggleTheme={handleToggleTheme}
        onEnterInspiration={() => setIsInspirationMode(true)}
        onShowToast={showToastMessage}
      />

      {/* Inspiration Mode Overlay */}
      {isInspirationMode && (
        <InspirationMode
          quote={currentQuote}
          isFavorite={currentQuote ? isFavoriteQuote(currentQuote.id) : false}
          onFavorite={handleFavoriteToggle}
          onExit={() => setIsInspirationMode(false)}
          onNextQuote={() => {
            if (currentQuote) handleAddToHistory(currentQuote);
            handleNewQuote();
          }}
          onShowToast={showToastMessage}
        />
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className="toast-container">
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}

export default App;
