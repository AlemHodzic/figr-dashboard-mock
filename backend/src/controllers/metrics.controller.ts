import { Request, Response, NextFunction } from 'express';
import * as metricsService from '../services/metrics.service';
import { parseDateRange } from '../utils/dateFilters';
import { delay } from '../utils/delay';

export async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    await delay();
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = metricsService.getSummaryMetrics(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getAvatarMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    await delay();
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = metricsService.getAvatarMetrics(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getTryonMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    await delay();
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = metricsService.getTryonMetrics(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getProductMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    await delay();
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = metricsService.getProductMetrics(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getShopperMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    await delay();
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = metricsService.getShopperMetrics(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getPerformanceMetrics(req: Request, res: Response, next: NextFunction) {
  try {
    await delay();
    const dateRange = parseDateRange(req.query as { startDate?: string; endDate?: string });
    const data = metricsService.getPerformanceMetrics(dateRange);
    res.json(data);
  } catch (error) {
    next(error);
  }
}
