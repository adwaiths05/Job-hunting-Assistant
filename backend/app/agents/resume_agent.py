from backend.app.services.resume_parser import ResumeParser

class ResumeAgent:
    def __init__(self):
        self.parser = ResumeParser()

    def process_resume(self, resume_text: str):
        """
        Parses the resume and returns structured data:
        skills, experience, education
        """
        parsed_data = self.parser.parse_resume(resume_text)
        return parsed_data
