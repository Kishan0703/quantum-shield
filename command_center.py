import socket
import json
import base64
import threading
import time
import crypto_core

# This will be set by server.py to allow emitting events
socketio_instance = None

def emit_event(name, data):
    if socketio_instance:
        socketio_instance.emit(name, data)

def handle_client(conn, addr, sk):
    print(f"[+] New connection from {addr}")
    buffer = b""
    try:
        while True:
            data = conn.recv(4096)
            if not data:
                break
            
            buffer += data
            while b'\n' in buffer:
                line, buffer = buffer.split(b'\n', 1)
                if not line:
                    continue
                
                try:
                    payload = json.loads(line.decode('utf-8'))
                    kem_ct, blob = crypto_core.parse_payload(payload)
                    
                    start_time = time.time()
                    
                    # Decryption Pipeline
                    shared_secret = crypto_core.decapsulate(sk, kem_ct)
                    plaintext = crypto_core.aes_decrypt(shared_secret, blob)
                    
                    end_time = time.time()
                    timing_ms = (end_time - start_time) * 1000
                    
                    print(f"[+] Decrypted: {plaintext} | Timing: {timing_ms:.2f}ms")
                    
                    # Emit to frontend
                    event_data = {
                        "status": "decrypted",
                        "plaintext": plaintext,
                        "kem_ct_size": len(kem_ct),
                        "shared_secret_preview": base64.b64encode(shared_secret[:8]).decode('utf-8') + "...",
                        "timing_ms": round(timing_ms, 2),
                        "algorithm": "ML-KEM-768 + AES-128-GCM",
                        "timestamp": payload.get('timestamp'),
                        "nonce": base64.b64encode(blob[:16]).decode('utf-8'),
                        "pk_size": len(base64.b64decode(payload['pk']))
                    }
                    emit_event("message_received", event_data)
                    
                except Exception as e:
                    print(f"[!] Error processing payload: {e}")
    finally:
        conn.close()
        print(f"[-] Connection from {addr} closed")

def run_command_center(host='0.0.0.0', port=9000, sk=None):
    if sk is None:
        pk, sk = crypto_core.generate_keypair()
        print("[*] Generated ML-KEM-768 keypair for Command Center.")
    
    server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_sock.bind((host, port))
    server_sock.listen(5)
    print(f"[*] Command Center listening on {host}:{port}")
    
    try:
        while True:
            conn, addr = server_sock.accept()
            client_thread = threading.Thread(target=handle_client, args=(conn, addr, sk))
            client_thread.daemon = True
            client_thread.start()
    except KeyboardInterrupt:
        print("\n[*] Command Center shutting down.")
    finally:
        server_sock.close()

if __name__ == "__main__":
    run_command_center()
