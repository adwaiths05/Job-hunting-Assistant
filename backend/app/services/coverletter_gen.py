from app.services.huggingface_client import HuggingFaceClient

class CoverLetterGenerator:
    def __init__(self):
        self.hf_client = HuggingFaceClient()

    def generate(self, resume_text: str, job_description: str):
        prompt = f"""
        Generate a professional, concise, and tailored cover letter based on the following resume:
        {resume_text}

        And for this job description:
        {job_description}
        """
        return self.hf_client.generate_cover_letter(prompt)
