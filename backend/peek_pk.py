import json

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data.get('private_key', '')
    print(f"Index 1625: '{pk[1625]}'")
    print(f"Context: '{pk[1620:1630]}'")
