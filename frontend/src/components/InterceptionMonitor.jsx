import React, { useState, useEffect } from "react"
import { PanelHeader } from './PanelHeader'
import { HexDump } from './HexDump'

export function InterceptionMonitor({ messages, breachState, lastTransmittedMessage = '' }) {
  const [activeTab, setActiveTab] = useState('raw')
  const latestMessage = messages[messages.length - 1]

  useEffect(() => {
    if (breachState === 'breached') {
      setActiveTab('decoded')
    }
  }, [breachState])

  return (
    <div className="flex flex-col h-full bg-[#0d1220] border-r border-[#1e2d40]">
      <PanelHeader label="INTERCEPTION MONITOR" sublabel="PASSIVE WIRE CAPTURE" />
      
      {/* Tabs */}
      <div className="flex border-b border-[#1e2d40] px-4 pt-2 gap-6 bg-[#080c14]">
        <button 
          onClick={() => setActiveTab('raw')}
          className={`font-mono text-[10px] uppercase tracking-widest pb-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'raw' ? 'border-[#c9d4e0] text-[#c9d4e0]' : 'border-transparent text-[#6b7a8d] hover:text-[#c9d4e0]'
          }`}
        >
          RAW WIRE
        </button>
        <button 
          onClick={() => setActiveTab('decoded')}
          className={`font-mono text-[10px] uppercase tracking-widest pb-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'decoded' ? 'border-[#c9d4e0] text-[#c9d4e0]' : 'border-transparent text-[#6b7a8d] hover:text-[#c9d4e0]'
          }`}
        >
          DECODED
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {activeTab === 'raw' && (
          <HexDump 
            hexString={latestMessage?.kem_ct_hex || "00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00"} 
            label="PACKET CAPTURE — ENCRYPTED PAYLOAD" 
            byteCount={latestMessage?.kem_ct_size || 1088} 
          />
        )}
        
        {activeTab === 'decoded' && (
          <div className="flex flex-col gap-2">
            {breachState === 'breached' ? (
              <div style={{ 
                border: '1px solid #e57373', background: '#2d1a1a', padding: '10px',
                fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#e57373', lineHeight: 1.8 
              }}>
                <div style={{ marginBottom: '4px', fontWeight: 600 }}>
                  INTERCEPTED PLAINTEXT — RSA-2048 COMPROMISED
                </div>
                <div style={{ margin: '6px 0', color: '#c9d4e0' }}>
                  "{lastTransmittedMessage || "TACTICAL: Grid 42-N, Advance at 0600"}"
                </div>
                <div>p = 0x9f2e8c1a4d7b3f0e52a81c96...</div>
                <div>q = 0xa31cb7f208e9d15c3b74f201...</div>
              </div>
            ) : breachState === 'shielded' ? (
              <div style={{ 
                border: '1px solid #1e2d40', background: '#0d1220', padding: '10px',
                fontFamily: 'JetBrains Mono', fontSize: '10px', color: '#3d4f63', lineHeight: 1.8 
              }}>
                <div style={{ marginBottom: '4px', color: '#52c48a' }}>
                  INTERCEPT ATTEMPT — ML-KEM-768 DETECTED
                </div>
                <div>[LATTICE NOISE — CRYPTANALYSIS INTRACTABLE]</div>
                <div>KEM ciphertext: 1088 bytes high-dimensional lattice noise</div>
                <div>AES-GCM payload: authenticated, encrypted</div>
                <div style={{ marginTop: '4px' }}>Quantum decryption: NOT POSSIBLE</div>
              </div>
            ) : (
              <div className="font-mono text-[10px] text-[#3d4f63] mt-4 italic">
                [AWAITING DECRYPTION ATTEMPT]
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Line */}
      <div className="border-t border-[#1e2d40] bg-[#111827] px-4 py-2 font-mono text-[10px] tracking-widest uppercase flex justify-between">
        <span className="text-[#6b7a8d]">INTERCEPT: ACTIVE</span>
        <span className="text-[#6b7a8d]">PROTOCOL: {breachState === 'shielded' ? 'ML-KEM-768' : 'RSA-2048'}</span>
        <span style={{ color: breachState === 'shielded' ? '#52c48a' : '#e57373' }}>
          STATUS: {breachState === 'shielded' ? 'SHIELDED' : 'VULNERABLE'}
        </span>
      </div>
    </div>
  )
}
