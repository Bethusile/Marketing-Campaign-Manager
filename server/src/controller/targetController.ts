import { Request, Response } from 'express';

// GET /getTarget
import path from 'path';
import fs from 'fs';

export const getTarget = async (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, '../../public/target/target.mind');
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'target.mind file not found' });
    }
    res.sendFile(path.resolve(filePath));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch target.mind file' });
  }
};
