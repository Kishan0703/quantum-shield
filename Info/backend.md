# Quantum-Shield — Backend Specification

## Overview

All backend code is Python 3.11+. Single codebase, role selected via `--mode field` or `--mode command`.

---

## File: `main.py`

Entry point. Parses `--mode` flag and delegates to the correct module.

```python
# Behaviour
# --mode field   → runs field_unit.py logic (Laptop A)
# --mode command → runs command_center.py logic + starts Flask server (Laptop B)
# --mode demo    → runs full local simulation on one machine for testing
```

Arguments:
- `--mode`: required. One of `field`, `command`, `demo`
- `--host`: IP of Laptop B (used by field mode). Default: `localhost`
- `--port`: TCP port. Default: `9000`

---

## File: `crypto_core.py`

Shared cryptographic primitives. No side effects, pure functions only.

### Functions

#### `generate_keypair() -> (pk: bytes, sk: bytes)`
- Calls `Kyber768.keygen()`
- Returns public key (1184 bytes) and secret key (2400 bytes)

#### `encapsulate(pk: bytes) -> (kem_ct: bytes, shared_secret: bytes)`
- Calls `Kyber768.enc(pk)`
- Returns KEM ciphertext (1088 bytes) and shared secret (32 bytes)

#### `decapsulate(sk: bytes, kem_ct: bytes) -> shared_secret: bytes`
- Calls `Kyber768.dec(sk, kem_ct)`
- Returns shared secret (32 bytes)

#### `aes_encrypt(shared_secret: bytes, plaintext: bytes) -> blob: bytes`
- Derives AES key: `shared_secret[:16]`
- Generates 16-byte random nonce
- Encrypts with AES-128-GCM
- Returns: `nonce (16) + tag (16) + ciphertext (N)` as single blob

#### `aes_decrypt(shared_secret: bytes, blob: bytes) -> plaintext: bytes`
- Splits blob into nonce, tag, ciphertext
- Decrypts and verifies GCM tag
- Raises `ValueError` on auth failure

#### `build_payload(pk: bytes, kem_ct: bytes, blob: bytes) -> dict`
- Base64-encodes all fields
- Returns JSON-serializable dict: `{pk, kem_ct, blob, timestamp}`

#### `parse_payload(data: dict) -> (kem_ct: bytes, blob: bytes)`
- Base64-decodes `kem_ct` and `blob` from received dict

---

## File: `field_unit.py`

Laptop A logic. Generates keys, encrypts, transmits.

### Behaviour
1. Load or generate keypair. On first run, generate `(pk, sk)`. Save `sk` locally. Send `pk` to command center once (key exchange phase).
2. Enter message loop. For each tactical message:
   - Call `encapsulate(pk)` → `(kem_ct, shared_secret)`
   - Call `aes_encrypt(shared_secret, message)` → `blob`
   - Build payload JSON
   - Send over TCP socket to Laptop B
   - Log: message, KEM ciphertext size, encryption time in ms

### Key exchange simulation
- For hackathon demo: `pk` is included in every payload (acceptable for demo)
- Production note: `pk` is pre-shared once, `sk` never leaves Laptop B

### Error handling
- Retry socket connection up to 5 times with 2s backoff
- Log all crypto timing metrics

---

## File: `command_center.py`

Laptop B logic. Receives, decapsulates, decrypts.

### Behaviour
1. Generate `(pk, sk)` keypair on startup. Store `sk` in memory only.
2. Bind TCP socket on `0.0.0.0:9000`. Accept connections.
3. For each incoming payload:
   - Parse JSON, base64-decode fields
   - Call `decapsulate(sk, kem_ct)` → `shared_secret`
   - Call `aes_decrypt(shared_secret, blob)` → `plaintext`
   - Emit event to Flask-SocketIO: `{status, plaintext, timing_ms, algo}`
   - Log decrypted message and timing

### Event emitted to dashboard
```json
{
  "event": "message_received",
  "status": "decrypted",
  "plaintext": "TACTICAL: Grid 42-N, Advance at 0600",
  "kem_ct_size": 1088,
  "shared_secret_preview": "a3f9...c721",
  "timing_ms": 4.2,
  "algorithm": "ML-KEM-768 + AES-128-GCM",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## File: `server.py`

Flask-SocketIO server. Runs on Laptop B. Bridges backend crypto events to React frontend.

### Endpoints
- `GET /` — health check, returns `{status: "online"}`
- `GET /api/status` — returns current session stats (message count, avg latency)
- `GET /api/keypair` — returns `pk` (base64), never `sk`
- `WebSocket /socket.io` — real-time event stream

### SocketIO events emitted to frontend
| Event | Payload | Description |
|---|---|---|
| `message_received` | See above | New message decrypted |
| `red_team_breach` | `{target, method, time_ms}` | RSA attack simulation result |
| `blue_team_block` | `{probe, reason, wall}` | Lattice block simulation result |
| `session_stats` | `{count, avg_ms, uptime}` | Periodic stats update (every 5s) |

### CORS
Allow all origins for hackathon demo. In production: restrict to dashboard origin.

---

## File: `sim_engine.py`

Simulates Red Team (quantum attacker) vs Blue Team (Quantum-Shield). No real cryptanalysis — theatrical simulation for dashboard demo.

### `simulate_rsa_attack(bits=2048) -> dict`
- Simulates Shor's algorithm breaking RSA
- Returns after 3-second animated delay
- Result: `{result: "BREACHED", method: "Shor's algorithm", time_ms: 3000, bits: 2048}`

### `simulate_kyber_attack() -> dict`
- Simulates attacker hitting lattice-based encryption
- Returns immediately (no quantum speedup possible)
- Result: `{result: "BLOCKED", method: "SVP — exponential hardness", time_ms: null, reason: "No quantum speedup on MLWE"}`

### `run_comparison_demo() -> dict`
- Runs both simulations
- Returns side-by-side result for dashboard Red vs Blue panel

---

## File: `requirements.txt`

```
kyber-py==0.4.0
pycryptodome==3.20.0
flask==3.0.0
flask-socketio==5.3.6
eventlet==0.35.2
```

---

## Running Locally (Single Machine Test)

```bash
pip install -r requirements.txt
python main.py --mode demo
```

This runs both field and command logic in-process with a local socket, useful to verify crypto pipeline before the two-laptop setup.

---

## Running on Two Laptops

```bash
# Laptop B first
python main.py --mode command

# Laptop A
python main.py --mode field --host <Laptop-B-IP>
```

Find Laptop B's IP with `ipconfig` (Windows) or `ip addr` (Linux/Mac).
