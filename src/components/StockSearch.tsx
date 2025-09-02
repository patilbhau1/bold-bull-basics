import { useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroBg from '@/assets/hero-bg.jpg';

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isLoading: boolean;
}

const StockSearch = ({ onSearch, isLoading }: StockSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.toUpperCase().trim());
    }
  };

  const popularStocks = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'NVDA', 'AMZN'];

  return (
    <section 
      className="relative py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <TrendingUp className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-foreground">
              Simple Stock Explorer
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Learn about stocks with real-time data, interactive charts, and AI-powered insights. 
            Perfect for beginners exploring the stock market.
          </p>

          <Card className="p-8 backdrop-blur-sm bg-card/80 border-2 animate-slide-up">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                <Input
                  type="text"
                  placeholder="Enter stock symbol (e.g., AAPL, TSLA, GOOGL)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-16 text-lg border-2 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <Button 
                type="submit" 
                variant="hero"
                size="lg" 
                disabled={isLoading || !searchTerm.trim()}
                className="w-full h-14 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="animate-pulse-soft">Searching...</div>
                ) : (
                  'Explore Stock'
                )}
              </Button>
            </form>

            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-4">Popular stocks to try:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {popularStocks.map((stock) => (
                  <Button
                    key={stock}
                    variant="outline"
                    size="sm"
                    onClick={() => onSearch(stock)}
                    disabled={isLoading}
                    className="hover:bg-primary/10 transition-colors"
                  >
                    {stock}
                  </Button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StockSearch;