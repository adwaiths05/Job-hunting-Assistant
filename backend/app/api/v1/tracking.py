from fastapi import APIRouter, Body
from app.agents.tracker_agent import TrackerAgent

router = APIRouter()

# ✅ FIX: Initialize without arguments (Agent handles MCP connection internally)
tracker_agent = TrackerAgent()

@router.post("/track")
async def track_application(
    job_title: str = Body(...),
    company: str = Body(...),
    status: str = Body("Applied"),
    link: str = Body(None) # Optional link
):
    # Pass the data to the agent
    result = tracker_agent.track_application(job_title, company, status, link)
    return {"message": "Application tracking request sent", "details": result}