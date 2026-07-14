import urllib.request
import json

def test_nadya_login():
    login_url = 'https://modiva.nurulfikri.ac.id/api/login'
    login_data = json.dumps({
        'nis': '0102228372',
        'kode_sekolah': '69753313'
    }).encode('utf-8')
    
    req = urllib.request.Request(
        login_url,
        data=login_data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        response = urllib.request.urlopen(req)
        res_data = json.loads(response.read().decode('utf-8'))
        print("Success:", json.dumps(res_data, indent=2))
    except Exception as e:
        try:
            err_body = e.read().decode('utf-8')
            print("Error details:", err_body)
        except Exception:
            print("Error:", e)

if __name__ == '__main__':
    test_nadya_login()
