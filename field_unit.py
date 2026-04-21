import socket
import json
import time
import base64
from datetime import datetime
import crypto_core

TACTICAL_MESSAGES = [
    "TACTICAL: Grid 42-N, Advance at 0600",
    "LOGISTICS: Ammo depletion at Sector 7",
    "INTEL: Unidentified drone spotted over Ridge B",
    "STATUS: Unit 4 clear, returning to base",
    "URGENT: Requesting CAS at coordinates Alpha-9"
]

def run_field_unit(host='localhost', port=9000, pk=None):
    print(f"[*] Starting Field Unit. Target: {host}:{port}")
    
    # Use provided pk (from Command Center) or generate one (for standalone testing)
    if pk is None:
        print("[!] No public key provided. Generating local keypair (Standalone Mode).")
        pk, _ = crypto_core.generate_keypair()
    else:
        print("[+] Using provided Command Center public key.")

    # Retry connection logic
    sock = None
    retries = 5
    for i in range(retries):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect((host, port))
            print(f"[+] Connected to Command Center at {host}:{port}")
            break
        except Exception as e:
            print(f"[!] Connection failed (attempt {i+1}/{retries}): {e}")
            if i < retries - 1:
                time.sleep(2)
            else:
                print("[!] Max retries reached. Exiting.")
                return

    try:
        msg_index = 0
        while True:
            plaintext = TACTICAL_MESSAGES[msg_index % len(TACTICAL_MESSAGES)]
            msg_index += 1
            
            start_time = time.time()
            
            # Hybrid Encryption Pipeline
            # MUST encapsulate using the Receiver's (Command Center) public key
            kem_ct, shared_secret = crypto_core.encapsulate(pk)
            blob = crypto_core.aes_encrypt(shared_secret, plaintext)
            payload = crypto_core.build_payload(pk, kem_ct, blob)
            
            end_time = time.time()
            timing_ms = (end_time - start_time) * 1000
            
            # Send payload
            payload_str = json.dumps(payload)
            sock.sendall(payload_str.encode('utf-8') + b'\n')
            
            print(f"[+] Sent: {plaintext[:30]}... | Timing: {timing_ms:.2f}ms | CT Size: {len(kem_ct)}B")
            
            time.sleep(2)
    except KeyboardInterrupt:
        print("\n[*] Field Unit shutting down.")
    finally:
        if sock:
            sock.close()

if __name__ == "__main__":
    run_field_unit()
