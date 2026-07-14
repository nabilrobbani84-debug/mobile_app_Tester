import urllib.request, json
data = json.dumps({'nis':'012836191', 'kode_sekolah':'69753313'}).encode('utf-8')
req = urllib.request.Request('https://modiva.nurulfikri.ac.id/api/login', data=data, headers={'Content-Type': 'application/json'})
try:
    print("Success:", urllib.request.urlopen(req).read().decode('utf-8'))
except Exception as e:
    try:
        print("Error Body:", e.read().decode('utf-8'))
    except:
        print("Error:", e)
