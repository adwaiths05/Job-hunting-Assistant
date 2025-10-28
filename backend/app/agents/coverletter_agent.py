from backend.app.services.huggingface_client import HuggingFaceClient

class CoverLetterAgent:
    def __init__(self):
        self.hf_client = HuggingFaceClient()

    def generate_cover_letter(self, user_resume_text: str, job_description: str):
        prompt = f"""
        Generate a professional cover letter based on the following resume:
        {user_resume_text}

        And for this job description:
        {job_description}

        The cover letter should be concise, tailored, and professional.
        """
        return self.hf_client.generate_cover_letter(prompt)
