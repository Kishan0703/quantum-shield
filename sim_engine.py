import time

def simulate_rsa_attack(bits=2048):
    """Simulates Shor's algorithm breaking RSA."""
    # Theatrical delay for dashboard effect
    time.sleep(3)
    return {
        "result": "BREACHED",
        "method": "Shor's algorithm",
        "time_ms": 3000,
        "bits": bits
    }

def simulate_kyber_attack():
    """Simulates attacker hitting lattice-based encryption."""
    # No quantum speedup possible, returns immediately or with small delay for realism
    return {
        "result": "BLOCKED",
        "method": "SVP — exponential hardness",
        "time_ms": None,
        "reason": "No quantum speedup on MLWE"
    }

def run_comparison_demo():
    """Runs both simulations and returns combined result."""
    rsa_result = simulate_rsa_attack()
    kyber_result = simulate_kyber_attack()
    return {
        "rsa": rsa_result,
        "kyber": kyber_result
    }
