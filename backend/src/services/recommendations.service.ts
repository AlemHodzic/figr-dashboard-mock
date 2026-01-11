import { DateRange, Recommendation } from '../types';
import * as metricsService from './metrics.service';

export function getRecommendations(dateRange: DateRange): Recommendation[] {
  const summary = metricsService.getSummaryMetrics(dateRange);
  const tryonMetrics = metricsService.getTryonMetrics(dateRange);
  const productMetrics = metricsService.getProductMetrics(dateRange);
  const shopperMetrics = metricsService.getShopperMetrics(dateRange);
  const performanceMetrics = metricsService.getPerformanceMetrics(dateRange);
  const funnel = metricsService.getDropoffFunnel(dateRange);
  
  const recommendations: Recommendation[] = [];
  
  // Check avatar completion rate
  if (summary.avatarCompletionRate < 70) {
    recommendations.push({
      id: 'rec_completion',
      severity: summary.avatarCompletionRate < 50 ? 'high' : 'medium',
      category: 'engagement',
      title: 'Low Avatar Completion Rate',
      description: 'Many users are dropping off before completing their avatar. Consider simplifying the onboarding flow or adding progress indicators.',
      metric: 'Avatar Completion Rate',
      value: `${summary.avatarCompletionRate}%`,
      action: 'Review onboarding UX and identify friction points in photo upload step'
    });
  }
  
  // Check category balance
  const categoryTryons = tryonMetrics.byCategory;
  const maxCategory = categoryTryons.reduce((a, b) => a.count > b.count ? a : b);
  const minCategory = categoryTryons.reduce((a, b) => a.count < b.count ? a : b);
  
  if (maxCategory.count > minCategory.count * 2.5 && minCategory.count > 0) {
    recommendations.push({
      id: 'rec_category',
      severity: 'medium',
      category: 'catalog',
      title: `${minCategory.category} Category Underperforming`,
      description: `${minCategory.category} has significantly fewer try-ons compared to ${maxCategory.category}. Consider featuring more ${minCategory.category.toLowerCase()} products or improving their visibility.`,
      metric: 'Category Try-ons',
      value: `${minCategory.count} vs ${maxCategory.count}`,
      action: `Promote ${minCategory.category.toLowerCase()} in homepage carousel or add category-specific campaigns`
    });
  }
  
  // Check SKU coverage
  if (productMetrics.skuCoverage < 85) {
    recommendations.push({
      id: 'rec_sku',
      severity: productMetrics.skuCoverage < 70 ? 'high' : 'low',
      category: 'catalog',
      title: 'SKU Coverage Gap',
      description: `Only ${productMetrics.skuCoverage}% of products are enabled for virtual try-on. Enabling more SKUs could increase engagement.`,
      metric: 'SKU Coverage',
      value: `${productMetrics.enabledProducts}/${productMetrics.totalProducts} products`,
      action: 'Prioritize enabling top-selling products that are currently disabled'
    });
  }
  
  // Check error rates
  if (performanceMetrics.tryonErrorRate > 3) {
    recommendations.push({
      id: 'rec_errors',
      severity: performanceMetrics.tryonErrorRate > 5 ? 'high' : 'medium',
      category: 'technical',
      title: 'Elevated Try-on Error Rate',
      description: `${performanceMetrics.tryonErrorRate}% of try-ons are failing. This directly impacts user experience and conversion.`,
      metric: 'Try-on Error Rate',
      value: `${performanceMetrics.tryonErrorRate}%`,
      action: 'Investigate recent error logs and prioritize fixing garment overlay issues'
    });
  }
  
  // Check latency
  if (performanceMetrics.avgTryonLatencyMs > 3000) {
    recommendations.push({
      id: 'rec_latency',
      severity: performanceMetrics.avgTryonLatencyMs > 4000 ? 'high' : 'medium',
      category: 'technical',
      title: 'High Try-on Latency',
      description: `Average try-on generation takes ${(performanceMetrics.avgTryonLatencyMs / 1000).toFixed(1)}s. Users expect results in under 3 seconds.`,
      metric: 'Avg Try-on Latency',
      value: `${(performanceMetrics.avgTryonLatencyMs / 1000).toFixed(1)}s`,
      action: 'Consider image optimization, caching, or infrastructure scaling'
    });
  }
  
  // Check try-on conversion
  if (summary.tryonConversionRate < 80) {
    recommendations.push({
      id: 'rec_tryon_conversion',
      severity: summary.tryonConversionRate < 60 ? 'high' : 'medium',
      category: 'engagement',
      title: 'Users Not Trying On Products',
      description: `Only ${summary.tryonConversionRate}% of users with avatars have tried on a product. Consider prompting users to try products immediately after avatar creation.`,
      metric: 'Avatar to Try-on Rate',
      value: `${summary.tryonConversionRate}%`,
      action: 'Add product suggestions after avatar creation, highlight "Try it on" buttons'
    });
  }
  
  // Check average try-ons per user
  if (tryonMetrics.avgPerUser < 2) {
    recommendations.push({
      id: 'rec_engagement',
      severity: 'low',
      category: 'engagement',
      title: 'Low Engagement Depth',
      description: `Users average only ${tryonMetrics.avgPerUser} try-ons each. Encouraging more try-ons correlates with higher purchase rates.`,
      metric: 'Avg Try-ons per User',
      value: `${tryonMetrics.avgPerUser}`,
      action: 'Implement "You might also like" recommendations after each try-on'
    });
  }
  
  // Check size distribution for gaps
  const sizeRecs = shopperMetrics.sizeRecommendations;
  const xsSizeRec = sizeRecs.find(s => s.size === 'XS');
  const totalSizeRecs = sizeRecs.reduce((sum, s) => sum + s.count, 0);
  
  if (xsSizeRec && totalSizeRecs > 0 && (xsSizeRec.count / totalSizeRecs) > 0.08) {
    const xsProducts = productMetrics.byCategory
      .reduce((sum, c) => sum + c.total, 0);
    
    recommendations.push({
      id: 'rec_sizing',
      severity: 'medium',
      category: 'sizing',
      title: 'Size Availability Gap for Petite Shoppers',
      description: `${Math.round((xsSizeRec.count / totalSizeRecs) * 100)}% of size recommendations are XS, but some products don't offer this size.`,
      metric: 'XS Size Requests',
      value: `${xsSizeRec.count} recommendations`,
      action: 'Ensure XS availability across all product categories, especially tops'
    });
  }
  
  // Check funnel drop-off
  const purchaseRate = funnel.find(f => f.stage === 'Purchase')?.percentage || 0;
  if (purchaseRate < 15) {
    recommendations.push({
      id: 'rec_purchase',
      severity: purchaseRate < 10 ? 'high' : 'medium',
      category: 'engagement',
      title: 'Low Purchase Conversion',
      description: `Only ${purchaseRate}% of users who started onboarding made a purchase. The virtual try-on experience may need optimization.`,
      metric: 'Purchase Rate',
      value: `${purchaseRate}%`,
      action: 'Add "Buy Now" CTAs on try-on results, offer first-purchase discounts'
    });
  }
  
  // Sort by severity
  const severityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  
  return recommendations;
}
