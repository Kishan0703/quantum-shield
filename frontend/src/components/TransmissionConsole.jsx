import React, { useState, useEffect } from "react"
import { PanelHeader } from './PanelHeader'

export function TransmissionConsole({ connected, onSend, securityMode }) {
  const [inputText, setInputText] = useState('')
  const [txLog, setTxLog] = useState([])

  const handleSend = () => {
    if (!inputText.trim()) return
    onSend(inputText)
    
    const newLog = {
      time: new Date().toISOString().slice(11, 19) + ' UTC',
      preview: inputText.slice(0, 30) + (inputText.length > 30 ? '...' : ''),
      bytes: securityMode === 'shielded' ? 1432 + 1088 : 1432 // kem_ct overhead
    }
    
    setTxLog(prev => [newLog, ...prev].slice(0, 10))
    setInputText('')
  }

  return (
    <div className="flex flex-col h-full bg-[#0d1220]">
      <PanelHeader label="TRANSMISSION CONSOLE" sublabel="FIELD UNIT OUTBOUND" />
      
      <div className="p-4 flex flex-col gap-4">
        {/* Encryption Mode Block */}
        <div className="flex flex-col gap-2 bg-[#080c14] border border-[#1e2d40] p-3">
          <div className="font-mono text-[10px] text-[#6b7a8d] uppercase tracking-widest border-b border-[#1e2d40] pb-1 mb-1">
            ACTIVE ENCRYPTION PROTOCOL
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-[#c9d4e0] uppercase">RSA-2048</span>
            <span style={{ 
              fontFamily: 'JetBrains Mono', fontSize: '10px', uppercase: 'true', trackingWidest: 'true',
              color: securityMode === 'legacy' ? '#d4a843' : '#3d4f63'
            }}>
              {securityMode === 'legacy' ? '● ACTIVE' : '○ LEGACY'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-mono text-[10px] text-[#c9d4e0] uppercase">ML-KEM-768</span>
            <span style={{ 
              fontFamily: 'JetBrains Mono', fontSize: '10px', uppercase: 'true', trackingWidest: 'true',
              color: securityMode === 'shielded' ? '#52c48a' : '#3d4f63',
              display: 'flex', alignItems: 'center'
            }}>
              {securityMode === 'shielded' ? (
                <>
                  <span style={{ 
                    width: 6, height: 6, borderRadius: '50%', background: '#52c48a', 
                    display: 'inline-block', marginRight: 4, animation: 'pulse-dot 1.5s infinite' 
                  }} />
                  ● ACTIVE
                </>
              ) : '○ DISABLED'}
            </span>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-[#6b7a8d] uppercase tracking-widest">MESSAGE COMPOSITION</span>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#080c14] border border-[#1e2d40] p-3 font-mono text-sm text-[#c9d4e0] outline-none focus:border-[#5fa8d4] resize-none h-24"
            style={{ borderRadius: 0 }}
            placeholder="ENTER TACTICAL MESSAGE..."
          />
          <button
            onClick={handleSend}
            disabled={!connected || !inputText.trim()}
            className={`w-full py-2 font-mono text-xs uppercase tracking-widest border transition-colors ${
              connected && inputText.trim() 
                ? 'bg-[#111827] border-[#5fa8d4] text-[#5fa8d4] hover:bg-[#1e2d40] hover:text-[#c9d4e0]' 
                : 'bg-[#080c14] border-[#1e2d40] text-[#3d4f63] cursor-not-allowed'
            }`}
            style={{ borderRadius: 0, cursor: (connected && inputText.trim()) ? 'pointer' : 'not-allowed' }}
          >
            TRANSMIT ENCRYPTED
          </button>
        </div>
      </div>

      {/* Outbound Log */}
      <div className="flex-1 border-t border-[#1e2d40] flex flex-col min-h-0">
        <div className="px-4 py-2 border-b border-[#1e2d40] bg-[#111827] grid grid-cols-[80px_60px_1fr] gap-4">
          <span className="font-mono text-[10px] text-[#6b7a8d] uppercase tracking-widest">TIME</span>
          <span className="font-mono text-[10px] text-[#6b7a8d] uppercase tracking-widest">BYTES</span>
          <span className="font-mono text-[10px] text-[#6b7a8d] uppercase tracking-widest">PREVIEW</span>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-1">
          {txLog.length === 0 ? (
            <div className="text-center font-mono text-[#3d4f63] text-[10px] py-4">[NO TRANSMISSIONS]</div>
          ) : (
            txLog.map((log, i) => (
              <div key={i} className="grid grid-cols-[80px_60px_1fr] gap-4 items-center font-mono text-[10px] py-1 border-b border-[#1e2d40]/30">
                <span className="text-[#3d4f63]">{log.time}</span>
                <span className="text-[#5fa8d4]">{log.bytes}</span>
                <span className="text-[#6b7a8d] truncate">{log.preview}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
