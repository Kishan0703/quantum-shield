import React, { useState, useEffect, useRef } from "react"
import { PanelHeader } from './PanelHeader'

const ACTIVATION_LOGS = [
  "[ACTIVATING ML-KEM-768 SIDECAR...]",
  "[GENERATING KEYPAIR: pk=1184 bytes, sk=2400 bytes]",
  "[LOADING NIST FIPS 203 PARAMETERS...]",
  "[SIDECAR WRAPPER: ONLINE]",
  "[QUANTUM-SHIELD: ACTIVE]",
]

const PROBE_LOGS = [
  { text: "TARGET ACQUIRED: ML-KEM-768 ciphertext", phase: 1 },
  { text: "Initialising Shortest Vector Problem oracle...", phase: 1 },
  { text: "Lattice dimension: 768 (Module-LWE)", phase: 1 },
  
  { text: "Attempting BKZ lattice reduction...", phase: 2 },
  { text: "BKZ-2.0: no polynomial-time solution found", phase: 2 },
  { text: "Sieving algorithm: complexity 2^(0.292×768) operations required", phase: 2 },
  
  { text: "Grover's algorithm: applied to lattice search", phase: 3 },
  { text: "Quantum speedup: O(√N) — insufficient against exponential hardness", phase: 3 },
  { text: "Required operations: 2^224 — exceeds all known quantum hardware", phase: 3 },
  
  { text: "ATTACK RESULT: COMPUTATIONALLY INTRACTABLE", phase: 4 },
  { text: "QUANTUM ADVANTAGE: NONE ON MLWE PROBLEM", phase: 4 },
  { text: "██████████████████ SHIELD HELD — ATTACK FAILED", phase: 4 },
]

export function ShieldStatus({ blueTeamState, onRunProbe, isAct2 }) {
  const [isActivating, setIsActivating] = useState(false)
  const [activationIndex, setActivationIndex] = useState(0)
  const [isActivated, setIsActivated] = useState(false)
  
  const [probeStatus, setProbeStatus] = useState('idle')
  const [currentProbeLogs, setCurrentProbeLogs] = useState([])
  const [probeLogIndex, setProbeLogIndex] = useState(0)
  const logEndRef = useRef(null)

  useEffect(() => {
    if (isAct2 && !isActivated && !isActivating) {
      setIsActivating(true)
      setActivationIndex(0)
    }
  }, [isAct2])

  useEffect(() => {
    if (isActivating) {
      const interval = setInterval(() => {
        setActivationIndex(prev => {
          if (prev >= ACTIVATION_LOGS.length - 1) {
            setIsActivating(false)
            setIsActivated(true)
            clearInterval(interval)
            return prev + 1
          }
          return prev + 1
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isActivating])

  useEffect(() => {
    if (probeStatus === 'running') {
      const interval = setInterval(() => {
        setProbeLogIndex(prev => {
          if (prev >= PROBE_LOGS.length - 1) {
            setProbeStatus('completed')
            if (onShielded) onShielded()
            clearInterval(interval)
            return prev + 1
          }
          const nextIndex = prev + 1
          setCurrentProbeLogs(PROBE_LOGS.slice(0, nextIndex))
          return nextIndex
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [probeStatus])

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentProbeLogs, activationIndex])

  const handleRunProbe = () => {
    setProbeStatus('running')
    setCurrentProbeLogs([])
    setProbeLogIndex(0)
    onRunProbe()
  }

  const getTimeStamp = (index) => {
    const totalMs = index * 500
    const seconds = Math.floor(totalMs / 1000)
    const ms = totalMs % 1000
    return `[00:0${seconds}.${ms.toString().padStart(3, '0')}]`
  }

  return (
    <div className="flex flex-col h-full bg-ops-surface border-r border-ops-border">
      <PanelHeader label="QUANTUM-SHIELD" sublabel="DEFENSE TELEMETRY" />
      
      <div className="p-4 flex flex-col gap-6 overflow-y-auto h-full">
        
        {/* Activation Log (if in Act 2 and not yet fully shown) */}
        {isAct2 && (isActivating || activationIndex > 0) && (
          <div className="flex flex-col gap-1 bg-ops-bg border border-ops-border p-3 font-mono text-[11px] text-ops-greenText">
            {ACTIVATION_LOGS.slice(0, activationIndex).map((log, i) => (
              <div key={i}>{log}</div>
            ))}
            {isActivating && <div className="animate-pulse">_</div>}
          </div>
        )}

        {/* Section 1 - Shield Status */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">SHIELD STATUS</span>
            <div className={`flex items-center gap-2 border px-2 py-0.5 ${isActivated ? 'border-ops-greenText bg-ops-greenDim' : 'border-ops-dim bg-ops-bg'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${isActivated ? 'bg-ops-greenText animate-pulse' : 'bg-ops-dim'}`} />
              <span className={`font-mono text-[10px] uppercase tracking-widest ${isActivated ? 'text-ops-greenText font-bold' : 'text-ops-dim'}`}>
                {isActivated ? 'ACTIVE' : 'STANDBY'}
              </span>
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
              <span className={`font-mono text-[10px] uppercase tracking-widest ${isActivated ? 'text-ops-greenText' : 'text-ops-dim'}`}>NIST LEVEL 3</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[9px] text-ops-secondary uppercase tracking-widest">PQ SECURITY</span>
              <span className={`font-mono text-[10px] uppercase tracking-widest ${isActivated ? 'text-ops-greenText' : 'text-ops-dim'}`}>RESISTANT (SVP)</span>
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

          {probeStatus === 'idle' && (
            <button
              onClick={handleRunProbe}
              disabled={!isActivated}
              className={`w-full py-3 font-mono text-[10px] uppercase tracking-widest border transition-colors ${
                isActivated 
                ? 'border-ops-blueText text-ops-blueText bg-ops-blueDim hover:bg-ops-blue hover:text-white' 
                : 'border-ops-border text-ops-dim bg-ops-bg cursor-not-allowed'
              }`}
            >
              RUN LATTICE ATTACK PROBE
            </button>
          )}

          {(probeStatus === 'running' || probeStatus === 'completed') && (
            <div className="flex flex-col gap-2 flex-1">
               <div className="bg-ops-bg border border-ops-border p-3 overflow-y-auto font-mono text-[11px] flex-1 min-h-[150px]">
                {currentProbeLogs.map((log, i) => (
                  <div key={i} className={`mb-0.5 ${log.phase === 4 ? 'text-ops-greenText font-semibold' : 'text-ops-secondary'}`}>
                    {getTimeStamp(i)} {log.text}
                  </div>
                ))}
                {probeStatus === 'running' && <div className="animate-pulse text-ops-secondary mt-1">_</div>}
                <div ref={logEndRef} />
              </div>

              {probeStatus === 'completed' && (
                <div className="border border-ops-greenText bg-ops-greenDim p-3 font-mono text-xs text-ops-greenText flex flex-col gap-1 mt-2">
                  <div className="uppercase border-b border-ops-greenText/30 pb-1 mb-1">┌─ SHIELD RESULT ──────────────────────────────────────────────────┐</div>
                  <div className="grid grid-cols-[100px_1fr]">
                    <span className="opacity-70">ATTACK TYPE:</span> <span>SVP on 768-dimensional lattice</span>
                    <span className="opacity-70">QUANTUM ALGO:</span> <span>None applicable (no speedup on MLWE)</span>
                    <span className="opacity-70">HARDNESS:</span> <span>2^128 operations minimum</span>
                    <span className="opacity-70">RESULT:</span> <span>COMPUTATIONALLY INTRACTABLE</span>
                    <span className="opacity-70">SHIELD STATUS:</span> <span className="font-bold">HELD</span>
                  </div>
                  <div className="uppercase pt-1 mt-1 border-t border-ops-greenText/30">└──────────────────────────────────────────────────────────────────┘</div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
