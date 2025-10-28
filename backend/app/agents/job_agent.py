from backend.app.services.job_fetcher import JobFetcher
from backend.app.services.huggingface_client import HuggingFaceClient
from backend.app.services.weaviate_client import WeaviateClient

class JobAgent:
    def __init__(self):
        self.fetcher = JobFetcher()
        self.hf_client = HuggingFaceClient()
        self.weaviate_client = WeaviateClient()

    def fetch_and_store_jobs(self, query: str, location: str = ""):
        """
        Fetches jobs from APIs or scraping, generates embeddings, and stores in Weaviate
        """
        jobs = self.fetcher.fetch_jobs_from_api(query, location)
        for job in jobs:
            embedding = self.hf_client.get_embedding(job["description"])
            self.weaviate_client.add_job(
                job_title=job["title"],
                company=job["company"],
                description=job["description"],
                embedding=embedding
            )
        return jobs
