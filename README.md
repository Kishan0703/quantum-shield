# QUANTUM-SHIELD — Tactical Defense System
Post-quantum cryptographic sidecar for legacy military communication systems.
ML-KEM-768 (NIST FIPS 203) + AES-128-GCM hybrid encryption.

## Installation
pip install -r requirements.txt
cd frontend && npm install

## Running

### Single machine demo
python3 main.py --mode demo
cd frontend && npm run dev
Open: http://localhost:3000/?view=both

### Two laptops
# Laptop B (command center) — run first
python3 main.py --mode command
cd frontend && npm run dev
Open: http://localhost:3000/?view=blue

# Laptop A (field unit) — run after Laptop B is ready
python3 main.py --mode field --host <LAPTOP-B-IP>
Open browser: http://<LAPTOP-B-IP>:3000/?view=red

## View URLs
/?view=red   — Field unit / Red Team console (Laptop A)
/?view=blue  — Command center / Blue Team console (Laptop B)
/?view=both  — Combined demo / judge walkthrough