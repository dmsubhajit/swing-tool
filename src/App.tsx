
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { LineChart, Search, Calculator as CalcIcon, Activity, LayoutDashboard } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Screener from './pages/Screener';
import Backtester from './pages/Backtester';
import Calculator from './pages/Calculator';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-glass)' }}>
            <h2 className="gradient-text" style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Activity size={28} /> 
              SwingPro
            </h2>
            <p style={{ fontSize: '0.875rem', marginTop: '4px', color: 'var(--text-tertiary)' }}>Indian Markets Terminal</p>
          </div>
          
          <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavLink to="/dashboard" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={20} /> Overview
            </NavLink>
            <NavLink to="/screener" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <Search size={20} /> Screener
            </NavLink>
            <NavLink to="/backtester" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <LineChart size={20} /> Backtesting
            </NavLink>
            <NavLink to="/calculator" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>
              <CalcIcon size={20} /> Calculator
            </NavLink>
          </nav>

          <div style={{ padding: '1.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-glass)' }}>
             <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>© 2026 SwingPro Terminal. Connects to active Yahoo Finance feed via local node proxy.</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/screener" element={<Screener />} />
            <Route path="/backtester" element={<Backtester />} />
            <Route path="/calculator" element={<Calculator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
