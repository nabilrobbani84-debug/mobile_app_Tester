import urllib.request
import json

def test_kartika():
    # Attempt login
    login_url = 'https://modiva.nurulfikri.ac.id/api/login'
    login_data = json.dumps({
        'nis': '10004',
        'kode_sekolah': '20223819'
    }).encode('utf-8')
    
    req = urllib.request.Request(
        login_url,
        data=login_data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        response = urllib.request.urlopen(req)
        res_data = json.loads(response.read().decode('utf-8'))
        print("Login Success:")
        
        token = res_data.get('access')
        if not token:
            print("Token ('access') not found in response")
            return
            
        # Call riwayat-konsumsi
        history_url = 'https://modiva.nurulfikri.ac.id/api/riwayat-konsumsi'
        req_hist = urllib.request.Request(
            history_url,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
        )
        
        res_hist = urllib.request.urlopen(req_hist)
        hist_data = json.loads(res_hist.read().decode('utf-8'))
        print("\nConsumption History from API:")
        print(json.dumps(hist_data, indent=2))
        
    except Exception as e:
        try:
            err_body = e.read().decode('utf-8')
            print("Error details:", err_body)
        except Exception:
            print("Error:", e)

if __name__ == '__main__':
    test_kartika()
