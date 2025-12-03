from fastapi import APIRouter, Body
from app.agents.assistant_agent import AssistantAgent

router = APIRouter()
agent = AssistantAgent()

@router.get("/calendar/events")
async def get_events(days: int = 7):
    response = agent.list_upcoming_events(days)
    # MCP returns objects, we might need to parse them depending on your MCPClient implementation
    # For now, returning the raw response is fine for debugging
    return {"events": response}

@router.post("/calendar/schedule-prep")
async def schedule_prep(
    job_title: str = Body(...),
    company: str = Body(...),
    date: str = Body(..., description="ISO format: 2023-12-25T14:00:00")
):
    result = agent.schedule_prep_session(job_title, company, date)
    return {"result": result}

@router.get("/gmail/check")
async def check_gmail(query: str = "subject:interview"):
    emails = agent.check_emails(query)
    return {"emails": emails}