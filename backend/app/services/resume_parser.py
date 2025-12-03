from app.services.huggingface_client import HuggingFaceClient

class ResumeParser:
    def __init__(self):
        self.hf_client = HuggingFaceClient()

    def parse_resume(self, text: str):
        """
        Uses Mixtral to intelligently parse the resume text into structured JSON.
        """
        print("📄 Sending resume to Mixtral for parsing...")
        
        try:
            # The 'extract_skills' method in HuggingFaceClient now handles 
            # the full extraction (Skills + Experience + Education) via the LLM.
            parsed_data = self.hf_client.extract_skills(text)
            
            # Ensure we return a consistent structure even if the LLM is slightly off
            return {
                "skills": parsed_data.get("skills", []),
                "experience": parsed_data.get("experience", "No experience detailed"),
                "education": parsed_data.get("education", [])
            }

        except Exception as e:
            print(f"❌ Error parsing resume: {e}")
            # Fallback structure if the API fails or returns bad JSON
            return {
                "skills": [],
                "experience": "Error during extraction",
                "education": []
            }