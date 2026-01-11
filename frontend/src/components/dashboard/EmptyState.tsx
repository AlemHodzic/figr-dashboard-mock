import { Inbox } from 'lucide-react';
import { Card } from '../ui/card';

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({ 
  title = 'No data available',
  message = 'There is no data to display for the selected period.'
}: EmptyStateProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 rounded-full bg-muted">
          <Inbox className="h-6 w-6 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    </Card>
  );
}
