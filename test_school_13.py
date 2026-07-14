import urllib.request, json
req = urllib.request.Request('https://modiva.nurulfikri.ac.id/api/schools/13')
try:
    print('Success:', urllib.request.urlopen(req).read().decode('utf-8'))
except Exception as e:
    print('Error:', e.read().decode('utf-8') if hasattr(e, 'read') else str(e))
