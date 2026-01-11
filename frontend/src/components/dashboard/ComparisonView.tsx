import { TrendingUp, TrendingDown, Minus, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import type { ComparisonMetrics, DateRange } from '../../types';

interface ComparisonViewProps {
  data?: ComparisonMetrics;
  loading?: boolean;
  dateRange?: DateRange;
}

interface MetricRowProps {
  label: string;
  current: number | string;
  previous: number | string;
  change: number;
  format?: 'number' | 'percent' | 'latency';
  inverseGood?: boolean;
}

function formatValue(value: number | string, format: 'number' | 'percent' | 'latency' = 'number'): string {
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'percent':
      return `${value}%`;
    case 'latency':
      return value > 0 ? `${(value / 1000).toFixed(1)}s` : '0s';
    default:
      return value.toLocaleString();
  }
}

function MetricRow({ label, current, previous, change, format = 'number', inverseGood = false }: MetricRowProps) {
  const isPositive = inverseGood ? change < 0 : change > 0;
  const isNegative = inverseGood ? change > 0 : change < 0;
  
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right w-20">
          <p className="text-xs text-muted-foreground">Previous</p>
          <p className="text-sm font-medium text-muted-foreground">
            {formatValue(previous, format)}
          </p>
        </div>
        
        <ArrowRight className="h-4 w-4 text-muted-foreground/50" />
        
        <div className="text-right w-20">
          <p className="text-xs text-muted-foreground">Current</p>
          <p className="text-sm font-bold text-foreground">
            {formatValue(current, format)}
          </p>
        </div>
        
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium min-w-[70px] justify-center",
          isPositive && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
          isNegative && "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
          !isPositive && !isNegative && "bg-muted text-muted-foreground"
        )}>
          {change > 0 && <TrendingUp className="h-3 w-3" />}
          {change < 0 && <TrendingDown className="h-3 w-3" />}
          {change === 0 && <Minus className="h-3 w-3" />}
          {change > 0 ? '+' : ''}{change}%
        </div>
      </div>
    </div>
  );
}

export function ComparisonView({ data, loading, dateRange }: ComparisonViewProps) {
  const hasDateRange = dateRange?.startDate && dateRange?.endDate;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  // Show message when "All time" is selected
  if (!hasDateRange) {
    return (
      <Card className="border-2 border-amber-200 dark:border-amber-900">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-b">
          <CardTitle className="flex items-center gap-2">
            📊 Period Comparison
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-start gap-3 text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium">Select a date range to compare periods</p>
              <p className="text-sm text-muted-foreground mt-1">
                Choose <span className="font-medium text-foreground">Last 7 days</span>, <span className="font-medium text-foreground">Last 14 days</span>, or <span className="font-medium text-foreground">Last 30 days</span> to compare against the previous period.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Example: "Last 7 days" will compare <span className="font-medium text-foreground">Dec 4-10</span> vs <span className="font-medium text-foreground">Nov 27 - Dec 3</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate what periods are being compared for the explanation
  const getPeriodExplanation = () => {
    if (!dateRange?.startDate || !dateRange?.endDate) return '';
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return `Comparing the last ${days} days to the ${days} days before that`;
  };

  return (
    <Card className="border-2 border-violet-200 dark:border-violet-900">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              📊 Period Comparison
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {getPeriodExplanation()}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{data.previous.period}</span>
              {' → '}
              <span className="font-medium text-foreground">{data.current.period}</span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <MetricRow 
          label="Total Avatars" 
          current={data.current.avatars}
          previous={data.previous.avatars}
          change={data.changes.avatars}
        />
        <MetricRow 
          label="Total Try-ons" 
          current={data.current.tryons}
          previous={data.previous.tryons}
          change={data.changes.tryons}
        />
        <MetricRow 
          label="Completion Rate" 
          current={data.current.completionRate}
          previous={data.previous.completionRate}
          change={data.changes.completionRate}
          format="percent"
        />
        <MetricRow 
          label="Conversion Rate" 
          current={data.current.conversionRate}
          previous={data.previous.conversionRate}
          change={data.changes.conversionRate}
          format="percent"
        />
        <MetricRow 
          label="Avg Latency" 
          current={data.current.avgLatencyMs}
          previous={data.previous.avgLatencyMs}
          change={data.changes.avgLatencyMs}
          format="latency"
          inverseGood={true}
        />
        <MetricRow 
          label="Error Rate" 
          current={data.current.errorRate}
          previous={data.previous.errorRate}
          change={data.changes.errorRate}
          format="percent"
          inverseGood={true}
        />
      </CardContent>
    </Card>
  );
}
