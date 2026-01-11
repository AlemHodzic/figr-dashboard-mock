import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  status?: 'good' | 'warning' | 'bad' | 'neutral';
}

export function KpiCard({ 
  title, 
  value, 
  subtitle,
  trend, 
  trendLabel,
  icon,
  loading,
  status = 'neutral'
}: KpiCardProps) {
  if (loading) {
    return (
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </Card>
    );
  }

  const statusColors = {
    good: 'text-emerald-600',
    warning: 'text-amber-600',
    bad: 'text-red-600',
    neutral: 'text-foreground'
  };

  const trendColors = {
    up: 'text-emerald-600 bg-emerald-50',
    down: 'text-red-600 bg-red-50',
    flat: 'text-muted-foreground bg-muted'
  };

  const getTrendDirection = () => {
    if (!trend) return 'flat';
    return trend > 0 ? 'up' : 'down';
  };

  const trendDir = getTrendDirection();

  return (
    <Card className="p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-2xl font-bold tracking-tight", statusColors[status])}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {typeof trend === 'number' && (
            <div className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
              trendColors[trendDir]
            )}>
              {trendDir === 'up' && <TrendingUp className="h-3 w-3" />}
              {trendDir === 'down' && <TrendingDown className="h-3 w-3" />}
              {trendDir === 'flat' && <Minus className="h-3 w-3" />}
              {trend > 0 ? '+' : ''}{trend}%
              {trendLabel && <span className="text-muted-foreground ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
