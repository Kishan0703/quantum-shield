import React, { useState, useEffect, useRef } from 'react'
import { TransmissionConsole } from '../components/TransmissionConsole'
import { InterceptionMonitor } from '../components/InterceptionMonitor'
import { SecurityPanel } from '../components/SecurityPanel'
import { ArchitectureTab } from '../components/ArchitectureTab'
import { socket } from '../socket'

export function CombinedView({ connected = false, messages = [], onSend }) {
  // Ensure all states are initialized with valid defaults
  const [activeTab, setActiveTab] = useState('dashboard')  // 'dashboard' | 'architecture'
  const [securityMode, setSecurityMode] = useState('legacy')  // 'legacy' | 'shielded'
  const [handshaking, setHandshaking] = useState(false)
  const [handshakeProgress, setHandshakeProgress] = useState(0)
  const [handshakeStep, setHandshakeStep] = useState('')
  const [breachState, setBreachState] = useState('none')  // 'none' | 'breached' | 'shielded'
  const [attackPhase, setAttackPhase] = useState('idle')  // 'idle' | 'running' | 'breached'
  const [probePhase, setProbePhase] = useState('idle')    // 'idle' | 'running' | 'blocked'
  
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { hour12: false }) + ' UTC')

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { hour12: false }) + ' UTC')
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleShieldClick = () => {
    if (securityMode === 'shielded' || handshaking) return
    
    setHandshaking(true)
    setHandshakeProgress(0)
    setHandshakeStep('GENERATING ML-KEM-768 KEYPAIR...')
    
    const interval = setInterval(() => {
      setHandshakeProgress(prev => {
        const next = prev + Math.random() * 6 + 2
        if (next >= 100) {
          clearInterval(interval)
          setHandshaking(false)
          setSecurityMode('shielded')
          setBreachState('none')
          setAttackPhase('idle')
          setProbePhase('idle')
          return 100
        }
        
        if (next < 25) setHandshakeStep('GENERATING ML-KEM-768 KEYPAIR...')
        else if (next < 50) setHandshakeStep('LOADING NIST FIPS 203 PARAMETERS...')
        else if (next < 75) setHandshakeStep('ACTIVATING SIDECAR WRAPPER...')
        else setHandshakeStep('QUANTUM-SHIELD ONLINE')
        
        return next
      })
    }, 60)
  }

  const handleLegacyClick = () => {
    if (handshaking) return
    setSecurityMode('legacy')
    setBreachState('none')
    setAttackPhase('idle')
    setProbePhase('idle')
  }

  const handleSendMessage = (text) => {
    if (onSend) {
      onSend(text)
    } else {
      socket.emit('demo_send_message', { text })
    }
  }

  // Render the Dashboard columns as a reusable sub-component or function
  const renderDashboard = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', height: 'calc(100vh - 150px)', position: 'relative' }}>
      <div style={{ borderRight: '1px solid #1e2d40', overflowY: 'auto' }}>
        <TransmissionConsole 
          connected={connected} 
          onSend={handleSendMessage} 
          securityMode={securityMode} 
        />
      </div>
      <div style={{ borderRight: '1px solid #1e2d40', overflowY: 'auto' }}>
        <InterceptionMonitor 
          messages={messages} 
          breachState={breachState || 'none'} 
        />
      </div>
      <div style={{ overflowY: 'auto' }}>
        <SecurityPanel 
          securityMode={securityMode || 'legacy'}
          attackPhase={attackPhase || 'idle'}
          setAttackPhase={setAttackPhase}
          probePhase={probePhase || 'idle'}
          setProbePhase={setProbePhase}
          setBreachState={setBreachState}
          messages={messages}
        />
      </div>

      {/* Handshake Overlay */}
      {handshaking && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(8,12,20,0.93)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '12px', zIndex: 20
        }}>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: '#d4a843',
            letterSpacing: '3px', animation: 'blink 0.7s infinite' }}>
            HANDSHAKING WITH SIDECAR...
          </div>
          <div style={{ width: '200px', height: '1px', background: '#1e2d40' }}>
            <div style={{ height: '1px', background: '#d4a843', width: `${handshakeProgress}%`,
              transition: 'width 0.08s' }} />
          </div>
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', color: '#6b7a8d',
            letterSpacing: '2px' }}>
            {handshakeStep}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', 
      background: securityMode === 'legacy' 
        ? 'linear-gradient(180deg, #0a0c10 0%, #0f0808 100%)' 
        : 'linear-gradient(180deg, #080c14 0%, #080f0c 100%)',
      color: '#c9d4e0', overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e2d40', background: '#0d1220' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'JetBrains Mono', fontSize: '10px' }}>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ fontWeight: 600, letterSpacing: '2px' }}>QUANTUM-SHIELD TACTICAL DEFENSE SYSTEM</span>
            <span style={{ color: '#3d4f63' }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6b7a8d' }}>SECURITY ENFORCEMENT:</span>
              <button 
                onClick={handleLegacyClick}
                style={{
                  fontFamily: 'JetBrains Mono', fontSize: '10px', uppercase: 'true', trackingWidest: 'true',
                  padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s',
                  background: securityMode === 'legacy' ? '#2d1a1a' : 'transparent',
                  color: securityMode === 'legacy' ? '#e57373' : '#6b7a8d',
                  border: securityMode === 'legacy' ? '1px solid #e57373' : '1px solid #1e2d40',
                  borderRadius: 0, outline: 'none'
                }}
              >
                RSA-2048 LEGACY
              </button>
              <button 
                onClick={handleShieldClick}
                style={{
                  fontFamily: 'JetBrains Mono', fontSize: '10px', uppercase: 'true', trackingWidest: 'true',
                  padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s',
                  background: securityMode === 'shielded' ? '#0f2318' : 'transparent',
                  color: securityMode === 'shielded' ? '#52c48a' : '#6b7a8d',
                  border: securityMode === 'shielded' ? '1px solid #52c48a' : '1px solid #1e2d40',
                  borderRadius: 0, outline: 'none'
                }}
              >
                ML-KEM-768 SHIELD
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80' }} />
              CONNECTED
            </span>
            <span style={{ color: '#6b7a8d' }}>ML-KEM-768</span>
            <span style={{ color: '#6b7a8d' }}>AES-128-GCM</span>
            <span style={{ color: '#c9d4e0' }}>{time}</span>
          </div>
        </div>
        <div style={{ height: '1px', background: '#1e2d40', margin: '12px 0' }} />
        <div style={{ fontFamily: 'JetBrains Mono', fontSize: '9px', color: '#3d4f63', letterSpacing: '1px' }}>
          UNCLASSIFIED // FOR OFFICIAL USE ONLY // HACKATHON PROTOTYPE // NOT FOR OPERATIONAL USE
        </div>
      </div>

      {/* Tabs Bar */}
      <div style={{ borderBottom: '1px solid #1e2d40', background: '#0d1220', display: 'flex' }}>
        <button 
          onClick={() => setActiveTab('dashboard')}
          style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px', uppercase: 'true', trackingWidest: 'widest',
            padding: '12px 24px', cursor: 'pointer', transition: 'colors', border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'dashboard' ? '2px solid #c9d4e0' : '2px solid transparent',
            color: activeTab === 'dashboard' ? '#c9d4e0' : '#6b7a8d', outline: 'none'
          }}
        >
          OPERATIONAL DASHBOARD
        </button>
        <button 
          onClick={() => setActiveTab('architecture')}
          style={{
            fontFamily: 'JetBrains Mono', fontSize: '10px', uppercase: 'true', trackingWidest: 'widest',
            padding: '12px 24px', cursor: 'pointer', transition: 'colors', border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'architecture' ? '2px solid #c9d4e0' : '2px solid transparent',
            color: activeTab === 'architecture' ? '#c9d4e0' : '#6b7a8d', outline: 'none'
          }}
        >
          ARCHITECTURE
        </button>
      </div>

      {/* Main Content with Safety Fallback */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {activeTab === 'architecture' ? (
          <ArchitectureTab />
        ) : (
          /* Fallback: If tab is 'dashboard' or any unknown state, show dashboard */
          renderDashboard()
        )}
      </div>
    </div>
  )
}
