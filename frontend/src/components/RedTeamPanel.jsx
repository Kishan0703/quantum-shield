import React, { useState, useEffect } from 'react';

function RedTeamPanel({ state, onAction }) {
  const [hex, setHex] = useState('');

  useEffect(() => {
    if (state === 'attacking') {
      const interval = setInterval(() => {
        setHex(Math.random().toString(16).slice(2, 18).toUpperCase());
      }, 50);
      return () => clearInterval(interval);
    }
  }, [state]);

  return (
    <div className={`bg-panel border-2 rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-500 ${state === 'breached' ? 'border-red-team shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-border'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-red-team">RED TEAM</h2>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">Quantum Adversary Simulation</p>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${state === 'breached' ? 'bg-red-team text-white animate-pulse' : 'bg-panel-light text-text-muted'}`}>
          {state.toUpperCase()}
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center min-h-[120px]">
        {state === 'idle' && (
          <div className="text-center py-4">
            <p className="text-sm text-text-muted italic">Ready to simulate RSA-2048 breach via Shor's Algorithm.</p>
          </div>
        )}

        {state === 'attacking' && (
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-red-team/80 mb-2 font-mono">EXECUTING SHOR'S ALGORITHM...</span>
              <div className="font-mono text-2xl text-red-team break-all tracking-widest">
                {hex}
              </div>
            </div>
            <div className="w-full bg-panel-light h-1 rounded-full overflow-hidden">
              <div className="bg-red-team h-full animate-[progress_3s_linear]"></div>
            </div>
          </div>
        )}

        {state === 'breached' && (
          <div className="text-center space-y-2 animate-bounce">
            <div className="text-4xl font-black text-red-team tracking-tighter">⚠ RSA BREACHED</div>
            <p className="text-xs text-red-team uppercase font-bold">Quantum Speedup Detected: Factoring Complete</p>
          </div>
        )}
      </div>

      <button 
        onClick={onAction}
        disabled={state === 'attacking'}
        className={`w-full py-3 rounded font-bold transition-all ${state === 'attacking' ? 'bg-panel-light text-text-muted cursor-not-allowed' : 'bg-red-team hover:bg-red-600 text-white shadow-lg shadow-red-team/20'}`}
      >
        {state === 'idle' ? 'RUN RSA ATTACK SIMULATION' : 'RESET SIMULATION'}
      </button>

      {state === 'attacking' && (
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}} />
      )}
    </div>
  );
}

export default RedTeamPanel;
