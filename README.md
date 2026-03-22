# AI Resume Analyzer & Job Matcher

A production-ready free SaaS web app that analyzes a resume against a job description and returns ATS score, JD match percentage, missing keywords, missing skills, section-wise feedback, and improvement suggestions.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + Python
- AI: Google Gemini API
- Database: Supabase PostgreSQL + SQLAlchemy
- Resume parsing: PyMuPDF and python-docx
- Deployment: Vercel for frontend, Render or Railway for backend

## Folder Structure

```text
resume_analyzer_with_job_description/
|-- backend/
|   |-- app/
|   |   |-- api/routes.py
|   |   |-- core/config.py
|   |   |-- core/database.py
|   |   |-- models/analysis.py
|   |   |-- schemas/analysis.py
|   |   |-- services/gemini_service.py
|   |   |-- services/parser.py
|   |   `-- main.py
|   |-- .env.example
|   `-- requirements.txt
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- index.css
|   |   `-- main.jsx
|   |-- .env.example
|   |-- tailwind.config.js
|   `-- vercel.json
|-- render.yaml
`-- README.md
```

## Features

- Upload a resume in PDF or DOCX format
- Paste a target job description
- Get ATS score from 0 to 100
- Get JD match percentage
- See missing keywords and missing skills
- Review matched skills
- Inspect resume issues and suggestions
- Read section-wise feedback
- Download the final report as PDF
- Persist completed analyses in Supabase PostgreSQL

## Backend API

### `POST /analyze`

Accepts:

- `file`: uploaded PDF or DOCX resume
- `job_description`: form field containing the target role description

Returns structured JSON:

```json
{
  "analysis_id": 1,
  "file_name": "resume.pdf",
  "created_at": "2026-03-19T11:00:00.000000",
  "extracted_characters": 4250,
  "analysis": {
    "ats_score": 84,
    "jd_match_percentage": 79,
    "missing_keywords": ["Kubernetes", "CI/CD"],
    "issues": ["Summary is too generic"],
    "section_analysis": [
      {
        "section": "Summary",
        "score": 72,
        "feedback": "Strong start but lacks role-specific keywords.",
        "strengths": ["Clear seniority"],
        "improvements": ["Add measurable outcomes"]
      }
    ],
    "suggestions": ["Add more quantified impact"],
    "improved_summary": "Results-driven software engineer...",
    "top_matching_skills": ["React", "FastAPI", "SQL"],
    "missing_skills": ["Docker", "Kubernetes"]
  }
}
```

## Local Setup

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Windows PowerShell:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload
```

Required environment values in `backend/.env`:

- `GEMINI_API_KEY`: your Google Gemini API key
- `GEMINI_MODEL`: default `gemini-2.5-flash`
- `DATABASE_URL`: Supabase PostgreSQL connection string, for example `postgresql+psycopg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require`
- `CORS_ORIGINS`: frontend URL, for example `http://localhost:5173`
- `MAX_FILE_SIZE_MB`: max upload size, default `5`

Create these tables in Supabase before starting the backend:

```sql
CREATE TABLE analyses (
    id SERIAL PRIMARY KEY,
    extracted_text TEXT,
    job_description TEXT,
    score INTEGER,
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subscribers (
    id SERIAL PRIMARY KEY,
    email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Windows PowerShell:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Required environment value in `frontend/.env`:

- `VITE_API_BASE_URL`: backend URL, for example `http://localhost:8000`

## Gemini Integration Notes

The backend sends the exact base prompt below and appends the extracted resume text plus job description:

```text
You are an advanced ATS Resume Analyzer.
Analyze the resume against job description and return STRICT JSON with:
ats_score, jd_match_percentage, missing_keywords, issues, section_analysis, suggestions, improved_summary, top_matching_skills, missing_skills

IMPORTANT:

* Do not include text outside JSON
* Keep output structured and clean
```

Structured output validation is enforced with a Pydantic schema so the app rejects malformed responses before they reach the UI.

## Deployment

### Backend on Render

1. Push the repository to GitHub.
2. Open Render and create a new Web Service from the repo.
3. Set the root directory to `backend` if you are not using the included `render.yaml`.
4. Use build command: `pip install -r requirements.txt`
5. Use start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL=gemini-2.5-flash`
   - `DATABASE_URL=postgresql+psycopg://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require`
   - `CORS_ORIGINS=https://your-vercel-domain.vercel.app`
7. Deploy and copy the backend URL.

### Backend on Railway

1. Create a new project from the GitHub repo.
2. Set the service root to `backend`.
3. Railway will detect Python automatically.
4. Set the start command to `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the same environment variables used for Render, including your Supabase PostgreSQL `DATABASE_URL`.
6. Deploy and copy the public backend URL.

### Frontend on Vercel

1. Import the repository into Vercel.
2. Set the root directory to `frontend`.
3. Framework preset: `Vite`
4. Add environment variable:
   - `VITE_API_BASE_URL=https://your-backend-domain.onrender.com`
5. Deploy the frontend.
6. Update backend `CORS_ORIGINS` with the final Vercel domain if needed.

## Production Notes

- The frontend is mobile-first and SEO-optimized with the required title, description, keywords, and heading structure.
- The backend validates upload type, file size, readable content, Gemini JSON shape, and API errors.
- Every successful analysis is stored in PostgreSQL.
- PDF download is handled on the client for a fully free deployment path.

## Useful Commands

```bash
# frontend
cd frontend && npm run build

# backend
cd backend && uvicorn app.main:app --reload
```

## Official References Used

- Gemini structured output docs: https://ai.google.dev/gemini-api/docs/structured-output
