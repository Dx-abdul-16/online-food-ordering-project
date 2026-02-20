import json

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data['private_key']
    print(f"PK Length: {len(pk)}")
    print(f"Char at 1625: '{pk[1625]}' (ascii: {ord(pk[1625])})")
    print(f"Context: {repr(pk[1620:1635])}")
