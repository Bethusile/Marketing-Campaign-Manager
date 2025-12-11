
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
import { toggleCampaignActive } from '../handlers/campaignStatusHandler';
import { getTarget } from '../controller/targetController';
import { uploadCampaignHandler } from '../handlers/uploadCampaign';
import { getCampaign, getUnredactedImage } from '../handlers/ar';
import { getRedactedImagesBulk, updateTarget } from '../handlers/postTarget';
import { upload as fileUpload } from '../utils/fileManager';
import { uploadImagesHandler } from '../handlers/UploadImages';

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
// Toggle Campaign Active route
router.put('/toggleCampaign/:id', allowAll, toggleCampaignActive);

// AR routes
router.get('/ar/:id', allowAll, (req, res) => { void getCampaign(req, res); });
router.get('/ar/image/unredacted/:id', allowAll, (req, res) => { void getUnredactedImage(req, res); });

// Post target routes
router.post('/marketing/images/redacted', allowAll, (req, res) => { void getRedactedImagesBulk(req, res); });
router.put(
  '/marketing/campaign/target',
  allowAll,
  fileUpload.fields([{ name: 'targetMind', maxCount: 1 }]),
  (req, res) => { void updateTarget(req, res); }
);


router.post(
  '/uploadImages',
  allowAll,
  upload.fields([
    { name: 'redacted', maxCount: 1 },
    { name: 'unredacted', maxCount: 1 },
  ]),
  (req, res) => { void uploadImagesHandler(req, res); }
);

export default router;
