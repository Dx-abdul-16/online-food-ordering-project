import urllib.request
try:
    # Test through Vite Proxy
    print('Testing /api/restaurants via Proxy (port 8080)...')
    res = urllib.request.urlopen('http://127.0.0.1:8080/api/restaurants').read().decode()
    print('Success! Received data:', res[:100], '...')
except Exception as e:
    print('ERROR:', e)
