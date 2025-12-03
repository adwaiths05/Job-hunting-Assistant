from app.agents.mcp_client import MCPClient

class TrackerAgent:
    def __init__(self):
        # Connects to the Notion MCP server via stdio/http
        self.mcp_client = MCPClient()

    def track_application(self, job_title: str, company: str, status: str = "Applied", link: str = ""):
        """
        Uses the Notion MCP 'add_job' tool to save the application.
        """
        print(f"📝 Tracking job '{job_title}' at '{company}' via MCP...")
        
        try:
            # Matches the 'add_job' tool definition in notion-mcp/index.js
            response = self.mcp_client.call(
                tool_name="add_job",
                arguments={
                    "role": job_title,
                    "company": company,
                    "status": status,
                    "link": link or "https://placeholder.com" # Notion MCP requires a link
                }
            )
            return response
        except Exception as e:
            print(f"❌ Error tracking job via MCP: {e}")
            return f"Failed to track job: {str(e)}"