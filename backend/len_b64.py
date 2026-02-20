import json

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data['private_key']
    b64_part = pk.replace('-----BEGIN PRIVATE KEY-----\n', '').replace('\n-----END PRIVATE KEY-----\n', '').replace('\n', '')
    print(f"B64 Part Length: {len(b64_part)}")
