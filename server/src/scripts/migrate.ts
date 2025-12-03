import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const migrate = async () => {
  const client = await pool.connect();
  try {
    // Create migrations table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get applied migrations
    const { rows: appliedMigrations } = await client.query('SELECT name FROM _migrations');
    const appliedNames = new Set(appliedMigrations.map(row => row.name));

    // Get migration files
    const migrationsDir = path.join(__dirname, '../../migrations');
    if (!fs.existsSync(migrationsDir)) {
        console.log('No migrations directory found.');
        return;
    }

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    if (files.length === 0) {
        console.log('No migration files found.');
        return;
    }

    let migratedCount = 0;

    for (const file of files) {
      if (!appliedNames.has(file)) {
        console.log(`Running migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        await client.query('BEGIN');
        try {
            await client.query(sql);
            await client.query('INSERT INTO _migrations (name) VALUES ($1)', [file]);
            await client.query('COMMIT');
            console.log(`Migration ${file} applied successfully.`);
            migratedCount++;
        } catch (err) {
            await client.query('ROLLBACK');
            console.error(`Error applying migration ${file}:`, err);
            process.exit(1);
        }
      }
    }

    if (migratedCount === 0) {
        console.log('No new migrations to apply.');
    } else {
        console.log(`Successfully applied ${migratedCount} migrations.`);
    }

  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
