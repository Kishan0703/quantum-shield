import React from "react"
import { useEffect, useRef } from 'react'
import { PanelHeader } from './PanelHeader'

export function IncomingFeed({ messages, selectedMessage, onSelectMessage }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-ops-surface border-r border-ops-border">
      <PanelHeader label="INCOMING FEED" sublabel="DECRYPTED TACTICAL TRAFFIC" />
      
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="m-auto font-mono text-[10px] text-ops-dim tracking-widest">
            [AWAITING INBOUND TRANSMISSIONS]
          </div>
        ) : (
          messages.map((msg, i) => {
            const isSelected = selectedMessage?.id === msg.id
            return (
              <div 
                key={msg.id || i}
                onClick={() => onSelectMessage(msg)}
                className={`flex flex-col p-3 border-b border-ops-border cursor-pointer transition-colors ${
                  isSelected ? 'bg-ops-muted' : 'hover:bg-ops-bg'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex gap-4">
                    <span className="font-mono text-[10px] text-ops-secondary">
                      [{new Date(msg.timestamp).toISOString().slice(11, 19)}]
                    </span>
                    <span className="font-mono text-[10px] text-ops-blueText">
                      [{msg.origin}]
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <span className="font-mono text-[10px] text-ops-greenText tracking-widest">
                      ✓ DECRYPTED
                    </span>
                    <span className="font-mono text-[10px] text-ops-dim w-12 text-right">
                      {msg.total_latency_ms}ms
                    </span>
                  </div>
                </div>
                <div className="font-mono text-sm text-ops-primary pl-1">
                  {msg.plaintext}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
