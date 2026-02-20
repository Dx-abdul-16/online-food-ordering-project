import json

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data['private_key']
    for i, b in enumerate(pk.encode('utf-8')):
        if b == 61:
            print(f"Found '=' at index {i}")
