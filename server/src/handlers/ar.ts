import { Request, Response } from 'express';
import Campaign from '../model/campaign';
import CampaignImages from '../model/campaignImages';

const BaseUrl = process.env.PUBLIC_ORIGIN

// Returns { message, buttonUrl, targetMindUrl, targetIdMap } for an active campaign
export const getCampaign = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const campaign = await Campaign.findByPk(id);
		if (!campaign || !campaign.getDataValue('isActive')) {
			return res.status(404).json({ error: 'No active campaign with that id' });
		}
		const payload = {
			message: campaign.getDataValue('message'),
			buttonUrl: campaign.getDataValue('buttonUrl'),
			targetMindUrl: `${BaseUrl}${campaign.getDataValue('targetMindUrl')}`,
			targetIdMap: campaign.getDataValue('targetIdMap'),
		};
		return res.json(payload);
	} catch (err) {
		console.error('Error in getCampaign:', err);
		return res.status(500).json({ error: 'Failed to fetch campaign' });
	}
};

// GET /ar/image/unredacted/:id
// Returns JSON with `unredactedImageUrl`
export const getUnredactedImage = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const images = await CampaignImages.findByPk(id);
		if (!images) return res.status(404).json({ error: 'Image not found for id' });
		const url = images.getDataValue('unredactedImageUrl');
		if (!url) return res.status(404).json({ error: 'No unredacted image URL available' });
		let unredactedImageUrl = `${BaseUrl}${url}`;

		return res.json({ unredactedImageUrl });
	} catch (err) {
		console.error('Error in getUnredactedImage:', err);
		return res.status(500).json({ error: 'Failed to fetch image' });
	}
};