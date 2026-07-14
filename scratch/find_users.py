import pymysql

def print_all_users():
    try:
        db_conn = pymysql.connect(host='localhost', port=3307, user='root', password='root', database='modiva')
        cursor = db_conn.cursor(pymysql.cursors.DictCursor)
        
        # Check tables
        cursor.execute("SHOW TABLES")
        tables = [list(row.values())[0] for row in cursor.fetchall()]
        print("Tables in modiva:", tables)
        
        if 'users' in tables:
            cursor.execute("SELECT id, name, nisn, school_code, role FROM users")
            users = cursor.fetchall()
            print("\n--- Users Table ---")
            for u in users:
                print(u)
                
        if 'siswa' in tables:
            cursor.execute("SELECT id, nama, nis, sekolah_id FROM siswa")
            siswa = cursor.fetchall()
            print("\n--- Siswa Table ---")
            for s in siswa:
                print(s)
                
        cursor.close()
        db_conn.close()
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    print_all_users()
