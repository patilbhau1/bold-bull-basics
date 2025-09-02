import { ArrowUp, ArrowDown, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap?: number;
  peRatio?: number;
}

interface StockDetailsProps {
  stockData: StockData;
  companyInfo?: {
    name: string;
    description: string;
    sector: string;
    industry: string;
  };
  onTimeframeChange: (timeframe: string) => void;
  activeTimeframe: string;
}

const StockDetails = ({ stockData, companyInfo, onTimeframeChange, activeTimeframe }: StockDetailsProps) => {
  const isPositive = stockData.change >= 0;
  
  // Simple algorithm for buy/caution signal based on basic metrics
  const getSignal = () => {
    const volatility = Math.abs(stockData.changePercent);
    
    if (stockData.changePercent > 0 && volatility < 5) {
      return { type: 'buy', label: 'Good to Buy', icon: Shield };
    }
    return { type: 'caution', label: 'Caution', icon: AlertTriangle };
  };

  const signal = getSignal();
  const timeframes = [
    { label: '1M', value: '1M' },
    { label: '3M', value: '3M' },
    { label: '1Y', value: '1Y' },
    { label: '5Y', value: '5Y' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Price Card */}
        <Card className="lg:col-span-2 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold">{stockData.symbol}</CardTitle>
                {companyInfo && (
                  <p className="text-muted-foreground text-lg">{companyInfo.name}</p>
                )}
              </div>
              
              <Badge 
                variant={signal.type === 'buy' ? 'default' : 'secondary'}
                className={`px-4 py-2 text-sm font-semibold ${
                  signal.type === 'buy' 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-warning text-warning-foreground'
                }`}
              >
                <signal.icon className="h-4 w-4 mr-2" />
                {signal.label}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-bold text-foreground">
                  {formatCurrency(stockData.price)}
                </span>
                
                <div className={`flex items-center gap-1 ${
                  isPositive ? 'text-success' : 'text-warning'
                }`}>
                  {isPositive ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                  <span className="text-lg font-semibold">
                    {formatCurrency(Math.abs(stockData.change))} ({Math.abs(stockData.changePercent).toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Timeframe Buttons */}
              <div className="flex gap-2">
                {timeframes.map((tf) => (
                  <Button
                    key={tf.value}
                    variant={activeTimeframe === tf.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onTimeframeChange(tf.value)}
                  >
                    {tf.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Key Stats
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Day High</p>
                <p className="font-semibold">{formatCurrency(stockData.high)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Day Low</p>
                <p className="font-semibold">{formatCurrency(stockData.low)}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-semibold">{stockData.volume.toLocaleString()}</p>
              </div>
              
              {stockData.marketCap && (
                <div>
                  <p className="text-sm text-muted-foreground">Market Cap</p>
                  <p className="font-semibold">{formatLargeNumber(stockData.marketCap)}</p>
                </div>
              )}
              
              {stockData.peRatio && (
                <div>
                  <p className="text-sm text-muted-foreground">P/E Ratio</p>
                  <p className="font-semibold">{stockData.peRatio.toFixed(2)}</p>
                </div>
              )}
            </div>

            {companyInfo && (
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Sector</p>
                    <p className="font-semibold">{companyInfo.sector}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-semibold">{companyInfo.industry}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StockDetails;