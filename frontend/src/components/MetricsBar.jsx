import React from "react"
import { useState, useEffect } from 'react'
import { LineChart, Line } from 'recharts'

export function MetricsBar({ metrics }) {
  const [latencyHistory, setLatencyHistory] = useState([])

  useEffect(() => {
    if (metrics.avg_latency_ms > 0) {
      setLatencyHistory(prev => {
        const next = [...prev, { value: metrics.avg_latency_ms }]
        return next.slice(-60)
      })
    }
  }, [metrics.avg_latency_ms])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${h}:${m}:${s}`
  }

  return (
    <div className="bg-ops-surface border-t border-ops-border h-12 flex items-center px-4">
      <div className="flex items-center h-full w-full justify-between">
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">MESSAGES RECEIVED</span>
          <span className="font-mono text-sm text-ops-primary">{metrics.message_count}</span>
        </div>

        <div className="h-6 w-px bg-ops-border" />

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">AVG LATENCY</span>
          <div className="flex items-center gap-2">
            <LineChart width={80} height={28} data={latencyHistory}>
              <Line type="monotone" dataKey="value" stroke="#52c48a" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </LineChart>
            <span className="font-mono text-sm text-ops-greenText">{metrics.avg_latency_ms}ms</span>
          </div>
        </div>

        <div className="h-6 w-px bg-ops-border" />

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">UPTIME</span>
          <span className="font-mono text-sm text-ops-primary">{formatTime(metrics.uptime_seconds)}</span>
        </div>

        <div className="h-6 w-px bg-ops-border" />

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">RSA-2048</span>
          <span className="font-mono text-sm text-ops-amberText">⚠ VULNERABLE</span>
        </div>

        <div className="h-6 w-px bg-ops-border" />

        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-ops-secondary uppercase tracking-widest">ML-KEM-768</span>
          <span className="font-mono text-sm text-ops-greenText">● NIST LEVEL 3</span>
        </div>

      </div>
    </div>
  )
}
