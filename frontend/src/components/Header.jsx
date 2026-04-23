import React from "react"
import { useClock } from '../hooks/useClock'

export function Header({ connected, currentView, onViewChange }) {
  const time = useClock()
  const viewLabel = { red: 'FIELD UNIT — RED TEAM', blue: 'COMMAND CENTER — BLUE TEAM', both: 'COMBINED DEMO VIEW' }

  return (
    <div className="border-b border-ops-border">
      <div className="flex items-center justify-between px-4 py-2 bg-ops-surface">
        <div>
          <div className="font-mono font-bold text-ops-primary text-base tracking-wider">QUANTUM-SHIELD</div>
          <div className="font-mono text-ops-secondary text-[10px] tracking-widest uppercase">Tactical Defense System</div>
        </div>

        <div className="flex items-center gap-6">
          <span className="font-mono text-ops-secondary text-[10px] uppercase tracking-widest">
            {viewLabel[currentView] || 'SELECT VIEW'}
          </span>

          <div className="flex gap-1">
            {['red', 'blue', 'both'].map(v => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border transition-colors
                  ${currentView === v
                    ? 'border-ops-blueText text-ops-blueText bg-ops-blueDim'
                    : 'border-ops-border text-ops-secondary hover:border-ops-primary hover:text-ops-primary'
                  }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-ops-online' : 'bg-ops-offline'}`} />
            <span className={`font-mono text-[10px] uppercase tracking-widest ${connected ? 'text-ops-greenText' : 'text-ops-redText'}`}>
              {connected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </div>

          <div className="flex gap-2">
            {['ML-KEM-768', 'AES-128-GCM'].map(label => (
              <span key={label} className="font-mono text-[10px] text-ops-secondary bg-ops-elevated border border-ops-border px-2 py-0.5">
                {label}
              </span>
            ))}
          </div>

          <span className="font-mono text-sm text-ops-primary tabular-nums">{time}</span>
        </div>
      </div>
      <div className="bg-ops-amberDim border-b border-ops-amber px-4 py-0.5 text-center font-mono text-[10px] tracking-widest text-ops-amberText uppercase">
        Unclassified // For Official Use Only // Hackathon Prototype // Not For Operational Use
      </div>
    </div>
  )
}
