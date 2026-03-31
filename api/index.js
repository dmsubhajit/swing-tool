import express from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// List of some sample Indian stocks to preload or test (reliance, hdfc, tcs, etc.)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get latest quote
app.get('/api/quote/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    // Yahoo format for Indian stocks is typically TICKER.NS for NSE
    // Add .NS if not provided and it doesn't contain a dot
    const symbol = ticker.includes('.') ? ticker : `${ticker}.NS`;
    const quote = await yahooFinance.quote(symbol);
    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get historical data
app.get('/api/historical/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params;
    const { period1, period2, interval } = req.query;
    
    const symbol = ticker.includes('.') ? ticker : `${ticker}.NS`;
    
    // Default period1: 3 years ago if not provided
    const threeYearsAgo = new Date();
    threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);
    
    const queryOptions = {
      period1: period1 || threeYearsAgo.toISOString().split('T')[0],
      period2: period2 || new Date().toISOString().split('T')[0],
      interval: interval || '1d',
    };
    
    const result = await yahooFinance.historical(symbol, queryOptions);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running safely on port ${PORT}`);
});

export default app;
