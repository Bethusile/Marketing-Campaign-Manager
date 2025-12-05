import { Request, Response } from 'express';
import Campaign from '../model/campaign';

// GET /getTarget
export const getTarget = async (req: Request, res: Response) => {
  try {
    // Example: return all target_urls from campaigns
    const targets = await Campaign.findAll({ attributes: ['id', 'target_url'] });
    res.json(targets);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch targets' });
  }
};
