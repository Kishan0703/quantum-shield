import React from "react"
import { PanelHeader } from './PanelHeader'

export function ShieldStatus({ blueTeamState, onRunProbe }) {
  const { status, logs, result } = blueTeamState

  return (
    <div className="flex flex-col h-full bg-ops-surface border-r border-ops-border">
      <PanelHeader label="QUANTUM-SHIELD" sublabel="DEFENSE TELEMETRY" />
      
      <div className="p-4 flex flex-col gap-6 overflow-y-auto h-full">
        
        {/* Section 1 - Shield Status */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">SHIELD STATUS</span>
            <div className="flex items-center gap-2 border border-ops-greenText bg-ops-greenDim px-2 py-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-ops-greenText animate-pulse" />
              <span className="font-mono text-[10px] text-ops-greenText uppercase tracking-widest">ACTIVE</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">ALGORITHM</span>
              <span className="font-mono text-[10px] text-ops-primary uppercase tracking-widest">ML-KEM-768</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">STANDARD</span>
              <span className="font-mono text-[10px] text-ops-primary uppercase tracking-widest">NIST FIPS 203</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">SECURITY LEVEL</span>
              <span className="font-mono text-[10px] text-ops-greenText uppercase tracking-widest">NIST LEVEL 3</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">PQ SECURITY</span>
              <span className="font-mono text-[10px] text-ops-greenText uppercase tracking-widest">RESISTANT (SVP)</span>
            </div>
          </div>
        </div>

        <hr className="border-ops-border" />

        {/* Section 2 - Key Material */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">KEY MATERIAL SIZES</span>
          </div>
          
          <div className="grid grid-cols-2 gap-y-3 gap-x-4">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">PUBLIC KEY</span>
              <span className="font-mono text-[10px] text-ops-blueText uppercase tracking-widest">1184 BYTES</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">SECRET KEY</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-ops-amberText uppercase tracking-widest">2400 BYTES</span>
                <span className="font-mono text-[8px] text-ops-dim uppercase tracking-widest">[MEMORY ONLY]</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">CIPHERTEXT</span>
              <span className="font-mono text-[10px] text-ops-primary uppercase tracking-widest">1088 BYTES</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">SHARED SECRET</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-ops-primary uppercase tracking-widest">32 BYTES</span>
                <span className="font-mono text-[8px] text-ops-dim uppercase tracking-widest">[EPHEMERAL]</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-ops-border" />

        {/* Section 3 - Lattice Attack Probe */}
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">THREAT SIMULATION</span>
          </div>

          {status === 'idle' && (
            <button
              onClick={onRunProbe}
              className="w-full py-3 font-mono text-[10px] uppercase tracking-widest border border-ops-blueText text-ops-blueText bg-ops-blueDim hover:bg-ops-blue hover:text-white transition-colors"
            >
              RUN LATTICE ATTACK PROBE
            </button>
          )}

          {status === 'probing' && (
            <div className="font-mono text-[10px] text-ops-greenText bg-ops-bg border border-ops-border p-2 flex flex-col gap-1">
              {logs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              <div className="animate-pulse mt-1">_</div>
            </div>
          )}

          {status === 'blocked' && result && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="border border-ops-greenText bg-ops-greenDim text-ops-greenText p-4 text-center flex flex-col gap-2">
                <span className="font-mono text-lg font-bold">✓ LATTICE SHIELD HELD</span>
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  {result.reason}
                </span>
              </div>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 font-mono text-[10px] uppercase tracking-widest border border-ops-border text-ops-secondary hover:text-ops-primary hover:border-ops-primary transition-colors"
              >
                [RESET PROBE]
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
