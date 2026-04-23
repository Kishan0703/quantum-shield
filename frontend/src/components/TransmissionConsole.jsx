import React from "react"
import { useState } from 'react'
import { PanelHeader } from './PanelHeader'

export function TransmissionConsole({ connected, onSend }) {
  const [inputText, setInputText] = useState('')
  const [txLog, setTxLog] = useState([])

  const handleSend = () => {
    if (!inputText.trim()) return
    onSend(inputText)
    
    const newLog = {
      time: new Date().toISOString().slice(11, 19) + ' UTC',
      preview: inputText.slice(0, 30) + (inputText.length > 30 ? '...' : ''),
      bytes: 1432
    }
    
    setTxLog(prev => [newLog, ...prev].slice(0, 10))
    setInputText('')
  }

  return (
    <div className="flex flex-col h-full">
      <PanelHeader label="TRANSMISSION CONSOLE" sublabel="FIELD UNIT OUTBOUND" />
      
      <div className="p-4 flex flex-col gap-4">
        {/* Encryption Mode Block */}
        <div className="flex flex-col gap-2 bg-ops-bg border border-ops-border p-3">
          <div className="flex justify-between items-center border-b border-ops-border pb-2">
            <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">RSA-2048</span>
            <span className="font-mono text-[10px] text-ops-amberText uppercase tracking-widest bg-ops-amberDim px-2 border border-ops-amber">ACTIVE</span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="font-mono text-[10px] text-ops-dim uppercase tracking-widest">ML-KEM-768</span>
            <span className="font-mono text-[10px] text-ops-dim uppercase tracking-widest">STANDBY</span>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">MESSAGE COMPOSITION</span>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-ops-bg border border-ops-border p-3 font-mono text-sm text-ops-primary outline-none focus:border-ops-blueText resize-none h-24"
            placeholder="ENTER TACTICAL MESSAGE..."
          />
          <button
            onClick={handleSend}
            disabled={!connected || !inputText.trim()}
            className={`w-full py-2 font-mono text-xs uppercase tracking-widest border transition-colors ${
              connected && inputText.trim() 
                ? 'bg-ops-blueDim border-ops-blueText text-ops-blueText hover:bg-ops-blue hover:text-white' 
                : 'bg-ops-bg border-ops-border text-ops-dim cursor-not-allowed'
            }`}
          >
            TRANSMIT ENCRYPTED
          </button>
        </div>
      </div>

      {/* Outbound Log */}
      <div className="flex-1 border-t border-ops-border flex flex-col min-h-0">
        <div className="px-4 py-2 border-b border-ops-border bg-ops-elevated grid grid-cols-[80px_60px_1fr] gap-4">
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">TIME</span>
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">BYTES</span>
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">PREVIEW</span>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-1">
          {txLog.length === 0 ? (
            <div className="text-center font-mono text-ops-dim text-[10px] py-4">[NO TRANSMISSIONS]</div>
          ) : (
            txLog.map((log, i) => (
              <div key={i} className="grid grid-cols-[80px_60px_1fr] gap-4 items-center font-mono text-[10px] py-1 border-b border-ops-border/30">
                <span className="text-ops-dim">{log.time}</span>
                <span className="text-ops-blueText">{log.bytes}</span>
                <span className="text-ops-secondary truncate">{log.preview}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
