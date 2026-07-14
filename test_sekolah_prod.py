import urllib.request, json
req = urllib.request.Request('https://modiva.nurulfikri.ac.id/api/sekolah/lokasi', headers={'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzgwNzM4NTI0LCJpYXQiOjE3ODA3MzgyMjQsImp0aSI6ImUyM2IyNWQwYzQzYzRlNmI5ZDMyNjY3M2VmN2YzYWFhIiwic2lzd2FfaWQiOjI5LCJuaXMiOiIwMTI4MzYxOTEiLCJuYW1hIjoiVXJ2YSIsInNla29sYWhfaWQiOjEzLCJzZWtvbGFoIjoiU01LUyBXSVNBVEEgSEFSTUFTIn0.AG1wunLPVHUn6hpTuzJYtNcaVTfPVmZUDG86JXM9JHI'})
try:
    print('Success:', urllib.request.urlopen(req).read().decode('utf-8'))
except Exception as e:
    print('Error:', e.read().decode('utf-8') if hasattr(e, 'read') else str(e))
