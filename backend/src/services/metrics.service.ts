import { DateRange, SummaryMetrics, AvatarMetrics, TryonMetrics, ProductMetrics, ShopperMetrics, PerformanceMetrics, DropoffFunnel } from '../types';
import { filterByDateRange, groupByDate } from '../utils/dateFilters';

import shoppersData from '../data/shoppers.json';
import avatarsData from '../data/avatars.json';
import tryonsData from '../data/tryons.json';
import productsData from '../data/products.json';
import eventsData from '../data/events.json';
import sizeRecsData from '../data/sizeRecommendations.json';

const shoppers = shoppersData as any[];
const avatars = avatarsData as any[];
const tryons = tryonsData as any[];
const products = productsData as any[];
const events = eventsData as any[];
const sizeRecs = sizeRecsData as any[];

export function getSummaryMetrics(dateRange: DateRange): SummaryMetrics {
  const filteredAvatars = filterByDateRange(avatars, dateRange);
  const filteredTryons = filterByDateRange(tryons, dateRange);
  const filteredShoppers = filterByDateRange(shoppers, dateRange);
  
  const successfulAvatars = filteredAvatars.filter(a => a.success);
  const successfulTryons = filteredTryons.filter(t => t.success);
  const completedOnboarding = filteredShoppers.filter(s => s.completedOnboarding);
  
  const totalProducts = products.length;
  const enabledProducts = products.filter(p => p.enabled).length;
  
  const avgLatency = successfulTryons.length > 0
    ? Math.round(successfulTryons.reduce((sum, t) => sum + t.generationTimeMs, 0) / successfulTryons.length)
    : 0;
  
  const avatarCompletionRate = filteredShoppers.length > 0
    ? Math.round((completedOnboarding.length / filteredShoppers.length) * 100)
    : 0;
  
  const tryonConversionRate = successfulAvatars.length > 0
    ? Math.round((new Set(filteredTryons.map(t => t.avatarId)).size / successfulAvatars.length) * 100)
    : 0;

  return {
    totalAvatars: successfulAvatars.length,
    totalTryons: successfulTryons.length,
    avatarCompletionRate,
    tryonConversionRate,
    skuCoverage: Math.round((enabledProducts / totalProducts) * 100),
    avgLatencyMs: avgLatency,
    errorRate: filteredTryons.length > 0
      ? Math.round(((filteredTryons.length - successfulTryons.length) / filteredTryons.length) * 100)
      : 0,
    trends: {
      avatars: 12,
      tryons: 8,
      completionRate: 3
    }
  };
}

export function getAvatarMetrics(dateRange: DateRange): AvatarMetrics {
  const filteredAvatars = filterByDateRange(avatars, dateRange);
  const successful = filteredAvatars.filter(a => a.success);
  const failed = filteredAvatars.filter(a => !a.success);
  const filteredShoppers = filterByDateRange(shoppers, dateRange);
  const completedOnboarding = filteredShoppers.filter(s => s.completedOnboarding);
  
  const avgGenTime = successful.length > 0
    ? Math.round(successful.reduce((sum, a) => sum + a.generationTimeMs, 0) / successful.length)
    : 0;
  
  const grouped = groupByDate(filteredAvatars);
  const timeline = Array.from(grouped.entries())
    .map(([date, items]) => ({ date, count: items.filter(a => a.success).length }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total: filteredAvatars.length,
    successful: successful.length,
    failed: failed.length,
    completionRate: filteredShoppers.length > 0
      ? Math.round((completedOnboarding.length / filteredShoppers.length) * 100)
      : 0,
    avgGenerationTimeMs: avgGenTime,
    timeline
  };
}

export function getTryonMetrics(dateRange: DateRange): TryonMetrics {
  const filteredTryons = filterByDateRange(tryons, dateRange);
  const successful = filteredTryons.filter(t => t.success);
  const failed = filteredTryons.filter(t => !t.success);
  
  const avgGenTime = successful.length > 0
    ? Math.round(successful.reduce((sum, t) => sum + t.generationTimeMs, 0) / successful.length)
    : 0;
  
  const productMap = new Map(products.map(p => [p.id, p]));
  const categoryCount: Record<string, number> = { tops: 0, bottoms: 0, 'one-pieces': 0 };
  
  for (const tryon of successful) {
    const product = productMap.get(tryon.productId);
    if (product) {
      categoryCount[product.category]++;
    }
  }
  
  const byCategory = Object.entries(categoryCount).map(([category, count]) => ({
    category: category.charAt(0).toUpperCase() + category.slice(1),
    count
  }));
  
  const grouped = groupByDate(filteredTryons);
  const timeline = Array.from(grouped.entries())
    .map(([date, items]) => ({ date, count: items.filter(t => t.success).length }))
    .sort((a, b) => a.date.localeCompare(b.date));
  
  const uniqueAvatars = new Set(successful.map(t => t.avatarId));
  const avgPerUser = uniqueAvatars.size > 0
    ? Math.round((successful.length / uniqueAvatars.size) * 10) / 10
    : 0;

  return {
    total: filteredTryons.length,
    successful: successful.length,
    failed: failed.length,
    avgGenerationTimeMs: avgGenTime,
    byCategory,
    timeline,
    avgPerUser
  };
}

export function getProductMetrics(dateRange: DateRange): ProductMetrics {
  const filteredTryons = filterByDateRange(tryons, dateRange);
  const successfulTryons = filteredTryons.filter(t => t.success);
  
  const totalProducts = products.length;
  const enabledProducts = products.filter(p => p.enabled).length;
  
  const categories = ['tops', 'bottoms', 'one-pieces'];
  const byCategory = categories.map(cat => ({
    category: cat.charAt(0).toUpperCase() + cat.slice(1),
    total: products.filter(p => p.category === cat).length,
    enabled: products.filter(p => p.category === cat && p.enabled).length
  }));
  
  const tryonCounts: Record<string, number> = {};
  for (const tryon of successfulTryons) {
    tryonCounts[tryon.productId] = (tryonCounts[tryon.productId] || 0) + 1;
  }
  
  const productMap = new Map(products.map(p => [p.id, p]));
  const topProducts = Object.entries(tryonCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => ({
      id,
      name: productMap.get(id)?.name || 'Unknown',
      tryons: count
    }));

  return {
    totalProducts,
    enabledProducts,
    skuCoverage: Math.round((enabledProducts / totalProducts) * 100),
    byCategory,
    topProducts
  };
}

export function getShopperMetrics(dateRange: DateRange): ShopperMetrics {
  const filteredShoppers = filterByDateRange(shoppers, dateRange);
  const filteredSizeRecs = filterByDateRange(sizeRecs, dateRange);
  const completedOnboarding = filteredShoppers.filter(s => s.completedOnboarding);
  
  const heightRanges = [
    { range: '150-159cm', min: 150, max: 159 },
    { range: '160-169cm', min: 160, max: 169 },
    { range: '170-179cm', min: 170, max: 179 },
    { range: '180-189cm', min: 180, max: 189 },
    { range: '190+cm', min: 190, max: 999 }
  ];
  
  const heightDistribution = heightRanges.map(r => ({
    range: r.range,
    count: filteredShoppers.filter(s => s.heightCm >= r.min && s.heightCm <= r.max).length
  }));
  
  const ageRanges = [
    { range: '18-24', min: 18, max: 24 },
    { range: '25-34', min: 25, max: 34 },
    { range: '35-44', min: 35, max: 44 },
    { range: '45+', min: 45, max: 999 }
  ];
  
  const ageDistribution = ageRanges.map(r => ({
    range: r.range,
    count: filteredShoppers.filter(s => s.age >= r.min && s.age <= r.max).length
  }));
  
  const genderCounts: Record<string, number> = {};
  for (const s of filteredShoppers) {
    genderCounts[s.gender] = (genderCounts[s.gender] || 0) + 1;
  }
  const genderDistribution = Object.entries(genderCounts).map(([gender, count]) => ({
    gender: gender.charAt(0).toUpperCase() + gender.slice(1),
    count
  }));
  
  const countryCounts: Record<string, number> = {};
  for (const s of filteredShoppers) {
    countryCounts[s.country] = (countryCounts[s.country] || 0) + 1;
  }
  const countryDistribution = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([country, count]) => ({ country, count }));
  
  const sizeCounts: Record<string, number> = {};
  for (const sr of filteredSizeRecs) {
    sizeCounts[sr.recommendedSize] = (sizeCounts[sr.recommendedSize] || 0) + 1;
  }
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38'];
  const sizeRecommendations = Object.entries(sizeCounts)
    .sort((a, b) => sizeOrder.indexOf(a[0]) - sizeOrder.indexOf(b[0]))
    .map(([size, count]) => ({ size, count }));

  return {
    total: filteredShoppers.length,
    completedOnboarding: completedOnboarding.length,
    heightDistribution,
    ageDistribution,
    genderDistribution,
    countryDistribution,
    sizeRecommendations
  };
}

export function getPerformanceMetrics(dateRange: DateRange): PerformanceMetrics {
  const filteredAvatars = filterByDateRange(avatars, dateRange);
  const filteredTryons = filterByDateRange(tryons, dateRange);
  
  const successfulAvatars = filteredAvatars.filter(a => a.success);
  const successfulTryons = filteredTryons.filter(t => t.success);
  
  const avgAvatarLatency = successfulAvatars.length > 0
    ? Math.round(successfulAvatars.reduce((sum, a) => sum + a.generationTimeMs, 0) / successfulAvatars.length)
    : 0;
  
  const avgTryonLatency = successfulTryons.length > 0
    ? Math.round(successfulTryons.reduce((sum, t) => sum + t.generationTimeMs, 0) / successfulTryons.length)
    : 0;
  
  const avatarErrorRate = filteredAvatars.length > 0
    ? Math.round(((filteredAvatars.length - successfulAvatars.length) / filteredAvatars.length) * 100)
    : 0;
  
  const tryonErrorRate = filteredTryons.length > 0
    ? Math.round(((filteredTryons.length - successfulTryons.length) / filteredTryons.length) * 100)
    : 0;
  
  const avatarsByDate = groupByDate(filteredAvatars);
  const tryonsByDate = groupByDate(filteredTryons);
  
  const allDates = new Set([...avatarsByDate.keys(), ...tryonsByDate.keys()]);
  const sortedDates = Array.from(allDates).sort();
  
  const latencyTimeline = sortedDates.map(date => {
    const dateAvatars = (avatarsByDate.get(date) || []).filter(a => a.success);
    const dateTryons = (tryonsByDate.get(date) || []).filter(t => t.success);
    
    return {
      date,
      avatar: dateAvatars.length > 0
        ? Math.round(dateAvatars.reduce((sum, a) => sum + a.generationTimeMs, 0) / dateAvatars.length)
        : 0,
      tryon: dateTryons.length > 0
        ? Math.round(dateTryons.reduce((sum, t) => sum + t.generationTimeMs, 0) / dateTryons.length)
        : 0
    };
  });
  
  const errorTimeline = sortedDates.map(date => {
    const dateAvatars = avatarsByDate.get(date) || [];
    const dateTryons = tryonsByDate.get(date) || [];
    
    return {
      date,
      avatarErrors: dateAvatars.filter(a => !a.success).length,
      tryonErrors: dateTryons.filter(t => !t.success).length
    };
  });

  return {
    avgAvatarLatencyMs: avgAvatarLatency,
    avgTryonLatencyMs: avgTryonLatency,
    avatarErrorRate,
    tryonErrorRate,
    latencyTimeline,
    errorTimeline
  };
}

export function getDropoffFunnel(dateRange: DateRange): DropoffFunnel[] {
  const filteredEvents = filterByDateRange(events, dateRange);
  
  const stages = [
    { stage: 'Started Onboarding', type: 'onboarding_started' },
    { stage: 'Photo Uploaded', type: 'photo_uploaded' },
    { stage: 'Avatar Created', type: 'avatar_created' },
    { stage: 'Try-on Completed', type: 'tryon_completed' },
    { stage: 'Purchase', type: 'purchase' }
  ];
  
  const stageCounts = stages.map(s => ({
    stage: s.stage,
    count: new Set(filteredEvents.filter(e => e.type === s.type).map(e => e.shopperId)).size
  }));
  
  const totalStarted = stageCounts[0].count || 1;
  
  return stageCounts.map(s => ({
    ...s,
    percentage: Math.round((s.count / totalStarted) * 100)
  }));
}
