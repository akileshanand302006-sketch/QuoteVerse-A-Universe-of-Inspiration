-- ==========================================================
-- QuoteVerse — Complete MySQL Database Schema (10,000+ Quotes)
-- Database: quoteverse
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `quoteverse`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `quoteverse`;

-- 1. Quotes Table
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

-- 2. Users Table (Authentication & Accounts)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(500),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Favorites Table (Saved Quotes)
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_email` VARCHAR(150) NOT NULL,
  `quote_id` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `user_quote_fav` (`user_email`, `quote_id`),
  FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. History Table (Quote Reading Activity)
CREATE TABLE IF NOT EXISTS `history` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_email` VARCHAR(150) NOT NULL,
  `quote_id` INT NOT NULL,
  `viewed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`quote_id`) REFERENCES `quotes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. User Stats Table (Analytics & Exploration)
CREATE TABLE IF NOT EXISTS `stats` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_email` VARCHAR(150) UNIQUE NOT NULL,
  `quotes_explored` INT DEFAULT 1,
  `searches` INT DEFAULT 0,
  `categories_explored` INT DEFAULT 1,
  `explored_categories` JSON,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Challenge Scores Table (Mini-Game High Scores)
CREATE TABLE IF NOT EXISTS `challenge_scores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_email` VARCHAR(150) UNIQUE NOT NULL,
  `best_score` INT DEFAULT 0,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. User Preferences Table (Theme & Settings)
CREATE TABLE IF NOT EXISTS `preferences` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_email` VARCHAR(150) UNIQUE NOT NULL,
  `theme` VARCHAR(20) DEFAULT 'dark',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
