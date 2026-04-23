from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import threading
import time
from command_center import CommandCenter
from sim_engine import simulate_rsa_attack, simulate_kyber_attack
import base64
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'quantum-shield-2024'
# Switched to async_mode='threading' for Python 3.13 compatibility
sio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

cc = CommandCenter()
start_time = time.time()

@app.route('/')
def health():
    return jsonify({"status": "online", "system": "QUANTUM-SHIELD", "version": "1.0"})

@app.route('/api/status')
def status():
    stats = cc.get_stats()
    uptime = int(time.time() - start_time)
    return jsonify({**stats, "uptime_seconds": uptime})

@app.route('/api/keypair')
def keypair():
    return jsonify({"pk": base64.b64encode(cc.pk).decode(), "pk_size": len(cc.pk)})

@sio.on('run_simulation')
def handle_simulation():
    # Step 1: attacking
    sio.emit('red_team_breach', {
        "status": "attacking",
        "method": "Shor's Algorithm",
        "bits": 2048,
        "progress": 0
    })
    
    def run_sim():
        # Emit progress updates every 0.5s over 3 seconds
        for i in range(1, 7):
            time.sleep(0.5)
            sio.emit('red_team_breach', {
                "status": "attacking",
                "progress": i / 6,
                "log_line": get_attack_log_line(i)
            })
        # Step 2: breached
        last_message = cc.messages[-1]["plaintext"] if cc.messages else "NO MESSAGES INTERCEPTED"
        result = simulate_rsa_attack()
        sio.emit('red_team_breach', {
            **result,
            "status": "breached",
            "exposed_message": last_message
        })
    
    threading.Thread(target=run_sim).start()

def get_attack_log_line(step):
    lines = [
        "[0.00s] Quantum register initialised — 2048 qubits",
        "[0.50s] Quantum Fourier Transform applied",
        "[1.00s] Period finding: measuring eigenvalue",
        "[1.50s] GCD(a^(r/2) ± 1, N) computed",
        "[2.00s] Prime factor candidate: p = 0x9f2e...",
        "[2.50s] Verification: p × q = N ✓",
    ]
    return lines[step - 1] if step <= len(lines) else ""

@sio.on('run_lattice_probe')
def handle_lattice_probe():
    sio.emit('blue_team_block', {"status": "probing"})
    
    def run_probe():
        probe_logs = [
            "[0.00s] SVP oracle initialised on 768-dimensional lattice",
            "[0.10s] BKZ reduction: no polynomial-time quantum speedup",
            "[0.30s] Grover's algorithm: exponential speedup insufficient",
            "[0.50s] ATTACK INTRACTABLE — no quantum algorithm known",
        ]
        for log in probe_logs:
            time.sleep(0.13)
            sio.emit('blue_team_block', {"status": "probing", "log_line": log})
        result = simulate_kyber_attack()
        sio.emit('blue_team_block', {**result, "status": "blocked"})
        
    threading.Thread(target=run_probe).start()

def emit_stats_loop():
    while True:
        time.sleep(5)
        stats = cc.get_stats()
        uptime = int(time.time() - start_time)
        sio.emit('session_stats', {**stats, "uptime_seconds": uptime})

def run_command_center_loop(port):
    def emit_fn(event, data):
        sio.emit(event, data)
    cc.run(port, emit_fn)

def start_server(cc_port=9000, flask_port=5000):
    threading.Thread(target=run_command_center_loop, args=(cc_port,), daemon=True).start()
    # Using threading.Thread instead of eventlet.spawn
    threading.Thread(target=emit_stats_loop, daemon=True).start()
    sio.run(app, host='0.0.0.0', port=flask_port, debug=False, allow_unsafe_werkzeug=True)
