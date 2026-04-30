import React, { useState, useEffect, useRef } from 'react'

const ATTACK_LOGS = [
  { text: '[00:00.000] TARGET ACQUIRED: RSA-2048 public key intercepted', phase: 1 },
  { text: '[00:00.121] Quantum register allocated: 4096 qubits', phase: 1 },
  { text: '[00:00.243] Initialising quantum circuit...', phase: 1 },
  { text: '[00:00.500] Quantum Fourier Transform: APPLIED', phase: 2 },
  { text: '[00:00.621] Superposition state: 2048-bit domain prepared', phase: 2 },
  { text: '[00:00.743] Interference pattern forming...', phase: 2 },
  { text: '[00:01.000] Period finding algorithm: RUNNING', phase: 3 },
  { text: '[00:01.121] Measuring quantum eigenvalue...', phase: 3 },
  { text: '[00:01.365] GCD(a^(r/2) - 1, N): COMPUTING', phase: 3 },
  { text: '[00:01.500] Prime factor p: 0x9f2e8c1a4d7b3f0e...', phase: 4 },
  { text: '[00:01.621] Prime factor q: 0xa31cb7f208e9d15c...', phase: 4 },
  { text: '[00:01.743] Verification: p × q = N... CONFIRMED', phase: 4 },
  { text: '[00:02.000] RSA private key reconstructed from factors', phase: 5 },
  { text: '[00:02.121] Decryption key loaded into adversary register', phase: 5 },
  { text: '[00:02.243] Decrypting intercepted ciphertext...', phase: 5 },
  { text: '[00:02.500] ████████████████████ DECRYPTION COMPLETE', phase: 6 },
  { text: '[00:02.621] PLAINTEXT RECOVERED — RSA-2048 BROKEN', phase: 6 },
  { text: '[00:02.743] ATTACK TIME: 2.743 seconds (quantum)', phase: 6 },
]

const PROBE_LOGS = [
  { text: '[00:00.000] TARGET: ML-KEM-768 ciphertext acquired', col: '#6b7a8d' },
  { text: '[00:00.121] Initialising SVP oracle — 768-dim lattice', col: '#6b7a8d' },
  { text: '[00:00.243] Lattice dimension: 768 (Module-LWE)', col: '#6b7a8d' },
  { text: '[00:00.500] BKZ reduction: no poly-time solution found', col: '#6b7a8d' },
  { text: '[00:00.621] BKZ-2.0: sieving complexity 2^(0.292×768)', col: '#6b7a8d' },
  { text: "[00:00.743] Grover's algorithm: applied to lattice search", col: '#6b7a8d' },
  { text: '[00:01.000] Quantum speedup: O(√N) — insufficient', col: '#6b7a8d' },
  { text: '[00:01.121] Required ops: 2^224 — exceeds all known QC', col: '#6b7a8d' },
  { text: '[00:01.243] Lattice attack: no viable quantum algorithm', col: '#6b7a8d' },
  { text: '[00:01.500] RESULT: COMPUTATIONALLY INTRACTABLE', col: '#52c48a' },
  { text: '[00:01.621] QUANTUM ADVANTAGE: NONE ON MLWE PROBLEM', col: '#52c48a' },
  { text: '[00:01.743] ████████████████████ SHIELD HELD — ATTACK FAILED', col: '#52c48a' },
]

const ACTIVATION_LOGS = [
  '[ACTIVATING ML-KEM-768 SIDECAR...]',
  '[GENERATING KEYPAIR: pk=1184 bytes, sk=2400 bytes]',
  '[LOADING NIST FIPS 203 PARAMETERS...]',
  '[SIDECAR WRAPPER: ONLINE]',
  '[QUANTUM-SHIELD: ACTIVE]',
]

export function SecurityPanel({ securityMode = 'legacy', attackPhase = 'idle', setAttackPhase, probePhase = 'idle', setProbePhase, setBreachState, messages = [], lastTransmittedMessage = '' }) {
  const [visibleAttackLogs, setVisibleAttackLogs] = useState([])
  const [visibleProbeLogs, setVisibleProbeLogs] = useState([])
  const [visibleActivationLogs, setVisibleActivationLogs] = useState([])
  const attackLogsRef = useRef(null)
  const probeLogsRef = useRef(null)
  const activatedRef = useRef(false)

  // Auto-scroll effect
  useEffect(() => {
    if (attackLogsRef.current) attackLogsRef.current.scrollTop = attackLogsRef.current.scrollHeight
  }, [visibleAttackLogs])

  useEffect(() => {
    if (probeLogsRef.current) probeLogsRef.current.scrollTop = probeLogsRef.current.scrollHeight
  }, [visibleProbeLogs])

  // Shield Activation sequence (one-time)
  useEffect(() => {
    let timeoutId;
    if (securityMode === 'shielded' && !activatedRef.current) {
      activatedRef.current = true
      const addNextActivationLog = (i) => {
        if (i < ACTIVATION_LOGS.length) {
          setVisibleActivationLogs(prev => [...prev, ACTIVATION_LOGS[i]])
          timeoutId = setTimeout(() => addNextActivationLog(i + 1), 300)
        }
      }
      addNextActivationLog(0)
    }
    return () => clearTimeout(timeoutId)
  }, [securityMode])

  // Attack sequence effect
  useEffect(() => {
    let timeoutId;
    if (attackPhase === 'running') {
      const i = visibleAttackLogs.length;
      if (i < ATTACK_LOGS.length) {
        const delay = 300 + Math.random() * 500;
        timeoutId = setTimeout(() => {
          setVisibleAttackLogs(prev => [...prev, ATTACK_LOGS[i]]);
        }, delay);
      } else {
        setAttackPhase('breached');
        setBreachState('breached');
      }
    }
    return () => clearTimeout(timeoutId);
  }, [attackPhase, visibleAttackLogs, setAttackPhase, setBreachState]);

  // Probe sequence effect
  useEffect(() => {
    let timeoutId;
    if (probePhase === 'running') {
      const i = visibleProbeLogs.length;
      if (i < PROBE_LOGS.length) {
        const delay = 300 + Math.random() * 500;
        timeoutId = setTimeout(() => {
          setVisibleProbeLogs(prev => [...prev, PROBE_LOGS[i]]);
        }, delay);
      } else {
        setProbePhase('blocked');
        setBreachState('shielded');
      }
    }
    return () => clearTimeout(timeoutId);
  }, [probePhase, visibleProbeLogs, setProbePhase, setBreachState]);

  const runAttack = () => {
    setVisibleAttackLogs([])
    setAttackPhase('running')
  }

  const runProbe = () => {
    setVisibleProbeLogs([])
    setProbePhase('running')
  }

  const resetAttack = () => {
    setVisibleAttackLogs([])
    setAttackPhase('idle')
    setBreachState('none')
  }

  const lastMessageText = lastTransmittedMessage || "TACTICAL: Grid 42-N, Advance at 0600"

  return (
    <div className="flex flex-col h-full bg-[#0d1220]">
      <div className="p-4 border-b border-[#1e2d40] bg-[#0d1220]">
        <div className="font-mono text-[11px] text-[#c9d4e0] font-bold uppercase tracking-[2px]">
          {securityMode === 'legacy' ? 'QUANTUM ADVERSARY SIMULATION' : 'LATTICE DEFENSE — SVP ANALYSIS'}
        </div>
        <div className="font-mono text-[9px] text-[#6b7a8d] uppercase tracking-widest mt-0.5">
          {securityMode === 'legacy' ? "SHOR'S ALGORITHM" : 'ML-KEM-768 ACTIVE'}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {securityMode === 'legacy' ? (
          <>
            {/* Status Block */}
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between"><span className="text-[#6b7a8d]">TARGET ALGORITHM</span><span className="text-[#c9d4e0]">RSA-2048</span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">ATTACK METHOD</span><span className="text-[#c9d4e0]">SHOR'S ALGORITHM</span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">COMPLEXITY</span><span className="text-[#c9d4e0]">O(LOG³ N) — POLYNOMIAL</span></div>
              <div className="flex justify-between items-center">
                <span className="text-[#6b7a8d]">CURRENT STATUS</span>
                <span style={{ color: attackPhase === 'idle' ? '#6b7a8d' : '#e57373' }}>
                  ● {attackPhase.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '1px', background: '#1e2d40', width: '100%', visibility: attackPhase === 'running' ? 'visible' : 'hidden' }}>
              <div style={{ 
                height: '1px', background: '#e57373', 
                width: `${(visibleAttackLogs.length / ATTACK_LOGS.length) * 100}%`,
                transition: 'width 0.3s' 
              }} />
            </div>

            {/* Attack Log Area */}
            <div 
              ref={attackLogsRef}
              style={{ 
                background: '#080c14', border: '1px solid #1e2d40', padding: '8px',
                height: '200px', overflowY: 'auto', fontFamily: 'JetBrains Mono',
                fontSize: '11px', lineHeight: '1.8'
              }}
            >
              {visibleAttackLogs.map((log, i) => (
                <div key={i} style={{ 
                  color: '#e57373', opacity: log.phase <= 5 ? 0.8 : 1,
                  fontWeight: log.phase === 6 ? 600 : 400
                }}>
                  {log.text}
                </div>
              ))}
            </div>

            {attackPhase === 'idle' && (
              <button onClick={runAttack} style={{
                border: '1px solid #e57373', color: '#e57373', background: 'transparent',
                fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '2px', padding: '8px', width: '100%', cursor: 'pointer'
              }}>INITIATE QUANTUM ATTACK</button>
            )}
            
            {attackPhase === 'running' && (
              <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e57373', fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '2px' }}>
                <span style={{ animation: 'blink 1s infinite' }}>ATTACK IN PROGRESS...</span>
              </div>
            )}

            {attackPhase === 'breached' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{
                  border: '1px solid #e57373', background: '#2d1a1a', padding: '10px',
                  fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#e57373', lineHeight: '1.8', minHeight: '150px'
                }}>
                  <div>┌─ BREACH CONFIRMED ─────────────────────────────────────────┐</div>
                  <div>│  ALGORITHM:      RSA-2048                                  │</div>
                  <div>│  ATTACK TIME:    2.743 seconds (quantum)                   │</div>
                  <div>│  FACTORS:        p = 0x9f2e..., q = 0xa31c...             │</div>
                  <div>│                                                            │</div>
                  <div>│  RECOVERED PLAINTEXT:                                      │</div>
                  <div style={{ color: '#c9d4e0', padding: '0 4px' }}>│  "{lastMessageText}"</div>
                  <div>│                                                            │</div>
                  <div>│  RECOMMENDATION: UPGRADE TO POST-QUANTUM IMMEDIATELY       │</div>
                  <div>└────────────────────────────────────────────────────────────┘</div>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#d4a843', animation: 'blink 1s infinite' }}>
                  ▸ ACTIVATE QUANTUM-SHIELD TO COUNTER THIS ATTACK →
                </div>
                <button onClick={resetAttack} style={{
                  border: '1px solid #6b7a8d', color: '#6b7a8d', background: 'transparent',
                  fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '2px', padding: '8px', width: '100%', cursor: 'pointer'
                }}>RESET SIMULATION</button>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Activation Log */}
            <div className="font-mono text-[11px] space-y-0.5" style={{ color: '#52c48a', height: '80px', overflow: 'hidden' }}>
              {visibleActivationLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>

            {/* Status Block */}
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between"><span className="text-[#6b7a8d]">ALGORITHM</span><span className="text-[#c9d4e0]">ML-KEM-768 (Kyber)</span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">STANDARD</span><span className="text-[#c9d4e0]">NIST FIPS 203 (2024)</span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">SECURITY LVL</span><span className="text-[#c9d4e0]">NIST LEVEL 3</span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">PQ SECURITY</span><span className="text-[#c9d4e0]">128-BIT POST-QUANTUM</span></div>
              <div className="flex justify-between items-center">
                <span className="text-[#6b7a8d]">STATUS</span>
                <span style={{ color: '#52c48a', display: 'flex', alignItems: 'center' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#52c48a', display: 'inline-block', marginRight: 6, animation: 'pulse-dot 1.5s infinite' }} />
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Key Material Block */}
            <div style={{ background: '#111827', border: '1px solid #1e2d40', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', fontNames: 'JetBrains Mono', fontSize: '10px' }}>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">PUBLIC KEY</span><span className="text-[#c9d4e0]">1184 bytes</span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">SECRET KEY</span><span className="text-[#c9d4e0]">2400 bytes <span className="text-[#3d4f63]">[MEMORY ONLY]</span></span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">KEM CIPHERTEXT</span><span className="text-[#c9d4e0]">1088 bytes</span></div>
              <div className="flex justify-between"><span className="text-[#6b7a8d]">SHARED SECRET</span><span className="text-[#c9d4e0]">32 bytes <span className="text-[#3d4f63]">[EPHEMERAL]</span></span></div>
            </div>

            {/* Probe Log Area */}
            <div 
              ref={probeLogsRef}
              style={{ 
                background: '#080c14', border: '1px solid #1e2d40', padding: '8px',
                height: '150px', overflowY: 'auto', fontFamily: 'JetBrains Mono',
                fontSize: '11px', lineHeight: '1.8', visibility: probePhase !== 'idle' ? 'visible' : 'hidden'
              }}
            >
              {visibleProbeLogs.map((log, i) => (
                <div key={i} style={{ color: log.col }}>
                  {log.text}
                </div>
              ))}
            </div>

            {probePhase === 'idle' && (
              <button onClick={runProbe} style={{
                border: '1px solid #52c48a', color: '#52c48a', background: 'transparent',
                fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '2px', padding: '8px', width: '100%', cursor: 'pointer'
              }}>PROBE QUANTUM RESISTANCE</button>
            )}

            {probePhase === 'running' && (
              <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#52c48a', fontFamily: 'JetBrains Mono', fontSize: '9px', letterSpacing: '2px' }}>
                <span style={{ animation: 'blink 1s infinite' }}>SIMULATING LATTICE ATTACK...</span>
              </div>
            )}

            {probePhase === 'blocked' && (
              <div style={{
                border: '1px solid #52c48a', background: '#0f2318', padding: '10px',
                fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#52c48a', lineHeight: '1.8', height: '130px'
              }}>
                <div>┌─ SHIELD RESULT ────────────────────────────────────────────┐</div>
                <div>│  ATTACK TYPE:    SVP on 768-dimensional lattice            │</div>
                <div>│  QUANTUM ALGO:   None applicable                           │</div>
                <div>│  HARDNESS:       2^128 operations minimum                  │</div>
                <div>│  RESULT:         COMPUTATIONALLY INTRACTABLE               │</div>
                <div>│  SHIELD:         HELD                                      │</div>
                <div>└────────────────────────────────────────────────────────────┘</div>
              </div>
            )}

            {/* Live Metrics */}
            <div className="mt-4">
              <div className="font-mono text-[10px] text-[#6b7a8d] tracking-widest border-b border-[#1e2d40] pb-1 mb-2">
                ─── LIVE SYSTEM METRICS ───────────────────────────
              </div>
              <div className="space-y-0">
                {[
                  { label: 'MESSAGES RECEIVED', value: messages.length },
                  { label: 'AVG DECAP LATENCY', value: '4.2ms' },
                  { label: 'PUBLIC KEY SIZE', value: '1184 bytes' },
                  { label: 'KEM CT SIZE', value: '1088 bytes' },
                  { label: 'SHARED SECRET', value: '32 bytes (ephemeral)' },
                  { label: 'NIST LEVEL', value: '3 (128-bit PQ)' },
                ].map((metric, i) => (
                  <div key={i} style={{ 
                    display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e2d40', 
                    padding: '4px 0', fontSize: '10px' 
                  }}>
                    <span style={{ color: '#6b7a8d' }}>{metric.label}</span>
                    <span style={{ color: '#c9d4e0', fontFamily: 'JetBrains Mono' }}>{metric.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
