# Quantum-Shield — System Architecture

## Project Overview

Quantum-Shield is a post-quantum cryptographic sidecar wrapper for legacy military communication systems. It retrofits RSA-encrypted field radios with NIST-standard ML-KEM-768 (Kyber) + AES-128-GCM hybrid encryption — without replacing hardware.

The system defends against "Harvest Now, Decrypt Later" attacks by quantum computers using Shor's algorithm.

---

## Core Concept: Sidecar Architectural Wrapper

Instead of replacing legacy hardware, a sidecar Python process intercepts outgoing/incoming data and applies post-quantum encryption transparently. The RSA layer underneath remains untouched.

```
[Legacy RSA Radio] → [Sidecar Wrapper: ML-KEM-768 + AES-128] → [Tactical Data Link] → [Command Center]
```

---

## Two-Laptop Setup

| Role | Machine | Responsibility |
|---|---|---|
| Field Unit | Laptop A | Encapsulate shared secret via ML-KEM-768, encrypt payload with AES-128-GCM, transmit |
| Command Center | Laptop B | Receive payload, decapsulate shared secret, decrypt, display on dashboard |

Both laptops run the **same codebase**. Role is selected via a CLI flag:

```bash
python main.py --mode field      # Laptop A
python main.py --mode command    # Laptop B
```

---

## Cryptographic Construction

### Key Exchange — ML-KEM-768 (Kyber)
- NIST FIPS 203 standard (finalized 2024)
- Based on Module Learning With Errors (MLWE) — lattice hardness
- Resistant to Shor's algorithm (no quantum speedup on lattice SVP)
- Key sizes: Public key 1184 bytes, Secret key 2400 bytes, Ciphertext 1088 bytes

### Data Encryption — AES-128-GCM
- Symmetric, high-speed bulk encryption
- First 16 bytes of ML-KEM shared secret used as AES key
- GCM mode provides authenticated encryption (integrity + confidentiality)
- Nonce: 16 bytes random, prepended to ciphertext blob

### Hybrid Construction Flow
```
1. Laptop B generates (pk, sk) keypair
2. pk is pre-shared to Laptop A (one-time, simulated secure channel)
3. For each message:
   a. Laptop A: kem_ct, shared_secret = ML-KEM-768.Encapsulate(pk)
   b. Laptop A: blob = AES-128-GCM.Encrypt(shared_secret[:16], plaintext)
   c. Laptop A: transmit {kem_ct, blob} over socket
   d. Laptop B: shared_secret = ML-KEM-768.Decapsulate(sk, kem_ct)
   e. Laptop B: plaintext = AES-128-GCM.Decrypt(shared_secret[:16], blob)
```

---

## Network / Data Link

- Protocol: TCP socket (simulated tactical data link)
- Both laptops on same WiFi network (LAN)
- Laptop B binds on port 9000, Laptop A connects to Laptop B's IP
- Payload format: JSON with base64-encoded fields
- Flask-SocketIO server on Laptop B pushes events to React dashboard via WebSocket

---

## Project File Structure

```
quantum-shield/
├── main.py                  # Entry point, --mode flag
├── crypto_core.py           # Shared crypto functions
├── field_unit.py            # Laptop A logic
├── command_center.py        # Laptop B logic
├── server.py                # Flask-SocketIO server (Laptop B)
├── sim_engine.py            # Red/Blue team simulation
├── requirements.txt
└── frontend/
    ├── package.json
    ├── index.html
    └── src/
        ├── App.jsx
        ├── socket.js
        └── components/
            ├── LiveFeed.jsx
            ├── RedTeamPanel.jsx
            ├── BlueTeamPanel.jsx
            ├── CryptoInspector.jsx
            └── MetricsBar.jsx
```

---

## Dependencies

### Python
```
kyber-py==0.4.0
pycryptodome==3.20.0
flask==3.0.0
flask-socketio==5.3.6
eventlet==0.35.2
```

### Node / React
```
react, react-dom
socket.io-client
tailwindcss
recharts
```

---

## Demo Flow (Hackathon Narrative)

1. **Setup**: Both laptops on same WiFi. Laptop B starts server. Laptop A connects.
2. **Red Team breach**: Show RSA-encrypted message being "intercepted and decrypted" by simulated quantum attacker. Alarm state on dashboard.
3. **Blue Team shield**: Same message sent over Quantum-Shield. Attacker hits lattice wall — mathematically intractable. Shield holds.
4. **Live feed**: Real ML-KEM-768 + AES-128 encrypted messages flowing between laptops in real time, decrypted correctly on Laptop B.
