import pymysql

def check_db():
    try:
        db = pymysql.connect(host='localhost',user='root',password='',database='modiva_mobileApp')
        cursor = db.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT u.name, h.year_label, h.hb_value FROM users u JOIN user_hb_history h ON u.id = h.user_id")
        print(cursor.fetchall())
        cursor.close()
        db.close()
    except Exception as e:
        print("Error:", e)

check_db()
