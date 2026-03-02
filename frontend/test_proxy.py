import urllib.request
try:
    print(urllib.request.urlopen('http://127.0.0.1:8080/api/restaurants').read().decode())
except Exception as e:
    print('ERROR:', e)
