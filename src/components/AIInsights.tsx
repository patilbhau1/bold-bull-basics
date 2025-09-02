import { useState, useEffect } from 'react';
import { Brain, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AIInsightsProps {
  stockSymbol: string;
  companyName?: string;
}

const AIInsights = ({ stockSymbol, companyName }: AIInsightsProps) => {
  const [insights, setInsights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const generateInsights = async () => {
    setLoading(true);
    setError('');

    try {
      // Using the Gemini API key provided by the user
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAAmKJ1mAG3XZZGsX8oXcSIX4AEhFAqN5A`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Please provide beginner-friendly insights about ${stockSymbol} ${companyName ? `(${companyName})` : ''} stock. Include:

1. Company's current status and recent performance
2. Major achievements or challenges 
3. Why this stock might be strong or risky for beginners
4. Simple explanation of what the company does
5. Any recent news or market trends affecting it

Keep the explanation simple and educational for someone new to investing. Limit to 200 words and use bullet points where appropriate.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate insights');
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        setInsights(data.candidates[0].content.parts[0].text);
      } else {
        throw new Error('No insights generated');
      }
    } catch (err) {
      console.error('Error generating insights:', err);
      setError('Unable to generate AI insights at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (stockSymbol) {
      generateInsights();
    }
  }, [stockSymbol, companyName]);

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="border-2 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-primary rounded-lg">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            AI-Powered Insights
            <Badge variant="secondary" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by Gemini
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="animate-pulse-soft">
                  <Brain className="h-6 w-6" />
                </div>
                <span className="text-lg">Analyzing {stockSymbol}...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span className="text-warning-foreground">{error}</span>
            </div>
          )}

          {insights && !loading && (
            <div className="prose prose-lg max-w-none">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {insights}
                </div>
                
                <div className="mt-6 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-4 w-4" />
                    <span>This analysis is for educational purposes and should not be considered financial advice.</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;