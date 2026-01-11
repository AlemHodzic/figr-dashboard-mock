import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';

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
              <Skeleton key={i} className="h-10" style={{ width: `${100 - i * 15}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const colors = [
    'bg-violet-500',
    'bg-violet-400',
    'bg-purple-400',
    'bg-purple-300',
    'bg-fuchsia-300',
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((stage, index) => (
            <div key={stage.stage} className="relative">
              <div
                className={`${colors[index % colors.length]} h-12 rounded-lg flex items-center px-4 transition-all duration-300`}
                style={{ width: `${Math.max(stage.percentage, 20)}%` }}
              >
                <span className="text-white font-medium text-sm truncate">
                  {stage.stage}
                </span>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm">
                <span className="font-semibold">{stage.count}</span>
                <span className="text-muted-foreground">({stage.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
