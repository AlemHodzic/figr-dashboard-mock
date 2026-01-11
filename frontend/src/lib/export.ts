export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportMetricsReport(data: {
  summary?: Record<string, unknown>;
  shoppers?: { heightDistribution?: unknown[]; sizeRecommendations?: unknown[] };
  products?: { topProducts?: unknown[] };
}) {
  const report: Record<string, unknown>[] = [];
  
  // Add summary metrics
  if (data.summary) {
    report.push({
      section: 'Summary Metrics',
      metric: 'Total Avatars',
      value: data.summary.totalAvatars
    });
    report.push({
      section: 'Summary Metrics',
      metric: 'Total Try-ons',
      value: data.summary.totalTryons
    });
    report.push({
      section: 'Summary Metrics',
      metric: 'Completion Rate',
      value: `${data.summary.avatarCompletionRate}%`
    });
    report.push({
      section: 'Summary Metrics',
      metric: 'Try-on Conversion',
      value: `${data.summary.tryonConversionRate}%`
    });
    report.push({
      section: 'Summary Metrics',
      metric: 'SKU Coverage',
      value: `${data.summary.skuCoverage}%`
    });
    report.push({
      section: 'Summary Metrics',
      metric: 'Avg Latency',
      value: `${data.summary.avgLatencyMs}ms`
    });
    report.push({
      section: 'Summary Metrics',
      metric: 'Error Rate',
      value: `${data.summary.errorRate}%`
    });
  }
  
  // Add height distribution
  if (data.shoppers?.heightDistribution) {
    (data.shoppers.heightDistribution as { range: string; count: number }[]).forEach(item => {
      report.push({
        section: 'Height Distribution',
        metric: item.range,
        value: item.count
      });
    });
  }
  
  // Add size recommendations
  if (data.shoppers?.sizeRecommendations) {
    (data.shoppers.sizeRecommendations as { size: string; count: number }[]).forEach(item => {
      report.push({
        section: 'Size Recommendations',
        metric: `Size ${item.size}`,
        value: item.count
      });
    });
  }
  
  // Add top products
  if (data.products?.topProducts) {
    (data.products.topProducts as { name: string; tryons: number }[]).forEach((item, i) => {
      report.push({
        section: 'Top Products',
        metric: `#${i + 1} ${item.name}`,
        value: item.tryons
      });
    });
  }
  
  exportToCSV(report, 'figr_brand_report');
}
