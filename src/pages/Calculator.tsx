import { useState, useEffect } from 'react';
import { Calculator as CalcIcon, DollarSign, Target, ShieldAlert, Percent } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Calculator = () => {
  const location = useLocation();
  const state = location.state as { entry?: number, stopLoss?: number, target?: number } | null;

  const [capital, setCapital] = useState(100000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entry, setEntry] = useState(state?.entry || 1000);
  const [stopLoss, setStopLoss] = useState(state?.stopLoss || 950);
  const [target, setTarget] = useState(state?.target || 1100);

  useEffect(() => {
    if (state?.entry) setEntry(state.entry);
    if (state?.stopLoss) setStopLoss(state.stopLoss);
    if (state?.target) setTarget(state.target);
  }, [state]);

  // Calculations
  const riskAmount = capital * (riskPercent / 100);
  const riskPerShare = entry - stopLoss;
  const positionSize = riskPerShare > 0 ? Math.floor( riskAmount / riskPerShare ) : 0;
  
  const totalPositionValue = positionSize * entry;
  const targetProfit = positionSize * (target - entry);
  const riskReward = riskPerShare > 0 ? ((target - entry) / riskPerShare).toFixed(1) : '0';

  return (
    <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Trade Calculator</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Calculate exact position sizing and risk parameters for your swing trades.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Input Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalcIcon size={20} className="text-accent-blue" /> Trade Details
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Trading Capital (₹)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input type="number" className="input" style={{ paddingLeft: '2.5rem' }} value={capital} onChange={e => setCapital(Number(e.target.value))} />
              </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Risk per Trade (%)</label>
              <div style={{ position: 'relative' }}>
                <Percent size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input type="number" step="0.1" className="input" style={{ paddingLeft: '2.5rem' }} value={riskPercent} onChange={e => setRiskPercent(Number(e.target.value))} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Entry Price (₹)</label>
                  <input type="number" className="input" value={entry} onChange={e => setEntry(Number(e.target.value))} />
               </div>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Stop Loss (₹)</label>
                  <input type="number" className="input" value={stopLoss} onChange={e => setStopLoss(Number(e.target.value))} />
               </div>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Target Price (₹)</label>
              <div style={{ position: 'relative' }}>
                <Target size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                <input type="number" className="input" style={{ paddingLeft: '2.5rem' }} value={target} onChange={e => setTarget(Number(e.target.value))} />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="card glass-panel" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(0, 240, 255, 0.05))', borderColor: 'rgba(0, 240, 255, 0.2)' }}>
            <p style={{ color: 'var(--accent-cyan)', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ideal Position Size</p>
            <div className="metric-value" style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{positionSize} <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>shares</span></div>
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Total Position Value: <strong style={{ color: 'var(--text-primary)' }}>₹{totalPositionValue.toLocaleString()}</strong></p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="card">
              <ShieldAlert size={20} style={{ color: 'var(--stat-down)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Max Risk</p>
              <div className="metric-value">₹{riskAmount.toLocaleString()}</div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>If SL hit at ₹{stopLoss}</p>
            </div>
            
            <div className="card">
              <Target size={20} style={{ color: 'var(--stat-up)', marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Expected Profit</p>
              <div className="metric-value">₹{targetProfit.toLocaleString()}</div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem', marginTop: '0.25rem' }}>If Target hit at ₹{target}</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Risk : Reward Ratio</p>
              <div className="metric-value" style={{ fontSize: '1.5rem' }}>1 : {riskReward}</div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              {Number(riskReward) >= 2 ? (
                <span className="badge badge-up" style={{ padding: '0.5rem 1rem' }}>Favorable Setup</span>
              ) : (
                <span className="badge badge-down" style={{ padding: '0.5rem 1rem' }}>Poor Setup</span>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Calculator;
