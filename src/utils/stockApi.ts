const ALPHA_VANTAGE_API_KEY = 'X286HZVEKOWB4OO1';

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  previousClose: number;
}

export interface CompanyOverview {
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  week52High: number;
  week52Low: number;
}

export interface TimeSeriesData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export const fetchStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch stock quote');
    }
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note'] || !data['Global Quote']) {
      throw new Error('Invalid symbol or API limit reached');
    }
    
    const quote = data['Global Quote'];
    
    return {
      symbol: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      previousClose: parseFloat(quote['08. previous close'])
    };
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
};

export const fetchCompanyOverview = async (symbol: string): Promise<CompanyOverview> => {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch company overview');
    }
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note'] || !data['Name']) {
      throw new Error('Company overview not available');
    }
    
    return {
      name: data['Name'],
      description: data['Description'],
      sector: data['Sector'],
      industry: data['Industry'],
      marketCap: parseInt(data['MarketCapitalization']) || 0,
      peRatio: parseFloat(data['PERatio']) || 0,
      dividendYield: parseFloat(data['DividendYield']) || 0,
      week52High: parseFloat(data['52WeekHigh']) || 0,
      week52Low: parseFloat(data['52WeekLow']) || 0
    };
  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw error;
  }
};

export const fetchTimeSeriesData = async (symbol: string, timeframe: string = '1M'): Promise<TimeSeriesData[]> => {
  try {
    // For simplicity, we'll use daily data for all timeframes
    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch time series data');
    }
    
    const data = await response.json();
    
    if (data['Error Message'] || data['Note'] || !data['Time Series (Daily)']) {
      throw new Error('Time series data not available');
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Limit data based on timeframe
    let limitDays = 30; // 1M
    if (timeframe === '3M') limitDays = 90;
    else if (timeframe === '1Y') limitDays = 252;
    else if (timeframe === '5Y') limitDays = 1260;
    
    const limitedDates = dates.slice(0, limitDays);
    
    return limitedDates.map(date => ({
      date,
      open: parseFloat(timeSeries[date]['1. open']),
      high: parseFloat(timeSeries[date]['2. high']),
      low: parseFloat(timeSeries[date]['3. low']),
      close: parseFloat(timeSeries[date]['4. close']),
      volume: parseInt(timeSeries[date]['5. volume'])
    })).reverse(); // Reverse to get chronological order
  } catch (error) {
    console.error('Error fetching time series data:', error);
    throw error;
  }
};