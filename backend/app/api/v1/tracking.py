from fastapi import APIRouter, Body, HTTPException
from app.agents.tracker_agent import TrackerAgent

router = APIRouter()

# Initialize the agent which handles MCP connections
tracker_agent = TrackerAgent()

@router.post("/track")
async def track_application(
    job_title: str = Body(...),
    company: str = Body(...),
    status: str = Body("Applied"),
    link: str = Body(None)
):
    """
    Sends a request to the Notion MCP to create a new job entry.
    """
    try:
        # Pass the data to the agent
        result = tracker_agent.track_application(job_title, company, status, link)
        return {"message": "Application tracking request sent", "details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track application: {str(e)}")

@router.get("/applications")
async def get_applications(userId: str = "demo"):
    """
    Fetches applications strictly from Notion via the MCP Agent.
    """
    try:
        # Call the 'list_jobs' tool defined in notion-mcp
        response = tracker_agent.mcp_client.call("list_jobs", {})
        
        # Extract text content from MCP response
        raw_text = ""
        if hasattr(response, 'content') and response.content:
            raw_text = response.content[0].text
        elif isinstance(response, dict) and 'content' in response:
            raw_text = response['content'][0]['text']
        else:
            raw_text = str(response)

        applications = []
        # Parse the specific format returned by notion-mcp: "- Title at Company (Status)"
        for line in raw_text.split('\n'):
            line = line.strip()
            if line.startswith('-'):
                # Clean the line
                clean_line = line.replace('-', '', 1).strip()
                
                # Split by " at " to separate Title and Company
                if ' at ' in clean_line:
                    parts = clean_line.split(' at ')
                    title = parts[0].strip()
                    
                    # Handle the Company and Status part
                    # Expected format: "CompanyName (Status)"
                    rest = parts[1]
                    company = rest
                    status = "saved" # Default
                    
                    if '(' in rest and rest.endswith(')'):
                        company_parts = rest.split(' (')
                        company = company_parts[0].strip()
                        status_raw = company_parts[1].replace(')', '').strip()
                        # Map Notion status to Frontend status keys
                        status = status_raw.lower() if status_raw.lower() in ["saved", "applied", "interview", "offer"] else "saved"

                    applications.append({
                        "id": f"notion-{len(applications)}", # Temporary ID as Notion ID isn't in simple list
                        "jobId": "external",
                        "userId": userId,
                        "status": status,
                        "appliedAt": "Notion Entry",
                        "notes": f"{title} at {company}"
                    })
        
        return applications

    except Exception as e:
        print(f"Error fetching applications: {e}")
        # Return empty list or error - NO MOCK DATA
        raise HTTPException(status_code=500, detail=f"Error fetching from Notion: {str(e)}")