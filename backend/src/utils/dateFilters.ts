import { DateRange } from '../types';

export function filterByDateRange<T extends { createdAt: string }>(
  items: T[],
  dateRange: DateRange
): T[] {
  const { startDate, endDate } = dateRange;
  
  return items.filter(item => {
    const itemDate = new Date(item.createdAt);
    
    if (startDate && new Date(startDate) > itemDate) {
      return false;
    }
    
    if (endDate && new Date(endDate) < itemDate) {
      return false;
    }
    
    return true;
  });
}

export function parseDateRange(query: { startDate?: string; endDate?: string }): DateRange {
  return {
    startDate: query.startDate,
    endDate: query.endDate
  };
}

export function groupByDate<T extends { createdAt: string }>(
  items: T[]
): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  
  for (const item of items) {
    const date = item.createdAt.split('T')[0];
    const existing = grouped.get(date) || [];
    existing.push(item);
    grouped.set(date, existing);
  }
  
  return grouped;
}

export function getDateRange(days: number): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
}

/**
 * Calculate the previous period date range for comparison.
 * If current period is 7 days, previous period is the 7 days before that.
 */
export function getPreviousPeriodRange(dateRange: DateRange): DateRange {
  if (!dateRange.startDate || !dateRange.endDate) {
    // If no date range specified, use "all time" - compare first half vs second half
    return {};
  }

  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  const periodLength = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const previousEndDate = new Date(startDate);
  previousEndDate.setDate(previousEndDate.getDate() - 1);
  
  const previousStartDate = new Date(previousEndDate);
  previousStartDate.setDate(previousStartDate.getDate() - periodLength);
  
  return {
    startDate: previousStartDate.toISOString().split('T')[0],
    endDate: previousEndDate.toISOString().split('T')[0]
  };
}

/**
 * Calculate percentage change between two values.
 * Returns rounded percentage (e.g., 12 for 12% increase, -5 for 5% decrease)
 */
export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}
