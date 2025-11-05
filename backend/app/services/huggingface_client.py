import os
from transformers import pipeline

class HuggingFaceClient:
    def __init__(self):
        use_local = os.getenv("USE_LOCAL_MODELS", "False").lower() == "true"

        if use_local:
            print("⚙️ Running in LOCAL MODE: skipping model loading.")
            self.cover_letter_model = None
            self.resume_qa_model = None
            self.embedding_model = None
        else:
            print("🚀 Loading Hugging Face models...")
            self.cover_letter_model = pipeline(
                "text-generation",
                model="gpt2",  # small, open model for testing
                device=-1       # CPU
            )
            self.resume_qa_model = pipeline(
                "question-answering",
                model="distilbert-base-cased-distilled-squad",
                device=-1
            )
            self.embedding_model = pipeline(
                "feature-extraction",
                model="sentence-transformers/all-MiniLM-L6-v2"
            )

    def generate_cover_letter(self, prompt: str, max_length: int = 300):
        if not self.cover_letter_model:
            return "Cover letter model not loaded in local mode."
        result = self.cover_letter_model(prompt, max_length=max_length, do_sample=True)
        return result[0]['generated_text']

    def extract_skills(self, context: str, question: str):
        if not self.resume_qa_model:
            return "QA model not loaded in local mode."
        result = self.resume_qa_model(question=question, context=context)
        return result['answer']

    def get_embedding(self, text: str):
        if not self.embedding_model:
            return []
        emb = self.embedding_model(text)
        return emb[0][0]
