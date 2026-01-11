import { Router } from 'express';
import * as metricsController from '../controllers/metrics.controller';

const router = Router();

router.get('/summary', metricsController.getSummary);
router.get('/avatars', metricsController.getAvatarMetrics);
router.get('/tryons', metricsController.getTryonMetrics);
router.get('/products', metricsController.getProductMetrics);
router.get('/shoppers', metricsController.getShopperMetrics);
router.get('/performance', metricsController.getPerformanceMetrics);

export default router;
