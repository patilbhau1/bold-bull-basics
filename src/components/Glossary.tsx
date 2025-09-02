import { BookOpen, TrendingUp, DollarSign, BarChart3, PieChart, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Glossary = () => {
  const terms = [
    {
      title: 'Market Cap',
      icon: PieChart,
      definition: 'Market Capitalization is the total value of a company\'s shares. It\'s calculated by multiplying the stock price by the number of shares outstanding.',
      example: 'If a company has 1 million shares at $50 each, the market cap is $50 million.',
      category: 'Valuation'
    },
    {
      title: 'P/E Ratio',
      icon: BarChart3,
      definition: 'Price-to-Earnings Ratio compares a company\'s stock price to its earnings per share. It helps determine if a stock is overvalued or undervalued.',
      example: 'A P/E of 20 means investors pay $20 for every $1 of earnings.',
      category: 'Valuation'
    },
    {
      title: 'Dividend',
      icon: DollarSign,
      definition: 'A payment made by companies to shareholders, usually quarterly. It\'s a way for companies to share profits with investors.',
      example: 'If you own 100 shares with a $2 annual dividend, you\'ll receive $200 per year.',
      category: 'Income'
    },
    {
      title: '52-Week High/Low',
      icon: TrendingUp,
      definition: 'The highest and lowest prices a stock has traded at during the past 52 weeks. It shows the stock\'s trading range.',
      example: 'If a stock\'s 52-week range is $30-$80, it shows significant volatility.',
      category: 'Performance'
    },
    {
      title: 'Volume',
      icon: BarChart3,
      definition: 'The number of shares traded during a specific period. High volume often indicates strong interest in a stock.',
      example: 'If 1 million shares traded today vs. average 200k, something significant might be happening.',
      category: 'Trading'
    },
    {
      title: 'Bull vs Bear Market',
      icon: Target,
      definition: 'Bull market = rising prices and optimism. Bear market = falling prices and pessimism. These terms describe overall market trends.',
      example: 'The 2020-2021 period was largely a bull market for technology stocks.',
      category: 'Market Trends'
    }
  ];

  const categories = ['All', 'Valuation', 'Income', 'Performance', 'Trading', 'Market Trends'];

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Stock Market Glossary</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Learn essential stock market terms explained in simple, beginner-friendly language.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {terms.map((term, index) => (
          <Card 
            key={term.title} 
            className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <term.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-xl font-bold">{term.title}</span>
                  <div className="text-sm text-muted-foreground font-normal">
                    {term.category}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-foreground leading-relaxed">
                {term.definition}
              </p>
              
              <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-primary">
                <p className="text-sm font-medium text-muted-foreground mb-1">Example:</p>
                <p className="text-sm text-foreground">{term.example}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 border-2">
          <CardContent className="p-8">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to Explore Stocks?</h3>
            <p className="text-muted-foreground mb-6">
              Now that you understand these key terms, start exploring real stock data with our interactive tool.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Start Exploring
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Glossary;