import argparse
import threading
import time
import sys
import field_unit
import command_center
import server
import crypto_core

def run_demo(host, port):
    print("[*] Starting Quantum-Shield Demo Mode...")
    
    # Generate common keypair for demo
    # In a real scenario, Command Center generates this and shares pk
    pk, sk = crypto_core.generate_keypair()
    
    # Start Server (Flask-SocketIO) on port 5001 to avoid macOS conflict
    server_thread = threading.Thread(target=server.start_server, kwargs={'port': 5001})
    server_thread.daemon = True
    server_thread.start()
    
    # Start Command Center (Receiver) with the secret key
    command_thread = threading.Thread(target=command_center.run_command_center, kwargs={'host': '0.0.0.0', 'port': port, 'sk': sk})
    command_thread.daemon = True
    command_thread.start()
    
    time.sleep(2) # Give servers time to start
    
    # Run Field Unit (Sender) with the public key
    field_unit.run_field_unit(host=host, port=port, pk=pk)

def main():
    parser = argparse.ArgumentParser(description="Quantum-Shield: Post-Quantum Sidecar Wrapper")
    parser.add_argument("--mode", required=True, choices=["field", "command", "demo"], help="Operational mode")
    parser.add_argument("--host", default="localhost", help="Host IP of Command Center (default: localhost)")
    parser.add_argument("--port", type=int, default=9000, help="TCP port for tactical link (default: 9000)")
    
    args = parser.parse_args()
    
    if args.mode == "field":
        field_unit.run_field_unit(host=args.host, port=args.port)
    elif args.mode == "command":
        # Start Server in background on 5001
        server_thread = threading.Thread(target=server.start_server, kwargs={'port': 5001})
        server_thread.daemon = True
        server_thread.start()
        
        # Run Command Center in main thread
        command_center.run_command_center(host='0.0.0.0', port=args.port)
    elif args.mode == "demo":
        run_demo(args.host, args.port)

if __name__ == "__main__":
    main()
