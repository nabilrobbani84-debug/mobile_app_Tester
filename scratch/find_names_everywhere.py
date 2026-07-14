import os

def search_text_files():
    root_dir = 'c:/project/mobile-app-modiva'
    ignore_dirs = {'.git', 'node_modules', '.expo', '.vscode', 'mysql-data'}
    found = False
    
    for r, dirs, files in os.walk(root_dir):
        # modify dirs in place to ignore specific directories
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in {'.py', '.js', '.ts', '.tsx', '.json', '.md', '.txt', '.env', '.yml', '.yaml'}:
                path = os.path.join(r, f)
                try:
                    with open(path, 'r', encoding='utf-8', errors='ignore') as file_obj:
                        for line_num, line in enumerate(file_obj, 1):
                            line_lower = line.lower()
                            if 'nadya' in line_lower:
                                print(f"  [NADYA] Found on line {line_num} in {path}: {line.strip()[:150]}")
                                found = True
                            if 'urva' in line_lower:
                                print(f"  [URVA] Found on line {line_num} in {path}: {line.strip()[:150]}")
                                found = True
                            if 'nadia' in line_lower:
                                print(f"  [NADIA] Found on line {line_num} in {path}: {line.strip()[:150]}")
                                found = True
                except Exception as e:
                    pass
    if not found:
        print("No matches found in any text files.")

if __name__ == '__main__':
    search_text_files()
