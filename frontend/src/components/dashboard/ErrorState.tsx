import { AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/card';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Failed to load data', onRetry }: ErrorStateProps) {
  return (
    <Card className="p-8">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">Something went wrong</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </button>
        )}
      </div>
    </Card>
  );
}
