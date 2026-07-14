import urllib.request
import json

try:
    req = urllib.request.Request("http://127.0.0.1:8000/api/siswa/hb", headers={"authorization": "Bearer 1"}) # Assuming user ID 1 is Navsa
    with urllib.request.urlopen(req) as response:
        print("HB Data:", response.read().decode())
except Exception as e:
    print("Error:", e)
