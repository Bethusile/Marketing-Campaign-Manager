import { Request, Response } from 'express';
import Campaign from '../model/campaign';
import path from 'path';

// Multer setup for file uploads
import multer from 'multer';
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: (error: Error | null, destination: string) => void) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req: any, file: any, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
export const upload = multer({ storage });

// GET /getCampain/all
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// GET /getCampain/active
export const getActiveCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll({ where: { isActive: true } });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active campaigns' });
  }
};

// GET /getCampain/:id
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findOne({ where: { id: req.params.id } });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};


// POST /postCampain
// expects fields: overlay (file), button (file), and campaign data in body
export const postCampaign = async (req: Request & { files?: any }, res: Response) => {
  try {
    const overlayFile = req.files && req.files.overlay ? req.files.overlay[0] : null;
    const targetFile = req.files && req.files.target ? req.files.target[0] : null;
    const overlay_url = overlayFile ? `/uploads/${overlayFile.filename}` : '';
    const target_url = targetFile ? `/uploads/${targetFile.filename}` : '';
    // Save text fields directly from body
    const campaignData: any = {
      title: req.body.title,
      message: req.body.message,
      comments: req.body.comments,
      button_url: req.body.button_url,
      overlay_url,
      target_url,
    };
    const campaign = await Campaign.create(campaignData);
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create campaign', details: err });
  }
};


// PUT /updateCampain/:id
// expects fields: overlay (file), button (file), and campaign data in body
export const updateCampaign = async (req: Request & { files?: any }, res: Response) => {
  try {
    const overlayFile = req.files && req.files.overlay ? req.files.overlay[0] : null;
    const targetFile = req.files && req.files.target ? req.files.target[0] : null;
    const updateData: any = {
      title: req.body.title,
      message: req.body.message,
      comments: req.body.comments,
      button_url: req.body.button_url,
    };
    if (overlayFile) updateData.overlay_url = `/uploads/${overlayFile.filename}`;
    if (targetFile) updateData.target_url = `/uploads/${targetFile.filename}`;
    const [affectedRows] = await Campaign.update(updateData, {
      where: { id: req.params.id },
    });
    if (!affectedRows) return res.status(404).json({ error: 'Campaign not found' });
    const updatedCampaign = await Campaign.findOne({ where: { id: req.params.id } });
    res.json(updatedCampaign);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update campaign', details: err });
  }
};

// DELETE /detelCAmpain/:id
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findOne({ where: { id: req.params.id } });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    await Campaign.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Campaign deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete campaign' });
  }
};
