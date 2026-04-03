import express from 'express';
import cors from 'cors';
import YahooFinance from 'yahoo-finance2';
import { getDbInstance } from './db.js';

const yahooFinance = new YahooFinance();
const app = express();
const PORT = process.env.PORT || 3001;

let db;
(async () => {
  try {
    db = await getDbInstance();
    console.log('Big backend SQLite database initialized successfully');
  } catch (err) {
    console.error('Failed to initialize database:', err);
  }
})();

app.use(cors());
app.use(express.json());

// Main proxy endpoint
app.get('/api/historical/:symbol', async (req, res) => {
  try {
    const period1 = req.query.period1 || '2023-01-01';
    
    // Upgraded from historical() to chart() as per Yahoo Finance v2 API specs
    const result = await yahooFinance.chart(req.params.symbol, {
      period1,
      interval: '1d',
    });
    
    // chart() returns { meta, quotes }, map to just an array for the frontend
    const quotes = result.quotes.filter(q => q.close !== null && q.close !== undefined);
    res.json(quotes || []);
  } catch (error) {
    console.error(`Error fetching ${req.params.symbol}:`, error.message);
    res.status(500).json({ error: error.message });
  }
});

// Save scan tracking
app.post('/api/scans', async (req, res) => {
  try {
    const { results } = req.body;
    if (!db || !results || !Array.isArray(results)) return res.status(400).json({ error: 'Invalid data' });

    const stmt = await db.prepare('INSERT INTO scan_history (symbol, strategy_id, price, win_probability, action_time) VALUES (?, ?, ?, ?, ?)');
    for (const r of results) {
      await stmt.run(r.stock?.symbol || r.symbol, r.strategyId, r.price, r.winProbability, r.actionTime);
    }
    await stmt.finalize();
    res.json({ message: `Logged ${results.length} scan hits to big backend DB.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running safely on port ${PORT}`);
});
