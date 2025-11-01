from fastapi import APIRouter
from pydantic import BaseModel
from app.services.weaviate_client import WeaviateClient

router = APIRouter()
weaviate_client = WeaviateClient()

# Request models
class JobInput(BaseModel):
    title: str
    company: str
    description: str
    embedding: list

class SearchInput(BaseModel):
    embedding: list
    top_k: int = 10

# Routes
@router.post("/add-job")
def add_job(job: JobInput):
    weaviate_client.add_job(job.title, job.company, job.description, job.embedding)
    return {"status": "success"}

@router.post("/search-jobs")
def search_jobs(search: SearchInput):
    results = weaviate_client.query_similar_jobs(search.embedding, search.top_k)
    return {"results": results}
