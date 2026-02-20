import json
import firebase_admin
from firebase_admin import credentials

try:
    cred = credentials.Certificate('firebase-service-account.json')
    print("Certificate loaded successfully!")
except Exception as e:
    print(f"Error: {e}")
