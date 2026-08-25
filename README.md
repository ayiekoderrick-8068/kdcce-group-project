# KDCCE Group Project

Group project repository for the KDCCE platform.

## Structure

- `frontend/` — React + Vite + React Router + Axios
- `backend/` — Flask + SQLAlchemy + Migrate + JWT + CORS + Marshmallow

## Getting started

### Frontend

```
cd frontend
npm install
npm run dev
```

### Backend

```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask --app run.py run
```

## Branches

Each of the 5 group members has two branches: `frontend-<name>` and `backend-<name>`.
`main` is the integration branch — do not push directly to it.

## Status

This repository is a clean structural scaffold. All pages, components, models,
routes, and services exist as files but contain no implemented features yet.
