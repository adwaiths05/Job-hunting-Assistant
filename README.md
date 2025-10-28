# 🤖 Job-hunting-Assistant

An AI-powered assistant that unifies job boards, tailors opportunities to your resume, and generates personalized cover letters — helping you apply faster and smarter.

## ✨ Features
- 📄 **Resume Parsing** – Extracts skills, experience, and education from uploaded resumes.
- 🔎 **Job Aggregation** – Fetches job postings from multiple boards (APIs + scraping).
- 🧠 **Smart Matching** – Uses Weaviate + embeddings to rank jobs by relevance.
- 📝 **Cover Letter Generation** – Creates tailored cover letters with GPT.
- 📊 **Application Tracking** – Syncs applications to Notion or Postgres DB.
- 🤖 **Agentic Workflow** – Autonomous AI agents handle each step of the pipeline.

## 🛠 Tech Stack
- **Backend**: FastAPI, Python
- **AI/NLP**: spaCy, Hugging Face, sentence-transformers
- **Vector DB**: Weaviate
- **Job Aggregation**: Playwright, BeautifulSoup, APIs
- **LLMs**: OpenAI GPT-4 (cover letters)
- **Database**: PostgreSQL + Redis
- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Infra**: Docker, GitHub Actions, AWS S3, Vercel

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker & Docker Compose

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
└── LICENSE
```
## 📄 License
MIT License – feel free to use this project and adapt it.
