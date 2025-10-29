from fastapi import APIRouter, Body
from backend.app.agents.matcher_agent import MatcherAgent

router = APIRouter()
matcher_agent = MatcherAgent()

@router.post("/match")
async def match_jobs(resume_text: str = Body(...), top_k: int = 10):
    matches = matcher_agent.get_best_matches(resume_text, top_k)
    return {"top_matches": matches}
