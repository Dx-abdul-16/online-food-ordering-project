import urllib.request
import json
import traceback
try:
    data = json.dumps({"userId":4,"restaurantId":1,"items":[{"id":1,"quantity":3,"price":350}],"total":1050,"paymentMethod":"cod","address":"test"}).encode('utf-8')
    req = urllib.request.Request("http://localhost:5000/api/orders/place", data=data, headers={'Content-Type': 'application/json'})
    res = urllib.request.urlopen(req)
    with open('test_api.txt', 'w') as f:
        f.write(res.read().decode())
except Exception as e:
    with open('test_api.txt', 'w') as f:
        if hasattr(e, 'read'):
            f.write(e.read().decode())
        else:
            f.write(traceback.format_exc())
