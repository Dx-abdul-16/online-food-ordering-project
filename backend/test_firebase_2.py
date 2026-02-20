import json
import firebase_admin
from firebase_admin import credentials

try:
    with open('firebase-service-account.json', 'r') as f:
        data = json.load(f)
        pk = data.get('private_key', '')
        print(f"Private Key starts with: {pk[:50]}")
        print(f"End of PK: {pk[-50:]}")
        
    cred = credentials.Certificate('firebase-service-account.json')
    print("Certificate loaded successfully!")
except Exception as e:
    print(f"Error: {e}")
