
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

const router = Router();

// Campaign routes
router.get('/getCampain/all', allowAll, getAllCampaigns);
router.get('/getCampain/active', allowAll, getActiveCampaigns);
router.get('/getCampain/:id', allowAll, getCampaignById);
router.post(
  '/postCampain',
  allowAll,
  upload.fields([
    { name: 'overlay', maxCount: 1 },
    { name: 'target', maxCount: 1 },
  ]),
  postCampaign
);
router.put(
  '/updateCampain/:id',
  allowAll,
  upload.fields([
    { name: 'overlay', maxCount: 1 },
    { name: 'target', maxCount: 1 },
  ]),
  updateCampaign
);
router.delete('/detelCAmpain/:id', allowAll, deleteCampaign);

// Target route
router.get('/getTarget', allowAll, getTarget);

export default router;
