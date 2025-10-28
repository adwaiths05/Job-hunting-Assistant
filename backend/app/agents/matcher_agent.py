from backend.app.services.huggingface_client import HuggingFaceClient
from backend.app.services.weaviate_client import WeaviateClient

class MatcherAgent:
    def __init__(self):
        self.hf_client = HuggingFaceClient()
        self.weaviate_client = WeaviateClient()

    def find_best_jobs(self, resume_text: str, top_k: int = 10):
        # Get embedding of resume
        resume_emb = self.hf_client.get_embedding(resume_text)
        # Query Weaviate for similar jobs
        results = self.weaviate_client.query_similar_jobs(resume_emb, top_k)
        return results
