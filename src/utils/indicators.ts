export interface OHLCV {
  date: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export function calculateEMA(data: number[], period: number): number[] {
  if (data.length === 0) return [];
  const k = 2 / (period + 1);
  const emaData: number[] = new Array(data.length).fill(null);
  
  // Use SMA for the initial value
  if (data.length < period) return emaData;
  let sum = 0;
  for (let i = 0; i < period; i++) sum += data[i];
  let ema = sum / period;
  
  emaData[period - 1] = ema;
  
  for (let i = period; i < data.length; i++) {
    ema = (data[i] * k) + (ema * (1 - k));
    emaData[i] = ema;
  }
  return emaData;
}

export function calculateRSI(data: number[], period: number = 14): number[] {
  const rsi: number[] = new Array(data.length).fill(null);
  if (data.length <= period) return rsi;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  let rs = avgGain / avgLoss;
  rsi[period] = avgLoss === 0 ? 100 : 100 - (100 / (1 + rs));

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;

    avgGain = ((avgGain * (period - 1)) + gain) / period;
    avgLoss = ((avgLoss * (period - 1)) + loss) / period;
    
    if (avgLoss === 0) {
      rsi[i] = 100;
    } else {
      rs = avgGain / avgLoss;
      rsi[i] = 100 - (100 / (1 + rs));
    }
  }

  return rsi;
}

export function calculateSMA(data: number[], period: number): number[] {
  const sma = new Array(data.length).fill(null);
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
    sma[i] = sum / period;
  }
  return sma;
}

export function isBullishEngulfing(candles: OHLCV[]): boolean {
  if (candles.length < 2) return false;
  const curr = candles[candles.length - 1];
  const prev = candles[candles.length - 2];

  const prevIsRed = prev.close < prev.open;
  const currIsGreen = curr.close > curr.open;
  
  const bodyEngulfs = curr.open <= prev.close && curr.close >= prev.open;
  return prevIsRed && currIsGreen && bodyEngulfs;
}
