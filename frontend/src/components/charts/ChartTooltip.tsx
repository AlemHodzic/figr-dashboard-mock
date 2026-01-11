interface PayloadEntry {
  color?: string;
  name?: string;
  dataKey?: string | number;
  value?: number | string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
  valueSuffix?: string;
}

export function ChartTooltip({ 
  active, 
  payload, 
  label,
  labelFormatter,
  valueFormatter,
  valueSuffix = ''
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const formattedLabel = labelFormatter ? labelFormatter(label as string) : label;

  return (
    <div className="bg-slate-900 dark:bg-slate-800 text-white border border-slate-700 rounded-lg shadow-xl p-3 text-sm backdrop-blur-sm">
      {formattedLabel && (
        <p className="font-medium mb-1 text-white">{formattedLabel}</p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-sm" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300">{entry.name || entry.dataKey}:</span>
            <span className="font-medium text-white">
              {valueFormatter ? valueFormatter(entry.value as number) : entry.value}
              {valueSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tooltip style for Recharts that respects dark mode via CSS variables
export const tooltipStyle = {
  contentStyle: {
    backgroundColor: 'hsl(var(--popover))',
    borderColor: 'hsl(var(--border))',
    borderRadius: '8px',
    color: 'hsl(var(--popover-foreground))',
  },
  itemStyle: {
    color: 'hsl(var(--popover-foreground))',
  },
  labelStyle: {
    color: 'hsl(var(--popover-foreground))',
    fontWeight: 500,
  },
};

// Grid stroke color that works in both themes
export const gridStroke = 'hsl(var(--border))';

// Axis tick style
export const axisTickStyle = {
  fill: 'hsl(var(--muted-foreground))',
  fontSize: 12,
};
