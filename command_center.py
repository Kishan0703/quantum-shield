import socket
import json
import time
import base64
from datetime import datetime
from crypto_core import generate_keypair, decapsulate, aes_decrypt, parse_payload

class CommandCenter:
    def __init__(self):
        self.pk, self.sk = generate_keypair()
        self.messages = []
        self.message_count = 0
        self.total_latency = 0

    def handle_connection(self, conn):
        data = b''
        while True:
            chunk = conn.recv(4096)
            if not chunk:
                break
            data += chunk
            if b'\n' in data:
                break
        
        if not data:
            return None

        try:
            payload = json.loads(data.decode().strip())
            kem_ct, blob = parse_payload(payload)
            
            t_start = time.time()
            shared_secret = decapsulate(self.sk, kem_ct)
            plaintext = aes_decrypt(shared_secret, blob)
            latency_ms = (time.time() - t_start) * 1000

            event_dict = {
                "event": "message_received",
                "status": "decrypted",
                "plaintext": plaintext.decode(),
                "kem_ct_hex": kem_ct[:48].hex(),
                "kem_ct_size": len(kem_ct),
                "blob_hex": blob[:32].hex(),
                "nonce_hex": blob[:16].hex(),
                "shared_secret_preview": base64.b64encode(shared_secret[:8]).decode() + "...",
                "decap_time_ms": round(latency_ms, 2),
                "total_latency_ms": round(float(payload.get("latency_ms", latency_ms)), 2),
                "algorithm": "ML-KEM-768 + AES-128-GCM",
                "integrity": "GCM AUTHENTIC",
                "timestamp": payload.get("timestamp", datetime.utcnow().isoformat() + "Z"),
                "message_number": self.message_count,
                "origin": "FIELD-UNIT-01"
            }
            
            self.messages.append(event_dict)
            self.message_count += 1
            self.total_latency += latency_ms
            
            return event_dict
            
        except Exception as e:
            print(f"[RX ERROR] Handling connection: {e}")
            return None

    def run(self, port, socketio_emit_fn):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.bind(('0.0.0.0', port))
        s.listen()
        
        while True:
            conn, addr = s.accept()
            event_dict = self.handle_connection(conn)
            if event_dict:
                socketio_emit_fn("message_received", event_dict)
                print(f"[RX] {event_dict['plaintext'][:40]} | decap: {event_dict['decap_time_ms']}ms")
            conn.close()

    def get_stats(self) -> dict:
        avg = self.total_latency / self.message_count if self.message_count > 0 else 0
        return {"message_count": self.message_count, "avg_latency_ms": round(avg, 2)}
