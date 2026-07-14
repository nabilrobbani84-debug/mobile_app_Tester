import pymysql

try:
    conn = pymysql.connect(
        host='127.0.0.1',
        user='root',
        password='',
        database='modiva',
        port=3306
    )
    cursor = conn.cursor(pymysql.cursors.DictCursor)
    
    # Check total records in distribusi_siswa
    cursor.execute("SELECT COUNT(*) as total FROM distribusi_siswa")
    total = cursor.fetchone()['total']
    print(f"Total records in distribusi_siswa table: {total}")
    
    # Check records for Kartika Anggraini (NIS 10004)
    cursor.execute("SELECT * FROM distribusi_siswa WHERE nis = '10004'")
    rows = cursor.fetchall()
    print(f"Records for Kartika (10004): {len(rows)}")
    for r in rows:
        print(r)
        
    cursor.close()
    conn.close()
except Exception as e:
    print("Database error:", e)
