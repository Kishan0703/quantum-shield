import time
import threading
import base64
from flask import Flask, jsonify
from flask_socketio import SocketIO, emit
import sim_engine
import crypto_core
import command_center

app = Flask(__name__)
# Changed async_mode to 'threading' for Python 3.13 compatibility
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Link command_center to this socketio instance
command_center.socketio_instance = socketio

# Global session stats
stats = {
    "message_count": 0,
    "total_latency_ms": 0,
    "start_time": time.time()
}

@app.route('/')
def health_check():
    return jsonify({"status": "online"})

@app.route('/api/status')
def get_status():
    uptime = time.time() - stats["start_time"]
    avg_latency = stats["total_latency_ms"] / stats["message_count"] if stats["message_count"] > 0 else 0
    return jsonify({
        "message_count": stats["message_count"],
        "avg_latency_ms": round(avg_latency, 2),
        "uptime_seconds": int(uptime)
    })

@app.route('/api/keypair')
def get_keypair():
    pk, _ = crypto_core.generate_keypair()
    return jsonify({"pk": base64.b64encode(pk).decode('utf-8')})

@socketio.on('connect')
def handle_connect():
    print("[+] Client connected to SocketIO")

@socketio.on('run_simulation')
def handle_simulation():
    print("[*] Running RSA Attack Simulation...")
    emit('red_team_breach', {"status": "attacking", "method": "Shor's Algorithm"})
    
    def run():
        result = sim_engine.simulate_rsa_attack()
        socketio.emit('red_team_breach', {
            "status": "breached",
            "method": result["method"],
            "time_ms": result["time_ms"],
            "bits": result["bits"]
        })
    
    threading.Thread(target=run).start()

@socketio.on('run_lattice_probe')
def handle_lattice_probe():
    print("[*] Running Lattice Probe...")
    emit('blue_team_block', {"status": "probing"})
    
    def run():
        time.sleep(1) # Small delay for visual effect
        result = sim_engine.simulate_kyber_attack()
        socketio.emit('blue_team_block', {
            "status": "blocked",
            "reason": result["reason"],
            "method": result["method"]
        })
    
    threading.Thread(target=run).start()

@socketio.on('message_received')
def on_message(data):
    stats["message_count"] += 1
    stats["total_latency_ms"] += data.get("timing_ms", 0)

def emit_stats_loop():
    while True:
        uptime = int(time.time() - stats["start_time"])
        avg_latency = stats["total_latency_ms"] / stats["message_count"] if stats["message_count"] > 0 else 0
        socketio.emit('session_stats', {
            "count": stats["message_count"],
            "avg_ms": round(avg_latency, 2),
            "uptime": uptime
        })
        time.sleep(5)

def start_server(host='0.0.0.0', port=5001):
    print(f"[*] Starting Flask-SocketIO server on {host}:{port}")
    daemon_thread = threading.Thread(target=emit_stats_loop)
    daemon_thread.daemon = True
    daemon_thread.start()
    socketio.run(app, host=host, port=port)

if __name__ == "__main__":
    start_server()
