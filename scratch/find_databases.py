import pymysql

def find_all():
    try:
        db = pymysql.connect(host='localhost', port=3307, user='root', password='root')
        cursor = db.cursor()
        cursor.execute("SHOW DATABASES")
        dbs = [row[0] for row in cursor.fetchall()]
        print("Databases on 3307:", dbs)
        
        for db_name in dbs:
            if db_name in ['information_schema', 'performance_schema', 'mysql', 'sys']:
                continue
            print(f"\n--- Database: {db_name} ---")
            db_conn = pymysql.connect(host='localhost', port=3307, user='root', password='root', database=db_name)
            cur = db_conn.cursor()
            cur.execute("SHOW TABLES")
            tables = [row[0] for row in cur.fetchall()]
            print("Tables:", tables)
            
            # check if 'siswa' or 'sekolah' or 'users' tables exist and print row counts
            for t in ['siswa', 'sekolah', 'users', 'auth_user']:
                if t in tables:
                    cur.execute(f"SELECT COUNT(*) FROM {t}")
                    count = cur.fetchone()[0]
                    print(f"  Table '{t}' count: {count}")
                    if count > 0:
                        cur.execute(f"SELECT * FROM {t} LIMIT 5")
                        print(f"  Sample {t}:", cur.fetchall())
            cur.close()
            db_conn.close()
            
        cursor.close()
        db.close()
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    find_all()
