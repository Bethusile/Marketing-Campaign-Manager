import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getCampaigns, createCampaign, getActiveCampaign } from '../controllers/campaignController';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', getCampaigns);
router.get('/active', getActiveCampaign);
router.post('/', upload.fields([{ name: 'redacted_image', maxCount: 1 }, { name: 'unredacted_image', maxCount: 1 }]), createCampaign);

export default router;
