import { Request, Response } from 'express';
import pool from '../db';

const mapCampaignToCamelCase = (campaign: any) => ({
    id: campaign.id,
    title: campaign.title,
    message: campaign.message,
    buttonUrl: campaign.button_url,
    targetUrl: campaign.redacted_image_url,
    displayUrl: campaign.unredacted_image_url,
    isActive: campaign.is_active,
    createdAt: campaign.created_at
});

export const getActiveCampaign = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM campaigns WHERE is_active = true');
        res.json(result.rows.map(mapCampaignToCamelCase));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

export const getCampaignById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM campaigns WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(mapCampaignToCamelCase(result.rows[0]));
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
