import { Request, Response, NextFunction } from 'express';
import Campaign from '../model/campaign';

const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  return Boolean(value);
};

const parseTargetIdMap = (value: unknown) => {
  if (!value) return {};
  if (typeof value === 'object') return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      throw new Error('targetIdMap must be valid JSON');
    }
  }
  return {};
};

export const uploadCampaignHandler = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const { title, message, buttonUrl, isActive, targetMindUrl } = req.body;

		if (!title || !message || !buttonUrl) {
			return res.status(400).json({
				error: 'Missing required fields',
				detail: 'title, message, and buttonUrl are required',
			});
		}

		const payload = {
			title,
			message,
			buttonUrl,
			targetMindUrl: (targetMindUrl ?? '').trim(),
			targetIdMap: parseTargetIdMap(req.body.targetIdMap),
			isActive: toBoolean(isActive),
		} as const;

		const campaign = await Campaign.create(payload);
		return res.status(201).json(campaign);
	} catch (error) {
		if (error instanceof Error && error.message.includes('targetIdMap')) {
			return res.status(400).json({ error: error.message });
		}
		console.error('uploadCampaignHandler error:', error);
		return res.status(500).json({
			error: 'Failed to save campaign',
			detail: error instanceof Error ? error.message : 'Unknown error',
		});
	}
};
