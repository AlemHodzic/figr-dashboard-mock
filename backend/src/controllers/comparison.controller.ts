import { Request, Response, NextFunction } from 'express';
import * as comparisonService from '../services/comparison.service';
import { parseDateRange } from '../utils/dateFilters';
import { delay } from '../utils/delay';

export async function getComparison(req: Request, res: Response, next: NextFunction) {
  try {
    await delay();
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = comparisonService.getComparisonMetrics(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
