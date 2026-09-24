# NeuroGuard AI Backend

FastAPI backend for the NeuroGuard AI prototype.

## Features

- profile intake
- symptom collection
- eye tracking feature capture
- cognitive test scoring
- feature extraction
- prototype ML screening
- SQLite storage and report generation

## Start locally

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Then open:

- Swagger docs: http://localhost:8000/docs
- Redoc: http://localhost:8000/redoc
