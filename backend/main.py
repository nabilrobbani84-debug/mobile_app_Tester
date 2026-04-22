from __future__ import annotations

import mimetypes
import os
import sqlite3
import uuid
from contextlib import closing
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional

from fastapi import FastAPI, File, Form, Header, HTTPException, Query, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
UPLOADS_DIR = BASE_DIR / "uploads"
DB_PATH = DATA_DIR / "modiva.db"

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

SEED_SCHOOLS = [
    {
        "id": "1",
        "kode": "SMPN1JKT",
        "nama": "SMPN 1 Jakarta",
        "nama_lengkap": "Sekolah Menengah Pertama Negeri 1 Jakarta",
        "alamat": "Jl. Cikini Raya No.1, Cikini, Menteng, Jakarta Pusat",
        "kota": "Jakarta Pusat",
        "provinsi": "DKI Jakarta",
        "kode_pos": "10330",
        "telepon": "(021) 3913371",
        "email": "smpn1jkt@disdik.jakarta.go.id",
        "kepala_sekolah": "Drs. H. Ahmad Fauzi, M.Pd",
        "akreditasi": "A",
        "npsn": "20100047",
        "latitude": -6.196241,
        "longitude": 106.836671,
        "jumlah_siswa": 1,
        "status": "Negeri",
        "jenjang": "SMP",
    },
    {
        "id": "3",
        "kode": "20223819",
        "nama": "SMAN 1 KOTA DEPOK",
        "nama_lengkap": "Sekolah Menengah Atas Negeri 1 Kota Depok",
        "alamat": "Jl. Nusantara Raya 317, Depok, Kota Depok",
        "kota": "Kota Depok",
        "provinsi": "Jawa Barat",
        "kode_pos": "16431",
        "telepon": "(021) 7520137",
        "email": "sman1depokjabar@gmail.com",
        "kepala_sekolah": "Kepala Sekolah SMAN 1 Kota Depok",
        "akreditasi": "A",
        "npsn": "20223819",
        "latitude": -6.402222,
        "longitude": 106.801944,
        "jumlah_siswa": 5,
        "status": "Negeri",
        "jenjang": "SMA",
    },
    {
        "id": "8",
        "kode": "20223818",
        "nama": "SMAN 2 KOTA DEPOK",
        "nama_lengkap": "Sekolah Menengah Atas Negeri 2 Kota Depok",
        "alamat": "Jl. Gede Raya No. 177, Depok Timur, Abadi Jaya, Kota Depok",
        "kota": "Kota Depok",
        "provinsi": "Jawa Barat",
        "kode_pos": "16412",
        "telepon": "(021) 7708359",
        "email": "sman2.depok@yahoo.com",
        "kepala_sekolah": "Kepala Sekolah SMAN 2 Kota Depok",
        "akreditasi": "A",
        "npsn": "20223818",
        "latitude": -6.389722,
        "longitude": 106.831667,
        "jumlah_siswa": 4,
        "status": "Negeri",
        "jenjang": "SMA",
    },
    {
        "id": "9",
        "kode": "20258460",
        "nama": "SMAN 15 Depok",
        "nama_lengkap": "Sekolah Menengah Atas Negeri 15 Depok",
        "alamat": "Jl. Merdeka No. 78, Abadijaya, Kec. Sukmajaya, Kota Depok",
        "kota": "Kota Depok",
        "provinsi": "Jawa Barat",
        "kode_pos": "16417",
        "telepon": None,
        "email": None,
        "kepala_sekolah": "Kepala Sekolah SMAN 15 Depok",
        "akreditasi": "A",
        "npsn": "20258460",
        "latitude": -6.381667,
        "longitude": 106.8425,
        "jumlah_siswa": 8,
        "status": "Negeri",
        "jenjang": "SMA",
    },
    {
        "id": "12",
        "kode": "20223817",
        "nama": "SMAN 3 KOTA DEPOK",
        "nama_lengkap": "Sekolah Menengah Atas Negeri 3 Kota Depok",
        "alamat": "Jl. Raden Saleh No.45, Sukmajaya, Kec. Sukmajaya, Kota Depok",
        "kota": "Kota Depok",
        "provinsi": "Jawa Barat",
        "kode_pos": "16412",
        "telepon": "021-7700310",
        "email": "SMANTIGADEPOK@YAHOO.COM",
        "kepala_sekolah": "Kepala Sekolah SMAN 3 Kota Depok",
        "akreditasi": "A",
        "npsn": "20223817",
        "latitude": -6.390833,
        "longitude": 106.835556,
        "jumlah_siswa": 6,
        "status": "Negeri",
        "jenjang": "SMA",
    },
]

SEED_USERS = [
    {
        "id": "1",
        "name": "Gita Hidayat",
        "nisn": "10001",
        "email": "gita.hidayat@outlook.com",
        "phone": "081234567801",
        "school_id": "3",
        "school_code": "20223819",
        "address": "Depok",
        "birth_place": "Depok",
        "birth_date": "2010-05-25",
        "gender": "M",
        "height": 155,
        "weight": 45,
        "hb_last": 12.0,
        "consumption_count": 5,
        "total_target": 90,
        "role": "siswa",
    },
    {
        "id": "2",
        "name": "Nanda Lestari",
        "nisn": "10002",
        "email": "nanda.lestari@yahoo.com",
        "phone": "081234567802",
        "school_id": "3",
        "school_code": "20223819",
        "address": "Depok",
        "birth_place": "Bekasi",
        "birth_date": "2006-06-18",
        "gender": "M",
        "height": 158,
        "weight": 48,
        "hb_last": 11.5,
        "consumption_count": 10,
        "total_target": 90,
        "role": "siswa",
    },
    {
        "id": "99",
        "name": "Rizky Pratama",
        "nisn": "0110222079",
        "email": "rizky.pratama@modiva.id",
        "phone": "081234567899",
        "school_id": "1",
        "school_code": "SMPN1JKT",
        "address": "Jakarta",
        "birth_place": "Jakarta",
        "birth_date": "2008-08-17",
        "gender": "M",
        "height": 170,
        "weight": 60,
        "hb_last": 13.5,
        "consumption_count": 15,
        "total_target": 90,
        "role": "siswa",
    },
]


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def utc_now_iso() -> str:
    return utc_now().isoformat()


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH, timeout=30)
    connection.row_factory = sqlite3.Row
    return connection


def execute_script(connection: sqlite3.Connection) -> None:
    connection.executescript(
        """
        CREATE TABLE IF NOT EXISTS schools (
            id TEXT PRIMARY KEY,
            kode TEXT NOT NULL UNIQUE,
            nama TEXT NOT NULL,
            nama_lengkap TEXT,
            alamat TEXT,
            kota TEXT,
            provinsi TEXT,
            kode_pos TEXT,
            telepon TEXT,
            email TEXT,
            kepala_sekolah TEXT,
            akreditasi TEXT,
            npsn TEXT,
            latitude REAL,
            longitude REAL,
            jumlah_siswa INTEGER DEFAULT 0,
            status TEXT,
            jenjang TEXT
        );

        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            nisn TEXT NOT NULL UNIQUE,
            email TEXT,
            phone TEXT,
            school_id TEXT,
            school_code TEXT,
            address TEXT,
            birth_place TEXT,
            birth_date TEXT,
            gender TEXT,
            height REAL,
            weight REAL,
            avatar TEXT,
            role TEXT DEFAULT 'siswa',
            hb_last REAL DEFAULT 12.0,
            consumption_count INTEGER DEFAULT 0,
            total_target INTEGER DEFAULT 90,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            refresh_token TEXT,
            user_id TEXT NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            icon TEXT DEFAULT 'notifications',
            color TEXT DEFAULT '#3b82f6',
            action TEXT,
            metadata TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            date TEXT NOT NULL,
            notes TEXT DEFAULT '',
            photo_filename TEXT,
            photo_original_name TEXT,
            photo_mime_type TEXT,
            photo_size INTEGER DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        """
    )


def seed_schools(connection: sqlite3.Connection) -> None:
    existing = connection.execute("SELECT COUNT(*) AS count FROM schools").fetchone()["count"]
    if existing:
        return

    for school in SEED_SCHOOLS:
        connection.execute(
            """
            INSERT INTO schools (
                id, kode, nama, nama_lengkap, alamat, kota, provinsi, kode_pos,
                telepon, email, kepala_sekolah, akreditasi, npsn, latitude,
                longitude, jumlah_siswa, status, jenjang
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                school["id"],
                school["kode"],
                school["nama"],
                school["nama_lengkap"],
                school["alamat"],
                school["kota"],
                school["provinsi"],
                school["kode_pos"],
                school["telepon"],
                school["email"],
                school["kepala_sekolah"],
                school["akreditasi"],
                school["npsn"],
                school["latitude"],
                school["longitude"],
                school["jumlah_siswa"],
                school["status"],
                school["jenjang"],
            ),
        )


def seed_users(connection: sqlite3.Connection) -> None:
    existing = connection.execute("SELECT COUNT(*) AS count FROM users").fetchone()["count"]
    if existing:
        return

    for user in SEED_USERS:
        timestamp = utc_now_iso()
        connection.execute(
            """
            INSERT INTO users (
                id, name, nisn, email, phone, school_id, school_code, address,
                birth_place, birth_date, gender, height, weight, avatar, role,
                hb_last, consumption_count, total_target, created_at, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                user["name"],
                user["nisn"],
                user["email"],
                user["phone"],
                user["school_id"],
                user["school_code"],
                user["address"],
                user["birth_place"],
                user["birth_date"],
                user["gender"],
                user["height"],
                user["weight"],
                None,
                user["role"],
                user["hb_last"],
                user["consumption_count"],
                user["total_target"],
                timestamp,
                timestamp,
            ),
        )


def seed_notifications(connection: sqlite3.Connection) -> None:
    existing = connection.execute("SELECT COUNT(*) AS count FROM notifications").fetchone()["count"]
    if existing:
        return

    for user in SEED_USERS:
        now = utc_now_iso()
        notifications = [
            (
                user["id"],
                "reminder",
                "Pengingat Minum Vitamin",
                f"Halo {user['name']}, jangan lupa minum vitamin hari ini ya.",
                0,
                "notifications",
                "blue",
            ),
            (
                user["id"],
                "info",
                "Data Sekolah Aktif",
                f"Akun kamu terhubung dengan kode sekolah {user['school_code']}.",
                1,
                "school",
                "yellow",
            ),
        ]

        for row in notifications:
            connection.execute(
                """
                INSERT INTO notifications (
                    user_id, type, title, message, read, icon, color, action,
                    metadata, created_at, updated_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (*row, None, "{}", now, now),
            )


def init_db() -> None:
    with closing(get_connection()) as connection:
        execute_script(connection)
        seed_schools(connection)
        seed_users(connection)
        seed_notifications(connection)
        connection.commit()


app = FastAPI(title="Modiva Backend", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def build_photo_url(request: Request, filename: Optional[str]) -> Optional[str]:
    if not filename:
        return None
    try:
        return str(request.url_for("get_uploaded_file", filename=filename))
    except RuntimeError:
        base_url = str(request.base_url).rstrip("/")
        return f"{base_url}/uploads/{filename}"


def resolve_media_url(request: Optional[Request], value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    if str(value).startswith("http://") or str(value).startswith("https://"):
        return value
    if request is None:
        return value
    return build_photo_url(request, value)


def save_upload_file(photo: UploadFile) -> tuple[str, int]:
    extension = Path(photo.filename or "").suffix.lower()
    if not extension:
        guessed_extension = mimetypes.guess_extension(photo.content_type or "") or ".jpg"
        extension = guessed_extension

    stored_filename = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOADS_DIR / stored_filename
    content = photo.file.read()
    destination.write_bytes(content)
    return stored_filename, len(content)


def remove_uploaded_file_if_unused(connection: sqlite3.Connection, filename: Optional[str]) -> bool:
    normalized_filename = str(filename or "").strip()
    if not normalized_filename:
        return False
    if "/" in normalized_filename or "\\" in normalized_filename:
        return False

    avatar_usage = connection.execute(
        "SELECT COUNT(*) AS count FROM users WHERE avatar = ?",
        (normalized_filename,),
    ).fetchone()["count"]
    report_usage = connection.execute(
        "SELECT COUNT(*) AS count FROM reports WHERE photo_filename = ?",
        (normalized_filename,),
    ).fetchone()["count"]

    if avatar_usage or report_usage:
        return False

    file_path = UPLOADS_DIR / normalized_filename
    if file_path.exists():
        file_path.unlink()
        return True
    return False


def get_school_row(connection: sqlite3.Connection, *, school_id: Optional[str] = None, school_code: Optional[str] = None) -> Optional[sqlite3.Row]:
    if school_id:
        row = connection.execute("SELECT * FROM schools WHERE id = ?", (school_id,)).fetchone()
        if row is not None:
            return row
    if school_code:
        return connection.execute(
            "SELECT * FROM schools WHERE UPPER(kode) = UPPER(?)",
            (school_code,),
        ).fetchone()
    return None


def user_to_payload(connection: sqlite3.Connection, user_row: sqlite3.Row, request: Optional[Request] = None) -> dict[str, Any]:
    school = get_school_row(connection, school_id=user_row["school_id"], school_code=user_row["school_code"])
    school_name = school["nama"] if school else user_row["school_code"]
    return {
        "id": user_row["id"],
        "name": user_row["name"],
        "nisn": user_row["nisn"],
        "school": school_name,
        "schoolId": user_row["school_id"],
        "schoolCode": user_row["school_code"],
        "role": user_row["role"] or "siswa",
        "email": user_row["email"],
        "phone": user_row["phone"],
        "address": user_row["address"],
        "birthPlace": user_row["birth_place"],
        "birthDate": user_row["birth_date"],
        "gender": user_row["gender"],
        "height": user_row["height"],
        "weight": user_row["weight"],
        "avatar": resolve_media_url(request, user_row["avatar"]),
        "createdAt": user_row["created_at"],
        "updatedAt": user_row["updated_at"],
        "hbLast": user_row["hb_last"],
        "consumptionCount": user_row["consumption_count"],
        "totalTarget": user_row["total_target"],
    }


def user_to_profile_response(connection: sqlite3.Connection, user_row: sqlite3.Row, request: Optional[Request] = None) -> dict[str, Any]:
    school = get_school_row(connection, school_id=user_row["school_id"], school_code=user_row["school_code"])
    school_name = school["nama"] if school else user_row["school_code"]
    return {
        "id": user_row["id"],
        "name": user_row["name"],
        "nisn": user_row["nisn"],
        "email": user_row["email"],
        "phone": user_row["phone"],
        "school": school_name,
        "school_id": user_row["school_id"],
        "school_code": user_row["school_code"],
        "address": user_row["address"],
        "birth_place": user_row["birth_place"],
        "birth_date": user_row["birth_date"],
        "gender": user_row["gender"],
        "height": user_row["height"],
        "weight": user_row["weight"],
        "avatar": resolve_media_url(request, user_row["avatar"]),
        "role": user_row["role"] or "siswa",
        "hb_last": user_row["hb_last"],
        "consumption_count": user_row["consumption_count"],
        "total_target": user_row["total_target"],
        "created_at": user_row["created_at"],
        "updated_at": user_row["updated_at"],
    }


def create_session(connection: sqlite3.Connection, user_id: str) -> tuple[str, str]:
    token = f"session-{user_id}-{uuid.uuid4().hex}"
    refresh_token = f"refresh-{user_id}-{uuid.uuid4().hex}"
    created_at = utc_now()
    expires_at = created_at.timestamp() + (24 * 60 * 60)
    expires_at_iso = datetime.fromtimestamp(expires_at, tz=timezone.utc).isoformat()
    connection.execute("DELETE FROM sessions WHERE user_id = ?", (user_id,))
    connection.execute(
        """
        INSERT INTO sessions (token, refresh_token, user_id, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (token, refresh_token, user_id, created_at.isoformat(), expires_at_iso),
    )
    return token, refresh_token


def extract_bearer_token(authorization: Optional[str]) -> str:
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header is required")
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Bearer token is required")
    return authorization[7:].strip()


def get_session_row(connection: sqlite3.Connection, token: str) -> sqlite3.Row:
    row = connection.execute("SELECT * FROM sessions WHERE token = ?", (token,)).fetchone()
    if row is None:
        raise HTTPException(status_code=401, detail="Sesi tidak valid")
    if datetime.fromisoformat(row["expires_at"]) < utc_now():
        connection.execute("DELETE FROM sessions WHERE token = ?", (token,))
        connection.commit()
        raise HTTPException(status_code=401, detail="Sesi telah berakhir")
    return row


def get_current_user(connection: sqlite3.Connection, authorization: Optional[str]) -> sqlite3.Row:
    token = extract_bearer_token(authorization)
    session = get_session_row(connection, token)
    user = connection.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],)).fetchone()
    if user is None:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")
    return user


def school_row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    return {
        "id": row["id"],
        "kode": row["kode"],
        "nama": row["nama"],
        "nama_lengkap": row["nama_lengkap"],
        "alamat": row["alamat"],
        "kota": row["kota"],
        "provinsi": row["provinsi"],
        "kode_pos": row["kode_pos"],
        "telepon": row["telepon"],
        "email": row["email"],
        "kepala_sekolah": row["kepala_sekolah"],
        "akreditasi": row["akreditasi"],
        "npsn": row["npsn"],
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "jumlah_siswa": row["jumlah_siswa"],
        "status": row["status"],
        "jenjang": row["jenjang"],
    }


@app.get("/health")
def healthcheck() -> dict:
    return {"success": True, "message": "Backend aktif"}


@app.get("/uploads/{filename}", name="get_uploaded_file")
def get_uploaded_file(filename: str) -> FileResponse:
    file_path = UPLOADS_DIR / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File tidak ditemukan")
    return FileResponse(file_path)


@app.post("/api/auth/login-siswa")
def login_siswa(payload: dict[str, Any], request: Request) -> dict[str, Any]:
    submitted_nisn = str(payload.get("nisn") or payload.get("nis") or "").strip()
    submitted_school = str(
        payload.get("schoolCode")
        or payload.get("school_code")
        or payload.get("schoolId")
        or payload.get("school_id")
        or ""
    ).strip().upper()

    if not submitted_nisn or not submitted_school:
        raise HTTPException(status_code=422, detail="NISN dan kode sekolah wajib diisi")

    with closing(get_connection()) as connection:
        user = connection.execute(
            """
            SELECT * FROM users
            WHERE nisn = ? AND (UPPER(school_code) = ? OR school_id = ?)
            """,
            (submitted_nisn, submitted_school, submitted_school),
        ).fetchone()
        if user is None:
            raise HTTPException(status_code=401, detail="NIS atau Kode Sekolah salah / tidak terdaftar")

        token, refresh_token = create_session(connection, user["id"])
        connection.commit()
        return {
            "success": True,
            "token": token,
            "refreshToken": refresh_token,
            "user": user_to_payload(connection, user, request),
        }


@app.post("/api/auth/login-guru")
def login_guru(payload: dict[str, Any]) -> dict[str, Any]:
    return {
        "success": True,
        "token": f"guru-{uuid.uuid4().hex}",
        "refreshToken": f"guru-refresh-{uuid.uuid4().hex}",
        "user": {
            "id": "guru-1",
            "name": payload.get("email") or "Guru",
            "role": "guru",
            "school": "SMAN 1 KOTA DEPOK",
        },
    }


@app.post("/api/auth/logout")
def logout(authorization: Optional[str] = Header(default=None)) -> dict[str, Any]:
    token = extract_bearer_token(authorization)
    with closing(get_connection()) as connection:
        connection.execute("DELETE FROM sessions WHERE token = ?", (token,))
        connection.commit()
    return {"success": True, "message": "Logout successful"}


@app.post("/api/auth/refresh")
def refresh_token(payload: dict[str, Any]) -> dict[str, Any]:
    refresh = str(payload.get("refreshToken") or "").strip()
    if not refresh:
        raise HTTPException(status_code=422, detail="Refresh token wajib diisi")

    with closing(get_connection()) as connection:
        session = connection.execute(
            "SELECT * FROM sessions WHERE refresh_token = ?",
            (refresh,),
        ).fetchone()
        if session is None:
            raise HTTPException(status_code=401, detail="Refresh token tidak valid")
        token, refresh_token = create_session(connection, session["user_id"])
        connection.commit()
        return {"success": True, "token": token, "refreshToken": refresh_token}


@app.get("/api/auth/verify")
def verify_token(authorization: Optional[str] = Header(default=None)) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        session = get_session_row(connection, extract_bearer_token(authorization))
        return {"success": True, "valid": True, "expiresAt": session["expires_at"]}


@app.post("/api/auth/password-reset")
def reset_password(payload: dict[str, Any]) -> dict[str, Any]:
    email = str(payload.get("email") or "").strip()
    if not email:
        raise HTTPException(status_code=422, detail="Email wajib diisi")
    return {"success": True, "message": "Password reset email sent"}


@app.put("/api/auth/password-change")
def change_password(payload: dict[str, Any], authorization: Optional[str] = Header(default=None)) -> dict[str, Any]:
    _ = extract_bearer_token(authorization)
    if not payload.get("oldPassword") or not payload.get("newPassword"):
        raise HTTPException(status_code=422, detail="Password lama dan baru wajib diisi")
    return {"success": True, "message": "Password changed successfully"}


@app.get("/api/users/profile")
def get_profile(request: Request, authorization: Optional[str] = Header(default=None)) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        return {"success": True, "data": user_to_profile_response(connection, user, request)}


@app.put("/api/users/profile")
def update_profile(request: Request, payload: dict[str, Any], authorization: Optional[str] = Header(default=None)) -> dict[str, Any]:
    allowed_fields = {
        "name": "name",
        "email": "email",
        "phone": "phone",
        "address": "address",
        "birthPlace": "birth_place",
        "birthDate": "birth_date",
        "gender": "gender",
        "height": "height",
        "weight": "weight",
        "schoolId": "school_id",
        "schoolCode": "school_code",
        "avatar": "avatar",
        "hbLast": "hb_last",
        "consumptionCount": "consumption_count",
        "totalTarget": "total_target",
    }

    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        updates = []
        values: list[Any] = []
        for payload_key, column in allowed_fields.items():
            if payload_key in payload:
                updates.append(f"{column} = ?")
                values.append(payload[payload_key])

        if not updates:
            return {"success": True, "message": "No changes applied", "data": user_to_profile_response(connection, user, request)}

        updates.append("updated_at = ?")
        values.append(utc_now_iso())
        values.append(user["id"])
        connection.execute(f"UPDATE users SET {', '.join(updates)} WHERE id = ?", values)
        connection.commit()
        refreshed = connection.execute("SELECT * FROM users WHERE id = ?", (user["id"],)).fetchone()
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": user_to_profile_response(connection, refreshed, request),
        }


@app.post("/api/users/profile/avatar")
async def upload_avatar(
    request: Request,
    avatar: UploadFile = File(...),
    authorization: Optional[str] = Header(default=None),
) -> dict[str, Any]:
    if not avatar.filename:
        raise HTTPException(status_code=422, detail="File avatar wajib diupload")
    if avatar.content_type and not avatar.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="File avatar harus berupa gambar")

    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        previous_avatar = user["avatar"]
        stored_filename, _avatar_size = save_upload_file(avatar)
        updated_at = utc_now_iso()
        connection.execute(
            "UPDATE users SET avatar = ?, updated_at = ? WHERE id = ?",
            (stored_filename, updated_at, user["id"]),
        )
        connection.commit()
        refreshed = connection.execute("SELECT * FROM users WHERE id = ?", (user["id"],)).fetchone()
        remove_uploaded_file_if_unused(connection, previous_avatar)

    return {
        "success": True,
        "message": "Avatar uploaded successfully",
        "data": {
            "avatar": resolve_media_url(request, refreshed["avatar"]),
            "updated_at": refreshed["updated_at"],
        },
    }


@app.delete("/api/users/profile/avatar")
def delete_avatar(
    request: Request,
    authorization: Optional[str] = Header(default=None),
) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        previous_avatar = user["avatar"]
        updated_at = utc_now_iso()
        connection.execute(
            "UPDATE users SET avatar = NULL, updated_at = ? WHERE id = ?",
            (updated_at, user["id"]),
        )
        connection.commit()
        remove_uploaded_file_if_unused(connection, previous_avatar)

    return {
        "success": True,
        "message": "Avatar deleted successfully",
        "data": {
            "avatar": None,
            "updated_at": updated_at,
        },
    }


@app.post("/api/reports/submit")
async def submit_report(
    request: Request,
    date: str = Form(...),
    photo: UploadFile = File(...),
    notes: str = Form(default=""),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    normalized_date = str(date).strip()
    normalized_notes = str(notes or "").strip()

    if not normalized_date:
        raise HTTPException(status_code=422, detail="Tanggal wajib diisi")

    if not photo.filename:
        raise HTTPException(status_code=422, detail="Foto bukti wajib diupload")

    if photo.content_type and not photo.content_type.startswith("image/"):
        raise HTTPException(status_code=422, detail="File harus berupa gambar")

    stored_filename, photo_size = save_upload_file(photo)
    created_at = utc_now_iso()

    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        cursor = connection.execute(
            """
            INSERT INTO reports (
                user_id,
                date,
                notes,
                photo_filename,
                photo_original_name,
                photo_mime_type,
                photo_size,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                normalized_date,
                normalized_notes,
                stored_filename,
                photo.filename,
                photo.content_type or "image/jpeg",
                photo_size,
                created_at,
                created_at,
            ),
        )
        connection.execute(
            """
            UPDATE users
            SET consumption_count = COALESCE(consumption_count, 0) + 1,
                updated_at = ?
            WHERE id = ?
            """,
            (created_at, user["id"]),
        )
        report_id = cursor.lastrowid
        connection.commit()

    return {
        "success": True,
        "message": "Laporan berhasil dikirim.",
        "data": {
            "report_id": report_id,
            "date": normalized_date,
            "timestamp": created_at,
            "photo_url": build_photo_url(request, stored_filename),
        },
    }


@app.get("/api/reports")
def get_reports(
    request: Request,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    authorization: Optional[str] = Header(default=None),
) -> dict:
    offset = (page - 1) * limit

    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        total_count = connection.execute(
            "SELECT COUNT(*) AS count FROM reports WHERE user_id = ?",
            (user["id"],),
        ).fetchone()["count"]
        rows = connection.execute(
            """
            SELECT id, user_id, date, notes, photo_filename, created_at, updated_at
            FROM reports
            WHERE user_id = ?
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT ? OFFSET ?
            """,
            (user["id"], limit, offset),
        ).fetchall()

    reports = [
        {
            "id": row["id"],
            "user_id": row["user_id"],
            "date": row["date"],
            "hb_value": user["hb_last"] or 12.0,
            "status": "Selesai",
            "photo_url": build_photo_url(request, row["photo_filename"]),
            "notes": row["notes"] or "",
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
            "timestamp": int(datetime.fromisoformat(row["created_at"]).timestamp() * 1000),
        }
        for row in rows
    ]

    return {
        "success": True,
        "data": {
            "hb_trends": [(user["hb_last"] or 12.0) for _ in reports],
            "consumption_rate": total_count,
            "total_count": total_count,
            "reports": reports,
        },
        "meta": {
            "page": page,
            "limit": limit,
            "total": total_count,
        },
    }


@app.get("/api/reports/{report_id}")
def get_report_by_id(
    request: Request,
    report_id: int,
    authorization: Optional[str] = Header(default=None),
) -> dict:
    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        row = connection.execute(
            """
            SELECT id, user_id, date, notes, photo_filename, created_at, updated_at
            FROM reports
            WHERE id = ? AND user_id = ?
            """,
            (report_id, user["id"]),
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Laporan tidak ditemukan")

    return {
        "success": True,
        "data": {
            "id": row["id"],
            "user_id": row["user_id"],
            "date": row["date"],
            "photo_url": build_photo_url(request, row["photo_filename"]),
            "notes": row["notes"] or "",
            "hb_value": user["hb_last"] or 12.0,
            "status": "Selesai",
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
        },
    }


@app.get("/api/notifications")
def get_notifications(
    authorization: Optional[str] = Header(default=None),
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
) -> dict[str, Any]:
    offset = (page - 1) * limit
    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        rows = connection.execute(
            """
            SELECT * FROM notifications
            WHERE user_id = ?
            ORDER BY datetime(created_at) DESC, id DESC
            LIMIT ? OFFSET ?
            """,
            (user["id"], limit, offset),
        ).fetchall()
        total = connection.execute(
            "SELECT COUNT(*) AS count FROM notifications WHERE user_id = ?",
            (user["id"],),
        ).fetchone()["count"]
        unread = connection.execute(
            "SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND read = 0",
            (user["id"],),
        ).fetchone()["count"]

    notifications = [
        {
            "id": row["id"],
            "type": row["type"],
            "title": row["title"],
            "message": row["message"],
            "timestamp": row["created_at"],
            "read": bool(row["read"]),
            "icon": row["icon"],
            "color": row["color"],
            "action": row["action"],
            "metadata": {},
        }
        for row in rows
    ]

    return {"success": True, "data": notifications, "meta": {"total": total, "unread": unread, "page": page, "limit": limit}}


@app.put("/api/notifications/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    authorization: Optional[str] = Header(default=None),
) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        cursor = connection.execute(
            "UPDATE notifications SET read = 1, updated_at = ? WHERE id = ? AND user_id = ?",
            (utc_now_iso(), notification_id, user["id"]),
        )
        connection.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan")
    return {"success": True, "message": "Notification marked as read"}


@app.put("/api/notifications/read-all")
def mark_all_notifications_read(authorization: Optional[str] = Header(default=None)) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        connection.execute(
            "UPDATE notifications SET read = 1, updated_at = ? WHERE user_id = ?",
            (utc_now_iso(), user["id"]),
        )
        connection.commit()
    return {"success": True, "message": "All notifications marked as read"}


@app.delete("/api/notifications/{notification_id}")
def delete_notification(
    notification_id: int,
    authorization: Optional[str] = Header(default=None),
) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        user = get_current_user(connection, authorization)
        cursor = connection.execute(
            "DELETE FROM notifications WHERE id = ? AND user_id = ?",
            (notification_id, user["id"]),
        )
        connection.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Notifikasi tidak ditemukan")
    return {"success": True, "message": "Notification deleted"}


@app.get("/api/schools")
def get_schools(
    kota: Optional[str] = Query(default=None),
    provinsi: Optional[str] = Query(default=None),
) -> dict[str, Any]:
    filters = []
    values: list[Any] = []
    if kota:
        filters.append("LOWER(kota) LIKE LOWER(?)")
        values.append(f"%{kota}%")
    if provinsi:
        filters.append("LOWER(provinsi) LIKE LOWER(?)")
        values.append(f"%{provinsi}%")

    query = "SELECT * FROM schools"
    if filters:
        query += " WHERE " + " AND ".join(filters)
    query += " ORDER BY nama ASC"

    with closing(get_connection()) as connection:
        rows = connection.execute(query, values).fetchall()
    data = [school_row_to_dict(row) for row in rows]
    return {"success": True, "data": data, "meta": {"total": len(data)}}


@app.get("/api/schools/{school_id}")
def get_school_by_id(school_id: str) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        row = get_school_row(connection, school_id=school_id, school_code=school_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Sekolah tidak ditemukan")
        payload = school_row_to_dict(row)
        payload["siswa"] = []
        return {"success": True, "data": payload}


@app.get("/api/schools/{school_id}/location")
def get_school_location(school_id: str) -> dict[str, Any]:
    with closing(get_connection()) as connection:
        row = get_school_row(connection, school_id=school_id, school_code=school_id)
        if row is None:
            raise HTTPException(status_code=404, detail="Sekolah tidak ditemukan")
        return {
            "success": True,
            "data": {
                "id": row["id"],
                "nama": row["nama"],
                "alamat": row["alamat"],
                "kota": row["kota"],
                "latitude": row["latitude"],
                "longitude": row["longitude"],
                "maps_url": f"https://www.google.com/maps?q={row['latitude']},{row['longitude']}",
                "embed_url": f"https://maps.google.com/maps?q={row['latitude']},{row['longitude']}&z=16&output=embed",
            },
        }


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
