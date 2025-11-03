from fastapi import APIRouter, UploadFile, File
from app.agents.resume_agent import ResumeAgent

router = APIRouter()
resume_agent = ResumeAgent()

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    content = await file.read()
    text = content.decode("utf-8", errors="ignore")
    parsed_resume = resume_agent.process_resume(text)
    return {"message": "Resume processed", "data": parsed_resume}
