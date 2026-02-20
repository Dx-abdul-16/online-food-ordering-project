import json
from cryptography.hazmat.primitives import serialization

try:
    with open('firebase-service-account.json', 'r') as f:
        data = json.load(f)
        pk = data['private_key']
        key_bytes = pk.encode('utf-8')
        print(f"Byte at 1625: {key_bytes[1625]}")
        print(f"Context: {key_bytes[1620:1635]}")
        serialization.load_pem_private_key(key_bytes, password=None)
        print("OK")
except Exception as e:
    print(f"Error: {e}")
