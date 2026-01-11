import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { ArrowDown } from 'lucide-react';

interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
}

interface FunnelChartProps {
  data: FunnelStage[];
  loading?: boolean;
}

export function FunnelChart({ data, loading }: FunnelChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[100, 80, 60, 45, 25].map((width, i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8" style={{ width: `${width}%` }} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create a proper funnel shape: first bar is 100%, each step reduces proportionally
  const getBarWidth = (index: number, totalSteps: number) => {
    const minWidth = 20;
    const stepReduction = (100 - minWidth) / (totalSteps - 1);
    return 100 - (index * stepReduction);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <p className="text-sm text-muted-foreground">User journey from onboarding to purchase</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {data.map((stage, index) => {
            const dropoff = index > 0 ? data[index - 1].count - stage.count : 0;
            const dropoffPercent = index > 0 && data[index - 1].count > 0 
              ? Math.round((dropoff / data[index - 1].count) * 100) 
              : 0;
            const barWidth = getBarWidth(index, data.length);
            
            return (
              <div key={stage.stage}>
                {index > 0 && dropoff > 0 && (
                  <div className="flex items-center justify-center py-1 text-xs text-muted-foreground">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{dropoff} dropped ({dropoffPercent}% drop-off)</span>
                  </div>
                )}
                <div className="space-y-1">
                  {/* Stage label and stats row */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {stage.stage}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{stage.count}</span>
                      <span className="text-xs text-muted-foreground px-1.5 py-0.5 bg-muted rounded">
                        {stage.percentage}%
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-lg transition-all duration-300"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
