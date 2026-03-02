import urllib.request
try:
    print(urllib.request.urlopen('http://172.20.10.4:5000/api/restaurants').read().decode())
except Exception as e:
    print('ERROR:', e)
