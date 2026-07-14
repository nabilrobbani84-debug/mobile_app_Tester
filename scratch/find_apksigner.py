import os
import glob

def find_apksigner():
    possible_paths = [
        os.path.expandvars(r'%LOCALAPPDATA%\Android\Sdk\build-tools'),
        r'C:\Android\sdk\build-tools',
        r'D:\Android\sdk\build-tools',
    ]
    for base in possible_paths:
        if os.path.exists(base):
            # Find all files named apksigner.bat
            matches = glob.glob(os.path.join(base, '**', 'apksigner.bat'), recursive=True)
            if matches:
                print("Found apksigner:")
                for m in matches:
                    print(m)
                return
    print("apksigner.bat not found in standard paths")

if __name__ == '__main__':
    find_apksigner()
