import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { TimeSeriesData } from '@/utils/stockApi';

interface StockChartProps {
  data: TimeSeriesData[];
  symbol: string;
  timeframe: string;
  isLoading: boolean;
}

const StockChart = ({ data, symbol, timeframe, isLoading }: StockChartProps) => {
  if (isLoading) {
    return (
      <Card className="border-2 h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <div className="animate-pulse-soft">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
            </div>
            <p className="text-muted-foreground">Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="border-2 h-96">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center space-y-4">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">No chart data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (timeframe === '1M' || timeframe === '3M') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const chartData = data.map(item => ({
    ...item,
    formattedDate: formatDate(item.date)
  }));

  const isPositiveTrend = data.length > 1 && data[data.length - 1].close > data[0].close;

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="border-2 animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-primary" />
            {symbol} Price Chart ({timeframe})
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="formattedDate"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                />
                <YAxis 
                  domain={['dataMin * 0.95', 'dataMax * 1.05']}
                  axisLine={false}
                  tickLine={false}
                  className="text-xs"
                  tickFormatter={formatPrice}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="font-semibold text-foreground">{label}</p>
                          <div className="space-y-1 text-sm">
                            <p className="text-muted-foreground">
                              <span className="font-medium">Open:</span> {formatPrice(data.open)}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium">High:</span> {formatPrice(data.high)}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium">Low:</span> {formatPrice(data.low)}
                            </p>
                            <p className="text-foreground font-semibold">
                              <span className="font-medium">Close:</span> {formatPrice(data.close)}
                            </p>
                            <p className="text-muted-foreground">
                              <span className="font-medium">Volume:</span> {data.volume.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="close" 
                  stroke={isPositiveTrend ? 'hsl(var(--success))' : 'hsl(var(--warning))'}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: isPositiveTrend ? 'hsl(var(--success))' : 'hsl(var(--warning))'
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockChart;