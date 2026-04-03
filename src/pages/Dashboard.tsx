import { useState, useEffect } from 'react';
import { Activity, Target, TrendingDown, ArrowRight, Filter, ArrowDownUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeMarketSignal, runGlobalScan } from '../utils/engine';
import { STRATEGIES } from '../services/api';
import type { ScanResult } from '../utils/engine';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [marketSignal, setMarketSignal] = useState({ trend: 'Loading...', rsi: '-', message: '' });
  const [globalMatches, setGlobalMatches] = useState<ScanResult[]>([]);
  const [scanning, setScanning] = useState(true);
  
  const [filterStrategy, setFilterStrategy] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('default');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sig = await analyzeMarketSignal();
        setMarketSignal(sig as any);

        const matches = await runGlobalScan();
        setGlobalMatches(matches);
      } catch (e) {
        console.error(e);
      } finally {
        setScanning(false);
      }
    };
    fetchData();
  }, []);

  const handleActionClick = (match: ScanResult) => {
    // We could pre-fill the calculator with these values using local routing state!
    navigate('/calculator', {
      state: {
        entry: match.entry,
        stopLoss: match.stopLoss,
        target: match.target,
      }
    });
  };

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* Top Header & Market Signal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>Welcome to SwingPro</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
            Your premium beginner-to-pro swing trading terminal. Get clear, mathematically derived entry and exit levels for every trade.
          </p>
        </div>

        <div className="card glass-panel" style={{ flex: '1 1 300px', maxWidth: '400px', borderTop: `4px solid ${marketSignal.trend.includes('Bull') ? 'var(--stat-up)' : marketSignal.trend.includes('Bear') ? 'var(--stat-down)' : 'var(--stat-neutral)'}` }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem', fontWeight: 600 }}>NIFTY 50 OVERVIEW</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-primary)' }}>{marketSignal.trend}</h2>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>RSI: {marketSignal.rsi}</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{marketSignal.message}</p>
        </div>
      </div>



      {/* Global Auto-Scanner Results */}
      <div className="card glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={20} className="text-accent-blue" />
            Live Global Matches & Action Plans
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.4rem 0.8rem', borderRadius: '8px', flex: 1 }}>
              <Filter size={16} color="var(--text-secondary)" />
              <select className="select" style={{ padding: '0.2rem 1.5rem 0.2rem 0.5rem', fontSize: '0.875rem', minWidth: '150px' }} value={filterStrategy} onChange={(e) => setFilterStrategy(e.target.value)}>
                <option value="ALL">All Strategies</option>
                {STRATEGIES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.4rem 0.8rem', borderRadius: '8px', flex: 1 }}>
              <ArrowDownUp size={16} color="var(--text-secondary)" />
              <select className="select" style={{ padding: '0.2rem 1.5rem 0.2rem 0.5rem', fontSize: '0.875rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Default</option>
                <option value="winProb">Highest Win Prob</option>
                <option value="riskReward">Best Risk:Reward</option>
              </select>
            </div>
          </div>
        </div>

        {scanning ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
            <Activity size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} className="animate-spin" />
            <p>Scanning the entire universe for actionable setups...</p>
          </div>
        ) : globalMatches.length > 0 ? (
          <div style={{ overflow: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Setup Pattern</th>
                  <th>Signal</th>
                  <th>Win Prob</th>
                  <th>Action Time</th>
                  <th>Buy Zone (LTP)</th>
                  <th>Stop Loss</th>
                  <th>Target</th>
                  <th>R:R</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {globalMatches
                  .filter(m => filterStrategy === 'ALL' || m.strategyId === filterStrategy)
                  .sort((a, b) => {
                     if (sortBy === 'winProb') return b.winProbability - a.winProbability;
                     if (sortBy === 'riskReward') return parseFloat(b.riskReward.split(':')[1]) - parseFloat(a.riskReward.split(':')[1]);
                     return 0;
                  })
                  .map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{r.stock.symbol.split('.')[0]}</td>
                    <td>
                      <div className="group" style={{ position: 'relative', cursor: 'help', display: 'inline-block' }}>
                        <span style={{ color: 'var(--accent-cyan)', display: 'block', borderBottom: '1px dashed var(--accent-cyan)' }}>{r.strategyName}</span>
                        <div className="tooltip" style={{
                          position: 'absolute',
                          top: '50%',
                          left: '100%',
                          transform: 'translateY(-50%)',
                          marginLeft: '1rem',
                          width: '280px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '1rem',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
                          zIndex: 99999,
                          display: 'none',
                          textAlign: 'left'
                        }}>
                          <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '0.95rem' }}>Rules</h4>
                          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', whiteSpace: 'normal' }}>
                            {STRATEGIES.find(s => s.name === r.strategyName || s.id === r.strategyId)?.rules?.map((rule, idx) => (
                              <li key={idx} style={{
                                padding: '0.5rem 0.75rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: '6px',
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem',
                                lineHeight: '1.4',
                                borderLeft: '2px solid var(--accent-cyan)',
                                zIndex: 200
                              }}>{rule}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>{r.notes}</span>
                    </td>
                    <td>
                      <span className={`badge ${STRATEGIES.find(s => s.name === r.strategyName || s.id === r.strategyId)?.action === 'BUY' ? 'badge-up' : 'badge-down'}`}>
                        {STRATEGIES.find(s => s.name === r.strategyName || s.id === r.strategyId)?.action || 'BUY'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-up" style={{ minWidth: '40px', textAlign: 'center' }}>
                        {r.winProbability}%
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{r.actionTime}</span>
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      <span style={{ color: 'var(--accent-cyan)' }}>₹{r.buyZone[0].toFixed(2)} - ₹{r.buyZone[1].toFixed(2)}</span>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>(LTP: ₹{r.price.toFixed(2)})</span>
                    </td>
                    <td style={{ color: 'var(--stat-down)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <TrendingDown size={14} /> ₹{r.stopLoss.toFixed(2)}
                    </td>
                    <td style={{ color: 'var(--stat-up)' }}>
                      <Target size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      ₹{r.target.toFixed(2)}
                    </td>
                    <td><span className="badge badge-up">{r.riskReward}</span></td>
                    <td>
                      <button onClick={() => handleActionClick(r)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '4px' }}>
                        Size Trade <ArrowRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
            <p>No active trade setups found today. Protect capital and wait for the right pitch!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
