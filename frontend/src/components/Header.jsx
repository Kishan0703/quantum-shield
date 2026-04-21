import React, { useState, useEffect } from 'react';

function Header({ connected }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-panel border border-border p-4 flex justify-between items-center rounded-lg shadow-xl">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tighter text-blue-team">QUANTUM-SHIELD</h1>
        <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${connected ? 'bg-green-ok/20 text-green-ok' : 'bg-red-team/20 text-red-team'}`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${connected ? 'bg-green-ok' : 'bg-red-team'}`}></div>
          {connected ? 'CONNECTED' : 'OFFLINE'}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] text-text-muted uppercase tracking-widest">Active Algorithm</span>
          <div className="flex gap-2 mt-1">
            <span className="bg-panel-light text-[10px] px-2 py-0.5 rounded border border-border">ML-KEM-768</span>
            <span className="bg-panel-light text-[10px] px-2 py-0.5 rounded border border-border">AES-128-GCM</span>
          </div>
        </div>
        
        <div className="text-xl font-mono text-text-muted">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </header>
  );
}

export default Header;
