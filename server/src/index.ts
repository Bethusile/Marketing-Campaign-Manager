import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import campaignRoutes from './routes/campaignRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/campaigns', campaignRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
