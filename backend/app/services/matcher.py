from app.services.huggingface_client import HuggingFaceClient
from app.services.weaviate_client import WeaviateClient

class Matcher:
    def __init__(self):
        self.hf_client = HuggingFaceClient()
        self.weaviate_client = WeaviateClient()

    def match_jobs_to_resume(self, resume_text: str, top_k: int = 10):
        embedding = self.hf_client.get_embedding(resume_text)

        # Flatten embedding if it's nested
        if isinstance(embedding, list) and len(embedding) > 0 and isinstance(embedding[0], list):
            embedding = embedding[0]

        return self.weaviate_client.query_similar_jobs(embedding, top_k)