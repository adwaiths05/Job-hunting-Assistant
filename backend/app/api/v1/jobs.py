from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.weaviate_client import WeaviateClient
from app.services.huggingface_client import HuggingFaceClient

router = APIRouter()
weaviate_client = WeaviateClient()
hf_client = HuggingFaceClient()

# Request models
class JobInput(BaseModel):
    title: str
    company: str
    description: str
    # Make embedding optional so the Agent doesn't have to calculate it
    embedding: Optional[List[float]] = None 

class SearchInput(BaseModel):
    embedding: Optional[List[float]] = None
    query_text: Optional[str] = None # Allow text search
    top_k: int = 10

# Routes
@router.post("/add-job")
def add_job(job: JobInput):
    """
    Adds a job to Weaviate. 
    If embedding is missing, generates it using HuggingFace model.
    """
    try:
        # 🧠 INTELLIGENCE: Auto-generate vector if missing
        if not job.embedding:
            print(f"⚡ Generating embedding for job: {job.title}")
            job.embedding = hf_client.get_embedding(job.description)
            
        weaviate_client.add_job(
            job_title=job.title, 
            company=job.company, 
            description=job.description, 
            embedding=job.embedding
        )
        return {"status": "success", "message": f"Job '{job.title}' added and vectorized."}
    except Exception as e:
        print(f"❌ Error adding job: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search-jobs")
def search_jobs(search: SearchInput):
    """
    Searches for similar jobs.
    Allows searching by raw text (we convert to vector) OR direct vector.
    """
    try:
        # 🧠 INTELLIGENCE: Convert text query to vector
        vector = search.embedding
        if not vector and search.query_text:
            print(f"🔍 Vectorizing query: '{search.query_text}'")
            vector = hf_client.get_embedding(search.query_text)
            
        if not vector:
            raise HTTPException(status_code=400, detail="Must provide 'embedding' or 'query_text'")
            
        results = weaviate_client.query_similar_jobs(vector, search.top_k)
        return {"results": results}
    except Exception as e:
        print(f"❌ Error searching jobs: {e}")
        raise HTTPException(status_code=500, detail=str(e))