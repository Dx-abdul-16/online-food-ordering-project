import json

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data.get('private_key', '')
    print(f"Total length: {len(pk)}")
    for i, char in enumerate(pk):
        if char == '=':
            print(f"Found '=' at index {i}")
