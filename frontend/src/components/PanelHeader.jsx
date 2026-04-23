import React from "react"
export function PanelHeader({ label, sublabel }) {
  return (
    <div className="border-b border-ops-border px-3 py-2 bg-ops-elevated">
      <div className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">{label}</div>
      {sublabel && <div className="font-mono text-[9px] text-ops-dim mt-0.5">{sublabel}</div>}
    </div>
  )
}
