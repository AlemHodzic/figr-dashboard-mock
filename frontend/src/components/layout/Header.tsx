import { useState, useRef, useEffect } from 'react';
import { Calendar, X, Download } from 'lucide-react';
import type { DateRange } from '../../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  onExport?: () => void;
}

export function Header({ title, subtitle, dateRange, onDateRangeChange, onExport }: HeaderProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStart, setCustomStart] = useState(dateRange.startDate || '');
  const [customEnd, setCustomEnd] = useState(dateRange.endDate || '');
  const pickerRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: '7d', fullLabel: 'Last 7 days', days: 7 },
    { label: '14d', fullLabel: 'Last 14 days', days: 14 },
    { label: '30d', fullLabel: 'Last 30 days', days: 30 },
    { label: 'All', fullLabel: 'All time', days: 0 },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePresetClick = (days: number) => {
    if (days === 0) {
      onDateRangeChange({});
      setCustomStart('');
      setCustomEnd('');
      return;
    }
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const start = startDate.toISOString().split('T')[0];
    const end = endDate.toISOString().split('T')[0];
    
    setCustomStart(start);
    setCustomEnd(end);
    onDateRangeChange({ startDate: start, endDate: end });
  };

  const handleCustomDateApply = () => {
    if (customStart && customEnd) {
      onDateRangeChange({ startDate: customStart, endDate: customEnd });
      setShowDatePicker(false);
    }
  };

  const handleClearDates = () => {
    setCustomStart('');
    setCustomEnd('');
    onDateRangeChange({});
    setShowDatePicker(false);
  };

  const getActivePreset = () => {
    if (!dateRange.startDate) return 'All time';
    
    const start = new Date(dateRange.startDate);
    const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date();
    const days = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    const preset = presets.find(p => p.days === days);
    return preset?.fullLabel || 'Custom';
  };

  const formatDateDisplay = () => {
    if (!dateRange.startDate) return null;
    const start = new Date(dateRange.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const end = dateRange.endDate 
      ? new Date(dateRange.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      : 'Now';
    return `${start} - ${end}`;
  };

  const isCustom = getActivePreset() === 'Custom';

  return (
    <header className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm lg:text-base text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            {presets.map((preset) => (
              <button
                key={preset.fullLabel}
                onClick={() => handlePresetClick(preset.days)}
                className={`px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-colors ${
                  getActivePreset() === preset.fullLabel
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="sm:hidden">{preset.label}</span>
                <span className="hidden sm:inline">{preset.fullLabel}</span>
              </button>
            ))}
            {isCustom && (
              <span className="px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md bg-card text-foreground shadow-sm">
                Custom
              </span>
            )}
          </div>
          
          <div className="relative" ref={pickerRef}>
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${
                showDatePicker || isCustom
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              title="Custom date range"
            >
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
              {isCustom && formatDateDisplay() && (
                <span className="hidden lg:inline text-sm font-medium">{formatDateDisplay()}</span>
              )}
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 p-4 bg-card rounded-lg shadow-lg border z-50 w-72 lg:w-80">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Custom Date Range</h3>
                  <button 
                    onClick={() => setShowDatePicker(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      max={customEnd || undefined}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      min={customStart || undefined}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleClearDates}
                    className="flex-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleCustomDateApply}
                    disabled={!customStart || !customEnd}
                    className="flex-1 px-3 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {onExport && (
            <button
              onClick={onExport}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Export to CSV"
            >
              <Download className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
