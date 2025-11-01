import weaviate
from app.core.config import WEAVIATE_URL

class WeaviateClient:
    def __init__(self):
        # Connect to Weaviate
        self.client = weaviate.Client(WEAVIATE_URL)
        self.class_name = "JobPosting"

        # Check if Weaviate is ready
        if not self.client.is_ready():
            raise ConnectionError(f"Weaviate is not ready at {WEAVIATE_URL}")

        # Ensure the class/schema exists
        self.ensure_schema()

    def ensure_schema(self):
        if not any(cls['class'] == self.class_name for cls in self.client.schema.get()['classes']):
            self.client.schema.create_class({
                "class": self.class_name,
                "properties": [
                    {"name": "title", "dataType": ["string"]},
                    {"name": "company", "dataType": ["string"]},
                    {"name": "description", "dataType": ["text"]}
                ]
            })

    def add_job(self, job_title: str, company: str, description: str, embedding: list):
        data_object = {
            "title": job_title,
            "company": company,
            "description": description
        }
        self.client.data_object.create(
            data_object,
            class_name=self.class_name,
            vector=embedding
        )

    def query_similar_jobs(self, embedding: list, top_k: int = 10):
        result = (
            self.client.query
            .get(self.class_name, ["title", "company", "description"])
            .with_near_vector({"vector": embedding})
            .with_limit(top_k)
            .do()
        )
        return result.get('data', {}).get('Get', {}).get(self.class_name, [])
