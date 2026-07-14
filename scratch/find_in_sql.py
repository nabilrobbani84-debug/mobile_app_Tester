import os

def search_sql():
    sql_path = 'backend-api/db_modiva.sql'
    if not os.path.exists(sql_path):
        print("db_modiva.sql does not exist.")
        return
        
    print(f"Searching in {sql_path}...")
    with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        for line_num, line in enumerate(f, 1):
            line_lower = line.lower()
            if 'nadya' in line_lower:
                print(f"Line {line_num} (Nadya):", line.strip()[:200])
            if 'urva' in line_lower:
                print(f"Line {line_num} (Urva):", line.strip()[:200])

if __name__ == '__main__':
    search_sql()
