import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Header } from '../components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/dashboard/ErrorState';
import { ChartTooltip } from '../components/charts/ChartTooltip';
import { 
  useTryonMetrics, 
  useProductMetrics, 
  useShopperMetrics, 
  usePerformanceMetrics 
} from '../hooks/useMetrics';
import type { DateRange } from '../types';

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

// Theme-aware chart colors
const useChartTheme = () => ({
  grid: 'rgba(148, 163, 184, 0.2)',
  axisLine: 'rgba(148, 163, 184, 0.3)',
  tick: { fontSize: 12 },
});

export function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  const chartTheme = useChartTheme();
  
  const { data: tryons, isLoading: tryonsLoading, error: tryonsError, refetch } = useTryonMetrics(dateRange);
  const { data: products, isLoading: productsLoading } = useProductMetrics(dateRange);
  const { data: shoppers, isLoading: shoppersLoading } = useShopperMetrics(dateRange);
  const { data: performance, isLoading: performanceLoading } = usePerformanceMetrics(dateRange);

  if (tryonsError) {
    return (
      <>
        <Header 
          title="Analytics" 
          subtitle="Deep dive into your performance data"
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <ErrorState message="Failed to load analytics" onRetry={() => refetch()} />
      </>
    );
  }

  return (
    <>
      <Header 
        title="Analytics" 
        subtitle="Deep dive into your performance data"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Try-ons Over Time</CardTitle>
            <p className="text-sm text-muted-foreground">Daily virtual try-on activity</p>
          </CardHeader>
          <CardContent>
            {tryonsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={tryons?.timeline || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis 
                    dataKey="date" 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                  />
                  <Tooltip 
                    content={<ChartTooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 0 }}
                    name="Try-ons"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <p className="text-sm text-muted-foreground">Try-ons by product type</p>
          </CardHeader>
          <CardContent>
            {tryonsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={tryons?.byCategory || []}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {(tryons?.byCategory || []).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <p className="text-sm text-muted-foreground">Most tried-on items</p>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart 
                  data={(products?.topProducts || []).slice(0, 6)} 
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} horizontal={false} />
                  <XAxis 
                    type="number" 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11 }} 
                    width={120}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="tryons" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Try-ons" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Height Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">Shopper body measurements</p>
          </CardHeader>
          <CardContent>
            {shoppersLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={shoppers?.heightDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis 
                    dataKey="range" 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                  />
                  <YAxis 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Shoppers" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Size Recommendations</CardTitle>
            <p className="text-sm text-muted-foreground">Suggested sizes for shoppers</p>
          </CardHeader>
          <CardContent>
            {shoppersLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={shoppers?.sizeRecommendations || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis 
                    dataKey="size" 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                  />
                  <YAxis 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="count" fill="#c4b5fd" radius={[4, 4, 0, 0]} name="Recommendations" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latency Trends</CardTitle>
            <p className="text-sm text-muted-foreground">Generation time performance</p>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={performance?.latencyTimeline || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                  <XAxis 
                    dataKey="date" 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={chartTheme.tick}
                    tickLine={{ stroke: chartTheme.axisLine }}
                    axisLine={{ stroke: chartTheme.axisLine }}
                    tickFormatter={(v) => `${(v/1000).toFixed(1)}s`}
                  />
                  <Tooltip 
                    content={<ChartTooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      valueFormatter={(value) => `${(value/1000).toFixed(2)}s`}
                    />}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                  />
                  <Line type="monotone" dataKey="avatar" stroke="#8b5cf6" strokeWidth={2} name="Avatar" dot={false} />
                  <Line type="monotone" dataKey="tryon" stroke="#a78bfa" strokeWidth={2} name="Try-on" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {shoppersLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="space-y-3">
                {(shoppers?.ageDistribution || []).map((item) => (
                  <div key={item.range} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-12">{item.range}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-violet-500 h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / Math.max(...(shoppers?.ageDistribution || []).map(a => a.count))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {shoppersLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="space-y-3">
                {(shoppers?.genderDistribution || []).map((item, i) => (
                  <div key={item.gender} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-16">{item.gender}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / Math.max(...(shoppers?.genderDistribution || []).map(g => g.count))) * 100}%`,
                          backgroundColor: COLORS[i % COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            {shoppersLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="space-y-3">
                {(shoppers?.countryDistribution || []).slice(0, 5).map((item, i) => (
                  <div key={item.country} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-8">{item.country}</span>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${(item.count / Math.max(...(shoppers?.countryDistribution || []).map(c => c.count))) * 100}%`,
                          backgroundColor: COLORS[i % COLORS.length]
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
