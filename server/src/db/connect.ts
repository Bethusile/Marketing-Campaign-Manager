import { Sequelize } from 'sequelize';
import 'dotenv/config';

export const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // ← required for Neon
      },
    },
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected');

    // Import models to register them before sync
    await import('../model/index');
    await sequelize.sync({ alter: true }); // ← auto-creates/updates tables
    console.log('Database synced');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};