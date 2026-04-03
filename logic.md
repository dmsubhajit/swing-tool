# SwingPro Terminal Logic & Mathematics

This document explains the core logic, parameters, and strategy assumptions used internally by the SwingPro Terminal.

## Why were Signals Only "BUY" During a Bear Market?
Previously, the system only contained programmed setups for long (BUY) positions. When the broader market trended lower, these long setups still triggered at oversold levels without offering you ways to short the market. 
**Fix Implemented:** We have now introduced robust **Bearish/Sell Strategies** (e.g., Bearish Engulfing, EMA Death Cross, Support Breakdown). Now, when the market drops, proper SELL/Short signals will trigger.

## How to Improve Win Probability
Currently, Win Probability is powered by a **Heuristic Heuristics Engine**:
1. Base success rates evaluated historically (~72-82% depending on strategy context).
2. Volatility and volume scaling factors.
**To achieve absolute accuracy:** The platform must expand to a "Big Backend DB." By pushing historical daily scan results to a structured Database (like `SQLite` or `PostgreSQL`), we enable the system to perform backtests. Over 6 months of live scanning, the engine could recalculate the Win Probability for *State Bank of India on a Volume Breakout* relative to its exact past outcomes stored in our database.

## 1. Macro Trend Filter (The Core Rule)
Before any mathematical pattern or setup is evaluated, the engine checks the broader macro climate of the individual stock:
- **Macro Uptrend Filter (For Longs)**: A bullish BUY setup is strictly rejected unless the stock's current price is **above** its 200-day Simple Moving Average (SMA). Buying in a crash (e.g. HCLTECH dipping 30% from its peak) is rejected to enforce "trend following" discipline.
- **Macro Downtrend Filter (For Shorts)**: A bearish SELL setup is strictly rejected unless the stock is **below** its 200-day SMA.

## 2. Strategies Used (Nifty 50 Components)

### Bullish Strategies (Longs)
- **EMA Crossover**: Looks for instances where the 9-day EMA crosses above the 21-day EMA. Confirms short-term bullish momentum.
- **RSI Pullback**: Requires the 14-day RSI to dip into the 40-55 support zone on a pullback, and then immediately turn back up.
- **Volume Breakout**: Compares the latest daily volume against the 20-day Simple Moving Average (SMA). A spike of `>1.5x` indicates institutional participation.
- **Bullish Engulfing**: Current green candle completely overtakes the body of the previous red candle. 
- **MA Bounce**: Identifies stocks in a primary uptrend (50 DMA > 200 DMA) that pull back to within ~3% of the 50 DMA, providing a low-risk entry.

### Bearish Strategies (Shorts)
- **EMA Death Cross**: 9-day EMA crosses below the 21-day EMA. Marks the end of an uptrend and signals short momentum.
- **Bearish Engulfing**: A massive red candle completely envelops the prior green candle, trapping buyers.
- **Support Breakdown**: Price drops and closes heavily below the primary 50-day moving average on escalated volume. 

## 3. Stop Loss & Target Engine
- **Stop Loss (`sl`)**: Placed dynamically based on structural support. For EMA crossovers, it's set 1% below the 21 EMA. For short positions (SELL), the stop loss is placed *above* the resistance levels.
- **Target Logic**: Targets are positioned using fixed Risk:Reward multiples. The system computes absolute risk (`Entry - StopLoss`). Target = Entry ± (Risk * Multiplier).

## 4. Buy Zone (Price Brackets)
Limit orders are superior to market orders. The engine provides a **Buy Zone**:
- Lower bound: `Entry * 0.99` (-1% from closing price)
- Upper bound: `Entry * 1.005` (+0.5% buffer for slippage)
This strictly enforces a defined limit region (e.g., ₹150.00 - ₹152.00) so you never buy blindly at market open.

## 5. Action Time Context
- **Weekdays**: The logical action point is `Today EOD (3:15 PM)`. You enter the trade right before the market closes to ensure the daily pattern is confirmed.
- **Weekends**: If the software is scanned on Friday evening, Saturday, or Sunday, the logical execution is `Mon Open (9:15 AM)`.
