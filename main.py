import argparse
import threading
import time

def main():
    parser = argparse.ArgumentParser(description='Quantum-Shield')
    parser.add_argument('--mode', required=True, choices=['field', 'command', 'demo'])
    parser.add_argument('--host', default='localhost')
    parser.add_argument('--port', type=int, default=9000)
    parser.add_argument('--flask-port', type=int, default=5001)
    args = parser.parse_args()

    if args.mode == 'field':
        from field_unit import run
        print(f"[FIELD UNIT] Connecting to {args.host}:{args.port}")
        run(args.host, args.port)

    elif args.mode == 'command':
        from server import start_server
        print(f"[COMMAND CENTER] Listening on port {args.port} | Dashboard: http://localhost:{args.flask_port}")
        start_server(cc_port=args.port, flask_port=args.flask_port)

    elif args.mode == 'demo':
        from server import start_server
        import eventlet
        # Start server (includes command center listener) in background
        t = threading.Thread(target=start_server, kwargs={'cc_port': args.port, 'flask_port': args.flask_port}, daemon=True)
        t.start()
        time.sleep(2)  # Wait for server to bind
        from field_unit import run
        print(f"[DEMO MODE] Running full pipeline locally")
        run('localhost', args.port)

if __name__ == '__main__':
    main()
