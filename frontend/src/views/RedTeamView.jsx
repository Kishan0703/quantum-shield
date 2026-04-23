import React from "react"
import { Header } from '../components/Header'
import { TransmissionConsole } from '../components/TransmissionConsole'
import { InterceptionMonitor } from '../components/InterceptionMonitor'
import { RsaCrackSimulation } from '../components/RsaCrackSimulation'
import { socket } from '../socket'

export function RedTeamView({ connected, messages, redTeamState, onViewChange }) {
  
  const handleSend = (text) => {
    // In a real app, this would hit Laptop A's local server.
    // For the demo, we mock it via Laptop B's socket to show UI feedback.
    socket.emit('demo_send_message', { text })
  }

  const handleRunSimulation = () => {
    socket.emit('run_simulation')
  }

  return (
    <div className="bg-ops-bg min-h-screen flex flex-col">
      <Header connected={connected} currentView="red" onViewChange={onViewChange} />
      
      <div className="flex-1 grid grid-cols-3">
        <div className="border-r border-ops-border bg-ops-surface overflow-y-auto">
          <TransmissionConsole connected={connected} onSend={handleSend} />
        </div>
        
        <div className="border-r border-ops-border bg-ops-surface overflow-y-auto">
          <InterceptionMonitor messages={messages} shieldActive={false} />
        </div>
        
        <div className="bg-ops-surface overflow-y-auto">
          <RsaCrackSimulation redTeamState={redTeamState} onRunSimulation={handleRunSimulation} />
        </div>
      </div>
    </div>
  )
}
