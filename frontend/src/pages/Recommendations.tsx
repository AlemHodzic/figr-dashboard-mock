import { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, ArrowRight, TrendingUp, Package, Wrench, Ruler } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/dashboard/ErrorState';
import { EmptyState } from '../components/dashboard/EmptyState';
import { useRecommendations } from '../hooks/useMetrics';
import { cn } from '../lib/utils';
import type { DateRange, Recommendation } from '../types';

const severityConfig = {
  high: { 
    icon: AlertTriangle, 
    variant: 'error' as const, 
    label: 'High Priority',
    border: 'border-l-red-500'
  },
  medium: { 
    icon: AlertCircle, 
    variant: 'warning' as const, 
    label: 'Medium Priority',
    border: 'border-l-amber-500'
  },
  low: { 
    icon: Info, 
    variant: 'secondary' as const, 
    label: 'Low Priority',
    border: 'border-l-slate-400'
  },
};

const categoryConfig = {
  engagement: { icon: TrendingUp, label: 'Engagement' },
  catalog: { icon: Package, label: 'Catalog' },
  technical: { icon: Wrench, label: 'Technical' },
  sizing: { icon: Ruler, label: 'Sizing' },
};

function RecommendationCard({ rec }: { rec: Recommendation }) {
  const severity = severityConfig[rec.severity];
  const category = categoryConfig[rec.category];
  const SeverityIcon = severity.icon;
  const CategoryIcon = category.icon;

  return (
    <Card className={cn("border-l-4", severity.border)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-muted">
              <CategoryIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">{category.label}</span>
          </div>
          <Badge variant={severity.variant} className="flex items-center gap-1">
            <SeverityIcon className="h-3 w-3" />
            {severity.label}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-foreground mb-2">{rec.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>
        
        <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">{rec.metric}</p>
            <p className="text-lg font-bold text-foreground">{rec.value}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <ArrowRight className="h-4 w-4 text-primary" />
          <span className="text-foreground font-medium">Action:</span>
          <span className="text-muted-foreground">{rec.action}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function Recommendations() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  const { data: recommendations, isLoading, error, refetch } = useRecommendations(dateRange);

  const highPriority = recommendations?.filter(r => r.severity === 'high') || [];
  const mediumPriority = recommendations?.filter(r => r.severity === 'medium') || [];
  const lowPriority = recommendations?.filter(r => r.severity === 'low') || [];

  if (error) {
    return (
      <>
        <Header 
          title="Recommendations" 
          subtitle="Data-driven insights to improve performance"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <ErrorState message="Failed to load recommendations" onRetry={() => refetch()} />
      </>
    );
  }

  if (!isLoading && (!recommendations || recommendations.length === 0)) {
    return (
      <>
        <Header 
          title="Recommendations" 
          subtitle="Data-driven insights to improve performance"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <EmptyState 
          title="No recommendations"
          message="Everything looks great! No issues detected based on your current data."
        />
      </>
    );
  }

  return (
    <>
      <Header 
        title="Recommendations" 
        subtitle="Data-driven insights to improve performance"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="mb-6">
        <Card className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950 border-violet-200 dark:border-violet-800">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-1">
              {highPriority.length > 0 && (
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">{highPriority.length}</span>
                </div>
              )}
              {mediumPriority.length > 0 && (
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">{mediumPriority.length}</span>
                </div>
              )}
              {lowPriority.length > 0 && (
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{lowPriority.length}</span>
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">
                {recommendations?.length || 0} recommendations found
              </p>
              <p className="text-sm text-muted-foreground">
                {highPriority.length} high priority • {mediumPriority.length} medium • {lowPriority.length} low
              </p>
            </div>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {highPriority.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                High Priority
              </h2>
              <div className="space-y-4">
                {highPriority.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            </section>
          )}

          {mediumPriority.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Medium Priority
              </h2>
              <div className="space-y-4">
                {mediumPriority.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            </section>
          )}

          {lowPriority.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-slate-500" />
                Low Priority
              </h2>
              <div className="space-y-4">
                {lowPriority.map((rec) => (
                  <RecommendationCard key={rec.id} rec={rec} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
