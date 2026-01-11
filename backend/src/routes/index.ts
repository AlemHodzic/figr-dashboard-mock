import { Router } from 'express';
import metricsRoutes from './metrics.routes';
import recommendationsRoutes from './recommendations.routes';

export const router = Router();

router.use('/metrics', metricsRoutes);
router.use('/recommendations', recommendationsRoutes);
