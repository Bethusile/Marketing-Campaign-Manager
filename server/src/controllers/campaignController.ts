import { Request, Response } from 'express';
import pool from '../db';

export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM campaigns ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const createCampaign = async (req: Request, res: Response) => {
  const { title, message } = req.body;
  // Assuming multer handles file uploads and puts them in req.files
  // We need to cast req to any or extend the type to include files if using multer types properly
  const files = (req as any).files;
  
  const redactedImage = files['redacted_image'] ? files['redacted_image'][0].filename : null;
  const unredactedImage = files['unredacted_image'] ? files['unredacted_image'][0].filename : null;

  try {
    const result = await pool.query(
      'INSERT INTO campaigns (title, message, redacted_image_url, unredacted_image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, message, redactedImage, unredactedImage]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getActiveCampaign = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM campaigns WHERE is_active = true LIMIT 1');
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ message: 'No active campaign found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
