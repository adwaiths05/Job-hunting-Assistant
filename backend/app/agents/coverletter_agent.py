# backend/app/agents/coverletter_agent.py
from app.services.coverletter_gen import CoverLetterGenerator

class CoverLetterAgent:
    def __init__(self):
        self.generator = CoverLetterGenerator()

    def create_cover_letter(self, resume_text: str, job_description: str):
        """
        Generates a professional and tailored cover letter
        """
        return self.generator.generate(resume_text, job_description)
