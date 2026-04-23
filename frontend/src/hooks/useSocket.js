import React, { useState, useEffect } from 'react'
import { socket } from '../socket'

export function useSocket() {
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState([])
  const [redTeamState, setRedTeamState] = useState({ status: 'idle', logs: [], progress: 0 })
  const [blueTeamState, setBlueTeamState] = useState({ status: 'idle', logs: [] })
  const [metrics, setMetrics] = useState({ message_count: 0, avg_latency_ms: 0, uptime_seconds: 0 })
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    socket.on('message_received', (data) => {
      setMessages(prev => {
        const updated = [...prev, { ...data, id: Date.now() }]
        return updated.slice(-100) // keep last 100
      })
      setSelectedMessage({ ...data, id: Date.now() })
      setMetrics(prev => ({
        ...prev,
        message_count: prev.message_count + 1,
        avg_latency_ms: data.total_latency_ms
      }))
    })

    socket.on('red_team_breach', (data) => {
      setRedTeamState(prev => ({
        ...prev,
        status: data.status,
        progress: data.progress || prev.progress,
        result: data.status === 'breached' ? data : prev.result,
        logs: data.log_line ? [...prev.logs, data.log_line] : prev.logs
      }))
    })

    socket.on('blue_team_block', (data) => {
      setBlueTeamState(prev => ({
        ...prev,
        status: data.status,
        result: data.status === 'blocked' ? data : prev.result,
        logs: data.log_line ? [...prev.logs, data.log_line] : prev.logs
      }))
    })

    socket.on('session_stats', (data) => {
      setMetrics(data)
    })

    return () => socket.off()
  }, [])

  return { connected, messages, redTeamState, blueTeamState, metrics, selectedMessage, setSelectedMessage }
}
