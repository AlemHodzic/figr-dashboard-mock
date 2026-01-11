import * as metricsService from '../services/metrics.service';

describe('metricsService', () => {
  describe('getSummaryMetrics', () => {
    it('returns correct structure', () => {
      const result = metricsService.getSummaryMetrics({});
      
      expect(result).toHaveProperty('totalAvatars');
      expect(result).toHaveProperty('totalTryons');
      expect(result).toHaveProperty('avatarCompletionRate');
      expect(result).toHaveProperty('tryonConversionRate');
      expect(result).toHaveProperty('skuCoverage');
      expect(result).toHaveProperty('avgLatencyMs');
      expect(result).toHaveProperty('errorRate');
      expect(result).toHaveProperty('trends');
    });

    it('returns numeric values', () => {
      const result = metricsService.getSummaryMetrics({});
      
      expect(typeof result.totalAvatars).toBe('number');
      expect(typeof result.totalTryons).toBe('number');
      expect(typeof result.avatarCompletionRate).toBe('number');
      expect(typeof result.tryonConversionRate).toBe('number');
    });

    it('completion rate is between 0 and 100', () => {
      const result = metricsService.getSummaryMetrics({});
      
      expect(result.avatarCompletionRate).toBeGreaterThanOrEqual(0);
      expect(result.avatarCompletionRate).toBeLessThanOrEqual(100);
    });

    it('trends contains numeric values', () => {
      const result = metricsService.getSummaryMetrics({});
      
      expect(typeof result.trends.avatars).toBe('number');
      expect(typeof result.trends.tryons).toBe('number');
      expect(typeof result.trends.completionRate).toBe('number');
    });

    it('filters by date range', () => {
      const allTime = metricsService.getSummaryMetrics({});
      const filtered = metricsService.getSummaryMetrics({
        startDate: '2025-12-01',
        endDate: '2025-12-07'
      });
      
      // Filtered should have fewer or equal items
      expect(filtered.totalAvatars).toBeLessThanOrEqual(allTime.totalAvatars);
    });
  });

  describe('getAvatarMetrics', () => {
    it('returns correct structure', () => {
      const result = metricsService.getAvatarMetrics({});
      
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('successful');
      expect(result).toHaveProperty('failed');
      expect(result).toHaveProperty('completionRate');
      expect(result).toHaveProperty('avgGenerationTimeMs');
      expect(result).toHaveProperty('timeline');
    });

    it('successful + failed equals total', () => {
      const result = metricsService.getAvatarMetrics({});
      
      expect(result.successful + result.failed).toBe(result.total);
    });

    it('timeline is sorted by date', () => {
      const result = metricsService.getAvatarMetrics({});
      
      const dates = result.timeline.map(t => t.date);
      const sortedDates = [...dates].sort();
      expect(dates).toEqual(sortedDates);
    });
  });

  describe('getTryonMetrics', () => {
    it('returns correct structure', () => {
      const result = metricsService.getTryonMetrics({});
      
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('byCategory');
      expect(result).toHaveProperty('timeline');
      expect(result).toHaveProperty('avgPerUser');
    });

    it('byCategory contains all product types', () => {
      const result = metricsService.getTryonMetrics({});
      
      const categories = result.byCategory.map(c => c.category.toLowerCase());
      expect(categories).toContain('tops');
      expect(categories).toContain('bottoms');
      expect(categories).toContain('one-pieces');
    });

    it('avgPerUser is positive when there are tryons', () => {
      const result = metricsService.getTryonMetrics({});
      
      if (result.successful > 0) {
        expect(result.avgPerUser).toBeGreaterThan(0);
      }
    });
  });

  describe('getProductMetrics', () => {
    it('returns correct structure', () => {
      const result = metricsService.getProductMetrics({});
      
      expect(result).toHaveProperty('totalProducts');
      expect(result).toHaveProperty('enabledProducts');
      expect(result).toHaveProperty('skuCoverage');
      expect(result).toHaveProperty('byCategory');
      expect(result).toHaveProperty('topProducts');
    });

    it('enabledProducts is less than or equal to totalProducts', () => {
      const result = metricsService.getProductMetrics({});
      
      expect(result.enabledProducts).toBeLessThanOrEqual(result.totalProducts);
    });

    it('skuCoverage is calculated correctly', () => {
      const result = metricsService.getProductMetrics({});
      
      const expectedCoverage = Math.round(
        (result.enabledProducts / result.totalProducts) * 100
      );
      expect(result.skuCoverage).toBe(expectedCoverage);
    });

    it('topProducts is sorted by tryons descending', () => {
      const result = metricsService.getProductMetrics({});
      
      const tryonCounts = result.topProducts.map(p => p.tryons);
      const sortedDesc = [...tryonCounts].sort((a, b) => b - a);
      expect(tryonCounts).toEqual(sortedDesc);
    });
  });

  describe('getShopperMetrics', () => {
    it('returns correct structure', () => {
      const result = metricsService.getShopperMetrics({});
      
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('completedOnboarding');
      expect(result).toHaveProperty('heightDistribution');
      expect(result).toHaveProperty('ageDistribution');
      expect(result).toHaveProperty('genderDistribution');
      expect(result).toHaveProperty('sizeRecommendations');
    });

    it('completedOnboarding is less than or equal to total', () => {
      const result = metricsService.getShopperMetrics({});
      
      expect(result.completedOnboarding).toBeLessThanOrEqual(result.total);
    });

    it('heightDistribution covers expected ranges', () => {
      const result = metricsService.getShopperMetrics({});
      
      const ranges = result.heightDistribution.map(h => h.range);
      expect(ranges.length).toBeGreaterThan(0);
    });
  });

  describe('getDropoffFunnel', () => {
    it('returns correct structure', () => {
      const result = metricsService.getDropoffFunnel({});
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(5);
    });

    it('funnel stages are in correct order', () => {
      const result = metricsService.getDropoffFunnel({});
      
      const stages = result.map(s => s.stage);
      expect(stages[0]).toBe('Started Onboarding');
      expect(stages[4]).toBe('Purchase');
    });

    it('first stage has 100% percentage', () => {
      const result = metricsService.getDropoffFunnel({});
      
      expect(result[0].percentage).toBe(100);
    });

    it('percentages decrease or stay same through funnel', () => {
      const result = metricsService.getDropoffFunnel({});
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i].percentage).toBeLessThanOrEqual(result[i-1].percentage);
      }
    });
  });

  describe('getPerformanceMetrics', () => {
    it('returns correct structure', () => {
      const result = metricsService.getPerformanceMetrics({});
      
      expect(result).toHaveProperty('avgAvatarLatencyMs');
      expect(result).toHaveProperty('avgTryonLatencyMs');
      expect(result).toHaveProperty('avatarErrorRate');
      expect(result).toHaveProperty('tryonErrorRate');
      expect(result).toHaveProperty('latencyTimeline');
    });

    it('error rates are between 0 and 100', () => {
      const result = metricsService.getPerformanceMetrics({});
      
      expect(result.avatarErrorRate).toBeGreaterThanOrEqual(0);
      expect(result.avatarErrorRate).toBeLessThanOrEqual(100);
      expect(result.tryonErrorRate).toBeGreaterThanOrEqual(0);
      expect(result.tryonErrorRate).toBeLessThanOrEqual(100);
    });
  });
});
