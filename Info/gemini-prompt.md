# Quantum-Shield — Gemini CLI Build Prompt

## How to Use

Place all MD files (`architecture.md`, `backend.md`, `frontend.md`, `demo.md`) in your project folder alongside this file. Then run the prompt below with Gemini CLI.

---

## Gemini CLI Prompt

Copy and paste this entire prompt into Gemini CLI:

---

```
You are an expert Python and React developer. Build a complete working project called "Quantum-Shield" based on the specification files I have provided: architecture.md, backend.md, frontend.md, and demo.md.

Read all four files carefully before writing any code. Follow every specification exactly.

Build the following files in this exact order:

---

STEP 1 — requirements.txt
Create requirements.txt with these exact packages:
kyber-py==0.4.0
pycryptodome==3.20.0
flask==3.0.0
flask-socketio==5.3.6
eventlet==0.35.2

---

STEP 2 — crypto_core.py
Create crypto_core.py with these exact functions as specified in backend.md:
- generate_keypair() -> (pk, sk)
- encapsulate(pk) -> (kem_ct, shared_secret)
- decapsulate(sk, kem_ct) -> shared_secret
- aes_encrypt(shared_secret, plaintext) -> blob
- aes_decrypt(shared_secret, blob) -> plaintext
- build_payload(pk, kem_ct, blob) -> dict
- parse_payload(data) -> (kem_ct, blob)

Use kyber-py for ML-KEM-768 and pycryptodome for AES-128-GCM. All fields in build_payload must be base64 encoded. The blob format is: nonce(16 bytes) + tag(16 bytes) + ciphertext.

---

STEP 3 — sim_engine.py
Create sim_engine.py with:
- simulate_rsa_attack(bits=2048) -> dict: returns {result: "BREACHED", method: "Shor's algorithm", time_ms: 3000, bits: 2048}
- simulate_kyber_attack() -> dict: returns {result: "BLOCKED", method: "SVP — exponential hardness", time_ms: None, reason: "No quantum speedup on MLWE"}
- run_comparison_demo() -> dict: runs both and returns combined result

---

STEP 4 — field_unit.py
Create field_unit.py as described in backend.md:
- Generates keypair, sends pk to command center
- For each message: encapsulate, aes_encrypt, build_payload, send via TCP socket as JSON
- Includes 5 sample tactical messages to send in a loop with 2-second delay between each
- Logs encryption timing in ms for each message
- Retries connection up to 5 times with 2s backoff

---

STEP 5 — command_center.py
Create command_center.py as described in backend.md:
- Generates keypair on startup, stores sk in memory
- Binds TCP socket on 0.0.0.0:9000
- For each payload: parse_payload, decapsulate, aes_decrypt
- After each decryption emits SocketIO event "message_received" with full details as specified in backend.md
- Logs decrypted message and timing

---

STEP 6 — server.py
Create server.py with Flask-SocketIO:
- GET / returns {status: "online"}
- GET /api/status returns {message_count, avg_latency_ms, uptime_seconds}
- GET /api/keypair returns {pk: base64} (never sk)
- WebSocket /socket.io emits: message_received, red_team_breach, blue_team_block, session_stats
- On SocketIO event "run_simulation": run simulate_rsa_attack() then emit red_team_breach twice (attacking then breached)
- On SocketIO event "run_lattice_probe": run simulate_kyber_attack() then emit blue_team_block (blocked)
- Emit session_stats every 5 seconds
- CORS: allow all origins
- Run with eventlet

---

STEP 7 — main.py
Create main.py with argparse:
- --mode: required, choices: ["field", "command", "demo"]
- --host: default "localhost"
- --port: default 9000
- field mode: run field_unit.py logic
- command mode: run command_center.py logic AND start server.py in a background thread
- demo mode: start server in background thread, run both field and command in-process using threading with local socket

---

STEP 8 — React Frontend
Create the frontend/ directory with a complete Vite + React + Tailwind project.

Create frontend/package.json with:
- react, react-dom
- socket.io-client
- recharts
- tailwindcss, autoprefixer, postcss
- vite

Create frontend/index.html as standard Vite entry.

Create frontend/src/socket.js:
- Connect to VITE_SERVER_URL env variable (default http://localhost:5000)
- Export socket instance from socket.io-client

Create frontend/src/App.jsx:
- Global state as described in frontend.md
- Listen to all 4 socket events: message_received, red_team_breach, blue_team_block, session_stats
- Render: Header, RedTeamPanel, BlueTeamPanel, LiveFeed, CryptoInspector, MetricsBar
- Dark tactical background color: #0a0e1a
- Use Tailwind grid layout as described in frontend.md

Create frontend/src/components/Header.jsx:
- Show "QUANTUM-SHIELD" title
- Connection status pill: green CONNECTED / red OFFLINE
- Live clock updated every second
- Algorithm badge: ML-KEM-768 + AES-128-GCM

Create frontend/src/components/RedTeamPanel.jsx:
- Three states: idle, attacking, breached (as described in frontend.md)
- Button to emit "run_simulation" to server
- Animated countdown progress bar for attacking state (3 seconds)
- Scrolling hex digits animation during attack
- Red alert styling when breached

Create frontend/src/components/BlueTeamPanel.jsx:
- Three states: idle, probing, blocked (as described in frontend.md)
- LatticeViz SVG component embedded: 6x6 grid of dots with connecting lines, animated probe dot that enters and freezes
- Green success styling when blocked

Create frontend/src/components/LiveFeed.jsx:
- Scrolling list of messages
- Each message: timestamp, direction A→B, status badge ENCRYPTED→DECRYPTED, plaintext, latency
- Auto-scroll to latest
- Click message to set as selected in CryptoInspector

Create frontend/src/components/CryptoInspector.jsx:
- Terminal aesthetic: monospace font, dark bg, green text
- Show all fields from frontend.md: KEM ciphertext preview, shared secret redacted, AES nonce, plaintext, algorithm, sizes, timing

Create frontend/src/components/MetricsBar.jsx:
- Full width bottom bar
- Total messages counter
- Average latency with recharts sparkline (LineChart)
- Session uptime HH:MM:SS
- RSA-2048 label in red: VULNERABLE
- ML-KEM-768 label in green: NIST Level 3

Create frontend/.env:
VITE_SERVER_URL=http://localhost:5000

Create frontend/tailwind.config.js and frontend/postcss.config.js with standard Tailwind setup.

---

STEP 9 — README.md
Create README.md with:
- Project description
- Installation: pip install -r requirements.txt, cd frontend && npm install
- Running demo mode: python main.py --mode demo
- Running two-laptop: Laptop B first (--mode command), then Laptop A (--mode field --host <IP>)
- Dashboard URL: http://localhost:3000

---

IMPORTANT RULES:
1. Write complete, working code for every file. No placeholders, no TODO comments.
2. All Python code must be compatible with Python 3.11+
3. Use kyber-py library exactly: from kyber import Kyber768, then Kyber768.keygen(), Kyber768.enc(pk), Kyber768.dec(sk, ct)
4. All socket communication uses JSON with base64-encoded bytes fields
5. Flask-SocketIO must use eventlet as async mode
6. React components must use functional components with hooks only
7. All Tailwind classes must be valid Tailwind v3 classes
8. The frontend must work without any backend changes — just point VITE_SERVER_URL to Laptop B's IP
9. The crypto pipeline must be tested end-to-end in demo mode before considering it complete
10. Every component must handle the case where no messages have been received yet (empty state)
```

---

## After Gemini CLI Generates the Code

### Verify the crypto pipeline first

```bash
pip install -r requirements.txt
python main.py --mode demo
```

You should see: key generation, encapsulation, encryption, decryption, and plaintext output — all in one terminal.

### Then test two-laptop

```bash
# Laptop B
python main.py --mode command

# Laptop A
python main.py --mode field --host <Laptop-B-IP>
```

### Then run frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in browser on Laptop B.

---

## Common Issues and Fixes

| Issue | Fix |
|---|---|
| `kyber-py` import error | Run `pip install kyber-py` separately and check `from kyber import Kyber768` |
| Socket connection refused | Make sure `python main.py --mode command` is running before Laptop A connects |
| CORS error in browser | Check server.py has `cors_allowed_origins="*"` in SocketIO init |
| Tailwind not applying | Check `tailwind.config.js` content array includes `./src/**/*.{js,jsx}` |
| Frontend not connecting | Check `.env` file has correct Laptop B IP |
