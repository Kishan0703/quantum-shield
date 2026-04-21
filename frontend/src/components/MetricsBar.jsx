import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

function MetricsBar({ metrics }) {
  // Simulate sparkline data
  const data = Array.from({ length: 10 }).map((_, i) => ({ value: Math.random() * 5 + 2 }));

  const formatUptime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":");
  };

  return (
    <div className="bg-panel border border-border p-4 rounded-lg flex flex-wrap justify-between items-center gap-6 shadow-2xl">
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Total Messages</span>
          <span className="text-xl font-mono text-text-primary">{metrics.count}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Avg Latency</span>
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-green-ok">{metrics.avg_ms}ms</span>
            <div className="w-16 h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Session Uptime</span>
          <span className="text-xl font-mono text-text-primary">{formatUptime(metrics.uptime)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-col items-end">
          <span className="text-[9px] text-text-muted uppercase font-black">Legacy Stack</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-red-team">RSA-2048</span>
            <span className="bg-red-team/10 text-red-team text-[8px] px-1.5 py-0.5 rounded border border-red-team/20 font-black">VULNERABLE</span>
          </div>
        </div>

        <div className="w-px h-8 bg-border"></div>

        <div className="flex flex-col items-end">
          <span className="text-[9px] text-text-muted uppercase font-black">Quantum Shield</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-bold text-green-ok">ML-KEM-768</span>
            <span className="bg-green-ok/10 text-green-ok text-[8px] px-1.5 py-0.5 rounded border border-green-ok/20 font-black">NIST LEVEL 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MetricsBar;
