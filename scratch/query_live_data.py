import urllib.request
import json

def query_live():
    # 1. Login
    login_url = 'https://modiva.nurulfikri.ac.id/api/login'
    login_data = json.dumps({
        'nis': '012836191',
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
        print("Login Success:")
        
        token = res_data.get('access')
        print("Token:", token)
        
        # 2. Get sekolah lokasi
        url = 'https://modiva.nurulfikri.ac.id/api/sekolah/lokasi'
        req_locations = urllib.request.Request(
            url,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
        )
        
        res_loc = urllib.request.urlopen(req_locations)
        loc_data = json.loads(res_loc.read().decode('utf-8'))
        print("\nLocations count:", len(loc_data) if isinstance(loc_data, list) else type(loc_data))
        print("Locations sample:")
        print(json.dumps(loc_data[:10] if isinstance(loc_data, list) else loc_data, indent=2))
        
    except Exception as e:
        try:
            err_body = e.read().decode('utf-8')
            print("Error details:", err_body)
        except Exception:
            print("Error:", e)

if __name__ == '__main__':
    query_live()
