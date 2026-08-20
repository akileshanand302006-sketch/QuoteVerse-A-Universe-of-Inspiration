# ✨ QuoteVerse — Premium Quote Discovery Platform

> "A thought worth discovering."

**QuoteVerse** is a modern Single Page Application (SPA) built with **React.js** designed to transform traditional quote generation into an engaging, interactive quote discovery experience. It offers curated inspirational, motivational, technology, leadership, and life quotes wrapped in a visual aesthetic featuring glassmorphic UI, smooth micro-animations, and full theme customization.

---

## 🌟 Features

* **✨ Thought of the Moment**: Display interactive quotes with floating quotation marks and soft glow effects.
* **🎲 Smart Random Generator**: Generates new quotes while preventing consecutive duplicates.
* **🔍 Multi-Attribute Search**: Search quotes instantly by quote text, author, category, or tags with live result counters.
* **🏷️ Category Filtering**: Filter quotes across 11 categories (Motivation, Success, Life, Wisdom, Technology, Leadership, Happiness, Friendship, Love, Study, Creativity).
* **🎭 Mood Picker**: Select your current mood (Happy 😊, Motivated 🔥, Calm 🧘, Confident 💪, Loved ❤️, Focused 📚, Ambitious 🚀) to find matching thoughts.
* **❤️ Favorite Quotes**: Save your favorite quotes locally with `localStorage` persistence.
* **📖 Quote Journey & History**: Auto-tracks viewing history with exact timestamps.
* **☀️ Quote of the Day**: Deterministic daily quote feature based on JavaScript date hashing.
* **🌌 Inspiration Mode**: Immersive, distraction-free reading experience with cinematic backdrop.
* **⚡ Quick Quote FAB**: Instant floating action button for quick quote generation.
* **📋 Copy & ↗ Share**: Copy formatted quotes to clipboard or share via Web Share API with Toast feedback.
* **☀️ Day / 🌙 Night Theme**: Full dark and light theme toggle with persistent preferences.
* **⌨️ Keyboard Shortcuts**:
  * `N` → New Quote
  * `F` → Favorite/Unfavorite
  * `C` → Copy Quote
  * `S` → Search Quotes
  * `D` → Toggle Day/Night Theme
  * `I` → Toggle Inspiration Mode
  * `Esc` → Close Modals / Exit Inspiration Mode
* **📊 Live Analytics**: Dynamic counter for explored quotes, saved favorites, searches, and categories.
* **⏰ Real-Time Clock**: Live day, date, month, and time display component (`<LiveClock />`).

---

## ⚛️ React Concepts Demonstrated

* **Functional Components**: modular and reusable component structure.
* **Props**: Data passing from parent to `<QuoteDisplay />`, `<QuoteCard />`, `<QuoteActions />`, etc.
* **useState**: Dynamic UI state management (current quote, search, filter, mood, modals, theme).
* **useEffect**: Lifecycle hooks for Axios data fetching, keyboard listeners, time updates, and theme syncing.
* **Custom Hooks**: `useLocalStorage` for storing application state in `localStorage`.
* **React Router**: SPA navigation (`/`, `/favorites`, `/history`, `/daily`, `/about`, `*`).
* **map()**: List rendering for quotes, category chips, history items, and statistics cards.
* **Conditional Rendering**: Loading skeletons, empty states, search result states, active tabs, and modals.
* **Axios Integration**: Data service layer simulation for quote retrieval architecture.

---

## 📁 Project Structure

```text
src/
├── assets/             # Assets and media
├── components/         # Reusable React components
│   ├── CategoryFilter.jsx
│   ├── EmptyState.jsx
│   ├── Footer.jsx
│   ├── InspirationMode.jsx
│   ├── LiveClock.jsx
│   ├── MoodPicker.jsx
│   ├── Navbar.jsx
│   ├── QuoteActions.jsx
│   ├── QuoteCard.jsx
│   ├── QuoteDisplay.jsx
│   ├── QuoteStats.jsx
│   ├── SearchBar.jsx
│   ├── ShortcutsModal.jsx
│   ├── ThemeToggle.jsx
│   └── Toast.jsx
├── data/               # Curated quote dataset (35 quotes)
│   └── quotes.js
├── hooks/              # Custom React hooks
│   └── useLocalStorage.js
├── pages/              # Application views / routes
│   ├── About.jsx
│   ├── DailyQuote.jsx
│   ├── Favorites.jsx
│   ├── History.jsx
│   ├── Home.jsx
│   └── NotFound.jsx
├── services/           # Axios service layer
│   └── quoteService.js
├── styles/             # Application styles
│   ├── animations.css
│   ├── global.css
│   └── responsive.css
├── utils/              # Helper utilities
│   ├── quoteUtils.js
│   └── storageUtils.js
├── App.jsx             # Main App layout & route setup
├── main.jsx            # Entry point
└── index.css           # Base styles
```

---

## 🚀 Installation & Running Instructions

### Prerequisites
Make sure you have Node.js (v18+) installed on your machine.

### Step 1: Clone or navigate to the project directory
```bash
cd quoteverse
```

### Step 2: Install dependencies
```bash
npm install
```

Required packages installed:
```bash
npm install bootstrap react-router-dom axios lucide-react
```

### Step 3: Run the development server
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

## 🛠️ Built With

* **React 19**
* **Vite 8**
* **Bootstrap 5.3**
* **React Router DOM 7**
* **Axios**
* **Lucide React Icons**
* **CSS3 (Glassmorphism & Custom Properties)**

---

## 📝 License
This project is open-source and available under the MIT License.
