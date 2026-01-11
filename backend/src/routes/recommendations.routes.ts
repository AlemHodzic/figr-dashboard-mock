import { Router } from 'express';
import * as recommendationsController from '../controllers/recommendations.controller';
import { validateDateRange } from '../middleware/validateDateRange';

const router = Router();

router.get('/', validateDateRange, recommendationsController.getRecommendations);

export default router;
