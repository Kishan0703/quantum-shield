import React, { useState } from 'react'

export function ArchitectureTab() {
  const [activeSub, setActiveSub] = useState('flow') // 'flow' | 'layer' | 'crypto'

  const tabs = [
    { id: 'flow', label: 'SYSTEM FLOW' },
    { id: 'layer', label: 'LAYER DIAGRAM' },
    { id: 'crypto', label: 'CRYPTO DETAIL' }
  ]

  return (
    <div className="flex flex-col h-full bg-[#080c14]">
      {/* Sub-tab bar */}
      <div className="flex border-b border-[#1e2d40] bg-[#0d1220]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSub(tab.id)}
            className={`font-mono text-[9px] uppercase tracking-widest px-6 py-3 border-b-2 transition-colors cursor-pointer ${
              activeSub === tab.id ? 'border-[#c9d4e0] text-[#c9d4e0]' : 'border-transparent text-[#6b7a8d] hover:text-[#c9d4e0]'
            }`}
          >
            [ {tab.label} ]
          </button>
        ))}
      </div>

      <div className="flex-1 p-8 flex items-center justify-center overflow-auto">
        {activeSub === 'flow' && <SystemFlowSVG />}
        {activeSub === 'layer' && <LayerDiagramSVG />}
        {activeSub === 'crypto' && <CryptoDetailSVG />}
      </div>
    </div>
  )
}

function SVGStyles() {
  return (
    <style>
      {`
        @keyframes nodeIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes arrowIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dataFlow {
          0%   { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
      `}
    </style>
  )
}

function SystemFlowSVG() {
  return (
    <svg width="100%" viewBox="0 0 900 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <SVGStyles />
      <text x="0" y="20" fontSize="11" fill="#6b7a8d" letterSpacing="2" fontFamily="JetBrains Mono">SYSTEM ARCHITECTURE — DATA FLOW</text>
      
      {/* Node 1 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0s', opacity: 0 }}>
        <rect x="0" y="98" width="140" height="64" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="70" y="128" fontSize="10" fill="#c9d4e0" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono">FIELD RADIO</text>
        <text x="70" y="142" fontSize="9" fill="#6b7a8d" textAnchor="middle" fontFamily="JetBrains Mono">Legacy hardware</text>
      </g>

      <line x1="140" y1="130" x2="174" y2="130" stroke="#1e2d40" strokeWidth="1" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.4s', opacity: 0 }} />
      <polygon points="180,130 174,127 174,133" fill="#1e2d40" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.4s', opacity: 0 }} />

      {/* Node 2 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0.3s', opacity: 0 }}>
        <rect x="180" y="98" width="140" height="64" fill="#0d1220" stroke="#c0392b" strokeWidth="1" />
        <text x="250" y="128" fontSize="10" fill="#c9d4e0" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono">RSA-2048 LAYER</text>
        <text x="250" y="142" fontSize="9" fill="#6b7a8d" textAnchor="middle" fontFamily="JetBrains Mono">Existing firmware</text>
        <text x="250" y="205" fontSize="9" fill="#e57373" textAnchor="middle" fontFamily="JetBrains Mono">⚠ VULNERABLE TO SHOR'S ALGORITHM</text>
      </g>

      <line x1="320" y1="130" x2="374" y2="130" stroke="#1e2d40" strokeWidth="1" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.7s', opacity: 0 }} />
      <polygon points="380,130 374,127 374,133" fill="#1e2d40" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.7s', opacity: 0 }} />

      {/* Node 3 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0.6s', opacity: 0 }}>
        <rect x="380" y="98" width="140" height="64" fill="#0f2318" stroke="#52c48a" strokeWidth="2" />
        <text x="450" y="128" fontSize="10" fill="#c9d4e0" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono">QUANTUM-SHIELD</text>
        <text x="450" y="142" fontSize="9" fill="#6b7a8d" textAnchor="middle" fontFamily="JetBrains Mono">ML-KEM-768 sidecar</text>
        <text x="450" y="70" fontSize="9" fill="#d4a843" textAnchor="middle" fontFamily="JetBrains Mono">▼ QUANTUM-SHIELD SIDECAR</text>
        <text x="450" y="82" fontSize="9" fill="#d4a843" textAnchor="middle" fontFamily="JetBrains Mono">SOFTWARE ONLY — NO HARDWARE CHANGE</text>
      </g>

      <line x1="520" y1="130" x2="574" y2="130" stroke="#1e2d40" strokeWidth="1" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1s', opacity: 0 }} />
      <polygon points="580,130 574,127 574,133" fill="#1e2d40" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1s', opacity: 0 }} />

      {/* Node 4 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0.9s', opacity: 0 }}>
        <rect x="580" y="98" width="140" height="64" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="650" y="128" fontSize="10" fill="#c9d4e0" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono">TACTICAL LINK</text>
        <text x="650" y="142" fontSize="9" fill="#6b7a8d" textAnchor="middle" fontFamily="JetBrains Mono">TCP socket</text>
      </g>

      <line x1="720" y1="130" x2="754" y2="130" stroke="#1e2d40" strokeWidth="1" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.3s', opacity: 0 }} />
      <polygon points="760,130 754,127 754,133" fill="#1e2d40" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.3s', opacity: 0 }} />

      {/* Node 5 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '1.2s', opacity: 0 }}>
        <rect x="760" y="98" width="140" height="64" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="830" y="128" fontSize="10" fill="#c9d4e0" fontWeight="600" textAnchor="middle" fontFamily="JetBrains Mono">COMMAND CENTER</text>
        <text x="830" y="142" fontSize="9" fill="#6b7a8d" textAnchor="middle" fontFamily="JetBrains Mono">Decapsulate + decrypt</text>
      </g>

      {/* Data Flow */}
      <path d="M70,130 L250,130" stroke="#e57373" strokeWidth="1" strokeDasharray="4 4" style={{ animation: 'dataFlow 1s linear infinite', animationDelay: '1.5s', opacity: 0 }} />
      <path d="M250,130 L450,130 L650,130 L830,130" stroke="#52c48a" strokeWidth="1" strokeDasharray="4 4" style={{ animation: 'dataFlow 1s linear infinite', animationDelay: '1.5s', opacity: 0 }} />
    </svg>
  )
}

function LayerDiagramSVG() {
  return (
    <svg width="100%" viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg">
      <SVGStyles />
      <text x="80" y="40" fontSize="11" fill="#6b7a8d" letterSpacing="2" fontFamily="JetBrains Mono">SIDECAR ARCHITECTURE — LAYER DIAGRAM</text>
      
      {/* Layer 1 (bottom) */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0s', opacity: 0 }}>
        <rect x="80" y="300" width="560" height="64" fill="#2d1a1a" stroke="#c0392b" strokeWidth="1" />
        <text x="100" y="325" fontSize="10" fill="#e57373" fontWeight="600" fontFamily="JetBrains Mono">LEGACY RADIO — RSA-2048</text>
        <text x="100" y="340" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">Existing radio firmware layer</text>
        <text x="670" y="332" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">← UNTOUCHED LEGACY HARDWARE</text>
        <text x="670" y="344" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">   RSA-2048 firmware unchanged</text>
        <text x="670" y="356" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">   No procurement needed</text>
      </g>

      <text x="360" y="290" fontSize="14" fill="#1e2d40" textAnchor="middle" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.6s', opacity: 0 }}>↑</text>

      {/* Layer 2 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0.5s', opacity: 0 }}>
        <rect x="80" y="220" width="560" height="64" fill="#0f2318" stroke="#52c48a" strokeWidth="2" />
        <text x="100" y="245" fontSize="10" fill="#52c48a" fontWeight="600" fontFamily="JetBrains Mono">★ QUANTUM-SHIELD SIDECAR (NEW)</text>
        <text x="100" y="260" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">Module-LWE Lattice Encapsulation</text>
        <text x="670" y="240" fontSize="9" fill="#52c48a" fontFamily="JetBrains Mono">← SOFTWARE SIDECAR</text>
        <text x="670" y="252" fontSize="9" fill="#52c48a" fontFamily="JetBrains Mono">   Zero hardware change</text>
        <text x="670" y="264" fontSize="9" fill="#52c48a" fontFamily="JetBrains Mono">   Deployed in hours</text>
        <text x="670" y="276" fontSize="9" fill="#52c48a" fontFamily="JetBrains Mono">   NIST FIPS 203 (2024)</text>
        <path d="M650,225 L660,225 L660,279 L650,279" stroke="#52c48a" strokeWidth="1.5" fill="none" />
      </g>

      <text x="360" y="210" fontSize="14" fill="#1e2d40" textAnchor="middle" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.1s', opacity: 0 }}>↑</text>

      {/* Layer 3 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '1s', opacity: 0 }}>
        <rect x="80" y="140" width="560" height="64" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="100" y="165" fontSize="10" fill="#c9d4e0" fontWeight="600" fontFamily="JetBrains Mono">TACTICAL DATA LINK</text>
        <text x="100" y="180" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">TCP/IP encrypted tunnel</text>
      </g>

      <text x="360" y="130" fontSize="14" fill="#1e2d40" textAnchor="middle" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.6s', opacity: 0 }}>↑</text>

      {/* Layer 4 */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '1.5s', opacity: 0 }}>
        <rect x="80" y="60" width="560" height="64" fill="#0d1220" stroke="#1e2d40" strokeWidth="1" />
        <text x="100" y="85" fontSize="10" fill="#c9d4e0" fontWeight="600" fontFamily="JetBrains Mono">COMMAND CENTER</text>
        <text x="100" y="100" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">Tactical display & analysis</text>
      </g>
    </svg>
  )
}

function CryptoDetailSVG() {
  return (
    <svg width="100%" viewBox="0 0 900 460" fill="none" xmlns="http://www.w3.org/2000/svg">
      <SVGStyles />
      <text x="20" y="20" fontSize="11" fill="#6b7a8d" letterSpacing="2" fontFamily="JetBrains Mono">HYBRID CRYPTOGRAPHIC CONSTRUCTION</text>
      
      <text x="220" y="50" fontSize="10" fill="#5fa8d4" letterSpacing="1" textAnchor="middle" fontFamily="JetBrains Mono">ML-KEM-768 KEY EXCHANGE</text>
      <text x="680" y="50" fontSize="10" fill="#52c48a" letterSpacing="1" textAnchor="middle" fontFamily="JetBrains Mono">AES-128-GCM ENCRYPTION</text>

      {/* Left Column */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0s', opacity: 0 }}>
        <rect x="80" y="60" width="280" height="80" fill="#0d1220" stroke="#5fa8d4" strokeWidth="1" />
        <line x1="80" y1="60" x2="80" y2="140" stroke="#5fa8d4" strokeWidth="2" />
        <text x="95" y="85" fontSize="10" fill="#5fa8d4" fontWeight="600" fontFamily="JetBrains Mono">COMMAND CENTER</text>
        <text x="95" y="105" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">generates (pk, sk) keypair</text>
      </g>
      <text x="220" y="180" fontSize="12" fill="#1e2d40" textAnchor="middle" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.4s', opacity: 0 }}>↓</text>
      <text x="220" y="165" fontSize="8" fill="#3d4f63" textAnchor="middle" fontFamily="JetBrains Mono">pk shared once (pre-shared)</text>

      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0.5s', opacity: 0 }}>
        <rect x="80" y="200" width="280" height="80" fill="#0d1220" stroke="#5fa8d4" strokeWidth="1" />
        <line x1="80" y1="200" x2="80" y2="280" stroke="#5fa8d4" strokeWidth="2" />
        <text x="95" y="225" fontSize="10" fill="#5fa8d4" fontWeight="600" fontFamily="JetBrains Mono">FIELD UNIT</text>
        <text x="95" y="245" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">encapsulate(pk) → kem_ct + shared_secret</text>
      </g>
      <text x="220" y="320" fontSize="12" fill="#1e2d40" textAnchor="middle" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.9s', opacity: 0 }}>↓</text>
      <text x="220" y="305" fontSize="8" fill="#3d4f63" textAnchor="middle" fontFamily="JetBrains Mono">kem_ct transmitted (1088 bytes)</text>

      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '1s', opacity: 0 }}>
        <rect x="80" y="340" width="280" height="80" fill="#0d1220" stroke="#5fa8d4" strokeWidth="1" />
        <line x1="80" y1="340" x2="80" y2="420" stroke="#5fa8d4" strokeWidth="2" />
        <text x="95" y="365" fontSize="10" fill="#5fa8d4" fontWeight="600" fontFamily="JetBrains Mono">COMMAND CENTER</text>
        <text x="95" y="385" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">decapsulate(sk, kem_ct) → shared_secret</text>
      </g>

      {/* Right Column */}
      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0.2s', opacity: 0 }}>
        <rect x="540" y="60" width="280" height="80" fill="#0d1220" stroke="#52c48a" strokeWidth="1" />
        <line x1="540" y1="60" x2="540" y2="140" stroke="#52c48a" strokeWidth="2" />
        <text x="555" y="85" fontSize="10" fill="#52c48a" fontWeight="600" fontFamily="JetBrains Mono">shared_secret[:16]</text>
        <text x="555" y="105" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">→ AES-128 key (16 bytes)</text>
      </g>
      <text x="680" y="180" fontSize="12" fill="#1e2d40" textAnchor="middle" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '0.6s', opacity: 0 }}>↓</text>

      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '0.7s', opacity: 0 }}>
        <rect x="540" y="200" width="280" height="80" fill="#0d1220" stroke="#52c48a" strokeWidth="1" />
        <line x1="540" y1="200" x2="540" y2="280" stroke="#52c48a" strokeWidth="2" />
        <text x="555" y="225" fontSize="10" fill="#52c48a" fontWeight="600" fontFamily="JetBrains Mono">AES-128-GCM ENCRYPT</text>
        <text x="555" y="245" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">nonce(16) + tag(16) + ciphertext</text>
      </g>
      <text x="680" y="320" fontSize="12" fill="#1e2d40" textAnchor="middle" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.1s', opacity: 0 }}>↓</text>

      <g style={{ animation: 'nodeIn 0.5s ease forwards', animationDelay: '1.2s', opacity: 0 }}>
        <rect x="540" y="340" width="280" height="80" fill="#0d1220" stroke="#52c48a" strokeWidth="1" />
        <line x1="540" y1="340" x2="540" y2="420" stroke="#52c48a" strokeWidth="2" />
        <text x="555" y="365" fontSize="10" fill="#52c48a" fontWeight="600" fontFamily="JetBrains Mono">AES-128-GCM DECRYPT</text>
        <text x="555" y="385" fontSize="9" fill="#6b7a8d" fontFamily="JetBrains Mono">verify tag → plaintext ✓</text>
      </g>

      {/* Bridges */}
      <line x1="360" y1="240" x2="540" y2="240" stroke="#d4a843" strokeDasharray="4 3" strokeWidth="1" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.3s', opacity: 0 }} />
      <text x="450" y="230" fontSize="9" fill="#d4a843" textAnchor="middle" fontFamily="JetBrains Mono" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.3s', opacity: 0 }}>shared_secret</text>
      <text x="450" y="242" fontSize="9" fill="#d4a843" textAnchor="middle" fontFamily="JetBrains Mono" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.3s', opacity: 0 }}>32 bytes</text>
      <text x="450" y="268" fontSize="8" fill="#3d4f63" textAnchor="middle" fontFamily="JetBrains Mono" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.3s', opacity: 0 }}>ML-KEM establishes → AES uses first 16 bytes</text>

      <line x1="360" y1="380" x2="540" y2="380" stroke="#d4a843" strokeDasharray="4 3" strokeWidth="1" style={{ animation: 'arrowIn 0.5s ease forwards', animationDelay: '1.5s', opacity: 0 }} />
    </svg>
  )
}
