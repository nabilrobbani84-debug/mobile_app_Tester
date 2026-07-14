import os
import re

def search_siswa_block():
    sql_path = 'backend-api/db_modiva.sql'
    with open(sql_path, 'r', encoding='utf-8', errors='ignore') as f:
        in_siswa = False
        for line in f:
            if 'INSERT INTO `siswa`' in line:
                in_siswa = True
                continue
            if in_siswa:
                if line.startswith('INSERT INTO') or line.strip() == '':
                    in_siswa = False
                    continue
                # This is a value line
                line_lower = line.lower()
                if 'nadya' in line_lower:
                    print("Found Nadya line:", line.strip())
                if 'urva' in line_lower:
                    print("Found Urva line:", line.strip())
                if 'nadia' in line_lower:
                    print("Found Nadia line:", line.strip())

if __name__ == '__main__':
    search_siswa_block()
