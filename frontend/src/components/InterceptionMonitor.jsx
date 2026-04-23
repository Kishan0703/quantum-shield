import React from "react"
import { useState } from 'react'
import { PanelHeader } from './PanelHeader'
import { HexDump } from './HexDump'

export function InterceptionMonitor({ messages, shieldActive }) {
  const [activeTab, setActiveTab] = useState('raw')
  const latestMessage = messages[messages.length - 1]

  return (
    <div className="flex flex-col h-full bg-ops-surface border-r border-ops-border">
      <PanelHeader label="INTERCEPTION MONITOR" sublabel="PASSIVE WIRE CAPTURE" />
      
      {/* Tabs */}
      <div className="flex border-b border-ops-border px-4 pt-2 gap-6 bg-ops-bg">
        <button 
          onClick={() => setActiveTab('raw')}
          className={`font-mono text-[10px] uppercase tracking-widest pb-2 border-b-2 transition-colors ${
            activeTab === 'raw' ? 'border-ops-primary text-ops-primary' : 'border-transparent text-ops-dim hover:text-ops-secondary'
          }`}
        >
          RAW WIRE
        </button>
        <button 
          onClick={() => setActiveTab('decoded')}
          className={`font-mono text-[10px] uppercase tracking-widest pb-2 border-b-2 transition-colors ${
            activeTab === 'decoded' ? 'border-ops-primary text-ops-primary' : 'border-transparent text-ops-dim hover:text-ops-secondary'
          }`}
        >
          DECODED
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {!latestMessage ? (
          <div className="m-auto font-mono text-[10px] text-ops-dim tracking-widest">[AWAITING INTERCEPT]</div>
        ) : (
          <>
            {activeTab === 'raw' && (
              <HexDump 
                hexString={latestMessage.kem_ct_hex} 
                label="PACKET CAPTURE — ENCRYPTED PAYLOAD" 
                byteCount={latestMessage.kem_ct_size} 
              />
            )}
            
            {activeTab === 'decoded' && (
              <div className="flex flex-col gap-2">
                {!shieldActive ? (
                  <>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ops-redText">
                      INTERCEPTED PLAINTEXT — RSA-2048 COMPROMISED
                    </span>
                    <div className="border border-ops-red border-dashed bg-ops-redDim p-4 font-mono text-sm text-ops-redText break-all">
                      {latestMessage.plaintext}
                    </div>
                  </>
                ) : (
                  <div className="font-mono text-sm text-ops-dim mt-4">
                    [LATTICE NOISE — CRYPTANALYSIS INTRACTABLE]
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom Status Line */}
      <div className="border-t border-ops-border bg-ops-elevated px-4 py-2 font-mono text-[10px] text-ops-secondary tracking-widest uppercase flex justify-between">
        <span>INTERCEPT: ACTIVE</span>
        <span>PROTOCOL: {shieldActive ? 'ML-KEM-768' : 'RSA-2048'}</span>
        <span className={shieldActive ? 'text-ops-greenText' : 'text-ops-redText'}>
          STATUS: {shieldActive ? 'INTRACTABLE' : 'VULNERABLE'}
        </span>
        <span>HARVEST: RECORDING</span>
      </div>
    </div>
  )
}
