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
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14" style={{ width: `${100 - i * 15}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = [
    'bg-violet-600',
    'bg-violet-500',
    'bg-purple-500',
    'bg-purple-400',
    'bg-fuchsia-400',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
        <p className="text-sm text-muted-foreground">User journey from onboarding to try-on</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.map((stage, index) => {
            const dropoff = index > 0 ? data[index - 1].count - stage.count : 0;
            const dropoffPercent = index > 0 && data[index - 1].count > 0 
              ? Math.round((dropoff / data[index - 1].count) * 100) 
              : 0;
            
            return (
              <div key={stage.stage}>
                {index > 0 && dropoff > 0 && (
                  <div className="flex items-center justify-center py-1 text-xs text-muted-foreground">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>{dropoff} dropped ({dropoffPercent}% drop-off)</span>
                  </div>
                )}
                <div className="relative flex items-center">
                  <div
                    className={`${colors[index % colors.length]} h-14 rounded-lg flex items-center px-4 transition-all duration-300 shadow-sm`}
                    style={{ width: `${Math.max(stage.percentage, 25)}%`, minWidth: '180px' }}
                  >
                    <span className="text-white font-medium text-sm">
                      {stage.stage}
                    </span>
                  </div>
                  <div className="ml-4 flex items-center gap-3">
                    <span className="text-xl font-bold text-foreground">{stage.count}</span>
                    <span className="text-sm text-muted-foreground px-2 py-0.5 bg-muted rounded">
                      {stage.percentage}%
                    </span>
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
