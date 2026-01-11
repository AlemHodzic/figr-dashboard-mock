import { TrendingUp, TrendingDown, Minus, HelpCircle } from 'lucide-react';
import { Card } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  status?: 'good' | 'warning' | 'bad' | 'neutral';
  tooltip?: string;
}

export function KpiCard({ 
  title, 
  value, 
  subtitle,
  trend, 
  trendLabel,
  icon,
  loading,
  status = 'neutral',
  tooltip
}: KpiCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

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

  const statusBg = {
    good: 'bg-emerald-50 border-emerald-200',
    warning: 'bg-amber-50 border-amber-200',
    bad: 'bg-red-50 border-red-200',
    neutral: ''
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
    <Card className={cn("p-5 hover:shadow-md transition-shadow relative", status !== 'neutral' && statusBg[status])}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {tooltip && (
              <div className="relative">
                <HelpCircle 
                  className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                />
                {showTooltip && (
                  <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-slate-900 rounded-lg shadow-lg w-48">
                    {tooltip}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                  </div>
                )}
              </div>
            )}
          </div>
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
