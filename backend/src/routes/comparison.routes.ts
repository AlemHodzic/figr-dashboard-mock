import { Router } from 'express';
import * as comparisonController from '../controllers/comparison.controller';
import { validateDateRange } from '../middleware/validateDateRange';

const router = Router();

router.get('/', validateDateRange, comparisonController.getComparison);

export default router;
