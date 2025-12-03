# 🤖 Job-hunting-Assistant

An AI-powered assistant that unifies job boards, tailors opportunities to your resume, and generates personalized cover letters — helping you apply faster and smarter.

## ✨ Key Features

### 🧠 Intelligent Core
- **Resume Parsing:** Uses **Mixtral 8x7B** to intelligently extract skills, education, and experience from PDF/DOCX resumes (no rigid regex).
- **Smart Matching:** Uses **Weaviate** vector search to semantically match your profile with job descriptions.
- **Cover Letter Writer:** Generates highly personalized, professional cover letters using an LLM persona.

### 🕵️‍♂️ Autonomous Agents (MCP)
The system uses the **Model Context Protocol** to give the AI "hands" to interact with the real world:
- **🌐 Browser Agent:** Scrapes real-time job listings from the web (LinkedIn, etc.).
- **📅 Calendar Agent:** Auto-schedules interview prep sessions and reminders.
- **📧 Gmail Agent:** Scans your inbox for interview invites and drafts follow-up emails.
- **📝 Notion Agent:** Automatically tracks applied jobs in your Notion database.

## 🛠 Tech Stack

- **Backend:** FastAPI (Python), Docker
- **AI Model:** Mistral AI (`open-mixtral-8x7b`) via API
- **Vector DB:** Weaviate
- **Agents:** Node.js Servers (Express + SSE) implementing MCP
- **Frontend:** Next.js, TailwindCSS
- **Infra:** Docker Compose (Orchestrates 6+ containers)

## 🚀 Getting Started

### 1. Prerequisites
- **Docker & Docker Compose** (Essential)
- **Node.js 18+** & **Python 3.10+**
- **API Keys:**
  - Mistral AI (Free tier)
  - Google Cloud Console (for Gmail/Calendar)
  - Notion Integration Token

### Clone Repo
```bash
git clone https://github.com/adwaiths05/job-hunting-agent.git
cd job-hunting-agent
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
### Project Structure
```bash 
job-hunting-agent/
│
├── backend/                           # Backend service (FastAPI + Weaviate)
│   ├── app/
│   │   ├── api/                       # API endpoints
│   │   │   ├── v1/                     # Versioned API
│   │   │   │   ├── resume.py           # Resume upload/parse routes
│   │   │   │   ├── jobs.py             # Job search + Weaviate queries
│   │   │   │   ├── coverletter.py      # Cover letter generation
│   │   │   │   ├── tracking.py         # Application tracking
│   │   │   │   └── users.py            # Auth / profile management
│   │   │   └── __init__.py
│   │   │
│   │   ├── core/                       # Core logic
│   │   │   ├── config.py               # Settings/env variables
│   │   │   ├── security.py             # Auth/JWT utils
│   │   │   └── utils.py                # General helpers
│   │   │
│   │   ├── services/                   # Business logic modules
│   │   │   ├── resume_parser.py        # spaCy/HF resume parsing
│   │   │   ├── job_fetcher.py          # APIs + scraping jobs
│   │   │   ├── weaviate_client.py      # Wrapper around Weaviate queries
│   │   │   ├── matcher.py              # Embedding + ranking logic
│   │   │   ├── coverletter_gen.py      # GPT-powered cover letter writer
│   │   │   └── notion_sync.py          # Notion integration (optional)
│   │   │
│   │   ├── db/                         # Database models + session
│   │   │   ├── models.py               # SQLAlchemy models (User, Resume, Job, App)
│   │   │   ├── schemas.py              # Pydantic schemas
│   │   │   └── session.py              # DB session management
│   │   │
│   │   ├── agents/                     # AI Agent Orchestration
│   │   │   ├── resume_agent.py         # Handles resume processing
│   │   │   ├── job_agent.py            # Handles fetching + inserting jobs
│   │   │   ├── matcher_agent.py        # Handles Weaviate similarity queries
│   │   │   ├── coverletter_agent.py    # Generates cover letters
│   │   │   └── tracker_agent.py        # Syncs applications with Notion/DB
│   │   │
│   │   ├── cli.py                      # Optional: CLI scripts for DB, Weaviate, etc.
│   │   └── main.py                     # FastAPI entrypoint
│   │
│   ├── tests/                          # Backend unit + integration tests
│   │   ├── test_resume.py
│   │   ├── test_jobs.py
│   │   └── test_matcher.py
│   │
│   └── requirements.txt                # Python dependencies
│
├── frontend/                           # User-facing portal (Next.js)
│   ├── pages/
│   │   ├── index.tsx                   # Landing page
│   │   ├── dashboard.tsx               # Job matches + tracking
│   │   └── upload.tsx                  # Resume upload
│   ├── components/
│   │   ├── JobCard.tsx                 # Job display component
│   │   ├── ResumeUploader.tsx
│   │   └── CoverLetterPreview.tsx
│   ├── lib/
│   │   └── api.ts                      # API client (calls FastAPI backend)
│   ├── contexts/                       # React context for state management
│   ├── hooks/                          # Custom hooks for frontend logic
│   ├── styles/
│   │   └── globals.css
│   └── package.json
│
├── infra/                              # Infrastructure as code
│   ├── docker-compose.yml              # Local setup (API + DB + Weaviate)
│   ├── Dockerfile.backend              # Backend container
│   ├── Dockerfile.frontend             # Frontend container   
│   └── README.md
│
├── scripts/                            # Helper scripts (data ingestion, setup)
│   ├── init_weaviate.py                # Bootstrap Weaviate schema
│   ├── load_jobs.py                    # Load test job data
│   └── migrate_db.py                   # Run migrations
│
├── .env                                # Environment variables (local)
├── README.md
├── requirements.txt
└── LICENSE

```
## 📄 License
MIT License – feel free to use this project and adapt it.
