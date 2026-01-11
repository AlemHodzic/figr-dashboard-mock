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
