import { Request, Response, NextFunction } from 'express';
import * as recommendationsService from '../services/recommendations.service';
import { parseDateRange } from '../utils/dateFilters';

export async function getRecommendations(req: Request, res: Response, next: NextFunction) {
  try {
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = recommendationsService.getRecommendations(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
