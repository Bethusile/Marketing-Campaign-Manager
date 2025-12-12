import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import routes from './route';
import cors from 'cors';
import { connectDB } from './db/connect';

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);
app.use(express.static('public'));

// 404 handler - must come after all routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to database before starting server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
