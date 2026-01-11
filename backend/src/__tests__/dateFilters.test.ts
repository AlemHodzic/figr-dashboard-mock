import { 
  filterByDateRange, 
  getPreviousPeriodRange, 
  calculateTrend,
  groupByDate 
} from '../utils/dateFilters';

describe('dateFilters', () => {
  describe('filterByDateRange', () => {
    const testItems = [
      { id: 1, createdAt: '2025-12-01T10:00:00Z' },
      { id: 2, createdAt: '2025-12-05T10:00:00Z' },
      { id: 3, createdAt: '2025-12-10T10:00:00Z' },
      { id: 4, createdAt: '2025-12-15T10:00:00Z' },
    ];

    it('returns all items when no date range specified', () => {
      const result = filterByDateRange(testItems, {});
      expect(result).toHaveLength(4);
    });

    it('filters items after startDate', () => {
      const result = filterByDateRange(testItems, { startDate: '2025-12-06' });
      expect(result).toHaveLength(2);
      expect(result.map(i => i.id)).toEqual([3, 4]);
    });

    it('filters items before endDate', () => {
      const result = filterByDateRange(testItems, { endDate: '2025-12-08' });
      expect(result).toHaveLength(2);
      expect(result.map(i => i.id)).toEqual([1, 2]);
    });

    it('filters items within date range', () => {
      const result = filterByDateRange(testItems, { 
        startDate: '2025-12-03', 
        endDate: '2025-12-12' 
      });
      expect(result).toHaveLength(2);
      expect(result.map(i => i.id)).toEqual([2, 3]);
    });

    it('returns empty array when no items in range', () => {
      const result = filterByDateRange(testItems, { 
        startDate: '2025-12-20', 
        endDate: '2025-12-25' 
      });
      expect(result).toHaveLength(0);
    });
  });

  describe('getPreviousPeriodRange', () => {
    it('returns empty object when no date range specified', () => {
      const result = getPreviousPeriodRange({});
      expect(result).toEqual({});
    });

    it('calculates previous 7-day period correctly', () => {
      const result = getPreviousPeriodRange({
        startDate: '2025-12-08',
        endDate: '2025-12-14'
      });
      expect(result.startDate).toBe('2025-12-01');
      expect(result.endDate).toBe('2025-12-07');
    });

    it('calculates previous 30-day period correctly', () => {
      const result = getPreviousPeriodRange({
        startDate: '2025-12-01',
        endDate: '2025-12-30'
      });
      expect(result.endDate).toBe('2025-11-30');
    });
  });

  describe('calculateTrend', () => {
    it('returns 0 when both values are 0', () => {
      expect(calculateTrend(0, 0)).toBe(0);
    });

    it('returns 100 when previous is 0 and current is positive', () => {
      expect(calculateTrend(50, 0)).toBe(100);
    });

    it('calculates positive trend correctly', () => {
      expect(calculateTrend(110, 100)).toBe(10);
    });

    it('calculates negative trend correctly', () => {
      expect(calculateTrend(90, 100)).toBe(-10);
    });

    it('rounds to nearest integer', () => {
      expect(calculateTrend(103, 100)).toBe(3);
    });

    it('handles large percentage increases', () => {
      expect(calculateTrend(200, 100)).toBe(100);
    });
  });

  describe('groupByDate', () => {
    const testItems = [
      { id: 1, createdAt: '2025-12-01T10:00:00Z' },
      { id: 2, createdAt: '2025-12-01T15:00:00Z' },
      { id: 3, createdAt: '2025-12-02T10:00:00Z' },
    ];

    it('groups items by date correctly', () => {
      const result = groupByDate(testItems);
      expect(result.size).toBe(2);
      expect(result.get('2025-12-01')).toHaveLength(2);
      expect(result.get('2025-12-02')).toHaveLength(1);
    });

    it('returns empty map for empty array', () => {
      const result = groupByDate([]);
      expect(result.size).toBe(0);
    });
  });
});
