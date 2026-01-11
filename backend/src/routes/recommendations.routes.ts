import { Router } from 'express';
import * as recommendationsController from '../controllers/recommendations.controller';

const router = Router();

router.get('/', recommendationsController.getRecommendations);

export default router;
