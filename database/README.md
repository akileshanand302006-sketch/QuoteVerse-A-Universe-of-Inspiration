# QuoteVerse — MySQL Database Documentation (10,000+ Quotes)

## 📌 Overview
QuoteVerse is powered by a high-performance **MySQL database** named `quoteverse` containing **10,000+ distinct, high-quality inspirational and philosophical quotes** categorized across 30 domains.

---

## 🗄️ Database Architecture & Schema

### Database: `quoteverse`

### Primary Table: `quotes` (10,100+ Records)
```sql
CREATE TABLE IF NOT EXISTS `quotes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `quote_text` TEXT NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `mood` VARCHAR(100) NOT NULL,
  `tags` JSON NOT NULL,
  `source` VARCHAR(255) DEFAULT 'Public Attribution',
  `language` VARCHAR(50) DEFAULT 'English',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_author` (`author`),
  INDEX `idx_category` (`category`),
  INDEX `idx_mood` (`mood`),
  INDEX `idx_language` (`language`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Auxiliary Tables (User Accounts & Activity)
- **`users`**: User registration credentials (`full_name`, `email`, hashed `password`, `avatar`).
- **`favorites`**: Saved favorite quotes (`user_email`, `quote_id` foreign key).
- **`history`**: Quote reading history timestamps (`user_email`, `quote_id` foreign key).
- **`stats`**: User exploration metrics (`quotes_explored`, `searches`, `categories_explored`).
- **`challenge_scores`**: Quote Challenge mini-game high scores.
- **`preferences`**: UI themes (`dark` / `light`) per user.

---

## 🚀 Seeding the 10,000+ Dataset

To automatically create the database, tables, indexes, and bulk insert the 10,000+ quotes:

```bash
npm run seed
# or
node database/seed.js
```

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/quotes` | `GET` | Retrieve quotes (supports `?page=1&limit=20`, `?category=`, `?mood=`, `?search=`) |
| `/api/quotes/random` | `GET` | Fast random quote retrieval from MySQL |
| `/api/quotes/search?q=:term` | `GET` | Server-side parameterized search |
| `/api/quotes/category/:category` | `GET` | Retrieve quotes by category |
| `/api/quotes/mood/:mood` | `GET` | Retrieve quotes by mood |
| `/api/quotes/stats` | `GET` | Returns dataset totals and category counts |
| `/api/quotes/:id` | `GET` | Retrieve single quote by primary key ID |

---

## 🔍 Verification Queries in MySQL / MySQL Workbench

```sql
USE quoteverse;

-- 1. Verify 10,000+ Total Quotes
SELECT COUNT(*) AS total_quotes FROM quotes;

-- 2. Category Distribution
SELECT category, COUNT(*) AS quote_count
FROM quotes
GROUP BY category
ORDER BY quote_count DESC;

-- 3. Check Indexes
SHOW INDEX FROM quotes;
```
