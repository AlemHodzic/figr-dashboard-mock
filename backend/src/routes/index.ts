import { Router } from 'express';
import metricsRoutes from './metrics.routes';
import recommendationsRoutes from './recommendations.routes';
import comparisonRoutes from './comparison.routes';

export const router = Router();

router.use('/metrics', metricsRoutes);
router.use('/recommendations', recommendationsRoutes);
router.use('/comparison', comparisonRoutes);
