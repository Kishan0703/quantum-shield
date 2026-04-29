import React, { useState, useEffect, useRef } from "react"
import { PanelHeader } from './PanelHeader'

const ATTACK_LOGS = [
  { text: "TARGET ACQUIRED: RSA-2048 public key intercepted", phase: 1 },
  { text: "Quantum register allocated: 4096 qubits", phase: 1 },
  { text: "Initialising quantum circuit...", phase: 1 },
  
  { text: "Quantum Fourier Transform: APPLIED", phase: 2 },
  { text: "Superposition state prepared across 2048-bit domain", phase: 2 },
  { text: "Interference pattern forming...", phase: 2 },
  
  { text: "Period finding algorithm: RUNNING", phase: 3 },
  { text: "Measuring quantum eigenvalue...", phase: 3 },
  { text: "Period r detected: 0x7f3a...", phase: 3 },
  { text: "GCD(a^(r/2) - 1, N): COMPUTING", phase: 3 },
  
  { text: "Prime factor p candidate: 0x9f2e8c1a...", phase: 4 },
  { text: "Prime factor q candidate: 0xa31cb7f2...", phase: 4 },
  { text: "Verification: p × q = N... CONFIRMED", phase: 4 },
  
  { text: "RSA private key reconstructed from factors", phase: 5 },
  { text: "Decryption key loaded into adversary register", phase: 5 },
  { text: "Decrypting intercepted ciphertext...", phase: 5 },
  
  { text: "██████████████████ DECRYPTION COMPLETE", phase: 6 },
  { text: "PLAINTEXT RECOVERED — RSA-2048 BROKEN", phase: 6 },
  { text: "ATTACK TIME: 2.743 seconds (quantum)", phase: 6 },
]

export function RsaCrackSimulation({ redTeamState, onRunSimulation, breachState }) {
  const [attackPhase, setAttackPhase] = useState('idle')
  const [currentLogs, setCurrentLogs] = useState([])
  const [currentLogIndex, setCurrentLogIndex] = useState(0)
  const logEndRef = useRef(null)
  
  const progress = currentLogIndex / ATTACK_LOGS.length

  useEffect(() => {
    if (attackPhase === 'running') {
      const interval = setInterval(() => {
        setCurrentLogIndex(prev => {
          if (prev >= ATTACK_LOGS.length) {
            setAttackPhase('breached')
            if (onBreached) onBreached()
            clearInterval(interval)
            return prev
          }
          const nextIndex = prev + 1
          setCurrentLogs(ATTACK_LOGS.slice(0, nextIndex))
          return nextIndex
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [attackPhase])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentLogs])

  const handleStart = () => {
    setAttackPhase('running')
    setCurrentLogs([])
    setCurrentLogIndex(0)
    onRunSimulation()
  }

  const handleReset = () => {
    setAttackPhase('idle')
    setCurrentLogs([])
    setCurrentLogIndex(0)
  }

  const getTimeStamp = (index) => {
    const totalMs = index * 500
    const seconds = Math.floor(totalMs / 1000)
    const ms = totalMs % 1000
    return `[00:0${seconds}.${ms.toString().padStart(3, '0')}]`
  }

  return (
    <div className="flex flex-col h-full bg-ops-surface">
      <PanelHeader label="QUANTUM ADVERSARY" sublabel="SHOR'S ALGORITHM SIMULATION" />
      
      <div className="p-4 flex flex-col gap-4 h-full overflow-hidden">
        
        <div className="grid grid-cols-2 gap-4 bg-ops-bg border border-ops-border p-3">
          <div className="flex flex-col gap-1 border-r border-ops-border pr-2">
            <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">TARGET ALGORITHM</span>
            <span className="font-mono text-[10px] text-ops-primary uppercase tracking-widest">RSA-2048</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">ATTACK METHOD</span>
            <span className="font-mono text-[10px] text-ops-redText uppercase tracking-widest">SHOR'S ALGORITHM</span>
          </div>
        </div>

        {attackPhase === 'idle' && (
          <button
            onClick={handleStart}
            className="w-full py-3 font-mono text-[11px] uppercase tracking-widest border border-ops-redText text-ops-redText bg-ops-redDim hover:bg-ops-red hover:text-white transition-colors"
          >
            INITIATE QUANTUM ATTACK SIMULATION
          </button>
        )}

        {(attackPhase === 'running' || attackPhase === 'breached') && (
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <div className="w-full bg-ops-bg h-px overflow-hidden">
              <div 
                className="h-full bg-ops-red transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            
            <div className="flex-1 min-h-0 bg-ops-bg border border-ops-border p-3 overflow-y-auto font-mono text-[11px]">
              {currentLogs.map((log, i) => (
                <div key={i} className={`mb-0.5 ${log.phase === 6 ? 'text-ops-redText font-semibold' : 'text-ops-redText opacity-80'}`}>
                  {getTimeStamp(i)} {log.text}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
        )}

        {attackPhase === 'breached' && (
          <div className="flex flex-col gap-4">
            <div className="border border-ops-redText bg-ops-redDim p-4 font-mono text-xs text-ops-redText flex flex-col gap-2">
              <div className="uppercase border-b border-ops-redText/30 pb-2">┌─ INTERCEPTED PLAINTEXT ─────────────────────────────────────────┐</div>
              <div>CLASSIFICATION: RSA-2048 DECRYPTED BY SHOR'S ALGORITHM</div>
              <div className="my-2">"TACTICAL: Grid 42-N, Advance at 0600"</div>
              <div>KEY FACTORS RECOVERED:</div>
              <div className="opacity-70">p = 0x9f2e8c1a4d7b3f0e...</div>
              <div className="opacity-70">q = 0xa31cb7f208e9d15c...</div>
              <div className="uppercase pt-2 border-t border-ops-redText/30">└─────────────────────────────────────────────────────────────────┘</div>
            </div>

            <div className="font-mono text-[11px] text-ops-amberText animate-pulse text-center">
              ▸ ACTIVATE QUANTUM-SHIELD TO COUNTER THIS ATTACK →
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2 font-mono text-[10px] uppercase tracking-widest border border-ops-border text-ops-secondary hover:text-ops-primary transition-colors"
            >
              [RESET SIMULATION]
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
