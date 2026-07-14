import urllib.request
import json

def test_nadya_profile():
    # 1. Login
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
        token = res_data.get('access')
        print("Token obtained.")
        
        # 2. Get profile
        profile_url = 'https://modiva.nurulfikri.ac.id/api/siswa/profile'
        req_profile = urllib.request.Request(
            profile_url,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
        )
        
        res_prof = urllib.request.urlopen(req_profile)
        prof_data = json.loads(res_prof.read().decode('utf-8'))
        print("Profile Response:")
        print(json.dumps(prof_data, indent=2))
        
    except Exception as e:
        try:
            err_body = e.read().decode('utf-8')
            print("Error details:", err_body)
        except Exception:
            print("Error:", e)

if __name__ == '__main__':
    test_nadya_profile()
