import { Router } from 'express';
import { getActiveCampaign, getCampaignById } from '../controllers/campaignController';

const router = Router();

router.get('/active', getActiveCampaign);
router.get('/:id', getCampaignById);

export default router;
