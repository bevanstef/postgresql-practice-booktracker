# Personal Book Tracker

A simple CRUD web application to track books you want to read, are reading, or have finished.

- **Backend** – FastAPI (Python) with async SQLAlchemy.
- **Database** – Managed PostgreSQL on Google Cloud SQL (no local DB required).
- **Frontend** – Next.js (React + TypeScript) – scaffold left as a placeholder.

## Project layout
```
postgresql-practice-booktracker/
├─ backend/
│   └─ app/
│       ├─ __init__.py
│       ├─ main.py
│       ├─ models.py
│       ├─ database.py
│       └─ crud.py
│   ├─ requirements.txt
│   └─ Dockerfile
├─ frontend/   # (you can add a Next.js app later)
├─ .gitignore
└─ docker-compose.yml
```

## Quick start (local)
1. **Create a Cloud SQL PostgreSQL instance** – see the README for details.
2. **Run the Cloud SQL Auth Proxy** (Windows example):
   ```powershell
   curl -o cloud_sql_proxy.exe https://dl.google.com/cloudsql/cloud_sql_proxy.exe
   ./cloud_sql_proxy.exe -instances=<PROJECT>:<REGION>:<INSTANCE>=tcp:5432
   ```
3. **Create `backend/.env`** (do **not** commit):
   ```dotenv
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=YOUR_PASSWORD
   POSTGRES_DB=books
   POSTGRES_HOST=127.0.0.1
   POSTGRES_PORT=5432
   ```
4. **Install backend deps & run**:
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
   API will be at `http://127.0.0.1:8000`.

## Deploy (Cloud Run)
Build Docker images and deploy – see the full README for commands.

---

Feel free to ask for any missing files (e.g. `frontend` scaffold, Dockerfile, etc.).

