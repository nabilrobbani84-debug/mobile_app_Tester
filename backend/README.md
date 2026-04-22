# Modiva FastAPI Backend

Backend sederhana untuk menerima login siswa, profile, upload avatar, upload bukti vitamin, notifikasi, dan data sekolah dari app mobile lalu menyimpannya ke SQLite.

## Jalankan

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
