import { Request, Response, NextFunction } from 'express';

/**
 * Validates date range query parameters
 * - Ensures dates are in YYYY-MM-DD format
 * - Ensures startDate is before endDate
 * - Ensures dates are not in the future
 * 
 * Note: Error messages don't echo back user input to prevent information disclosure
 */
export function validateDateRange(req: Request, res: Response, next: NextFunction) {
  const { startDate, endDate } = req.query;
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  // If no dates provided, skip validation
  if (!startDate && !endDate) {
    return next();
  }

  // Validate startDate format
  if (startDate && typeof startDate === 'string') {
    if (!dateRegex.test(startDate)) {
      return res.status(400).json({
        error: 'Invalid startDate format',
        message: 'startDate must be in YYYY-MM-DD format'
      });
    }
    
    const parsedStart = new Date(startDate);
    if (isNaN(parsedStart.getTime())) {
      return res.status(400).json({
        error: 'Invalid startDate',
        message: 'startDate is not a valid date'
      });
    }

    if (parsedStart > today) {
      return res.status(400).json({
        error: 'Invalid startDate',
        message: 'startDate cannot be in the future'
      });
    }
  }

  // Validate endDate format
  if (endDate && typeof endDate === 'string') {
    if (!dateRegex.test(endDate)) {
      return res.status(400).json({
        error: 'Invalid endDate format',
        message: 'endDate must be in YYYY-MM-DD format'
      });
    }
    
    const parsedEnd = new Date(endDate);
    if (isNaN(parsedEnd.getTime())) {
      return res.status(400).json({
        error: 'Invalid endDate',
        message: 'endDate is not a valid date'
      });
    }

    if (parsedEnd > today) {
      return res.status(400).json({
        error: 'Invalid endDate',
        message: 'endDate cannot be in the future'
      });
    }
  }

  // Validate date range logic
  if (startDate && endDate && typeof startDate === 'string' && typeof endDate === 'string') {
    const parsedStart = new Date(startDate);
    const parsedEnd = new Date(endDate);
    
    if (parsedStart > parsedEnd) {
      return res.status(400).json({
        error: 'Invalid date range',
        message: 'startDate must be before or equal to endDate'
      });
    }
  }

  next();
}
