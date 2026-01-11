import { useState } from 'react';
import { Users, Shirt, CheckCircle, Zap, Package, Activity } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { KpiCard } from '../components/dashboard/KpiCard';
import { ErrorState } from '../components/dashboard/ErrorState';
import { FunnelChart } from '../components/charts/FunnelChart';
import { useSummary, useShopperMetrics, useTryonMetrics } from '../hooks/useMetrics';
import { formatPercent, formatLatency } from '../lib/utils';
import type { DateRange } from '../types';

export function Overview() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  
  const { data: summary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = useSummary(dateRange);
  const { data: shoppers, isLoading: shoppersLoading } = useShopperMetrics(dateRange);
  const { data: tryons } = useTryonMetrics(dateRange);

  const funnel = [
    { stage: 'Started Onboarding', count: shoppers?.total || 0, percentage: 100 },
    { stage: 'Avatar Created', count: summary?.totalAvatars || 0, percentage: summary?.avatarCompletionRate || 0 },
    { stage: 'Try-on Completed', count: summary?.totalTryons || 0, percentage: summary?.tryonConversionRate || 0 },
  ];

  if (summaryError) {
    return (
      <>
        <Header 
          title="Overview" 
          subtitle="Key performance metrics at a glance"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <ErrorState 
          message="Failed to load dashboard metrics" 
          onRetry={() => refetchSummary()} 
        />
      </>
    );
  }

  return (
    <>
      <Header 
        title="Overview" 
        subtitle="Key performance metrics at a glance"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <KpiCard
          title="Total Avatars"
          value={summary?.totalAvatars || 0}
          subtitle="Successfully created"
          trend={summary?.trends.avatars}
          trendLabel="vs last period"
          icon={<Users className="h-5 w-5" />}
          loading={summaryLoading}
          tooltip="Number of virtual avatars created from user photos"
        />
        
        <KpiCard
          title="Total Try-ons"
          value={summary?.totalTryons || 0}
          subtitle="Product interactions"
          trend={summary?.trends.tryons}
          trendLabel="vs last period"
          icon={<Shirt className="h-5 w-5" />}
          loading={summaryLoading}
          tooltip="Times users virtually tried on products"
        />
        
        <KpiCard
          title="Completion Rate"
          value={formatPercent(summary?.avatarCompletionRate || 0)}
          subtitle="Onboarding success"
          trend={summary?.trends.completionRate}
          trendLabel="vs last period"
          icon={<CheckCircle className="h-5 w-5" />}
          loading={summaryLoading}
          status={
            (summary?.avatarCompletionRate || 0) >= 70 ? 'good' :
            (summary?.avatarCompletionRate || 0) >= 50 ? 'warning' : 'bad'
          }
          tooltip="Percentage of users who completed avatar creation"
        />
        
        <KpiCard
          title="Try-on Conversion"
          value={formatPercent(summary?.tryonConversionRate || 0)}
          subtitle="Avatar to try-on"
          icon={<Activity className="h-5 w-5" />}
          loading={summaryLoading}
          status={
            (summary?.tryonConversionRate || 0) >= 80 ? 'good' :
            (summary?.tryonConversionRate || 0) >= 60 ? 'warning' : 'bad'
          }
          tooltip="Users with avatars who tried at least one product"
        />
        
        <KpiCard
          title="SKU Coverage"
          value={formatPercent(summary?.skuCoverage || 0)}
          subtitle="Products enabled"
          icon={<Package className="h-5 w-5" />}
          loading={summaryLoading}
          status={
            (summary?.skuCoverage || 0) >= 85 ? 'good' :
            (summary?.skuCoverage || 0) >= 70 ? 'warning' : 'bad'
          }
          tooltip="Percentage of catalog enabled for virtual try-on"
        />
        
        <KpiCard
          title="Avg Latency"
          value={formatLatency(summary?.avgLatencyMs || 0)}
          subtitle="Try-on generation"
          icon={<Zap className="h-5 w-5" />}
          loading={summaryLoading}
          status={
            (summary?.avgLatencyMs || 0) <= 2000 ? 'good' :
            (summary?.avgLatencyMs || 0) <= 3000 ? 'warning' : 'bad'
          }
          tooltip="Average time to generate a try-on image"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FunnelChart data={funnel} loading={summaryLoading || shoppersLoading} />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white border">
              <p className="text-sm text-muted-foreground">Avg Try-ons / User</p>
              <p className="text-2xl font-bold">{tryons?.avgPerUser || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-white border">
              <p className="text-sm text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold">{summary?.errorRate || 0}%</p>
            </div>
            <div className="p-4 rounded-lg bg-white border">
              <p className="text-sm text-muted-foreground">Total Shoppers</p>
              <p className="text-2xl font-bold">{shoppers?.total || 0}</p>
            </div>
            <div className="p-4 rounded-lg bg-white border">
              <p className="text-sm text-muted-foreground">Completed Onboarding</p>
              <p className="text-2xl font-bold">{shoppers?.completedOnboarding || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
