# Modiva FastAPI Backend

Backend sederhana untuk menerima login siswa, profile, upload avatar, upload bukti vitamin, notifikasi, dan data sekolah dari app mobile lalu menyimpannya ke SQLite.

## Jalankan Lokal

```bash
cd backend
python -m pip install -r requirements.txt
python main.py
```

Server akan aktif di `http://127.0.0.1:8000`.

## Endpoint

- `GET /health`
- `POST /api/auth/login-siswa`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `GET /api/auth/verify`
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/profile/avatar`
- `DELETE /api/users/profile/avatar`
- `POST /api/reports/submit`
- `GET /api/reports`
- `GET /api/reports/{id}`
- `GET /api/notifications`
- `PUT /api/notifications/{id}/read`
- `PUT /api/notifications/read-all`
- `DELETE /api/notifications/{id}`
- `GET /api/schools`
- `GET /api/schools/{id}`
- `GET /api/schools/{id}/location`

## Akun Seed

Beberapa akun siswa awal sudah dibuat di database:

- NISN `10001` dengan kode sekolah `20223819`
- NISN `10002` dengan kode sekolah `20223819`
- NISN `0110222079` dengan kode sekolah `SMPN1JKT`

## Penyimpanan

- Database SQLite: `backend/data/modiva.db`
- File upload: `backend/uploads/`

Saat user upload avatar baru atau menghapus avatar, backend akan membersihkan file avatar lama yang sudah tidak direferensikan lagi.

## Siap Deploy

Backend ini sekarang sudah disiapkan untuk deploy generik:

- [Dockerfile](C:\project\mobile-app-modiva\mobile_tester\backend\Dockerfile)
- [Procfile](C:\project\mobile-app-modiva\mobile_tester\backend\Procfile)
- [.env.example](C:\project\mobile-app-modiva\mobile_tester\backend\.env.example)
- [railway.toml](C:\project\mobile-app-modiva\mobile_tester\backend\railway.toml)

### Opsi 1: Deploy dengan Docker di VPS

```bash
cd backend
docker build -t modiva-backend .
docker run -d --name modiva-backend -p 8000:8000 -v $(pwd)/data:/app/data -v $(pwd)/uploads:/app/uploads modiva-backend
```

### Opsi 2: Deploy ke platform seperti Railway/Render

- gunakan root folder `backend`
- install command: `pip install -r requirements.txt`
- start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- pastikan folder `data/` dan `uploads/` punya persistent storage

### Opsi 3: Deploy ke Railway

- root service: `backend`
- Railway akan memakai [Dockerfile](C:\project\mobile-app-modiva\mobile_tester\backend\Dockerfile) dan [railway.toml](C:\project\mobile-app-modiva\mobile_tester\backend\railway.toml)
- healthcheck: `/health`
- mount volume persisten untuk:
  - `/app/data`
  - `/app/uploads`
- setelah deploy berhasil, catat domain publik Railway lalu gunakan sebagai `EXPO_PUBLIC_API_URL`

### Catatan penting produksi

- SQLite cocok untuk tahap awal atau traffic kecil
- untuk banyak pengguna, lebih aman pindah ke PostgreSQL/MySQL
- upload file di produksi sebaiknya dipindah ke object storage seperti S3-compatible storage
- jangan build APK production ke IP laptop lokal; gunakan domain publik backend
