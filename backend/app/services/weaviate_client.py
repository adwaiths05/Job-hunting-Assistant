import weaviate

class WeaviateClient:
    def __init__(self):
        self.client = weaviate.Client("http://localhost:8080")  
        self.class_name = "JobPosting"

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
