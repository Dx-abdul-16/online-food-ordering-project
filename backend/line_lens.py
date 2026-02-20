import json

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data['private_key']
    lines = pk.split('\n')
    for i, line in enumerate(lines):
        if line and '---' not in line:
            print(f"Line {i}: {len(line)}")
