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

cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

cd frontend
npm install
npm run dev
