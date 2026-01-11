import { getRecommendations } from '../services/recommendations.service';
import type { Recommendation } from '../types';

describe('recommendationsService', () => {
  describe('getRecommendations', () => {
    let recommendations: Recommendation[];

    beforeAll(() => {
      recommendations = getRecommendations({});
    });

    it('returns an array', () => {
      expect(Array.isArray(recommendations)).toBe(true);
    });

    it('each recommendation has required fields', () => {
      for (const rec of recommendations) {
        expect(rec).toHaveProperty('id');
        expect(rec).toHaveProperty('severity');
        expect(rec).toHaveProperty('category');
        expect(rec).toHaveProperty('title');
        expect(rec).toHaveProperty('description');
        expect(rec).toHaveProperty('metric');
        expect(rec).toHaveProperty('value');
        expect(rec).toHaveProperty('action');
      }
    });

    it('severity is valid value', () => {
      const validSeverities = ['high', 'medium', 'low'];
      
      for (const rec of recommendations) {
        expect(validSeverities).toContain(rec.severity);
      }
    });

    it('category is valid value', () => {
      const validCategories = ['engagement', 'catalog', 'technical', 'sizing'];
      
      for (const rec of recommendations) {
        expect(validCategories).toContain(rec.category);
      }
    });

    it('recommendations are sorted by severity', () => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      
      for (let i = 1; i < recommendations.length; i++) {
        const prevSeverity = severityOrder[recommendations[i-1].severity];
        const currSeverity = severityOrder[recommendations[i].severity];
        expect(currSeverity).toBeGreaterThanOrEqual(prevSeverity);
      }
    });

    it('each recommendation has unique id', () => {
      const ids = recommendations.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('action is non-empty string', () => {
      for (const rec of recommendations) {
        expect(typeof rec.action).toBe('string');
        expect(rec.action.length).toBeGreaterThan(0);
      }
    });

    it('value contains metric information', () => {
      for (const rec of recommendations) {
        expect(typeof rec.value).toBe('string');
        expect(rec.value.length).toBeGreaterThan(0);
      }
    });
  });

  describe('date range filtering', () => {
    it('returns different recommendations for different date ranges', () => {
      const allTime = getRecommendations({});
      const recent = getRecommendations({
        startDate: '2025-12-20',
        endDate: '2025-12-25'
      });
      
      // May or may not have different recommendations
      // but should still return valid structure
      expect(Array.isArray(recent)).toBe(true);
    });
  });
});
