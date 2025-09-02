import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import StockSearch from '@/components/StockSearch';
import StockDetails from '@/components/StockDetails';
import StockChart from '@/components/StockChart';
import AIInsights from '@/components/AIInsights';
import Glossary from '@/components/Glossary';
import { fetchStockQuote, fetchCompanyOverview, fetchTimeSeriesData, StockQuote, CompanyOverview, TimeSeriesData } from '@/utils/stockApi';

const Index = () => {
  const [activeSection, setActiveSection] = useState<'home' | 'glossary'>('home');
  const [stockData, setStockData] = useState<StockQuote | null>(null);
  const [companyInfo, setCompanyInfo] = useState<CompanyOverview | null>(null);
  const [chartData, setChartData] = useState<TimeSeriesData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('1M');
  const { toast } = useToast();

  const handleSearch = async (symbol: string) => {
    setIsLoading(true);
    setStockData(null);
    setCompanyInfo(null);
    setChartData([]);

    try {
      // Fetch all data concurrently
      const [quoteData, overviewData, timeSeriesData] = await Promise.allSettled([
        fetchStockQuote(symbol),
        fetchCompanyOverview(symbol),
        fetchTimeSeriesData(symbol, activeTimeframe)
      ]);

      if (quoteData.status === 'fulfilled') {
        setStockData(quoteData.value);
      } else {
        throw new Error('Failed to fetch stock data');
      }

      if (overviewData.status === 'fulfilled') {
        setCompanyInfo(overviewData.value);
      }

      if (timeSeriesData.status === 'fulfilled') {
        setChartData(timeSeriesData.value);
      }

      toast({
        title: 'Stock data loaded!',
        description: `Successfully loaded data for ${symbol}`,
      });

    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch stock data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeframeChange = async (timeframe: string) => {
    if (!stockData) return;

    setActiveTimeframe(timeframe);
    setIsChartLoading(true);

    try {
      const timeSeriesData = await fetchTimeSeriesData(stockData.symbol, timeframe);
      setChartData(timeSeriesData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chart data for the selected timeframe.',
        variant: 'destructive',
      });
    } finally {
      setIsChartLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />

      {activeSection === 'home' ? (
        <main>
          <StockSearch onSearch={handleSearch} isLoading={isLoading} />
          
          {stockData && (
            <>
              <StockDetails
                stockData={{
                  symbol: stockData.symbol,
                  price: stockData.price,
                  change: stockData.change,
                  changePercent: stockData.changePercent,
                  high: stockData.high,
                  low: stockData.low,
                  volume: stockData.volume,
                  marketCap: companyInfo?.marketCap,
                  peRatio: companyInfo?.peRatio,
                }}
                companyInfo={companyInfo ? {
                  name: companyInfo.name,
                  description: companyInfo.description,
                  sector: companyInfo.sector,
                  industry: companyInfo.industry,
                } : undefined}
                onTimeframeChange={handleTimeframeChange}
                activeTimeframe={activeTimeframe}
              />

              <StockChart
                data={chartData}
                symbol={stockData.symbol}
                timeframe={activeTimeframe}
                isLoading={isChartLoading}
              />

              <AIInsights
                stockSymbol={stockData.symbol}
                companyName={companyInfo?.name}
              />
            </>
          )}
        </main>
      ) : (
        <Glossary />
      )}
    </div>
  );
};

export default Index;