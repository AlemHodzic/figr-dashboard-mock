import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Header } from '../components/layout/Header';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { ErrorState } from '../components/dashboard/ErrorState';
import { 
  useTryonMetrics, 
  useProductMetrics, 
  useShopperMetrics, 
  usePerformanceMetrics 
} from '../hooks/useMetrics';
import type { DateRange } from '../types';

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

export function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>({});
  
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
          </CardHeader>
          <CardContent>
            {tryonsLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={tryons?.timeline || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
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
                    outerRadius={90}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {(tryons?.byCategory || []).map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 11 }} 
                    width={120}
                  />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="tryons" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Height Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {shoppersLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={shoppers?.heightDistribution || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="count" fill="#a78bfa" radius={[4, 4, 0, 0]} />
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
          </CardHeader>
          <CardContent>
            {shoppersLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={shoppers?.sizeRecommendations || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="size" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="count" fill="#c4b5fd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latency Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {performanceLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={performance?.latencyTimeline || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(1)}s`} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value) => [`${(Number(value)/1000).toFixed(2)}s`]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
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
