/// <reference types="node" />
import { connectDB, sequelize } from '../src/db/connect';
import '../src/model';

(async () => {
  try {
    await connectDB();
    await sequelize.sync({ alter: true });
    console.log('All models migrated successfully.');
    await sequelize.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
})();
