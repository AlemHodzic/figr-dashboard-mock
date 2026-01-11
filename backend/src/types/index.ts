export interface Shopper {
  id: string;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  age: number;
  country: string;
  createdAt: string;
  completedOnboarding: boolean;
  dropOffStage: 'none' | 'started' | 'photo_upload' | 'avatar_generation' | 'completed';
}

export interface Avatar {
  id: string;
  shopperId: string;
  createdAt: string;
  generationTimeMs: number;
  success: boolean;
  errorMessage?: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'tops' | 'bottoms' | 'one-pieces';
  brand: string;
  enabled: boolean;
  availableSizes: string[];
  imageUrl?: string;
}

export interface TryOn {
  id: string;
  avatarId: string;
  productId: string;
  createdAt: string;
  generationTimeMs: number;
  success: boolean;
  anglesGenerated: number;
  errorMessage?: string;
}

export interface SizeRecommendation {
  id: string;
  shopperId: string;
  productId: string;
  recommendedSize: string;
  createdAt: string;
}

export interface Event {
  id: string;
  shopperId: string;
  type: 'onboarding_started' | 'photo_uploaded' | 'avatar_created' | 'tryon_completed' | 'purchase';
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface SummaryMetrics {
  totalAvatars: number;
  totalTryons: number;
  avatarCompletionRate: number;
  tryonConversionRate: number;
  skuCoverage: number;
  avgLatencyMs: number;
  errorRate: number;
  trends: {
    avatars: number;
    tryons: number;
    completionRate: number;
  };
}

export interface AvatarMetrics {
  total: number;
  successful: number;
  failed: number;
  completionRate: number;
  avgGenerationTimeMs: number;
  timeline: Array<{ date: string; count: number }>;
}

export interface TryonMetrics {
  total: number;
  successful: number;
  failed: number;
  avgGenerationTimeMs: number;
  byCategory: Array<{ category: string; count: number }>;
  timeline: Array<{ date: string; count: number }>;
  avgPerUser: number;
}

export interface ProductMetrics {
  totalProducts: number;
  enabledProducts: number;
  skuCoverage: number;
  byCategory: Array<{ category: string; total: number; enabled: number }>;
  topProducts: Array<{ id: string; name: string; tryons: number }>;
}

export interface ShopperMetrics {
  total: number;
  completedOnboarding: number;
  heightDistribution: Array<{ range: string; count: number }>;
  ageDistribution: Array<{ range: string; count: number }>;
  genderDistribution: Array<{ gender: string; count: number }>;
  countryDistribution: Array<{ country: string; count: number }>;
  sizeRecommendations: Array<{ size: string; count: number }>;
}

export interface PerformanceMetrics {
  avgAvatarLatencyMs: number;
  avgTryonLatencyMs: number;
  avatarErrorRate: number;
  tryonErrorRate: number;
  latencyTimeline: Array<{ date: string; avatar: number; tryon: number }>;
  errorTimeline: Array<{ date: string; avatarErrors: number; tryonErrors: number }>;
}

export interface Recommendation {
  id: string;
  severity: 'high' | 'medium' | 'low';
  category: 'engagement' | 'catalog' | 'technical' | 'sizing';
  title: string;
  description: string;
  metric: string;
  value: string;
  action: string;
}

export interface DropoffFunnel {
  stage: string;
  count: number;
  percentage: number;
}
