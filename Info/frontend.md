# Quantum-Shield — Frontend Specification v2
# Redesigned: Palantir/DARPA Ops Console Aesthetic

---

## Design Philosophy

This is not a game dashboard. It is a defence operations console. Every design decision must feel like it belongs in a DARPA lab or an NSA ops center.

**Rules:**
- No saturated neon colours. All colours are muted/desaturated.
- No rounded corners on data panels or tables. Sharp edges only. `border-radius: 0` for data surfaces.
- Monospace font (`font-mono`) for ALL data values — ciphertext, hex, latency, timestamps, IPs.
- Normal sans-serif for labels and descriptions only.
- Small all-caps labels (`text-[10px] tracking-widest uppercase text-slate-500`) above data values.
- No icons as decoration. Icons only where they carry meaning (status dot, alert triangle).
- No gradients. No glow effects. No animated borders unless conveying real system state.
- Information density: pack data, use small text for secondary info. Real ops software is dense.
- Thin 1px borders everywhere: `border border-slate-800`.
- Classification banner at top: `UNCLASSIFIED // FOR OFFICIAL USE ONLY`

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS v3
- socket.io-client
- recharts (latency sparkline only)
- JetBrains Mono from Google Fonts (import in index.html)
- No icon libraries — use SVG inline or Unicode symbols only

---

## Colour Palette

Add to `tailwind.config.js` under `extend.colors`:

```js
ops: {
  bg:        '#080c14',
  surface:   '#0d1220',
  elevated:  '#111827',
  border:    '#1e2d40',
  muted:     '#1a2535',
  primary:   '#c9d4e0',
  secondary: '#6b7a8d',
  dim:       '#3d4f63',
  red:       '#c0392b',
  redDim:    '#2d1a1a',
  redText:   '#e57373',
  amber:     '#b5832a',
  amberDim:  '#2a2010',
  amberText: '#d4a843',
  green:     '#2e7d52',
  greenDim:  '#0f2318',
  greenText: '#52c48a',
  blue:      '#1a4f7a',
  blueDim:   '#0a1e30',
  blueText:  '#5fa8d4',
  online:    '#4ade80',
  offline:   '#f87171',
}
```

---

## View System

The frontend has THREE distinct views selected by URL query param `?view=`:

| URL | View | Used on |
|---|---|---|
| `/?view=red` | Red Team Console | Laptop A — field unit |
| `/?view=blue` | Blue Team Console | Laptop B — command center |
| `/?view=both` | Combined Demo View | Single machine demo or judge walkthrough |

No param → renders Landing view (view selector).

`App.jsx` reads `new URLSearchParams(window.location.search).get('view')` and renders the correct view. The Header has view toggle buttons that update the URL param.

---

## Shared: Header Component

Thin top bar. Height: ~56px total.

Line 1 (main bar):
```
QUANTUM-SHIELD  TACTICAL DEFENSE SYSTEM    [FIELD UNIT]    ● CONNECTED    ML-KEM-768  AES-128-GCM    14:22:31 UTC
                                           View: [RED] [BLUE] [BOTH]
```

Line 2 (classification strip, full width, 1px height amber background):
```
UNCLASSIFIED // FOR OFFICIAL USE ONLY // HACKATHON PROTOTYPE // NOT FOR OPERATIONAL USE
```

- `QUANTUM-SHIELD`: `font-mono font-bold text-ops-primary text-lg` — no colour, no glow
- Status dot: 6px `rounded-full` inline — `bg-ops-online` or `bg-ops-offline`. Text `text-xs font-mono text-ops-secondary`
- View toggle: `[RED] [BLUE] [BOTH]` — `text-xs font-mono px-2 py-0.5 border border-ops-border`. Active view: `border-ops-blueText text-ops-blueText`
- Algorithm tags: `text-xs font-mono text-ops-secondary bg-ops-elevated px-2 py-0.5 border border-ops-border`
- Clock: `font-mono text-sm text-ops-primary` — updates every second via `useClock` hook
- Classification line: `text-[10px] tracking-widest text-ops-amberText bg-ops-amberDim text-center py-0.5`

---

## Landing View (no ?view param)

Clean black screen. Centered vertically and horizontally.

```
QUANTUM-SHIELD TACTICAL DEFENSE SYSTEM
v1.0 — POST-QUANTUM CRYPTOGRAPHIC SIDECAR

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECT OPERATIONAL MODE

[  FIELD UNIT — RED TEAM  ]   [  COMMAND CENTER — BLUE TEAM  ]   [  COMBINED DEMO VIEW  ]

ML-KEM-768 + AES-128-GCM  |  NIST FIPS 203 (2024)  |  HARVEST-NOW-DECRYPT-LATER DEFENSE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UNCLASSIFIED // FOR OFFICIAL USE ONLY
```

Three buttons: `border border-ops-border text-ops-primary font-mono text-sm px-8 py-3`. No fill. Hover: `bg-ops-elevated`. No colour difference between them on landing — all neutral.

---

## View 1: Red Team Console (`?view=red`)

**Purpose**: Laptop A — field unit. Shows the operator transmitting messages AND the adversary intercepting and cracking their RSA traffic. Judges see WHY the old system is broken.

**Background tint**: Extremely subtle red tint on `bg` — `#0a0c10` with a faint `#1a0808` overlay on the page. Not obvious, just directional.

**Layout** — 3 equal columns, full height minus header:
```
┌──────────────────┬──────────────────┬──────────────────┐
│ TRANSMISSION     │ INTERCEPTION     │ RSA CRACK        │
│ CONSOLE          │ MONITOR          │ SIMULATION       │
│                  │                  │                  │
│ (Send messages)  │ (Wire intercept) │ (Shor's attack)  │
└──────────────────┴──────────────────┴──────────────────┘
```

### Panel A: Transmission Console

Panel header (small, all-caps, monospace, secondary colour):
`FIELD UNIT — OUTBOUND TRANSMISSION`

Contents:

1. Encryption mode block:
```
ACTIVE ENCRYPTION PROTOCOL
────────────────────────────────
RSA-2048              ● ACTIVE
ML-KEM-768            ○ STANDBY
```
`● ACTIVE` in `text-ops-amberText` (amber = warning, legacy is active). `○ STANDBY` in dim.

2. Message composer:
- Label: `COMPOSE TACTICAL MESSAGE`
- `textarea`: `bg-ops-bg border border-ops-border font-mono text-sm text-ops-primary p-3 w-full resize-none h-24 focus:outline-none focus:border-ops-blueText`. No border-radius.
- `[TRANSMIT ENCRYPTED]` button: `w-full border border-ops-border text-ops-primary font-mono text-xs py-2 hover:bg-ops-elevated`. No fill, no colour.

3. Transmission log:
- Label: `OUTBOUND LOG`
- Monospace table, no borders between rows, just `─` separator every 5 rows:
```
TIME       BYTES    PREVIEW
14:22:31   1432     TACTICAL: Grid 42-N...
14:22:33   1432     STATUS: Unit 4 clea...
14:22:35   1432     INTEL: Unidentified...
```

### Panel B: Interception Monitor

Panel header: `ADVERSARY INTERCEPT — SIGNAL INTELLIGENCE`

Two plain text tabs (underline style): `RAW WIRE` | `DECODED`

**RAW WIRE tab**: Real hex dump of the transmitted payload. 16-byte rows. `font-mono text-xs text-ops-dim`. Label above: `PACKET CAPTURE — ENCRYPTED PAYLOAD`
```
0000:  a3 f9 21 7c 44 b8 e2 91  03 c7 5a 19 f4 8d 2b 6e  |..!|D.....Z...+n|
0010:  77 04 e8 31 9a 5c 2f b3  44 21 0c 9f 8b 3e 55 a7  |w..1.\/...D!...>U.|
```

**DECODED tab** (RSA vulnerable mode):
- Label: `INTERCEPTED PLAINTEXT — RSA-2048 COMPROMISED`
- Shows last message in `text-ops-redText font-mono`
- When ML-KEM active: `[LATTICE NOISE — CRYPTANALYSIS INTRACTABLE]` in `text-ops-dim`

Bottom status line (monospace, tiny, full width):
```
INTERCEPT: ACTIVE  |  PROTOCOL: RSA-2048  |  CLASSIFICATION: VULNERABLE  |  HARVEST STATUS: RECORDING
```

### Panel C: RSA Crack Simulation

Panel header: `THREAT SIM — SHOR'S ALGORITHM (QUANTUM)`

Status block (top):
```
TARGET ALGORITHM
RSA-2048

ATTACK VECTOR
Shor's Algorithm (Quantum Period Finding)

COMPLEXITY
O(log³ N) — polynomial in key size

CURRENT STATUS
● IDLE
```

`[INITIATE QUANTUM ATTACK SIMULATION]` button — same borderless style, full width.

During attack (3 seconds):
- Thin progress bar: `h-0.5 bg-ops-red transition-all duration-3000`
- Scrolling log (monospace, 11px, dark red text):
```
[0.00s] Quantum register initialised — 2048 qubits
[0.31s] Quantum Fourier Transform applied
[0.87s] Period finding: measuring eigenvalue
[1.24s] GCD(a^(r/2) ± 1, N) computed
[2.11s] Prime factor candidate: p = 0x9f2e...
[2.89s] Verification: p × q = N ✓
[3.00s] FACTORISATION COMPLETE
```

After breach — solid bordered block, no animation:
```
┌─ BREACH CONFIRMED ──────────────────────────────────────┐
│  ALGORITHM:    RSA-2048                                 │
│  ATTACK TIME:  3.00 seconds (quantum)                   │
│  FACTORS:      p = 9f2e..., q = a31c...                 │
│                                                         │
│  RECOVERED PLAINTEXT:                                   │
│  "TACTICAL: Grid 42-N, Advance at 0600"                 │
│                                                         │
│  RECOMMENDATION: IMMEDIATE UPGRADE TO POST-QUANTUM      │
└─────────────────────────────────────────────────────────┘
```
Border: `border-ops-redText`. Text: `text-ops-redText`. Background: `bg-ops-redDim`.

---

## View 2: Blue Team Console (`?view=blue`)

**Purpose**: Laptop B — command center. Shows incoming decrypted messages and quantum shield status. Judges see WHY the new system works.

**Background tint**: Extremely subtle blue tint on bg. `#08090f` → `#080c16`.

**Layout** — 3 columns top, 1 full-width bottom:
```
┌──────────────────┬──────────────────┬──────────────────┐
│ INCOMING COMMS   │ QUANTUM SHIELD   │ CRYPTO INSPECTOR │
│ DECRYPTED FEED   │ STATUS           │ PAYLOAD ANALYSIS │
├──────────────────┴──────────────────┴──────────────────┤
│ SYSTEM METRICS (full width)                            │
└─────────────────────────────────────────────────────────┘
```

### Panel A: Incoming Comms Feed

Panel header: `COMMAND CENTER — INBOUND TACTICAL FEED`

Connection status line (monospace, tiny):
```
FIELD-UNIT-01  192.168.x.x:9000  ● CONNECTED  |  PROTOCOL: ML-KEM-768 + AES-128-GCM
```

Message log — flat rows, NO cards, NO rounded corners, NO shadows:
```
────────────────────────────────────────────────────────────────
14:22:31 UTC  FIELD-UNIT-01  ✓ DECRYPTED  4.2ms
TACTICAL: Grid 42-N, Advance at 0600
────────────────────────────────────────────────────────────────
14:22:33 UTC  FIELD-UNIT-01  ✓ DECRYPTED  3.9ms
STATUS: Unit 4 clear, returning to base
────────────────────────────────────────────────────────────────
```
- Timestamp, origin, status, latency: `font-mono text-[10px] text-ops-secondary uppercase tracking-wider`
- Message content: `font-mono text-sm text-ops-primary mt-1`
- `✓ DECRYPTED` in `text-ops-greenText`
- `✗ FAILED` in `text-ops-redText`
- Clicking a row highlights it and loads it into Crypto Inspector
- Auto-scroll to latest

### Panel B: Quantum Shield Status

Panel header: `ML-KEM-768 SHIELD — LATTICE DEFENSE`

Three sections separated by `─────` rules:

**Shield Status:**
```
SHIELD STATUS
─────────────────────────────────────────
● ACTIVE

ALGORITHM      ML-KEM-768 (Kyber)
STANDARD       NIST FIPS 203 (2024)
SECURITY LVL   NIST Level 3
PQ SECURITY    128-bit post-quantum
```
`● ACTIVE` in `text-ops-greenText`. All labels `text-ops-secondary text-[10px] uppercase`. All values `font-mono text-xs text-ops-primary`.

**Key Material:**
```
KEY MATERIAL
─────────────────────────────────────────
PUBLIC KEY       1184 bytes
SECRET KEY       2400 bytes    [MEMORY ONLY]
KEM CIPHERTEXT   1088 bytes
SHARED SECRET    32 bytes      [EPHEMERAL]
```
`[MEMORY ONLY]` and `[EPHEMERAL]` in `text-ops-dim`.

**Lattice Attack Probe:**
`[RUN LATTICE ATTACK PROBE]` button.

Probe simulation log (same style as RSA crack log but green):
```
[0.00s] SVP oracle initialised on 768-dimensional lattice
[0.10s] BKZ reduction: no polynomial-time quantum speedup
[0.30s] Grover's algorithm: exponential speedup insufficient
[0.50s] ATTACK INTRACTABLE — no quantum algorithm known
```

Result block:
```
┌─ SHIELD RESULT ──────────────────────────────────────────┐
│  ATTACK TYPE:   SVP (Shortest Vector Problem)            │
│  QUANTUM ALGO:  None applicable                          │
│  HARDNESS:      Exponential in lattice dimension         │
│  RESULT:        COMPUTATIONALLY INTRACTABLE              │
│  SHIELD:        HELD                                     │
└──────────────────────────────────────────────────────────┘
```
Border: `border-ops-greenText`. Text: `text-ops-greenText`. Background: `bg-ops-greenDim`.

### Panel C: Crypto Inspector

Panel header: `PAYLOAD ANALYSIS — CRYPTOGRAPHIC DETAIL`

Triggered by clicking a message. Default state: `[NO MESSAGE SELECTED — CLICK A MESSAGE IN THE FEED]` in dim text.

When loaded:
```
KEM CIPHERTEXT (LATTICE NOISE)                        1088 BYTES
──────────────────────────────────────────────────────────────────
0000:  a3 f9 21 7c 44 b8 e2 91  03 c7 5a 19 f4 8d 2b 6e
0010:  77 04 e8 31 9a 5c 2f b3  44 21 0c 9f 8b 3e 55 a7
0020:  [... 1024 bytes remaining ...]

AES-GCM NONCE                                          16 BYTES
──────────────────────────────────────────────────────────────────
9f2e8c 1a4d7b 3f0e52 a81c96 3b74f2 08e9d1

SHARED SECRET (EPHEMERAL)
──────────────────────────────────────────────────────────────────
RQeKq9vjVuw=...       [REDACTED AFTER USE — NEVER LOGGED]

DECRYPTED PLAINTEXT
──────────────────────────────────────────────────────────────────
"TACTICAL: Grid 42-N, Advance at 0600"

ALGORITHM       RSA-2048 → ML-KEM-768 + AES-128-GCM
INTEGRITY       GCM AUTHENTIC  ✓
DECAP TIME      4.2ms
MESSAGE #       0047
```

`HexDump` component: renders monospace hex in the format above. Accepts `bytes` (base64 string), `label`, `byteCount`.

### Bottom: System Metrics Bar

Full-width horizontal bar. `bg-ops-surface border-t border-ops-border`. Height: 48px.

Layout: 5 stat blocks in a row, separated by `|` dividers.

```
MESSAGES RECEIVED    |    AVG LATENCY       |    UPTIME          |    RSA-2048            |    ML-KEM-768
47                   |    [sparkline] 4.1ms  |    00:12:34        |    ⚠ VULNERABLE         |    ● NIST LEVEL 3
```

- All labels: `text-[10px] uppercase tracking-widest text-ops-secondary`
- All values: `font-mono text-sm text-ops-primary`
- `⚠ VULNERABLE`: `text-ops-amberText`
- `● NIST LEVEL 3`: `text-ops-greenText`
- Sparkline: `<LineChart>` from recharts, width 80px, height 28px, no axes, no grid, `stroke="#52c48a"` 1.5px, no dots

---

## View 3: Combined Demo View (`?view=both`)

**Purpose**: Single machine demo OR judge walkthrough. Presenter toggles between 4 acts.

**Act selector** — full-width bar below header:
```
[ ACT 1: THE THREAT ]    [ ACT 2: THE SOLUTION ]    [ ACT 3: LIVE DEMO ]    [ ACT 4: COMPARISON ]
```
Active act: `border-ops-primary text-ops-primary`. Inactive: `border-ops-border text-ops-dim`.

**Act 1 — The Threat**: Renders Red Team Console in full width.

**Act 2 — The Solution**: Renders Blue Team Console (shield panels only — no incoming feed) in full width.

**Act 3 — Live Demo**: Split 50/50 with a `|` divider in the center.
- Left: Transmission Console + Interception Monitor (from Red view)
- Right: Incoming Comms Feed + Crypto Inspector (from Blue view)
- Both connected to the same socket — live traffic flows left to right

**Act 4 — Comparison Table**: Full width. Plain monospace table. No cards.

```
POST-QUANTUM UPGRADE — SYSTEM COMPARISON
══════════════════════════════════════════════════════════════════════════════════
                        RSA-2048                    ML-KEM-768
──────────────────────────────────────────────────────────────────────────────────
Algorithm basis         Integer factorisation       MLWE (lattice hardness)
Quantum vulnerability   BROKEN — Shor's O(log³N)    No quantum speedup known
Time to break (QC)      ~minutes (2048-bit)         Exponential — intractable
Public key size         256 bytes                   1184 bytes
Ciphertext overhead     256 bytes                   1088 bytes
PQ security level       0-bit (completely broken)   128-bit (NIST Level 3)
NIST standard           No — legacy                 FIPS 203 (August 2024)
Hardware replacement    Required                    NOT REQUIRED
Deployment cost         $$$$ per unit               Software sidecar only
Deployment time         Years (procurement)         Hours (software update)
══════════════════════════════════════════════════════════════════════════════════
RECOMMENDATION: IMMEDIATE MIGRATION TO ML-KEM-768 FOR ALL FIELD UNITS
```

RSA column values: `text-ops-redText`. ML-KEM column values: `text-ops-greenText`. Everything else: `text-ops-primary`. Table lines: `text-ops-dim`.

---

## Component File Structure

```
frontend/src/
├── App.jsx                      # Reads ?view= param, renders correct view
├── socket.js                    # socket.io-client singleton
├── views/
│   ├── Landing.jsx
│   ├── RedTeamView.jsx
│   ├── BlueTeamView.jsx
│   └── CombinedView.jsx
├── components/
│   ├── Header.jsx
│   ├── TransmissionConsole.jsx
│   ├── InterceptionMonitor.jsx
│   ├── RsaCrackSimulation.jsx
│   ├── IncomingFeed.jsx
│   ├── ShieldStatus.jsx
│   ├── CryptoInspector.jsx
│   ├── MetricsBar.jsx
│   ├── ComparisonTable.jsx
│   └── HexDump.jsx
└── hooks/
    ├── useSocket.js
    └── useClock.js
```

---

## Bugs to Fix from Previous Version

- `Invalid Date` bug: backend must send `timestamp` as ISO string e.g. `datetime.utcnow().isoformat() + 'Z'`. Frontend: `new Date(timestamp).toISOString().slice(11,19) + ' UTC'`
- Empty Crypto Inspector boxes: show `[AWAITING DATA]` placeholder in dim monospace
- PQ SECURITY showing `VULNERABLE` in blue panel: only show VULNERABLE for RSA row in comparison table. Shield panel should always show NIST Level 3 green.

---

## What NOT to Build

- No lock icons, shield icons, or decorative SVG illustrations
- No rounded cards with box shadows
- No saturated neon colours (no pure #ff0000 red, no pure #00ffff cyan)
- No animated glowing borders
- No big countdown timers with large fonts
- No `IDLE` badges — use small status dots instead
- No gradient backgrounds

---

## Environment Variables

```
VITE_SERVER_URL=http://localhost:5000
VITE_DEFAULT_VIEW=both
```