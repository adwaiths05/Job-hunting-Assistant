import os
import json
from transformers import pipeline
from mistralai import Mistral

class HuggingFaceClient:
    def __init__(self):
        # 1. Load Local Embedding Model (Fast & Free)
        print("🚀 Loading Local Embedding Model...")
        self.embedding_model = pipeline(
            "feature-extraction",
            model="sentence-transformers/all-MiniLM-L6-v2"
        )

        # 2. Setup Mistral for Intelligence
        self.api_key = os.getenv("MISTRAL_API_KEY")
        self.client = Mistral(api_key=self.api_key) if self.api_key else None

        if not self.client:
            print("⚠️ WARNING: MISTRAL_API_KEY not found. Intelligence features will fail.")

    def get_embedding(self, text: str):
        if not self.embedding_model:
            return []
        # Calculate mean pooling (average of all token vectors)
        emb = self.embedding_model(text)
        # emb[0] is a list of vectors for each word. We sum them and divide by count.
        vectors = emb[0]
        return [sum(col) / len(col) for col in zip(*vectors)]

    def generate_cover_letter(self, resume_text: str, job_description: str):
        if not self.client: return "Error: Mistral API key missing."

        prompt = f"""
        You are an expert career coach. Write a tailored, professional cover letter.
        RESUME: {resume_text}
        JOB DESCRIPTION: {job_description}
        Output ONLY the cover letter body.
        """
        
        # Using open-mixtral-8x7b for best creative writing balance
        return self.chat_completion(
            messages=[{"role": "user", "content": prompt}],
            model="open-mixtral-8x7b"
        )

    def extract_skills(self, text: str):
        if not self.client: return {"error": "API key missing"}

        prompt = f"""
        Extract key skills, experience (in years), and education.
        Return strictly valid JSON with keys: 'skills' (list), 'experience' (str), 'education' (list).
        RESUME TEXT: {text[:4000]}
        """

        response = self.client.chat.complete(
            model="open-mixtral-8x7b",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        return json.loads(response.choices[0].message.content)

    def chat_completion(self, messages: list, model: str = "open-mixtral-8x7b"):
        """
        Generic chat method for Interview Training & Q&A.
        Accepts a list of messages: [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}]
        """
        if not self.client: return "Error: Mistral API key missing."
        
        response = self.client.chat.complete(
            model=model,
            messages=messages,
            temperature=0.7
        )
        return response.choices[0].message.content