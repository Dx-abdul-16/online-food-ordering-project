import urllib.request
with open('debug_output.txt', 'w') as f:
    f.write(urllib.request.urlopen('http://localhost:5000/debug').read().decode())
