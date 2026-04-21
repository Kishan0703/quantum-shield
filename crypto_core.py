import base64
import os
import json
from datetime import datetime
from kyber_py.kyber import Kyber768
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

def generate_keypair():
    """Generates ML-KEM-768 keypair (pk, sk)."""
    pk, sk = Kyber768.keygen()
    return pk, sk

def encapsulate(pk):
    """Encapsulates a shared secret using public key pk."""
    shared_secret, kem_ct = Kyber768.encaps(pk)
    return kem_ct, shared_secret

def decapsulate(sk, kem_ct):
    """Decapsulates the shared secret using secret key sk and ciphertext kem_ct."""
    shared_secret = Kyber768.decaps(sk, kem_ct)
    return shared_secret

def aes_encrypt(shared_secret, plaintext):
    """Encrypts plaintext using first 16 bytes of shared_secret with AES-128-GCM."""
    key = shared_secret[:16]
    nonce = get_random_bytes(16)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode('utf-8'))
    # Blob format: nonce(16) + tag(16) + ciphertext
    return nonce + tag + ciphertext

def aes_decrypt(shared_secret, blob):
    """Decrypts blob using first 16 bytes of shared_secret with AES-128-GCM."""
    key = shared_secret[:16]
    if len(blob) < 32:
        raise ValueError("Invalid blob size")
    
    nonce = blob[:16]
    tag = blob[16:32]
    ciphertext = blob[32:]
    
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    return plaintext.decode('utf-8')

def build_payload(pk, kem_ct, blob):
    """Builds a JSON-serializable payload with base64-encoded fields."""
    payload = {
        "pk": base64.b64encode(pk).decode('utf-8'),
        "kem_ct": base64.b64encode(kem_ct).decode('utf-8'),
        "blob": base64.b64encode(blob).decode('utf-8'),
        "timestamp": datetime.now().isoformat()
    }
    return payload

def parse_payload(data):
    """Parses a received payload and returns (kem_ct, blob) in bytes."""
    kem_ct = base64.b64decode(data['kem_ct'])
    blob = base64.b64decode(data['blob'])
    return kem_ct, blob
