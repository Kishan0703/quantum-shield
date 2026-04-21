import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import Header from './components/Header';
import RedTeamPanel from './components/RedTeamPanel';
import BlueTeamPanel from './components/BlueTeamPanel';
import LiveFeed from './components/LiveFeed';
import CryptoInspector from './components/CryptoInspector';
import MetricsBar from './components/MetricsBar';

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [redTeamState, setRedTeamState] = useState("idle"); // idle, attacking, breached
  const [blueTeamState, setBlueTeamState] = useState("idle"); // idle, probing, blocked
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [metrics, setMetrics] = useState({ count: 0, avg_ms: 0, uptime: 0 });

  useEffect(() => {
    function onConnect() {
      setConnected(true);
    }

    function onDisconnect() {
      setConnected(false);
    }

    function onMessageReceived(msg) {
      setMessages(prev => [msg, ...prev].slice(0, 50));
      setSelectedMessage(msg);
    }

    function onRedTeamBreach(data) {
      setRedTeamState(data.status);
    }

    function onBlueTeamBlock(data) {
      setBlueTeamState(data.status);
    }

    function onSessionStats(stats) {
      setMetrics(stats);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message_received', onMessageReceived);
    socket.on('red_team_breach', onRedTeamBreach);
    socket.on('blue_team_block', onBlueTeamBlock);
    socket.on('session_stats', onSessionStats);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message_received', onMessageReceived);
      socket.off('red_team_breach', onRedTeamBreach);
      socket.off('blue_team_block', onBlueTeamBlock);
      socket.off('session_stats', onSessionStats);
    };
  }, []);

  return (
    <div className="min-h-screen bg-primary text-primary flex flex-col p-4 gap-4">
      <Header connected={connected} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RedTeamPanel state={redTeamState} onAction={() => socket.emit('run_simulation')} />
            <BlueTeamPanel state={blueTeamState} onAction={() => socket.emit('run_lattice_probe')} />
          </div>
          <CryptoInspector message={selectedMessage} />
        </div>
        
        <LiveFeed messages={messages} onSelect={setSelectedMessage} />
      </div>

      <MetricsBar metrics={metrics} />
    </div>
  );
}

export default App;
