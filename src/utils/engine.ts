import { fetchHistorical, INDIAN_STOCKS } from '../services/api';
import { calculateEMA, calculateRSI, calculateSMA, isBullishEngulfing } from './indicators';

export interface ScanResult {
  stock: any;
  strategyId: string;
  strategyName: string;
  price: number;
  volume: number;
  notes: string;
  entry: number;
  stopLoss: number;
  target: number;
  riskReward: string;
}

export const analyzeMarketSignal = async () => {
  try {
    const data = await fetchHistorical('NIFTYBEES.NS');
    if (!data || data.length < 50) return { trend: 'Neutral', rsi: 50, message: 'Insufficient data' };
    
    const closes = data.map((d: any) => d.close);
    const rsi = calculateRSI(closes, 14);
    const ema20 = calculateEMA(closes, 20);
    const ema50 = calculateEMA(closes, 50);
    
    const currClose = closes[closes.length - 1];
    const currRsi = rsi[rsi.length - 1];
    const currEma20 = ema20[ema20.length - 1];
    const currEma50 = ema50[ema50.length - 1];
    
    let trend = 'Neutral';
    let message = 'Market in consolidation.';
    
    if (currClose > currEma20 && currEma20 > currEma50) {
       trend = 'Bullish';
       message = 'Strong upward momentum. Buy on dips.';
    } else if (currClose < currEma20 && currEma20 < currEma50) {
       trend = 'Bearish';
       message = 'Downward momentum. Protect capital.';
    } else if (currClose > currEma50) {
       trend = 'Mildly Bullish';
       message = 'Above 50 DMA, holding support.';
    }
    
    return { trend, rsi: currRsi.toFixed(1), message };
  } catch (e) {
    return { trend: 'Unknown', rsi: 0, message: 'Could not fetch market data' };
  }
};

export const runGlobalScan = async (): Promise<ScanResult[]> => {
  const matches: ScanResult[] = [];
  
  const batchSize = 5;
  for (let i = 0; i < INDIAN_STOCKS.length; i += batchSize) {
    const batch = INDIAN_STOCKS.slice(i, i + batchSize);
    await Promise.all(batch.map(async (stock) => {
      try {
        const data = await fetchHistorical(stock.symbol);
        if (!data || data.length < 50) return;
        
        const closes = data.map((d: any) => d.close);
        const opens = data.map((d: any) => d.open);
        const lows = data.map((d: any) => d.low);
        const volumes = data.map((d: any) => d.volume);
        
        const currentClose = closes[closes.length - 1];
        const currentVol = volumes[volumes.length - 1];
        
        const ema9 = calculateEMA(closes, 9);
        const ema21 = calculateEMA(closes, 21);
        const rsi = calculateRSI(closes, 14);
        const volSma20 = calculateSMA(volumes, 20);
        const sma50 = calculateSMA(closes, 50);
        const sma200 = calculateSMA(closes, 200);

        const currEma9 = ema9[ema9.length - 1];
        const currEma21 = ema21[ema21.length - 1];
        const prevEma9 = ema9[ema9.length - 2];
        const prevEma21 = ema21[ema21.length - 2];
        
        // Helper to format result with SL/Target
        const addMatch = (id: string, name: string, notes: string, sl: number, riskMultiplier: number = 2) => {
          const entry = currentClose;
          const risk = entry - sl;
          if (risk <= 0) return; // Prevent bad math
          
          const target = entry + (risk * riskMultiplier);
          matches.push({
            stock, strategyId: id, strategyName: name, 
            price: currentClose, volume: currentVol, notes,
            entry, stopLoss: sl, target, riskReward: `1:${riskMultiplier}`
          });
        };

        // 1. EMA Crossover
        if (currEma9 > currEma21 && prevEma9 <= prevEma21) {
          addMatch('ema_crossover', 'EMA Crossover', 'Golden Cross today', currEma21 * 0.99, 2);
        } else if (currEma9 > currEma21 && ema9[ema9.length - 3] <= ema21[ema21.length - 3]) {
          addMatch('ema_crossover', 'EMA Crossover', 'Recent crossover', currEma21 * 0.99, 2);
        }

        // 2. RSI Pullback
        const currRsi = rsi[rsi.length - 1];
        const prevRsi = rsi[rsi.length - 2];
        if (currRsi > prevRsi && prevRsi < 55 && currRsi > 40 && currRsi < 65) {
          addMatch('rsi_pullback', 'RSI Pullback', `Bounced to ${currRsi.toFixed(1)}`, lows[lows.length - 1] * 0.98, 2.5);
        }

        // 3. Volume Breakout
        const avgVol = volSma20[volSma20.length - 1];
        if (currentVol > avgVol * 1.5 && currentClose > opens[opens.length - 1]) {
           addMatch('volume_breakout', 'Volume Breakout', `Vol: ${(currentVol/avgVol).toFixed(1)}x avg`, lows[lows.length - 1] * 0.99, 3);
        }

        // 4. Bullish Engulfing
        if (isBullishEngulfing(data.slice(-2))) {
           const lowestLow = Math.min(lows[lows.length - 1], lows[lows.length - 2]);
           addMatch('bullish_engulfing', 'Bullish Engulfing', 'Pattern Spotted', lowestLow * 0.99, 2.5);
        }

        // 5. MA Bounce
        const curr50 = sma50[sma50.length - 1];
        const curr200 = sma200[sma200.length - 1];
        if (curr50 > curr200 && Math.abs(currentClose - curr50)/curr50 < 0.03) {
           addMatch('ma_bounce', 'MA Bounce', 'Near 50 DMA', curr50 * 0.98, 3);
        }

      } catch (e) {
        // Ignored
      }
    }));
  }
  
  return matches;
};
