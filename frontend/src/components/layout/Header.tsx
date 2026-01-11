import { Calendar } from 'lucide-react';
import type { DateRange } from '../../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function Header({ title, subtitle, dateRange, onDateRangeChange }: HeaderProps) {
  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 14 days', days: 14 },
    { label: 'Last 30 days', days: 30 },
    { label: 'All time', days: 0 },
  ];

  const handlePresetClick = (days: number) => {
    if (days === 0) {
      onDateRangeChange({});
      return;
    }
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    onDateRangeChange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  const getActivePreset = () => {
    if (!dateRange.startDate) return 'All time';
    
    const start = new Date(dateRange.startDate);
    const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date();
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const preset = presets.find(p => p.days === days);
    return preset?.label || 'Custom';
  };

  return (
    <header className="mb-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset.days)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  getActivePreset() === preset.label
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          
          <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            <Calendar className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
