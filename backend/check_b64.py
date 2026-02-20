import json
import base64

with open('firebase-service-account.json', 'r') as f:
    data = json.load(f)
    pk = data['private_key']
    # Remove header/footer
    b64_part = pk.replace('-----BEGIN PRIVATE KEY-----\n', '').replace('\n-----END PRIVATE KEY-----\n', '').replace('\n', '')
    try:
        base64.b64decode(b64_part)
        print("Base64 is valid")
    except Exception as e:
        print(f"Base64 error: {e}")
