from fastapi import APIRouter, Body
from backend.app.agents.coverletter_agent import CoverLetterAgent

router = APIRouter()
cover_agent = CoverLetterAgent()

@router.post("/generate")
async def generate_cover_letter(resume_text: str = Body(...), job_description: str = Body(...)):
    letter = cover_agent.create_cover_letter(resume_text, job_description)
    return {"cover_letter": letter}
