import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const createDb = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres', // Connect to default postgres db to create new db
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NAME;
    
    if (!dbName) {
        console.error('DB_NAME is not defined in .env');
        process.exit(1);
    }

    // Check if database exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
    
    if (res.rowCount === 0) {
      // Create database
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database ${dbName} created successfully.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
};

createDb();
