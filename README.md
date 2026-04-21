# Quantum-Shield

Quantum-Shield is a post-quantum cryptographic sidecar wrapper for legacy communication systems. It retrofits RSA-encrypted field radios with NIST-standard ML-KEM-768 (Kyber) + AES-128-GCM hybrid encryption without replacing hardware.

## Features

- **Hybrid Encryption**: ML-KEM-768 for key encapsulation and AES-128-GCM for data encryption.
- **Quantum Resistance**: Protected against Shor's algorithm and other quantum-specific attacks.
- **Sidecar Architecture**: Easily integrates with existing systems as a transparent wrapper.
- **Real-time Dashboard**: Visualizes encryption flow, simulation of quantum attacks, and system metrics.

## Installation

### Backend
1. Ensure you have Python 3.11+ installed.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Frontend
1. Ensure you have Node.js and npm installed.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Project

### Demo Mode (Single Machine)
Runs the server, command center, and field unit all in one process:
```bash
python main.py --mode demo
```

### Two-Machine Setup (LAN)

**Machine B (Command Center):**
```bash
python main.py --mode command
```

**Machine A (Field Unit):**
```bash
python main.py --mode field --host <Machine-B-IP>
```

### Dashboard
Start the React dashboard to visualize the data:
```bash
cd frontend
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser. (Note: Vite's default port might vary, check terminal output).

## Visualizing Attacks
- **Red Team Simulation**: Click "RUN RSA ATTACK SIMULATION" on the dashboard to see how Shor's algorithm can breach legacy RSA encryption.
- **Blue Team Protection**: Click "ACTIVATE LATTICE PROBE" to see Quantum-Shield's lattice-based protection in action.

## Tech Stack
- **Backend**: Python, Flask-SocketIO, Kyber (ML-KEM), PyCryptodome.
- **Frontend**: React, Vite, Tailwind CSS, Recharts, Socket.io-client.
