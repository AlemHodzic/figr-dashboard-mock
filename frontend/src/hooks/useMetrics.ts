import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { DateRange } from '../types';

export function useSummary(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['summary', dateRange],
    queryFn: () => api.getSummary(dateRange),
  });
}

export function useAvatarMetrics(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['avatars', dateRange],
    queryFn: () => api.getAvatarMetrics(dateRange),
  });
}

export function useTryonMetrics(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['tryons', dateRange],
    queryFn: () => api.getTryonMetrics(dateRange),
  });
}

export function useProductMetrics(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['products', dateRange],
    queryFn: () => api.getProductMetrics(dateRange),
  });
}

export function useShopperMetrics(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['shoppers', dateRange],
    queryFn: () => api.getShopperMetrics(dateRange),
  });
}

export function usePerformanceMetrics(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['performance', dateRange],
    queryFn: () => api.getPerformanceMetrics(dateRange),
  });
}

export function useRecommendations(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['recommendations', dateRange],
    queryFn: () => api.getRecommendations(dateRange),
  });
}

export function useDropoffFunnel(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['funnel', dateRange],
    queryFn: () => api.getDropoffFunnel(dateRange),
  });
}

export function useComparison(dateRange?: DateRange) {
  return useQuery({
    queryKey: ['comparison', dateRange],
    queryFn: () => api.getComparison(dateRange),
  });
}
