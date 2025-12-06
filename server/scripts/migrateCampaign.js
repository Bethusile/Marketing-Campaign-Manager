import { connectDB, sequelize } from '../src/db/connect';
import Campaign from '../src/model/campaign';

(async () => {
  try {
    await connectDB();
    await Campaign.sync({ alter: true });
    console.log('Campaign table migrated successfully.');
    await sequelize.close();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
})();
