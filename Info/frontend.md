# Quantum-Shield — Frontend Specification

## Overview

React + Tailwind CSS dashboard. Connects to Laptop B's Flask-SocketIO server via WebSocket. Visualizes real-time encrypted message flow, Red Team breach simulation, and Blue Team lattice shield.

---

## Tech Stack

- React 18 (Vite)
- Tailwind CSS
- socket.io-client
- recharts (for metrics graphs)

---

## Color Palette & Theme

Dark military/tactical aesthetic.

| Token | Hex | Usage |
|---|---|---|
| `bg-primary` | `#0a0e1a` | Main background |
| `bg-panel` | `#111827` | Panel/card background |
| `bg-panel-light` | `#1f2937` | Elevated card |
| `red-team` | `#ef4444` | Red Team, breached state, danger |
| `blue-team` | `#3b82f6` | Blue Team, shield active, safe |
| `amber-warn` | `#f59e0b` | Warnings, RSA indicators |
| `green-ok` | `#10b981` | Decrypted OK, lattice shield |
| `text-primary` | `#f9fafb` | Main text |
| `text-muted` | `#6b7280` | Labels, secondary info |
| `border` | `#1f2937` | Panel borders |

---

## Layout

```
┌─────────────────────────────────────────────────┐
│  HEADER — Quantum-Shield | Status | Connection   │
├──────────────┬──────────────┬────────────────────┤
│  RED TEAM    │  BLUE TEAM   │   LIVE FEED        │
│  Panel       │  Panel       │   (message log)    │
│              │              │                    │
├──────────────┴──────────────┤                    │
│  CRYPTO INSPECTOR           │                    │
│  (hex dump, key sizes)      │                    │
├─────────────────────────────┴────────────────────┤
│  METRICS BAR — latency graph, counters           │
└─────────────────────────────────────────────────┘
```

Grid: `grid-cols-3` top section, full-width bottom.

---

## File: `src/socket.js`

WebSocket connection singleton.

```js
// Connects to Flask-SocketIO on Laptop B
// URL from env: VITE_SERVER_URL (default: http://localhost:5000)
// Exports: socket instance
// Events to listen: message_received, red_team_breach, blue_team_block, session_stats
```

---

## File: `src/App.jsx`

Root component. Manages global state via `useState` / `useReducer`.

### State shape
```js
{
  connected: boolean,
  messages: Array<MessageEvent>,
  redTeamState: "idle" | "attacking" | "breached",
  blueTeamState: "idle" | "probing" | "blocked",
  cryptoInspector: MessageEvent | null,   // last message details
  metrics: { count, avgLatency, uptime }
}
```

### Socket event handlers
- `message_received` → push to `messages`, update `cryptoInspector`, update `metrics`
- `red_team_breach` → set `redTeamState = "breached"`, trigger animation
- `blue_team_block` → set `blueTeamState = "blocked"`, trigger animation
- `session_stats` → update `metrics`

---

## Component: `Header`

Top bar showing:
- Project name: **QUANTUM-SHIELD**
- Connection status pill: green "CONNECTED" / red "OFFLINE"
- Laptop B IP and port
- Current time (live clock)
- Small algorithm badge: `ML-KEM-768 + AES-128-GCM`

---

## Component: `RedTeamPanel`

Left top panel. Shows quantum attacker attempting RSA breach.

### States

**Idle**: Gray panel. "Red Team standing by." Button: `[Run RSA Attack Simulation]`

**Attacking**: Red pulsing border. Animated progress bar counting down 3 seconds. Text: "Shor's Algorithm executing..." Show RSA-2048 key being "factored" — animated hex digits scrolling.

**Breached**: Full red alert. Large `⚠ RSA BREACHED` text. Shows:
- Method: Shor's Algorithm
- Time to break: 3.0s (simulated quantum)
- Key bits factored: 2048
- Message exposed: plaintext shown in red

### Trigger
- Button click → emit `run_simulation` to server → server responds with `red_team_breach` event

---

## Component: `BlueTeamPanel`

Center top panel. Shows Quantum-Shield stopping the attacker.

### States

**Idle**: Blue panel. "Quantum-Shield active." Shows shield icon and algorithm.

**Probing**: Attacker probe incoming. Animated lattice grid visualization — dots and lines. Text: "Lattice attack probe detected..."

**Blocked**: Full green success. Large `✓ LATTICE SHIELD HELD` text. Shows:
- Method: SVP hardness — MLWE
- Quantum speedup: None
- Security level: NIST Level 3
- Attack result: Mathematically intractable

### Lattice visualization
Simple SVG: grid of dots with connecting lines, animated "probe" that hits the grid and stops. Represents high-dimensional lattice space that quantum computers cannot navigate efficiently.

---

## Component: `LiveFeed`

Right panel (full height). Scrolling log of real messages between laptops.

### Each message entry shows
- Timestamp
- Direction: `A → B`
- Status badge: `ENCRYPTED` (amber) → `DECRYPTED` (green)
- Plaintext content (after decryption)
- Latency: e.g. `4.2ms`
- Click to expand → loads into CryptoInspector

### Auto-scroll to latest message

---

## Component: `CryptoInspector`

Bottom left. Shows cryptographic details of the selected (or latest) message.

### Fields displayed
| Field | Value shown |
|---|---|
| KEM Ciphertext | First 32 bytes hex, truncated with `...` |
| Shared Secret | First 8 bytes hex + `[REDACTED]` |
| AES Nonce | 16 bytes hex |
| Plaintext (decrypted) | Full string |
| Algorithm | ML-KEM-768 + AES-128-GCM |
| KEM CT size | 1088 bytes |
| Public key size | 1184 bytes |
| Decap time | X.Xms |

Styled as a terminal/hex dump aesthetic — monospace font, dark background, green text.

---

## Component: `MetricsBar`

Bottom full-width strip.

### Metrics shown
- Total messages: counter
- Average decryption latency: Xms (recharts sparkline)
- Session uptime: HH:MM:SS
- RSA key size: 2048 bits (red label — "vulnerable")
- ML-KEM-768 security: 128-bit post-quantum (green label — "safe")
- Messages per second: live counter

---

## File: `src/components/LatticeViz.jsx`

Reusable SVG lattice visualization used in BlueTeamPanel.

- Grid of dots (6x6)
- Random connecting lines between nearby dots
- Animated "probe" red dot that enters the grid and freezes
- CSS keyframe animation

---

## Environment Variables

```
VITE_SERVER_URL=http://<Laptop-B-IP>:5000
```

Set in `.env` file in `frontend/` directory.

---

## Build & Run

```bash
cd frontend
npm install
npm run dev        # dev server on localhost:3000
npm run build      # production build
```

For hackathon demo: run `npm run dev` and open browser on Laptop B (or any machine on same WiFi pointing to Laptop B's IP).
