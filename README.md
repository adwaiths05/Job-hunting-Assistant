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
job-hunting-assistant/
├── backend/                           # 🐍 FastAPI Backend
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── services/
│   │   ├── db/
│   │   ├── agents/
│   │   └── main.py
│   └── tests/
│
├── frontend/                          # 🎨 React + Vite Frontend (Moved from Principal...)
│   ├── src/                           # Source code (pages, components, hooks)
│   ├── public/                        # Static assets (favicon, etc.)
│   ├── shared/                        # Shared types/schemas (Zod, Drizzle models)
│   ├── index.html                     # Entry point
│   ├── package.json                   # Frontend dependencies
│   ├── vite.config.ts                 # Vite config (Updated proxy & paths)
│   ├── tsconfig.json                  # TypeScript config (Updated paths)
│   ├── tailwind.config.ts             # Tailwind config
│   ├── postcss.config.js              # PostCSS config
│   └── components.json                # Shadcn UI config
│
├── infra/                             # 🏗️ Infrastructure & Docker
│   ├── docker-compose.yml             # Orchestration (Updated with frontend)
│   ├── Dockerfile.backend             # Backend image (Moved here)
│   ├── Dockerfile.frontend            # Frontend image (Newly created)
│   └── Dockerfile.mcp                 # Shared MCP server image
│
├── mcp-servers/                       # 🤖 MCP Agents (Node.js)
│   ├── browser-mcp/
│   ├── calendar-mcp/
│   ├── gmail-mcp/
│   └── notion-mcp/
│
├── .gitignore                         # Updated to ignore dist/, .env, etc.
├── requirements.txt                   # Python dependencies
├── LICENSE
├── .env
└── README.md

```
## 📄 License
MIT License – feel free to use this project and adapt it.
