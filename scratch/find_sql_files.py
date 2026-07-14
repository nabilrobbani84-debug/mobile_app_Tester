import os

def search_sql_files():
    root_dir = 'c:/project/mobile-app-modiva'
    found = False
    for r, dirs, files in os.walk(root_dir):
        for f in files:
            if f.endswith('.sql'):
                path = os.path.join(r, f)
                print(f"Checking SQL file: {path}")
                try:
                    with open(path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                        for line_num, line in enumerate(file_obj, 1):
                            line_lower = line.lower()
                            if 'nadya' in line_lower:
                                print(f"  [NADYA] Found on line {line_num} in {f}: {line.strip()[:150]}")
                                found = True
                            if 'urva' in line_lower:
                                print(f"  [URVA] Found on line {line_num} in {f}: {line.strip()[:150]}")
                                found = True
                            if 'nadia' in line_lower:
                                print(f"  [NADIA] Found on line {line_num} in {f}: {line.strip()[:150]}")
                                found = True
                except Exception as e:
                    print(f"  Error reading {path}: {e}")
    if not found:
        print("No matches for Nadya, Urva, or Nadia found in any SQL file.")

if __name__ == '__main__':
    search_sql_files()
