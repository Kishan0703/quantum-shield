import React from "react"
export function Landing({ onSelect }) {
  return (
    <div className="bg-ops-bg min-h-screen flex items-center justify-center">
      <div className="max-w-2xl w-full flex flex-col items-center gap-8">
        
        <div className="flex flex-col items-center gap-2">
          <div className="font-mono font-bold text-ops-primary text-3xl tracking-widest">QUANTUM-SHIELD</div>
          <div className="font-mono text-ops-secondary text-sm tracking-widest uppercase">Tactical Defense System Initialisation</div>
        </div>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => onSelect('red')}
            className="flex-1 py-4 border border-ops-red border-opacity-50 text-ops-redText bg-ops-redDim hover:bg-ops-red hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors"
          >
            FIELD UNIT — RED TEAM
          </button>
          <button
            onClick={() => onSelect('blue')}
            className="flex-1 py-4 border border-ops-blue border-opacity-50 text-ops-blueText bg-ops-blueDim hover:bg-ops-blue hover:text-white font-mono text-[10px] uppercase tracking-widest transition-colors"
          >
            COMMAND CENTER — BLUE TEAM
          </button>
          <button
            onClick={() => onSelect('both')}
            className="flex-1 py-4 border border-ops-primary border-opacity-50 text-ops-primary bg-ops-elevated hover:bg-ops-primary hover:text-ops-bg font-mono text-[10px] uppercase tracking-widest transition-colors"
          >
            COMBINED DEMO VIEW
          </button>
        </div>

        <div className="flex gap-4 font-mono text-[10px] text-ops-dim tracking-widest uppercase mt-8">
          <span>v1.0.0</span>
          <span>|</span>
          <span>STRICTLY CONFIDENTIAL</span>
          <span>|</span>
          <span>NIST FIPS 203 COMPLIANT</span>
        </div>

      </div>
    </div>
  )
}
