import { Router } from 'express';
import * as metricsController from '../controllers/metrics.controller';
import { validateDateRange } from '../middleware/validateDateRange';

const router = Router();

// Apply date range validation to all metrics routes
router.get('/summary', validateDateRange, metricsController.getSummary);
router.get('/avatars', validateDateRange, metricsController.getAvatarMetrics);
router.get('/tryons', validateDateRange, metricsController.getTryonMetrics);
router.get('/products', validateDateRange, metricsController.getProductMetrics);
router.get('/shoppers', validateDateRange, metricsController.getShopperMetrics);
router.get('/performance', validateDateRange, metricsController.getPerformanceMetrics);
router.get('/funnel', validateDateRange, metricsController.getDropoffFunnel);

export default router;
