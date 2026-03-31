import axios from 'axios';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export const fetchQuote = async (ticker: string) => {
  const res = await axios.get(`${API_BASE}/quote/${ticker}`);
  return res.data;
};

export const fetchHistorical = async (ticker: string, period1?: string, period2?: string) => {
  const params = new URLSearchParams();
  if (period1) params.append('period1', period1);
  if (period2) params.append('period2', period2);
  
  const res = await axios.get(`${API_BASE}/historical/${ticker}?${params.toString()}`);
  return res.data;
};

// Expanded list of liquid Indian stocks & Nifty 50 components
export const INDIAN_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Ind' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
  { symbol: 'INFY.NS', name: 'Infosys' },
  { symbol: 'TCS.NS', name: 'TCS' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance' },
  { symbol: 'TITAN.NS', name: 'Titan Company' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro' },
  { symbol: 'WIPRO.NS', name: 'Wipro' },
  { symbol: 'SBIN.NS', name: 'State Bank' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Bank' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki' },
  { symbol: 'HINDUNILVR.NS', name: 'HUL' },
  { symbol: 'ITC.NS', name: 'ITC' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
  { symbol: 'M&M.NS', name: 'M&M' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints' },
  { symbol: 'NTPC.NS', name: 'NTPC' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra' },
  { symbol: 'HCLTECH.NS', name: 'HCL Tech' }
];

export const STRATEGIES = [
  { 
    id: 'ema_crossover', 
    name: '1. EMA Crossover (9 & 21)', 
    action: 'BUY',
    rules: [
      '9 EMA crosses above 21 EMA',
      'Confirms short-term bullish momentum',
      'Strongest when combined with high volume'
    ]
  },
  { 
    id: 'rsi_pullback', 
    name: '2. RSI Pullback (40-60 Zone)', 
    action: 'BUY',
    rules: [
      'RSI drops into 40-50 support zone',
      'Price rebounds and RSI turns back above 50',
      'Captures oversold bounces in an uptrend'
    ]
  },
  { 
    id: 'volume_breakout', 
    name: '3. Breakout + Volume', 
    action: 'BUY',
    rules: [
      'Trading volume > 1.5x of 20-day average',
      'Price closes higher than open',
      'Indicates strong institutional buying interest'
    ]
  },
  { 
    id: 'bullish_engulfing', 
    name: '4. Bullish Engulfing + Support', 
    action: 'BUY',
    rules: [
      'Current green candle fully engulfs previous red candle',
      'Occurs after a downward price sequence',
      'High probability trend reversal signal'
    ]
  },
  { 
    id: 'ma_bounce', 
    name: '5. MA Bounce (50/200)', 
    action: 'BUY',
    rules: [
      'Primary uptrend confirmed (50 DMA > 200 DMA)',
      'Price pulls back to within 2-3% of 50 DMA support',
      'Low-risk entry point for trend continuation'
    ]
  }
];
