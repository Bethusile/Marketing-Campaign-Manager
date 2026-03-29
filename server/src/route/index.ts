import { Router } from 'express';
import { allowAll } from '../middleware/allowAll';

import { toggleCampaignActive } from '../handlers/campaignStatusHandler';
import { uploadCampaignHandler } from '../handlers/uploadCampaign';
import { getImagesHandler } from '../handlers/getImagesHandler';
import { getCampaign, getUnredactedImage } from '../handlers/ar';
import { getRedactedImagesBulk, updateTarget } from '../handlers/postTarget';
import { upload, uploadMind } from '../utils/fileManager'; // ← add uploadMind
import { uploadImagesHandler } from '../handlers/UploadImages';

const router = Router();

router.post(
  '/campaign/upload',
  allowAll,
  uploadCampaignHandler,
);

router.put('/toggleCampaign/:id', allowAll, toggleCampaignActive);

// AR routes
router.get('/ar/:id', allowAll, (req, res) => { void getCampaign(req, res); });
router.get('/ar/image/unredacted/:id', allowAll, (req, res) => { void getUnredactedImage(req, res); });

// Post target routes
router.post('/marketing/images/redacted', allowAll, (req, res) => { void getRedactedImagesBulk(req, res); });
router.put(
  '/marketing/campaign/target',
  allowAll,
  uploadMind.fields([{ name: 'targetMind', maxCount: 1 }]), // ← use uploadMind
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

// Get Images route
router.get('/getImagesHandler', allowAll, getImagesHandler);

export default router;