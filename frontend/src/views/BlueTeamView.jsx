import React from "react"
import { Header } from '../components/Header'
import { IncomingFeed } from '../components/IncomingFeed'
import { ShieldStatus } from '../components/ShieldStatus'
import { CryptoInspector } from '../components/CryptoInspector'
import { MetricsBar } from '../components/MetricsBar'
import { socket } from '../socket'

export function BlueTeamView({ connected, messages, blueTeamState, metrics, selectedMessage, setSelectedMessage, onViewChange }) {
  
  const handleRunProbe = () => {
    socket.emit('run_lattice_probe')
  }

  return (
    <div className="bg-ops-bg min-h-screen flex flex-col">
      <Header connected={connected} currentView="blue" onViewChange={onViewChange} />
      
      <div className="flex-1 grid grid-cols-3 min-h-0">
        <div className="bg-ops-surface overflow-hidden">
          <IncomingFeed 
            messages={messages} 
            selectedMessage={selectedMessage} 
            onSelectMessage={setSelectedMessage} 
          />
        </div>
        
        <div className="bg-ops-surface overflow-hidden">
          <ShieldStatus blueTeamState={blueTeamState} onRunProbe={handleRunProbe} />
        </div>
        
        <div className="bg-ops-surface overflow-hidden">
          <CryptoInspector selectedMessage={selectedMessage} />
        </div>
      </div>

      <MetricsBar metrics={metrics} />
    </div>
  )
}
