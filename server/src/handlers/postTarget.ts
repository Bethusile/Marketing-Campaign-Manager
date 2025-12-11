import { Request, Response } from 'express';
import { upload as fileUpload, fileUrlFromFilename } from '../utils/fileManager';
import CampaignImages from '../model/campaignImages';
import Campaign from '../model/campaign';

// POST /marketing/images/redacted
// Accepts JSON body { ids: number[] } and returns mapping { id: url }
export const getRedactedImagesBulk = async (req: Request, res: Response) => {
	try {
		const ids: number[] = Array.isArray(req.body.ids) ? req.body.ids : [];
		if (!ids.length) return res.status(400).json({ error: 'ids array required' });

		const rows = await CampaignImages.findAll({ where: { id: ids } });
		const map: Record<number, string> = {};
		for (const r of rows) {
			map[r.getDataValue('id')] = r.getDataValue('redactedImageUrl');
		}
		return res.json(map);
	} catch (err) {
		console.error('Error in getRedactedImagesBulk:', err);
		return res.status(500).json({ error: 'Failed to fetch redacted images' });
	}
};

// PUT /marketing/campaign/target
// Expects multipart: campaignId (body), targetMind (file), targetIdMap (body: JSON string)
export const updateTarget = async (req: Request, res: Response) => {
	try {
		const campaignId = req.body.campaignId;
		if (!campaignId) return res.status(400).json({ error: 'campaignId required' });
		const targetFile = req.files && !Array.isArray(req.files) ? (req.files['targetMind']?.[0] ?? null) : null;
		const rawMap = req.body.targetIdMap || '{}';
		let targetIdMap = {} as any;
		try {
			targetIdMap = typeof rawMap === 'string' ? JSON.parse(rawMap) : rawMap;
		} catch (e) {
			return res.status(400).json({ error: 'Invalid targetIdMap JSON' });
		}

		const campaign = await Campaign.findByPk(campaignId);
		if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

		if (targetFile) {
			const url = fileUrlFromFilename(targetFile.filename);
			campaign.setDataValue('targetMindUrl', url);
		}
		campaign.setDataValue('targetIdMap', targetIdMap);
		await campaign.save();
		return res.json(campaign);
	} catch (err) {
		console.error('Error in updateTarget:', err);
		return res.status(500).json({ error: 'Failed to update target' });
	}
};