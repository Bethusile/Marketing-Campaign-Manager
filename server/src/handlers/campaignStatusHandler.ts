import { Request, Response } from 'express';
import Campaign from '../model/campaign';

// PUT /toggleCampaign/:id
export const toggleCampaignActive = async (req: Request, res: Response) => {
  const campaignId = req.params.id;
  const isActiveRaw = req.body.isActive;

  // Sanitize the input to ensure it is a strict Boolean
  // This handles "true" (string), true (boolean), or 1 (number)
  const isActive = (typeof isActiveRaw === 'string') 
    ? (isActiveRaw.toLowerCase() === 'true') 
    : Boolean(isActiveRaw);

  try {
    // Perform the update using the sanitized 'isActive' variable
    // We only pass the field we want to change.
    const [affectedRows] = await Campaign.update(
      { isActive: isActive }, 
      { where: { id: campaignId } }
    );

    if (!affectedRows) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Return the updated record
    const updatedCampaign = await Campaign.findOne({ where: { id: campaignId } });
    return res.json(updatedCampaign);

  } catch (err) {
    return res.status(400).json({ error: 'Failed to update status', details: err });
  }
};