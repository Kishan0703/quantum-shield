import React from "react"
import { useState } from 'react'
import { Header } from '../components/Header'
import { TransmissionConsole } from '../components/TransmissionConsole'
import { InterceptionMonitor } from '../components/InterceptionMonitor'
import { RsaCrackSimulation } from '../components/RsaCrackSimulation'
import { IncomingFeed } from '../components/IncomingFeed'
import { ShieldStatus } from '../components/ShieldStatus'
import { CryptoInspector } from '../components/CryptoInspector'
import { ComparisonTable } from '../components/ComparisonTable'
import { socket } from '../socket'

export function CombinedView({ connected, messages, redTeamState, blueTeamState, selectedMessage, setSelectedMessage, onViewChange }) {
  const [activeAct, setActiveAct] = useState(1)

  const handleSend = (text) => {
    socket.emit('demo_send_message', { text })
  }

  return (
    <div className="bg-ops-bg min-h-screen flex flex-col">
      <Header connected={connected} currentView="both" onViewChange={onViewChange} />
      
      {/* Act Selector Bar */}
      <div className="flex border-b border-ops-border bg-ops-elevated">
        {[
          { id: 1, label: 'ACT 1: THE THREAT' },
          { id: 2, label: 'ACT 2: THE SOLUTION' },
          { id: 3, label: 'ACT 3: LIVE DEMO' },
          { id: 4, label: 'ACT 4: COMPARISON' }
        ].map(act => (
          <button
            key={act.id}
            onClick={() => setActiveAct(act.id)}
            className={`flex-1 py-3 font-mono text-[10px] uppercase tracking-widest border-r border-ops-border transition-colors ${
              activeAct === act.id 
                ? 'bg-ops-primary text-ops-bg font-bold' 
                : 'text-ops-secondary hover:text-ops-primary hover:bg-ops-surface'
            }`}
          >
            {act.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex min-h-0">
        {activeAct === 1 && (
          <div className="flex-1 grid grid-cols-3">
            <div className="border-r border-ops-border bg-ops-surface overflow-y-auto">
              <TransmissionConsole connected={connected} onSend={handleSend} />
            </div>
            <div className="border-r border-ops-border bg-ops-surface overflow-y-auto">
              <InterceptionMonitor messages={messages} shieldActive={false} />
            </div>
            <div className="bg-ops-surface overflow-y-auto">
              <RsaCrackSimulation redTeamState={redTeamState} onRunSimulation={() => socket.emit('run_simulation')} />
            </div>
          </div>
        )}

        {activeAct === 2 && (
          <div className="flex-1 grid grid-cols-3">
             <div className="border-r border-ops-border bg-ops-surface overflow-y-auto">
              <IncomingFeed messages={messages} selectedMessage={selectedMessage} onSelectMessage={setSelectedMessage} />
            </div>
            <div className="border-r border-ops-border bg-ops-surface overflow-y-auto">
              <ShieldStatus blueTeamState={blueTeamState} onRunProbe={() => socket.emit('run_lattice_probe')} />
            </div>
            <div className="bg-ops-surface overflow-y-auto">
              <CryptoInspector selectedMessage={selectedMessage} />
            </div>
          </div>
        )}

        {activeAct === 3 && (
          <div className="flex-1 grid grid-cols-2">
            <div className="border-r border-ops-border flex flex-col min-h-0">
              <div className="flex-1 border-b border-ops-border min-h-0 bg-ops-surface">
                <TransmissionConsole connected={connected} onSend={handleSend} />
              </div>
              <div className="flex-1 min-h-0 bg-ops-surface">
                <InterceptionMonitor messages={messages} shieldActive={true} />
              </div>
            </div>
            <div className="flex flex-col min-h-0">
              <div className="flex-1 border-b border-ops-border min-h-0 bg-ops-surface">
                <IncomingFeed messages={messages} selectedMessage={selectedMessage} onSelectMessage={setSelectedMessage} />
              </div>
              <div className="flex-1 min-h-0 bg-ops-surface">
                <CryptoInspector selectedMessage={selectedMessage} />
              </div>
            </div>
          </div>
        )}

        {activeAct === 4 && (
          <div className="flex-1 bg-ops-surface overflow-y-auto flex">
            <ComparisonTable />
          </div>
        )}
      </div>
    </div>
  )
}
