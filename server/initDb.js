import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { generateQuotesDataset } from '../database/generateQuotes.js';

dotenv.config();

async function initDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '1234';
  const dbName = process.env.DB_NAME || 'quoteverse';

  console.log(`🔌 Connecting to MySQL server at ${host}:${port} as ${user}...`);

  let connection;
  try {
    connection = await mysql.createConnection({ host, port, user, password });

    console.log(`📦 Creating database '${dbName}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${dbName}\`;`);

    console.log('📋 Ensuring all tables exist with proper indexes...');

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`quotes\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`quote_text\` TEXT NOT NULL,
        \`author\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`mood\` VARCHAR(100) NOT NULL,
        \`tags\` JSON NOT NULL,
        \`source\` VARCHAR(255) DEFAULT 'Public Attribution',
        \`language\` VARCHAR(50) DEFAULT 'English',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX \`idx_author\` (\`author\`),
        INDEX \`idx_category\` (\`category\`),
        INDEX \`idx_mood\` (\`mood\`),
        INDEX \`idx_language\` (\`language\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`full_name\` VARCHAR(100) NOT NULL,
        \`email\` VARCHAR(150) UNIQUE NOT NULL,
        \`password\` VARCHAR(255) NOT NULL,
        \`avatar\` VARCHAR(500),
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`favorites\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_email\` VARCHAR(150) NOT NULL,
        \`quote_id\` INT NOT NULL,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY \`user_quote_fav\` (\`user_email\`, \`quote_id\`),
        FOREIGN KEY (\`quote_id\`) REFERENCES \`quotes\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`history\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_email\` VARCHAR(150) NOT NULL,
        \`quote_id\` INT NOT NULL,
        \`viewed_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`quote_id\`) REFERENCES \`quotes\`(\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`stats\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_email\` VARCHAR(150) UNIQUE NOT NULL,
        \`quotes_explored\` INT DEFAULT 1,
        \`searches\` INT DEFAULT 0,
        \`categories_explored\` INT DEFAULT 1,
        \`explored_categories\` JSON,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`challenge_scores\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_email\` VARCHAR(150) UNIQUE NOT NULL,
        \`best_score\` INT DEFAULT 0,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`preferences\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_email\` VARCHAR(150) UNIQUE NOT NULL,
        \`theme\` VARCHAR(20) DEFAULT 'dark',
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('✅ All data storage tables confirmed!');

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM `quotes`;');
    const currentCount = rows[0].count;

    if (currentCount < 10000) {
      console.log(`🌱 Seeding 10,000+ quotes into database (Current count: ${currentCount})...`);
      const quotes = generateQuotesDataset(10100);

      await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
      await connection.query('TRUNCATE TABLE `quotes`;');
      await connection.query('SET FOREIGN_KEY_CHECKS = 1;');

      const BATCH_SIZE = 500;
      for (let i = 0; i < quotes.length; i += BATCH_SIZE) {
        const chunk = quotes.slice(i, i + BATCH_SIZE);
        const placeholders = chunk.map(() => '(?, ?, ?, ?, ?, ?, ?)').join(', ');
        const values = [];

        for (const q of chunk) {
          values.push(
            q.quote_text,
            q.author,
            q.category,
            q.mood,
            JSON.stringify(q.tags),
            q.source,
            q.language
          );
        }

        const sql = `INSERT INTO \`quotes\` (\`quote_text\`, \`author\`, \`category\`, \`mood\`, \`tags\`, \`source\`, \`language\`) VALUES ${placeholders};`;
        await connection.query(sql, values);
      }
      const [newRows] = await connection.query('SELECT COUNT(*) as count FROM `quotes`;');
      console.log(`✨ Successfully seeded ${newRows[0].count} quotes into MySQL database!`);
    } else {
      console.log(`ℹ️ MySQL quotes table already contains ${currentCount} quotes (>= 10,000).`);
    }

  } catch (error) {
    console.error('❌ Database Initialization Error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
