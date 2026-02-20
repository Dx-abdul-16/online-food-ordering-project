import traceback
import firebase_admin
from firebase_admin import credentials

with open('full_error.txt', 'w') as f:
    try:
        credentials.Certificate('firebase-service-account.json')
        f.write("OK")
    except Exception:
        traceback.print_exc(file=f)
