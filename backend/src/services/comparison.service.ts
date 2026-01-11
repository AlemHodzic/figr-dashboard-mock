import { DateRange } from '../types';
import { getPreviousPeriodRange } from '../utils/dateFilters';
import * as metricsService from './metrics.service';

export interface ComparisonMetrics {
  current: {
    period: string;
    avatars: number;
    tryons: number;
    completionRate: number;
    conversionRate: number;
    avgLatencyMs: number;
    errorRate: number;
  };
  previous: {
    period: string;
    avatars: number;
    tryons: number;
    completionRate: number;
    conversionRate: number;
    avgLatencyMs: number;
    errorRate: number;
  };
  changes: {
    avatars: number;
    tryons: number;
    completionRate: number;
    conversionRate: number;
    avgLatencyMs: number;
    errorRate: number;
  };
}

function formatPeriod(dateRange: DateRange): string {
  if (!dateRange.startDate || !dateRange.endDate) {
    return 'All Time';
  }
  const start = new Date(dateRange.startDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  const end = new Date(dateRange.endDate).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
  return `${start} - ${end}`;
}

function calculateChange(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}

export function getComparisonMetrics(dateRange: DateRange): ComparisonMetrics {
  const currentSummary = metricsService.getSummaryMetrics(dateRange);
  const currentPerformance = metricsService.getPerformanceMetrics(dateRange);
  
  const previousPeriod = getPreviousPeriodRange(dateRange);
  const previousSummary = metricsService.getSummaryMetrics(previousPeriod);
  const previousPerformance = metricsService.getPerformanceMetrics(previousPeriod);

  return {
    current: {
      period: formatPeriod(dateRange),
      avatars: currentSummary.totalAvatars,
      tryons: currentSummary.totalTryons,
      completionRate: currentSummary.avatarCompletionRate,
      conversionRate: currentSummary.tryonConversionRate,
      avgLatencyMs: currentPerformance.avgTryonLatencyMs,
      errorRate: currentSummary.errorRate,
    },
    previous: {
      period: formatPeriod(previousPeriod),
      avatars: previousSummary.totalAvatars,
      tryons: previousSummary.totalTryons,
      completionRate: previousSummary.avatarCompletionRate,
      conversionRate: previousSummary.tryonConversionRate,
      avgLatencyMs: previousPerformance.avgTryonLatencyMs,
      errorRate: previousSummary.errorRate,
    },
    changes: {
      avatars: calculateChange(currentSummary.totalAvatars, previousSummary.totalAvatars),
      tryons: calculateChange(currentSummary.totalTryons, previousSummary.totalTryons),
      completionRate: calculateChange(currentSummary.avatarCompletionRate, previousSummary.avatarCompletionRate),
      conversionRate: calculateChange(currentSummary.tryonConversionRate, previousSummary.tryonConversionRate),
      avgLatencyMs: calculateChange(currentPerformance.avgTryonLatencyMs, previousPerformance.avgTryonLatencyMs),
      errorRate: calculateChange(currentSummary.errorRate, previousSummary.errorRate),
    }
  };
}
