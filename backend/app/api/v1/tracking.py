from fastapi import APIRouter, Body
from app.agents.tracker_agent import TrackerAgent
import os

router = APIRouter()

notion_token = os.getenv("NOTION_TOKEN")
database_id = os.getenv("NOTION_DB_ID")

tracker_agent = TrackerAgent(notion_token, database_id)

@router.post("/track")
async def track_application(
    job_title: str = Body(...),
    company: str = Body(...),
    status: str = Body("Applied")
):
    tracker_agent.track_application(job_title, company, status)
    return {"message": "Application tracked successfully"}
