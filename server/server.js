import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to format quote tags and preserve text/quote_text properties
function formatQuote(q) {
  if (!q) return null;
  let parsedTags = [];
  try {
    parsedTags = typeof q.tags === 'string' ? JSON.parse(q.tags) : (Array.isArray(q.tags) ? q.tags : []);
  } catch (e) {
    parsedTags = [];
  }
  const quoteText = q.quote_text || q.text || '';
  return {
    ...q,
    id: q.id,
    text: quoteText,
    quote_text: quoteText,
    author: q.author || 'Unknown',
    category: q.category || 'Motivation',
    mood: q.mood || 'motivated',
    tags: parsedTags,
    source: q.source || 'Public Attribution',
    language: q.language || 'English',
    created_at: q.created_at
  };
}

// ----------------------------------------------------
// 1. QUOTES API ENDPOINTS
// ----------------------------------------------------

// Get quotes with optional pagination, category, mood, language, or search filtering
app.get('/api/quotes', async (req, res) => {
  try {
    const { category, mood, language, search, q, page, limit } = req.query;
    const searchTerm = (search || q || '').trim();

    let whereClauses = [];
    const params = [];

    if (category && category !== 'All') {
      whereClauses.push('category = ?');
      params.push(category);
    }

    if (mood && mood !== 'All') {
      whereClauses.push('mood = ?');
      params.push(mood);
    }

    if (language) {
      whereClauses.push('language = ?');
      params.push(language);
    }

    if (searchTerm) {
      whereClauses.push('(quote_text LIKE ? OR author LIKE ? OR category LIKE ?)');
      const term = `%${searchTerm}%`;
      params.push(term, term, term);
    }

    const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

    // If paginated request (page parameter supplied)
    if (page) {
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(200, Math.max(1, parseInt(limit) || 20));
      const offset = (pageNum - 1) * limitNum;

      const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM quotes${whereSql}`, params);
      const total = countRows[0].total;

      const [rows] = await pool.query(
        `SELECT * FROM quotes${whereSql} ORDER BY id ASC LIMIT ? OFFSET ?`,
        [...params, limitNum, offset]
      );

      return res.json({
        data: rows.map(formatQuote),
        page: pageNum,
        limit: limitNum,
        total: total,
        totalPages: Math.ceil(total / limitNum)
      });
    }

    // Direct list query (with custom or sensible default limit)
    const limitNum = limit ? Math.min(10500, parseInt(limit)) : 10500;
    const [rows] = await pool.query(
      `SELECT * FROM quotes${whereSql} ORDER BY id ASC LIMIT ?`,
      [...params, limitNum]
    );

    res.json(rows.map(formatQuote));
  } catch (err) {
    console.error('Error fetching quotes:', err);
    res.status(500).json({ error: 'Failed to fetch quotes from database' });
  }
});

// Fast random quote retrieval
app.get('/api/quotes/random', async (req, res) => {
  try {
    const { category, mood } = req.query;
    let whereClauses = [];
    const params = [];

    if (category && category !== 'All') {
      whereClauses.push('category = ?');
      params.push(category);
    }
    if (mood && mood !== 'All') {
      whereClauses.push('mood = ?');
      params.push(mood);
    }

    const whereSql = whereClauses.length > 0 ? ` WHERE ${whereClauses.join(' AND ')}` : '';

    const [countRows] = await pool.query(`SELECT COUNT(*) as total FROM quotes${whereSql}`, params);
    const total = countRows[0].total;

    if (total === 0) {
      return res.status(404).json({ error: 'No quotes found' });
    }

    const randomOffset = Math.floor(Math.random() * total);
    const [rows] = await pool.query(
      `SELECT * FROM quotes${whereSql} LIMIT 1 OFFSET ?`,
      [...params, randomOffset]
    );

    res.json(formatQuote(rows[0]));
  } catch (err) {
    console.error('Error fetching random quote:', err);
    res.status(500).json({ error: 'Failed to fetch random quote' });
  }
});

// Dedicated server-side search endpoint
app.get('/api/quotes/search', async (req, res) => {
  try {
    const term = (req.query.q || req.query.search || req.query.query || '').trim();
    if (!term) return res.json([]);

    const searchPattern = `%${term}%`;
    const [rows] = await pool.query(
      'SELECT * FROM quotes WHERE quote_text LIKE ? OR author LIKE ? OR category LIKE ? LIMIT 100',
      [searchPattern, searchPattern, searchPattern]
    );
    res.json(rows.map(formatQuote));
  } catch (err) {
    console.error('Error searching quotes:', err);
    res.status(500).json({ error: 'Failed to search quotes' });
  }
});

// Filter by category endpoint
app.get('/api/quotes/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const [rows] = await pool.query(
      'SELECT * FROM quotes WHERE category = ? ORDER BY id ASC LIMIT ?',
      [category, limit]
    );
    res.json(rows.map(formatQuote));
  } catch (err) {
    console.error('Error fetching category quotes:', err);
    res.status(500).json({ error: 'Failed to fetch quotes by category' });
  }
});

// Filter by mood endpoint
app.get('/api/quotes/mood/:mood', async (req, res) => {
  try {
    const { mood } = req.params;
    const limit = parseInt(req.query.limit) || 100;
    const [rows] = await pool.query(
      'SELECT * FROM quotes WHERE mood = ? ORDER BY id ASC LIMIT ?',
      [mood, limit]
    );
    res.json(rows.map(formatQuote));
  } catch (err) {
    console.error('Error fetching mood quotes:', err);
    res.status(500).json({ error: 'Failed to fetch quotes by mood' });
  }
});

// Dataset breakdown statistics endpoint
app.get('/api/quotes/stats', async (req, res) => {
  try {
    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM quotes');
    const [categoryRows] = await pool.query(`
      SELECT category, COUNT(*) as count
      FROM quotes
      GROUP BY category
      ORDER BY count DESC
    `);
    res.json({
      total: countRows[0].total,
      categories: categoryRows
    });
  } catch (err) {
    console.error('Error fetching quotes statistics:', err);
    res.status(500).json({ error: 'Failed to fetch quotes stats' });
  }
});

// Get quote by ID
app.get('/api/quotes/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM quotes WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json(formatQuote(rows[0]));
  } catch (err) {
    console.error('Error fetching quote by id:', err);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Add new quote
app.post('/api/quotes', async (req, res) => {
  try {
    const { quote_text, text, author, category, tags, mood, source, language } = req.body;
    const qText = quote_text || text;
    if (!qText || !author) {
      return res.status(400).json({ error: 'Text and author are required' });
    }
    const tagsJson = JSON.stringify(tags || []);
    const [result] = await pool.query(
      'INSERT INTO quotes (quote_text, author, category, tags, mood, source, language) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        qText,
        author,
        category || 'Motivation',
        tagsJson,
        mood || 'motivated',
        source || 'Public Attribution',
        language || 'English'
      ]
    );
    res.status(201).json({
      id: result.insertId,
      text: qText,
      quote_text: qText,
      author,
      category: category || 'Motivation',
      tags: tags || [],
      mood: mood || 'motivated',
      source: source || 'Public Attribution',
      language: language || 'English'
    });
  } catch (err) {
    console.error('Error creating quote:', err);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});


// ----------------------------------------------------
// 2. AUTHENTICATION & USERS API ENDPOINTS
// ----------------------------------------------------

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'Full name, email, and password are required' });
    }

    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`;

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, password, avatar) VALUES (?, ?, ?, ?)',
      [fullName, email, passwordHash, avatar]
    );

    // Initialize stats and preferences for user
    await pool.query(
      'INSERT IGNORE INTO stats (user_email, quotes_explored, searches, categories_explored, explored_categories) VALUES (?, 1, 0, 1, ?)',
      [email, JSON.stringify(['Motivation'])]
    );
    await pool.query(
      'INSERT IGNORE INTO preferences (user_email, theme) VALUES (?, "dark")',
      [email]
    );

    const userObj = {
      id: result.insertId,
      name: fullName,
      email: email,
      avatar: avatar,
      joinedAt: new Date().toISOString()
    };

    res.status(201).json({ user: userObj, message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userObj = {
      id: user.id,
      name: user.full_name,
      email: user.email,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.email)}`,
      joinedAt: user.created_at
    };

    res.json({ user: userObj, message: 'Logged in successfully' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// ----------------------------------------------------
// 3. FAVORITES API ENDPOINTS
// ----------------------------------------------------

// Get user favorite quote IDs
app.get('/api/favorites', async (req, res) => {
  try {
    const email = req.query.email || 'guest';
    const [rows] = await pool.query(
      'SELECT quote_id FROM favorites WHERE user_email = ? ORDER BY created_at DESC',
      [email]
    );
    const favoriteIds = rows.map(r => r.quote_id);
    res.json(favoriteIds);
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Toggle favorite quote (Add or Remove)
app.post('/api/favorites/toggle', async (req, res) => {
  try {
    const { email = 'guest', quoteId } = req.body;
    if (!quoteId) return res.status(400).json({ error: 'quoteId is required' });

    // Check if already favorited
    const [existing] = await pool.query(
      'SELECT * FROM favorites WHERE user_email = ? AND quote_id = ?',
      [email, quoteId]
    );

    if (existing.length > 0) {
      // Remove
      await pool.query('DELETE FROM favorites WHERE user_email = ? AND quote_id = ?', [email, quoteId]);
      res.json({ status: 'removed', quoteId });
    } else {
      // Add
      await pool.query('INSERT INTO favorites (user_email, quote_id) VALUES (?, ?)', [email, quoteId]);
      res.json({ status: 'added', quoteId });
    }
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ error: 'Failed to update favorite' });
  }
});


// ----------------------------------------------------
// 4. HISTORY API ENDPOINTS
// ----------------------------------------------------

// Get user quote history
app.get('/api/history', async (req, res) => {
  try {
    const email = req.query.email || 'guest';
    const [rows] = await pool.query(`
      SELECT h.id as history_id, h.viewed_at, q.*
      FROM history h
      JOIN quotes q ON h.quote_id = q.id
      WHERE h.user_email = ?
      ORDER BY h.viewed_at DESC
      LIMIT 100
    `, [email]);

    const historyItems = rows.map(r => ({
      historyId: r.history_id,
      timestamp: r.viewed_at,
      quote: formatQuote(r)
    }));

    res.json(historyItems);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch quote history' });
  }
});

// Add entry to user history
app.post('/api/history', async (req, res) => {
  try {
    const { email = 'guest', quoteId } = req.body;
    if (!quoteId) return res.status(400).json({ error: 'quoteId is required' });

    await pool.query(
      'INSERT INTO history (user_email, quote_id) VALUES (?, ?)',
      [email, quoteId]
    );

    res.status(201).json({ message: 'Added to history' });
  } catch (err) {
    console.error('Error saving history:', err);
    res.status(500).json({ error: 'Failed to save history' });
  }
});

// Clear history for user
app.delete('/api/history', async (req, res) => {
  try {
    const email = req.query.email || 'guest';
    await pool.query('DELETE FROM history WHERE user_email = ?', [email]);
    res.json({ message: 'History cleared' });
  } catch (err) {
    console.error('Error clearing history:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});


// ----------------------------------------------------
// 5. USER STATS & ANALYTICS API ENDPOINTS
// ----------------------------------------------------

// Get stats for user
app.get('/api/stats', async (req, res) => {
  try {
    const email = req.query.email || 'guest';
    const [rows] = await pool.query('SELECT * FROM stats WHERE user_email = ?', [email]);

    // Also count total favorites for this user
    const [favRows] = await pool.query('SELECT COUNT(*) as count FROM favorites WHERE user_email = ?', [email]);
    const favCount = favRows[0].count;

    if (rows.length === 0) {
      return res.json({
        quotesExplored: 1,
        favorites: favCount,
        searches: 0,
        categoriesExplored: 1,
        exploredCategories: ['Motivation']
      });
    }

    const row = rows[0];
    let exploredCategories = ['Motivation'];
    try {
      exploredCategories = typeof row.explored_categories === 'string' ? JSON.parse(row.explored_categories) : row.explored_categories;
    } catch (e) {}

    res.json({
      quotesExplored: row.quotes_explored,
      favorites: favCount,
      searches: row.searches,
      categoriesExplored: row.categories_explored,
      exploredCategories
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Update stats for user
app.post('/api/stats', async (req, res) => {
  try {
    const { email = 'guest', quotesExplored, searches, categoriesExplored, exploredCategories } = req.body;
    const expCatJson = JSON.stringify(exploredCategories || ['Motivation']);

    await pool.query(`
      INSERT INTO stats (user_email, quotes_explored, searches, categories_explored, explored_categories)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        quotes_explored = VALUES(quotes_explored),
        searches = VALUES(searches),
        categories_explored = VALUES(categories_explored),
        explored_categories = VALUES(explored_categories)
    `, [email, quotesExplored || 1, searches || 0, categoriesExplored || 1, expCatJson]);

    res.json({ message: 'Stats updated successfully' });
  } catch (err) {
    console.error('Error updating stats:', err);
    res.status(500).json({ error: 'Failed to update stats' });
  }
});


// ----------------------------------------------------
// 6. CHALLENGE SCORES API ENDPOINTS
// ----------------------------------------------------

// Get best challenge score
app.get('/api/challenge/best', async (req, res) => {
  try {
    const email = req.query.email || 'guest';
    const [rows] = await pool.query('SELECT best_score FROM challenge_scores WHERE user_email = ?', [email]);
    res.json({ bestScore: rows.length > 0 ? rows[0].best_score : 0 });
  } catch (err) {
    console.error('Error fetching challenge score:', err);
    res.status(500).json({ error: 'Failed to fetch best challenge score' });
  }
});

// Update best challenge score
app.post('/api/challenge/score', async (req, res) => {
  try {
    const { email = 'guest', score } = req.body;
    const newScore = parseInt(score) || 0;

    const [rows] = await pool.query('SELECT best_score FROM challenge_scores WHERE user_email = ?', [email]);
    if (rows.length === 0) {
      await pool.query('INSERT INTO challenge_scores (user_email, best_score) VALUES (?, ?)', [email, newScore]);
    } else if (newScore > rows[0].best_score) {
      await pool.query('UPDATE challenge_scores SET best_score = ? WHERE user_email = ?', [newScore, email]);
    }

    res.json({ message: 'Score processed successfully' });
  } catch (err) {
    console.error('Error updating score:', err);
    res.status(500).json({ error: 'Failed to update challenge score' });
  }
});


// ----------------------------------------------------
// 7. PREFERENCES API ENDPOINTS
// ----------------------------------------------------

// Get user preferences (theme)
app.get('/api/preferences', async (req, res) => {
  try {
    const email = req.query.email || 'guest';
    const [rows] = await pool.query('SELECT theme FROM preferences WHERE user_email = ?', [email]);
    res.json({ theme: rows.length > 0 ? rows[0].theme : 'dark' });
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Save user preferences (theme)
app.post('/api/preferences', async (req, res) => {
  try {
    const { email = 'guest', theme = 'dark' } = req.body;
    await pool.query(`
      INSERT INTO preferences (user_email, theme)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE theme = VALUES(theme)
    `, [email, theme]);
    res.json({ theme });
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Start Express HTTP Server
app.listen(PORT, () => {
  console.log(`🚀 QuoteVerse MySQL Backend Server running on http://localhost:${PORT}`);
});
