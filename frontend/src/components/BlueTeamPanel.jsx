import React from 'react';
import LatticeViz from './LatticeViz';

function BlueTeamPanel({ state, onAction }) {
  return (
    <div className={`bg-panel border-2 rounded-lg p-6 flex flex-col gap-4 relative overflow-hidden transition-all duration-500 ${state === 'blocked' ? 'border-green-ok shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'border-border'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-blue-team">BLUE TEAM</h2>
          <p className="text-xs text-text-muted mt-1 uppercase tracking-widest">Quantum-Shield Defense</p>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${state === 'blocked' ? 'bg-green-ok text-white' : 'bg-panel-light text-text-muted'}`}>
          {state.toUpperCase()}
        </div>
      </div>

      <div className="flex-grow flex flex-col justify-center min-h-[120px]">
        {state === 'idle' && (
          <div className="text-center py-2">
            <LatticeViz active={false} />
            <p className="text-xs text-text-muted mt-2">ML-KEM-768 Active. Monitoring for lattice probes.</p>
          </div>
        )}

        {state === 'probing' && (
          <div className="text-center py-2">
            <LatticeViz active={true} />
            <p className="text-xs text-blue-team animate-pulse mt-2 uppercase font-bold tracking-widest">Lattice Attack Probe Detected...</p>
          </div>
        )}

        {state === 'blocked' && (
          <div className="text-center space-y-2">
            <div className="text-4xl font-black text-green-ok tracking-tighter">✓ SHIELD HELD</div>
            <p className="text-xs text-green-ok uppercase font-bold">Hardness: SVP Exponential Difficulty</p>
            <p className="text-[10px] text-text-muted">Quantum Speedup: NONE (Lattice Hardness)</p>
          </div>
        )}
      </div>

      <button 
        onClick={onAction}
        disabled={state === 'probing'}
        className={`w-full py-3 rounded font-bold transition-all ${state === 'probing' ? 'bg-panel-light text-text-muted cursor-not-allowed' : 'bg-blue-team hover:bg-blue-600 text-white shadow-lg shadow-blue-team/20'}`}
      >
        {state === 'idle' ? 'ACTIVATE LATTICE PROBE' : 'RESET SHIELD'}
      </button>
    </div>
  );
}

export default BlueTeamPanel;
