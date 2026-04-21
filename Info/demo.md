# Quantum-Shield — Demo & Simulation Specification

## Hackathon Demo Script

This document describes the exact demo flow for judges. Follow this order.

---

## Setup (Before Judges Arrive)

1. Both laptops on same WiFi network
2. Laptop B: `python main.py --mode command` — server running, dashboard open in browser
3. Laptop A: `python main.py --mode field --host <Laptop-B-IP>` — ready to send
4. Dashboard shows: **CONNECTED**, shield idle, live feed empty

---

## Demo Sequence

### Act 1 — The Threat (60 seconds)

**Narration**: "Today's military radios use RSA encryption. RSA relies on the difficulty of factoring large numbers. Classical computers take millions of years. But a quantum computer running Shor's algorithm can factor RSA-2048 in minutes."

**Action**: Click `[Run RSA Attack Simulation]` on Red Team panel.

**What happens**:
- Red panel pulses, countdown begins
- After 3 seconds: `⚠ RSA BREACHED`
- Tactical message appears in plaintext — exposed
- Dashboard alarm state

**Key point**: "Harvest Now, Decrypt Later — adversaries are recording encrypted traffic today, to decrypt it once quantum computers exist."

---

### Act 2 — The Solution (60 seconds)

**Narration**: "Quantum-Shield wraps the existing radio with a sidecar — no hardware replacement. We use ML-KEM-768, a NIST-standardized post-quantum algorithm based on lattice mathematics."

**Action**: Click `[Activate Quantum-Shield]` on Blue Team panel.

**What happens**:
- Lattice grid animates in Blue Team panel
- Shield status turns green: `QUANTUM-SHIELD ACTIVE`
- Attacker probe hits the lattice and freezes: `LATTICE SHIELD HELD`
- Reason shown: "SVP hardness — no quantum speedup on MLWE"

---

### Act 3 — Live Demo (90 seconds)

**Narration**: "This is real ML-KEM-768 running right now, between these two laptops."

**Action**: Send messages from Laptop A.

**What happens on dashboard**:
- Live Feed shows new message incoming
- Status: `ENCRYPTED` (amber) → `DECRYPTED` (green)
- CryptoInspector updates with real KEM ciphertext, nonce, shared secret preview
- Latency shown: ~4ms
- Message counter increments

**Highlight**:
- KEM ciphertext: 1088 bytes of lattice noise — indistinguishable from random
- Even with a quantum computer, attacker must solve Shortest Vector Problem — exponential hardness

---

### Act 4 — Key Comparison (30 seconds)

Point to MetricsBar:
- RSA-2048: **VULNERABLE** to Shor's algorithm
- ML-KEM-768: **NIST Level 3** — 128-bit post-quantum security
- "Zero hardware replacement. Existing radios, quantum-safe overnight."

---

## Simulation Engine Details

### RSA Attack Simulation

This is a theatrical simulation — no actual cryptanalysis.

**Trigger**: `run_simulation` SocketIO event from frontend button

**Server behaviour**:
```
1. Emit red_team_breach event with status "attacking"
2. Sleep 3 seconds (simulated Shor's computation)
3. Emit red_team_breach event with status "breached"
   Payload: { method: "Shor's Algorithm", time_ms: 3000, bits: 2048, exposed_message: <last plaintext> }
```

**Why 3 seconds**: Enough to build tension. Fast enough to not bore judges.

---

### Lattice Attack Simulation

**Trigger**: `run_lattice_probe` SocketIO event

**Server behaviour**:
```
1. Emit blue_team_block with status "probing"
2. Sleep 0.5 seconds
3. Emit blue_team_block with status "blocked"
   Payload: { reason: "SVP exponential hardness", quantum_speedup: "none", security: "NIST Level 3" }
```

**Visual metaphor**: Quantum probe enters the high-dimensional lattice space, cannot find the short vector, times out. The lattice is the dead end.

---

## Talking Points for Judges

### Why ML-KEM-768 specifically?
- NIST selected it as FIPS 203 in 2024 — the gold standard
- Level 3 security: equivalent to AES-192 classical security, AES-128 post-quantum
- Fastest of the NIST finalists in software implementation

### Why AES-128 alongside it?
- ML-KEM only does key encapsulation — it establishes a shared secret
- AES-128-GCM does the actual data encryption at line speed
- This hybrid construction is the industry standard (e.g. TLS 1.3 post-quantum proposals)

### Why not just upgrade the radios?
- Military hardware lifecycles are 20-30 years
- Replacement cost: millions per unit
- Sidecar approach: software update, zero hardware change

### What is "Harvest Now, Decrypt Later"?
- Nation-state adversaries record encrypted comms today
- Store them until quantum computers exist (estimated 5-15 years)
- Then decrypt retroactively — operational plans, troop movements, identities
- Threat is real and active right now

### Why not RSA with larger keys?
- RSA-4096, RSA-8192 — Shor's algorithm breaks all of them in polynomial time
- Key size doesn't help against quantum. Need a fundamentally different mathematical problem.
- Lattice SVP has no known quantum speedup — even with unlimited qubits.
