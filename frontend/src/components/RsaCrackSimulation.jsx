import React from "react"
import { PanelHeader } from './PanelHeader'

export function RsaCrackSimulation({ redTeamState, onRunSimulation }) {
  const { status, progress, logs, result } = redTeamState

  return (
    <div className="flex flex-col h-full bg-ops-surface">
      <PanelHeader label="QUANTUM ADVERSARY" sublabel="SHOR'S ALGORITHM SIMULATION" />
      
      <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
        
        <div className="grid grid-cols-2 gap-4 bg-ops-bg border border-ops-border p-3">
          <div className="flex flex-col gap-1 border-r border-ops-border pr-2">
            <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">TARGET ALGORITHM</span>
            <span className="font-mono text-[10px] text-ops-primary uppercase tracking-widest">RSA-2048</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">ATTACK METHOD</span>
            <span className="font-mono text-[10px] text-ops-redText uppercase tracking-widest">SHOR'S ALGORITHM</span>
          </div>
          <div className="flex flex-col gap-1 border-r border-ops-border pr-2 border-t pt-2">
            <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">COMPLEXITY</span>
            <span className="font-mono text-[10px] text-ops-amberText uppercase tracking-widest">O(log³ N) — POLYNOMIAL</span>
          </div>
          <div className="flex flex-col gap-1 border-t border-ops-border pt-2">
            <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">CURRENT STATUS</span>
            <span className={`font-mono text-[10px] uppercase tracking-widest ${
              status === 'idle' ? 'text-ops-dim' : 
              status === 'attacking' ? 'text-ops-amberText animate-pulse' : 
              'text-ops-redText'
            }`}>
              {status.toUpperCase()}
            </span>
          </div>
        </div>

        {status === 'idle' && (
          <button
            onClick={onRunSimulation}
            className="mt-4 w-full py-3 font-mono text-xs uppercase tracking-widest border border-ops-redText text-ops-redText bg-ops-redDim hover:bg-ops-red hover:text-white transition-colors"
          >
            INITIATE QUANTUM ATTACK SIMULATION
          </button>
        )}

        {status === 'attacking' && (
          <div className="flex flex-col gap-2 mt-4">
            <div className="w-full bg-ops-bg border border-ops-border h-2 overflow-hidden">
              <div 
                className="h-full bg-ops-red transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="font-mono text-[10px] text-ops-redText bg-ops-bg border border-ops-border p-2 max-h-32 overflow-y-auto flex flex-col gap-1 mt-2">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>
          </div>
        )}

        {status === 'breached' && result && (
          <div className="mt-4 flex flex-col gap-4">
            <div className="border border-ops-redText bg-ops-redDim text-ops-redText p-4 text-center flex flex-col gap-2">
              <span className="font-mono text-lg font-bold">⚠ RSA BREACHED</span>
              <span className="font-mono text-[10px] uppercase tracking-widest">
                2048-bit key factored in {result.time_ms}ms
              </span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">EXPOSED MESSAGE</span>
              <div className="font-mono text-sm text-ops-redText break-all border-l-2 border-ops-redText pl-2 py-1">
                {result.exposed_message}
              </div>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full py-2 font-mono text-[10px] uppercase tracking-widest border border-ops-border text-ops-secondary hover:text-ops-primary hover:border-ops-primary transition-colors"
            >
              [RESET SIMULATION]
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
