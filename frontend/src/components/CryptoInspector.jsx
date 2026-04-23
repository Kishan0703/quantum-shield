import React from "react"
import { PanelHeader } from './PanelHeader'
import { HexDump } from './HexDump'

export function CryptoInspector({ selectedMessage }) {
  if (!selectedMessage) {
    return (
      <div className="flex flex-col h-full bg-ops-surface">
        <PanelHeader label="CRYPTO INSPECTOR" sublabel="PAYLOAD ANALYSIS" />
        <div className="flex-1 flex items-center justify-center">
          <span className="font-mono text-[10px] text-ops-dim uppercase tracking-widest">
            [NO MESSAGE SELECTED — CLICK A MESSAGE IN THE FEED]
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-ops-surface">
      <PanelHeader label="CRYPTO INSPECTOR" sublabel="PAYLOAD ANALYSIS" />
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* KEM Ciphertext */}
        <div className="flex flex-col gap-2">
          <HexDump 
            hexString={selectedMessage.kem_ct_hex} 
            label="KEM CIPHERTEXT (LATTICE NOISE)" 
            byteCount={selectedMessage.kem_ct_size} 
          />
        </div>

        {/* AES Nonce */}
        <div className="flex flex-col gap-2">
          <HexDump 
            hexString={selectedMessage.nonce_hex} 
            label="AES-GCM NONCE" 
            byteCount={16} 
          />
        </div>

        {/* Shared Secret */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">
            SHARED SECRET (DERIVED)
          </span>
          <div className="border border-ops-border bg-ops-bg p-2 font-mono text-[10px] text-ops-dim flex items-center gap-2">
            <span className="text-ops-primary">{selectedMessage.shared_secret_preview}</span>
            <span className="text-ops-dim">[REDACTED]</span>
          </div>
        </div>

        {/* Decrypted Plaintext */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">
            DECRYPTED PLAINTEXT
          </span>
          <div className="border border-ops-border bg-ops-elevated p-3 font-mono text-sm text-ops-primary">
            {selectedMessage.plaintext}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-ops-border">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">ALGORITHM</span>
            <span className="font-mono text-xs text-ops-primary">{selectedMessage.algorithm}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">INTEGRITY</span>
            <span className="font-mono text-xs text-ops-greenText">✓ {selectedMessage.integrity}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">DECAP TIME</span>
            <span className="font-mono text-xs text-ops-primary">{selectedMessage.decap_time_ms}ms</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">MESSAGE #</span>
            <span className="font-mono text-xs text-ops-primary">{selectedMessage.message_number}</span>
          </div>
        </div>

      </div>
    </div>
  )
}
