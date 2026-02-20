import json

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data['private_key']
    lines = pk.split('\n')
    print(f"Line 24: '{lines[24]}'")
