import urllib.request
import json

def test_slashes():
    for url in ['https://modiva.nurulfikri.ac.id/api/login', 'https://modiva.nurulfikri.ac.id/api/login/']:
        print(f"Testing: {url}")
        login_data = json.dumps({
            'nis': '0102228372',
            'kode_sekolah': '69753313'
        }).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=login_data,
            headers={'Content-Type': 'application/json'}
        )
        
        try:
            response = urllib.request.urlopen(req)
            print("  Response code:", response.getcode())
            print("  Response body:", response.read().decode('utf-8')[:150])
        except Exception as e:
            try:
                print("  Response code:", e.code)
                print("  Error details:", e.read().decode('utf-8')[:150])
            except Exception:
                print("  Error:", e)

if __name__ == '__main__':
    test_slashes()
