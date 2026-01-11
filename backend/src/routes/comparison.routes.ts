import { Router } from 'express';
import * as comparisonController from '../controllers/comparison.controller';

const router = Router();

router.get('/', comparisonController.getComparison);

export default router;
