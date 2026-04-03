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

// Exact Nifty 50 Components
export const INDIAN_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
  { symbol: 'SBIN.NS', name: 'State Bank of India' },
  { symbol: 'INFY.NS', name: 'Infosys' },
  { symbol: 'ITC.NS', name: 'ITC' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Bank' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints' },
  { symbol: 'WIPRO.NS', name: 'Wipro' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid' },
  { symbol: 'NTPC.NS', name: 'NTPC' },
  { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv' },
  { symbol: 'ONGC.NS', name: 'ONGC' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel' },
  { symbol: 'COALINDIA.NS', name: 'Coal India' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports' },
  { symbol: 'HDFCLIFE.NS', name: 'HDFC Life' },
  { symbol: 'SBILIFE.NS', name: 'SBI Life' },
  { symbol: 'GRASIM.NS', name: 'Grasim' },
  { symbol: 'TITAN.NS', name: 'Titan Company' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra' },
  { symbol: 'BRITANNIA.NS', name: 'Britannia' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India' },
  { symbol: 'EICHERMOT.NS', name: 'Eicher Motors' },
  { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank' },
  { symbol: 'CIPLA.NS', name: 'Cipla' },
  { symbol: 'DRREDDY.NS', name: 'Dr. Reddy Labs' },
  { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals' },
  { symbol: 'TRENT.NS', name: 'Trent' },
  { symbol: 'BEL.NS', name: 'Bharat Electronics' },
  { symbol: 'SHRIRAMFIN.NS', name: 'Shriram Finance' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco' },
  { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto' },
  { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp' },
  { symbol: 'TATACONSUM.NS', name: 'Tata Consumer' },
  { symbol: 'BPCL.NS', name: 'BPCL' }
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
  },
  { 
    id: 'ema_death_cross', 
    name: '6. EMA Death Cross', 
    action: 'SELL',
    rules: [
      '9 EMA crosses below 21 EMA',
      'Confirms short-term bearish momentum',
      'Strongest when combined with high selling volume'
    ]
  },
  { 
    id: 'bearish_engulfing', 
    name: '7. Bearish Engulfing', 
    action: 'SELL',
    rules: [
      'Current red candle fully engulfs previous green candle',
      'Occurs after an upward price sequence',
      'High probability trend reversal to the downside'
    ]
  },
  { 
    id: 'support_breakdown', 
    name: '8. Support Breakdown (50 DMA)', 
    action: 'SELL',
    rules: [
      'Price breaks and closes below the 50-day moving average',
      'Volume is higher than average',
      'Indicates a major shift from bullish to bearish sentiment'
    ]
  }
];
