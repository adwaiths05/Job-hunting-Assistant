from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import the new module
from app.api.v1 import resume, jobs, matcher, coverletter, tracking, assistant 

app = FastAPI(title="AI Job Hunting Assistant", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/api/v1/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["Jobs"])
app.include_router(matcher.router, prefix="/api/v1/matcher", tags=["Matcher"])
app.include_router(coverletter.router, prefix="/api/v1/coverletter", tags=["Cover Letter"])
app.include_router(tracking.router, prefix="/api/v1/tracking", tags=["Tracking"])
# Register the new Assistant routes
app.include_router(assistant.router, prefix="/api/v1/assistant", tags=["Assistant"]) 

@app.get("/")
def root():
    return {"message": "Welcome to the AI Job Hunting Assistant API"}