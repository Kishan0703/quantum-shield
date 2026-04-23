import os
import base64
from datetime import datetime
from kyber_py.kyber import Kyber768
from Crypto.Cipher import AES

def generate_keypair() -> tuple[bytes, bytes]:
    pk, sk = Kyber768.keygen()
    return pk, sk

def encapsulate(pk: bytes) -> tuple[bytes, bytes]:
    shared_secret, kem_ct = Kyber768.encaps(pk)
    return kem_ct, shared_secret

def decapsulate(sk: bytes, kem_ct: bytes) -> bytes:
    shared_secret = Kyber768.decaps(sk, kem_ct)
    return shared_secret

def aes_encrypt(shared_secret: bytes, plaintext: bytes) -> bytes:
    key = shared_secret[:16]
    nonce = os.urandom(16)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return nonce + tag + ciphertext

def aes_decrypt(shared_secret: bytes, blob: bytes) -> bytes:
    nonce = blob[:16]
    tag = blob[16:32]
    ciphertext = blob[32:]
    key = shared_secret[:16]
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    try:
        plaintext = cipher.decrypt_and_verify(ciphertext, tag)
        return plaintext
    except ValueError:
        raise ValueError("Authentication failed")

def build_payload(pk: bytes, kem_ct: bytes, blob: bytes) -> dict:
    return {
        "pk": base64.b64encode(pk).decode('utf-8'),
        "kem_ct": base64.b64encode(kem_ct).decode('utf-8'),
        "blob": base64.b64encode(blob).decode('utf-8'),
        "timestamp": datetime.utcnow().isoformat() + 'Z'
    }

def parse_payload(data: dict) -> tuple[bytes, bytes]:
    kem_ct = base64.b64decode(data["kem_ct"])
    blob = base64.b64decode(data["blob"])
    return kem_ct, blob
