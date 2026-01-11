import { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import type { DateRange } from '../../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function Header({ title, subtitle, dateRange, onDateRangeChange }: HeaderProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStart, setCustomStart] = useState(dateRange.startDate || '');
  const [customEnd, setCustomEnd] = useState(dateRange.endDate || '');
  const pickerRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 14 days', days: 14 },
    { label: 'Last 30 days', days: 30 },
    { label: 'All time', days: 0 },
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
    return preset?.label || 'Custom';
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
            {isCustom && (
              <span className="px-3 py-1.5 text-sm font-medium rounded-md bg-white text-foreground shadow-sm">
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
            >
              <Calendar className="h-5 w-5" />
              {isCustom && formatDateDisplay() && (
                <span className="text-sm font-medium">{formatDateDisplay()}</span>
              )}
            </button>

            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 p-4 bg-white rounded-lg shadow-lg border z-50 w-80">
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
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
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
        </div>
      </div>
    </header>
  );
}
