import socket
import json
import time
from crypto_core import generate_keypair, encapsulate, aes_encrypt, build_payload

SAMPLE_MESSAGES = [
    "TACTICAL: Grid 42-N, Advance at 0600",
    "STATUS: Unit 4 clear, returning to base",
    "INTEL: Unidentified drone spotted over Ridge B",
    "LOGISTICS: Ammo depletion at Sector 7",
    "URGENT: Requesting CAS at coordinates Alpha-9",
    "RECON: Enemy armour column moving south on Route 7",
    "MEDEVAC: Two casualties at grid 33-F, priority extract"
]

def send_message(host, port, pk, message_text):
    t_start = time.time()
    kem_ct, shared_secret = encapsulate(pk)
    blob = aes_encrypt(shared_secret, message_text.encode())
    latency_ms = (time.time() - t_start) * 1000
    
    payload = build_payload(pk, kem_ct, blob)
    payload["message_preview"] = message_text[:30]
    payload["latency_ms"] = latency_ms

    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((host, port))
        s.sendall(json.dumps(payload).encode() + b'\n')
        s.close()
        print(f"[TX] {message_text[:40]} | {latency_ms:.1f}ms | kem_ct: 1088 bytes")
    except Exception as e:
        print(f"[TX ERROR] Failed to send message: {e}")

def run(host, port):
    pk, sk = generate_keypair()
    print(f"Generated keypair. Public key size: {len(pk)} bytes")
    
    while True:
        for message in SAMPLE_MESSAGES:
            send_message(host, port, pk, message)
            time.sleep(3)
