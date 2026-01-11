import type { 
  SummaryMetrics, 
  AvatarMetrics, 
  TryonMetrics, 
  ProductMetrics, 
  ShopperMetrics, 
  PerformanceMetrics, 
  Recommendation,
  DateRange 
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function buildUrl(path: string, dateRange?: DateRange): string {
  const url = new URL(path, API_URL);
  if (dateRange?.startDate) {
    url.searchParams.set('startDate', dateRange.startDate);
  }
  if (dateRange?.endDate) {
    url.searchParams.set('endDate', dateRange.endDate);
  }
  return url.toString();
}

async function fetchApi<T>(path: string, dateRange?: DateRange): Promise<T> {
  const response = await fetch(buildUrl(path, dateRange));
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export const api = {
  getSummary: (dateRange?: DateRange) => 
    fetchApi<SummaryMetrics>('/api/metrics/summary', dateRange),
  
  getAvatarMetrics: (dateRange?: DateRange) => 
    fetchApi<AvatarMetrics>('/api/metrics/avatars', dateRange),
  
  getTryonMetrics: (dateRange?: DateRange) => 
    fetchApi<TryonMetrics>('/api/metrics/tryons', dateRange),
  
  getProductMetrics: (dateRange?: DateRange) => 
    fetchApi<ProductMetrics>('/api/metrics/products', dateRange),
  
  getShopperMetrics: (dateRange?: DateRange) => 
    fetchApi<ShopperMetrics>('/api/metrics/shoppers', dateRange),
  
  getPerformanceMetrics: (dateRange?: DateRange) => 
    fetchApi<PerformanceMetrics>('/api/metrics/performance', dateRange),
  
  getRecommendations: (dateRange?: DateRange) => 
    fetchApi<Recommendation[]>('/api/recommendations', dateRange),
};
