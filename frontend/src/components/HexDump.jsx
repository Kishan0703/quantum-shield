import React from "react"
export function HexDump({ hexString, label, byteCount }) {
  if (!hexString) return (
    <div className="font-mono text-[10px] text-ops-dim">[AWAITING DATA]</div>
  )

  // Split hex string into chunks of 32 chars (16 bytes per row)
  const rows = []
  for (let i = 0; i < hexString.length; i += 32) {
    rows.push(hexString.slice(i, i + 32))
  }

  return (
    <div>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ops-secondary">{label}</span>
          {byteCount && <span className="font-mono text-[10px] text-ops-blueText">{byteCount} bytes</span>}
        </div>
      )}
      <div className="border border-ops-border bg-ops-bg p-2 overflow-x-auto">
        {rows.map((row, i) => {
          const offset = (i * 16).toString(16).padStart(4, '0')
          const bytes = []
          for (let j = 0; j < row.length; j += 2) bytes.push(row.slice(j, j + 2))
          const left = bytes.slice(0, 8).join(' ')
          const right = bytes.slice(8).join(' ')
          return (
            <div key={i} className="font-mono text-[10px] text-ops-dim leading-5 whitespace-pre">
              <span className="text-ops-dim">{offset}:  </span>
              <span className="text-ops-secondary">{left}</span>
              {right && <span className="text-ops-secondary">  {right}</span>}
            </div>
          )
        })}
        {byteCount && hexString.length < byteCount * 2 && (
          <div className="font-mono text-[10px] text-ops-dim mt-1">[... {byteCount - (hexString.length / 2)} bytes remaining ...]</div>
        )}
      </div>
    </div>
  )
}
