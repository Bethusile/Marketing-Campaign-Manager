import { Request, Response } from 'express';
import Campaign from '../model/campaign';
import path from 'path';

// Multer setup for file uploads
import multer from 'multer';
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix);
  },
});
export const upload = multer({ storage });

// GET /getCampaign/all
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// GET /getCampaign/active
export const getActiveCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll({ where: { isActive: true } });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active campaigns' });
  }
};

// GET /getCampaign/:id
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findOne({ where: { id: req.params.id } });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch campaign' });
  }
};


// POST /postCampaign
interface CampaignData {
  title: string;
  message: string;
  comments?: string;
  button_url: string;
  overlay_url: string;
  target_url: string;
}

interface MulterUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer?: Buffer;
}




export const postCampaign = async (
  req: Request,
  res: Response
) => {
  try {
    let overlayFile = null;
    let targetFile = null;
    if (req.files && !Array.isArray(req.files)) {
      overlayFile = req.files['overlay']?.[0] ?? null;
      targetFile = req.files['target']?.[0] ?? null;
    }
    const overlay_url = overlayFile ? `/uploads/${overlayFile.filename}` : '';
    const target_url = targetFile ? `/uploads/${targetFile.filename}` : '';
    const campaignData: CampaignData = {
      title: req.body.title,
      message: req.body.message,
      comments: req.body.comments,
      button_url: req.body.button_url,
      overlay_url,
      target_url,
    };
    const campaign = await Campaign.create({ ...campaignData });
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create campaign', details: err });
  }
};


// PUT /updateCampaign/:id
export const updateCampaign = async (
  req: Request,
  res: Response
) => {
  try {
    let overlayFile = null;
    let targetFile = null;
    if (req.files && !Array.isArray(req.files)) {
      overlayFile = req.files['overlay']?.[0] ?? null;
      targetFile = req.files['target']?.[0] ?? null;
    }
    const updateData: Partial<CampaignData> = {
      title: req.body.title,
      message: req.body.message,
      comments: req.body.comments,
      button_url: req.body.button_url,
    };
    if (overlayFile) updateData.overlay_url = `/uploads/${overlayFile.filename}`;
    if (targetFile) updateData.target_url = `/uploads/${targetFile.filename}`;
    const [affectedRows] = await Campaign.update({ ...updateData }, {
      where: { id: req.params.id },
    });
    if (!affectedRows) return res.status(404).json({ error: 'Campaign not found' });
    const updatedCampaign = await Campaign.findOne({ where: { id: req.params.id } });
    res.json(updatedCampaign);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update campaign', details: err });
  }
};

// DELETE /deleteCampaign/:id
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
