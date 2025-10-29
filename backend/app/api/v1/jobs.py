from fastapi import APIRouter, Query
from backend.app.agents.job_agent import JobAgent

router = APIRouter()
job_agent = JobAgent()

@router.get("/fetch")
async def fetch_jobs(query: str = Query(...), location: str = Query("Remote")):
    jobs = job_agent.fetch_and_store_jobs(query=query, location=location)
    return {"count": len(jobs), "jobs": jobs}
