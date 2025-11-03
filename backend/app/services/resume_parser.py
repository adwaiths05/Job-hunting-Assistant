import spacy
from app.services.huggingface_client import HuggingFaceClient

nlp = spacy.load("en_core_web_sm")

class ResumeParser:
    def __init__(self):
        self.hf_client = HuggingFaceClient()

    def parse_resume(self, text: str):
        # Basic NLP extraction
        doc = nlp(text)
        skills = self.extract_skills(text)
        experience = self.extract_experience(doc)
        education = self.extract_education(doc)
        return {
            "skills": skills,
            "experience": experience,
            "education": education
        }

    def extract_skills(self, text: str):
        # Example questions
        question = "List all programming languages and tools mentioned in the resume."
        return self.hf_client.extract_skills(text, question)

    def extract_experience(self, doc):
        # Extract experience lines (simple placeholder)
        return [sent.text for sent in doc.sents if "experience" in sent.text.lower()]

    def extract_education(self, doc):
        # Extract education lines (simple placeholder)
        return [sent.text for sent in doc.sents if "university" in sent.text.lower()]
