import weaviate
from app.core.config import WEAVIATE_URL

class WeaviateClient:
    def __init__(self):
        host = WEAVIATE_URL.replace("http://", "").replace("https://", "")
        if ":" in host:
            host, port = host.split(":")
        else:
            port = 8080

        self.client = weaviate.connect_to_local(
            host=host,
            port=int(port),
            grpc_port=50051
        )

        # Check connection
        if not self.client.is_ready():
            raise ConnectionError(f"Weaviate is not ready at {WEAVIATE_URL}")

        # Ensure schema exists
        self.ensure_schema()

    def ensure_schema(self):
        existing_classes = [c.name for c in self.client.collections.list_all()]
        if self.class_name not in existing_classes:
            self.client.collections.create(
                name=self.class_name,
                vectorizer_config=weaviate.classes.config.Configure.Vectorizer.none(),
                properties=[
                    weaviate.classes.config.Property(name="title", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="company", data_type=weaviate.classes.config.DataType.TEXT),
                    weaviate.classes.config.Property(name="description", data_type=weaviate.classes.config.DataType.TEXT),
                ]
            )

    def add_job(self, job_title: str, company: str, description: str, embedding: list):
        job_collection = self.client.collections.get(self.class_name)
        job_collection.data.insert({
            "title": job_title,
            "company": company,
            "description": description
        }, vector=embedding)

    def query_similar_jobs(self, embedding: list, top_k: int = 10):
        job_collection = self.client.collections.get(self.class_name)
        results = job_collection.query.near_vector(
            near_vector=embedding,
            limit=top_k,
            return_properties=["title", "company", "description"]
        )
        return results.objects
