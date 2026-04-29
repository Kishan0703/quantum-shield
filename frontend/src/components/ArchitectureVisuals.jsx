import React from "react"

export function ArchitectureVisuals({ activeSub }) {
  return (
    <div className="flex flex-col h-full bg-ops-surface overflow-hidden">
      <div className="flex-1 p-6 flex items-center justify-center">
        {activeSub === 'flow' && <SystemFlow />}
        {activeSub === 'layer' && <LayerDiagram />}
        {activeSub === 'crypto' && <CryptoDetail />}
      </div>
    </div>
  )
}

function SystemFlow() {
  const fontStyle = { fontFamily: 'JetBrains Mono, Courier New, monospace' }
  return (
    <svg viewBox="0 0 900 200" width="100%" xmlns="http://www.w3.org/2000/svg" className="font-mono">
      <style>{`
        @keyframes nodeAppear {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .node { animation: nodeAppear 0.5s ease-out forwards; opacity: 0; }
        .arrow { animation: nodeAppear 0.5s ease-out forwards; opacity: 0; }
      `}</style>
      
      {/* Nodes */}
      <g className="node" style={{ animationDelay: '0s' }}>
        <rect x="20" y="70" width="140" height="60" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="90" y="100" fill="#c9d4e0" fontSize="11" textAnchor="middle" style={fontStyle}>FIELD RADIO</text>
        <text x="90" y="115" fill="#6b7a8d" fontSize="9" textAnchor="middle" style={fontStyle}>(legacy)</text>
      </g>

      <path d="M 160 100 L 190 100" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="arrow" style={{ animationDelay: '0.15s' }} />

      <g className="node" style={{ animationDelay: '0.3s' }}>
        <rect x="200" y="70" width="140" height="60" fill="#0d1220" stroke="#e57373" strokeWidth="1" />
        <text x="270" y="100" fill="#c9d4e0" fontSize="11" textAnchor="middle" style={fontStyle}>RSA LAYER</text>
        <text x="270" y="115" fill="#6b7a8d" fontSize="9" textAnchor="middle" style={fontStyle}>(legacy)</text>
        <text x="270" y="150" fill="#e57373" fontSize="9" textAnchor="middle" style={fontStyle}>⚠ VULNERABLE TO SHOR'S</text>
      </g>

      <path d="M 340 100 L 370 100" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="arrow" style={{ animationDelay: '0.45s' }} />

      <g className="node" style={{ animationDelay: '0.6s' }}>
        <text x="450" y="50" fill="#d4a843" fontSize="9" textAnchor="middle" style={fontStyle}>▼ QUANTUM-SHIELD SIDECAR</text>
        <text x="450" y="62" fill="#d4a843" fontSize="9" textAnchor="middle" style={fontStyle}>SOFTWARE ONLY — NO HARDWARE CHANGE</text>
        <rect x="380" y="70" width="140" height="60" fill="#0d1220" stroke="#52c48a" strokeWidth="2" />
        <text x="450" y="100" fill="#c9d4e0" fontSize="11" textAnchor="middle" style={fontStyle}>SIDECAR WRAPPER</text>
        <text x="450" y="112" fill="#6b7a8d" fontSize="9" textAnchor="middle" style={fontStyle}>ML-KEM-768</text>
        <text x="450" y="122" fill="#6b7a8d" fontSize="9" textAnchor="middle" style={fontStyle}>AES-128-GCM</text>
      </g>

      <path d="M 520 100 L 550 100" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="arrow" style={{ animationDelay: '0.75s' }} />

      <g className="node" style={{ animationDelay: '0.9s' }}>
        <rect x="560" y="70" width="140" height="60" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="630" y="100" fill="#c9d4e0" fontSize="11" textAnchor="middle" style={fontStyle}>TACTICAL LINK</text>
        <text x="630" y="115" fill="#6b7a8d" fontSize="9" textAnchor="middle" style={fontStyle}>TCP socket</text>
      </g>

      <path d="M 700 100 L 730 100" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="arrow" style={{ animationDelay: '1.05s' }} />

      <g className="node" style={{ animationDelay: '1.2s' }}>
        <rect x="740" y="70" width="140" height="60" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="810" y="95" fill="#c9d4e0" fontSize="11" textAnchor="middle" style={fontStyle}>COMMAND CENTER</text>
        <text x="810" y="110" fill="#6b7a8d" fontSize="9" textAnchor="middle" style={fontStyle}>decapsulate</text>
        <text x="810" y="120" fill="#6b7a8d" fontSize="9" textAnchor="middle" style={fontStyle}>decrypt</text>
      </g>

      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#1e2d40" />
        </marker>
      </defs>
    </svg>
  )
}

function LayerDiagram() {
  const fontStyle = { fontFamily: 'JetBrains Mono, Courier New, monospace' }
  return (
    <svg viewBox="0 0 900 380" width="100%" xmlns="http://www.w3.org/2000/svg" className="font-mono">
      <style>{`
        @keyframes layerAppear {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .layer { animation: layerAppear 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Layer 1 (bottom) */}
      <g className="layer" style={{ animationDelay: '0s' }}>
        <rect x="150" y="280" width="500" height="60" fill="#2d1a1a" stroke="#e57373" strokeWidth="1" />
        <text x="170" y="305" fill="#e57373" fontSize="11" style={fontStyle}>Layer 1: LEGACY RADIO — RSA-2048</text>
        <text x="170" y="325" fill="#e57373" fontSize="9" style={fontStyle}>Existing firmware, unchanged</text>
        <text x="660" y="305" fill="#6b7a8d" fontSize="9" style={fontStyle}>← UNTOUCHED LEGACY HARDWARE</text>
        <text x="660" y="317" fill="#6b7a8d" fontSize="9" style={fontStyle}>   RSA-2048 firmware unchanged</text>
        <text x="660" y="329" fill="#6b7a8d" fontSize="9" style={fontStyle}>   No procurement required</text>
      </g>

      <path d="M 400 280 L 400 250 M 410 250 L 410 280" stroke="#1e2d40" fill="none" className="layer" style={{ animationDelay: '0.2s' }} />

      {/* Layer 2 (sidecar) */}
      <g className="layer" style={{ animationDelay: '0.4s' }}>
        <rect x="150" y="190" width="500" height="60" fill="#0f2318" stroke="#52c48a" strokeWidth="2" />
        <text x="170" y="215" fill="#52c48a" fontSize="11" style={fontStyle}>Layer 2: ★ QUANTUM-SHIELD SIDECAR (NEW LAYER)</text>
        <text x="170" y="235" fill="#52c48a" fontSize="9" style={fontStyle}>ML-KEM-768 encapsulate → AES-128-GCM encrypt</text>
        <text x="660" y="205" fill="#52c48a" fontSize="9" style={fontStyle}>← SOFTWARE SIDECAR</text>
        <text x="660" y="217" fill="#52c48a" fontSize="9" style={fontStyle}>   Zero hardware change</text>
        <text x="660" y="229" fill="#52c48a" fontSize="9" style={fontStyle}>   Deployed in hours</text>
        <text x="660" y="241" fill="#52c48a" fontSize="9" style={fontStyle}>   NIST FIPS 203 (2024)</text>
      </g>

      <path d="M 400 190 L 400 160 M 410 160 L 410 190" stroke="#1e2d40" fill="none" className="layer" style={{ animationDelay: '0.6s' }} />

      {/* Layer 3 */}
      <g className="layer" style={{ animationDelay: '0.8s' }}>
        <rect x="150" y="100" width="500" height="60" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="170" y="125" fill="#c9d4e0" fontSize="11" style={fontStyle}>Layer 3: TACTICAL DATA LINK</text>
        <text x="170" y="145" fill="#c9d4e0" fontSize="9" style={fontStyle}>TCP socket — encrypted payload in transit</text>
      </g>

      <path d="M 400 100 L 400 70 M 410 70 L 410 100" stroke="#1e2d40" fill="none" className="layer" style={{ animationDelay: '1s' }} />

      {/* Layer 4 */}
      <g className="layer" style={{ animationDelay: '1.2s' }}>
        <rect x="150" y="10" width="500" height="60" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="170" y="35" fill="#c9d4e0" fontSize="11" style={fontStyle}>Layer 4: COMMAND CENTER — DECAPSULATION + DECRYPT</text>
        <text x="170" y="55" fill="#c9d4e0" fontSize="9" style={fontStyle}>ML-KEM-768 decapsulate → AES-128-GCM decrypt</text>
      </g>
    </svg>
  )
}

function CryptoDetail() {
  const fontStyle = { fontFamily: 'JetBrains Mono, Courier New, monospace' }
  return (
    <svg viewBox="0 0 900 420" width="100%" xmlns="http://www.w3.org/2000/svg" className="font-mono">
      <style>{`
        @keyframes detailAppear {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .detail { animation: detailAppear 0.5s ease-out forwards; opacity: 0; }
      `}</style>

      {/* Left Column - ML-KEM-768 */}
      <g className="detail" style={{ animationDelay: '0s' }}>
        <rect x="50" y="20" width="300" height="80" fill="#0d1220" stroke="#1e2d40" />
        <line x1="50" y1="20" x2="50" y2="100" stroke="#5fa8d4" strokeWidth="2" />
        <text x="65" y="45" fill="#c9d4e0" fontSize="9" style={fontStyle}>COMMAND CENTER</text>
        <text x="65" y="60" fill="#6b7a8d" fontSize="9" style={fontStyle}>generates keypair</text>
        <text x="65" y="75" fill="#6b7a8d" fontSize="9" style={fontStyle}>pk (1184 bytes)</text>
        <text x="65" y="90" fill="#6b7a8d" fontSize="9" style={fontStyle}>sk (2400 bytes)</text>
      </g>

      <path d="M 200 100 L 200 130" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="detail" style={{ animationDelay: '0.25s' }} />
      <text x="210" y="120" fill="#6b7a8d" fontSize="8" className="detail" style={{ animationDelay: '0.25s', ...fontStyle }}>pk shared once (pre-shared)</text>

      <g className="detail" style={{ animationDelay: '0.5s' }}>
        <rect x="50" y="140" width="300" height="100" fill="#0d1220" stroke="#1e2d40" />
        <line x1="50" y1="140" x2="50" y2="240" stroke="#5fa8d4" strokeWidth="2" />
        <text x="65" y="165" fill="#c9d4e0" fontSize="9" style={fontStyle}>FIELD UNIT</text>
        <text x="65" y="180" fill="#6b7a8d" fontSize="9" style={fontStyle}>encapsulate(pk)</text>
        <text x="65" y="205" fill="#5fa8d4" fontSize="9" style={fontStyle}>→ kem_ct 1088 bytes</text>
        <text x="65" y="220" fill="#5fa8d4" fontSize="9" style={fontStyle}>→ shared_secret 32 bytes</text>
      </g>

      <path d="M 200 240 L 200 270" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="detail" style={{ animationDelay: '0.75s' }} />
      <text x="210" y="260" fill="#6b7a8d" fontSize="8" className="detail" style={{ animationDelay: '0.75s', ...fontStyle }}>kem_ct transmitted</text>

      <g className="detail" style={{ animationDelay: '1.0s' }}>
        <rect x="50" y="280" width="300" height="80" fill="#0d1220" stroke="#1e2d40" />
        <line x1="50" y1="280" x2="50" y2="360" stroke="#5fa8d4" strokeWidth="2" />
        <text x="65" y="305" fill="#c9d4e0" fontSize="9" style={fontStyle}>COMMAND CENTER</text>
        <text x="65" y="320" fill="#6b7a8d" fontSize="9" style={fontStyle}>decapsulate(sk, kem_ct)</text>
        <text x="65" y="345" fill="#5fa8d4" fontSize="9" style={fontStyle}>→ shared_secret 32 bytes</text>
      </g>

      {/* Bridge */}
      <text x="450" y="225" fill="#d4a843" fontSize="9" textAnchor="middle" className="detail" style={{ animationDelay: '1.5s', ...fontStyle }}>shared_secret (32 bytes)</text>
      <path d="M 360 230 L 540 230" stroke="#d4a843" strokeDasharray="4" className="detail" style={{ animationDelay: '1.5s' }} />
      <text x="450" y="245" fill="#d4a843" fontSize="8" textAnchor="middle" className="detail" style={{ animationDelay: '1.5s', ...fontStyle }}>←───────────→</text>
      <text x="450" y="260" fill="#6b7a8d" fontSize="8" textAnchor="middle" className="detail" style={{ animationDelay: '1.5s', ...fontStyle }}>ML-KEM establishes secret | AES uses first 16 bytes</text>

      {/* Right Column - AES-128-GCM */}
      <g className="detail" style={{ animationDelay: '0.3s' }}>
        <rect x="550" y="140" width="300" height="40" fill="#0d1220" stroke="#1e2d40" />
        <line x1="550" y1="140" x2="550" y2="180" stroke="#52c48a" strokeWidth="2" />
        <text x="565" y="165" fill="#c9d4e0" fontSize="9" style={fontStyle}>shared_secret[:16] → AES-128 key</text>
      </g>

      <path d="M 700 180 L 700 210" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="detail" style={{ animationDelay: '0.55s' }} />

      <g className="detail" style={{ animationDelay: '0.8s' }}>
        <rect x="550" y="220" width="300" height="80" fill="#0d1220" stroke="#1e2d40" />
        <line x1="550" y1="220" x2="550" y2="300" stroke="#52c48a" strokeWidth="2" />
        <text x="565" y="245" fill="#c9d4e0" fontSize="9" style={fontStyle}>AES-128-GCM encrypt(key, msg)</text>
        <text x="565" y="260" fill="#6b7a8d" fontSize="9" style={fontStyle}>nonce: 16 bytes | tag: 16 bytes</text>
        <text x="565" y="285" fill="#52c48a" fontSize="9" style={fontStyle}>→ blob transmitted</text>
      </g>

      <path d="M 700 300 L 700 330" stroke="#1e2d40" markerEnd="url(#arrowhead)" className="detail" style={{ animationDelay: '1.05s' }} />

      <g className="detail" style={{ animationDelay: '1.3s' }}>
        <rect x="550" y="340" width="300" height="40" fill="#0d1220" stroke="#1e2d40" />
        <line x1="550" y1="340" x2="550" y2="380" stroke="#52c48a" strokeWidth="2" />
        <text x="565" y="365" fill="#c9d4e0" fontSize="9" style={fontStyle}>AES-128-GCM decrypt + verify → plaintext ✓</text>
      </g>

      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#1e2d40" />
        </marker>
      </defs>
    </svg>
  )
}
