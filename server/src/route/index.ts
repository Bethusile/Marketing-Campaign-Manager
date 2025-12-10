
import { Router } from 'express';
import { allowAll } from '../middleware/allowAll';
import {
  getAllCampaigns,
  getActiveCampaigns,
  getCampaignById,
  postCampaign,
  updateCampaign,
  deleteCampaign,
  upload
} from '../controller/campaignController';
import { getTarget } from '../controller/targetController';
import { uploadCampaignHandler } from '../handlers/uploadCampaign';

const router = Router();

// Campaign routes
router.get('/getCampaign/all', allowAll, getAllCampaigns);
router.get('/getCampaign/active', allowAll, getActiveCampaigns);
router.get('/getCampaign/:id', allowAll, getCampaignById);
router.post(
  '/postCampaign',
  allowAll,
  upload.fields([
    { name: 'overlay', maxCount: 1 },
    { name: 'target', maxCount: 1 },
  ]),
  (req, res) => { void postCampaign(req, res); }
);
router.put(
  '/updateCampaign/:id',
  allowAll,
  upload.fields([
    { name: 'overlay', maxCount: 1 },
    { name: 'target', maxCount: 1 },
  ]),
  (req, res) => { void updateCampaign(req, res); }
);
router.delete('/deleteCampaign/:id', allowAll, deleteCampaign);

router.post(
  '/campaign/upload',
  allowAll,
  uploadCampaignHandler,
);

// Target route
router.get('/getTarget', allowAll, getTarget);

export default router;
