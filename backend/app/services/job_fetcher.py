import re
import json
from app.agents.mcp_client import MCPClient

class JobFetcher:
    def __init__(self):
        # Initialize the connection to your MCP Server
        # Ensure your 'browser-mcp' is running on the port defined in mcp_client.py
        self.mcp_client = MCPClient()

    def fetch_jobs_from_api(self, query: str, location: str = ""):
        """
        Uses the Browser MCP to search for real job listings.
        STRICT MODE: Returns error object if MCP fails, no mock data.
        """
        search_term = f"{query} {location}".strip()
        print(f"🕵️‍♂️ Agent fetching real jobs for: '{search_term}'...")

        try:
            # 1. Call the 'find_job_openings' tool from your Node.js MCP server
            response = self.mcp_client.call(
                tool_name="find_job_openings", 
                arguments={"keyword": search_term}
            )
            
            # 2. Extract content based on response structure
            content_text = ""
            if hasattr(response, 'content') and response.content:
                content_text = response.content[0].text
            elif isinstance(response, dict) and 'content' in response:
                content_text = response['content'][0]['text']
            else:
                content_text = str(response)

            # 3. Parse and return real jobs
            return self._parse_mcp_response(content_text)

        except Exception as e:
            print(f"❌ Error fetching jobs via MCP: {e}")
            # STRICT: Return only the error details so the frontend knows it failed
            return [
                {
                    "title": "Error: MCP Connection Failed", 
                    "company": "System", 
                    "description": f"Could not connect to Browser MCP. Is the Node server running? Error details: {str(e)}",
                    "link": "#"
                }
            ]

    def _parse_mcp_response(self, text: str):
        """
        Parses the text output from browser-mcp:
        'JOB: Title\nURL: https://...\n---'
        """
        jobs = []
        entries = text.split("---")
        
        for entry in entries:
            if "JOB:" not in entry:
                continue
            
            title_match = re.search(r"JOB:\s*(.*)", entry)
            link_match = re.search(r"URL:\s*(.*)", entry)
            
            if title_match and link_match:
                title = title_match.group(1).strip()
                link = link_match.group(1).strip()
                
                jobs.append({
                    "title": title,
                    "company": "Job Board Listing", 
                    "description": f"Apply here: {link}",
                    "link": link 
                })
        
        print(f"✅ Parsed {len(jobs)} jobs from MCP output.")
        return jobs

    def fetch_jobs_from_scraping(self, url: str):
        pass