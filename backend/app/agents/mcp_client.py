import os
from mcp import Client

class MCPClient:
    def __init__(self):
        # Map tools to their specific servers (defined in docker-compose)
        self.tool_map = {
            # Browser Tools
            "search": os.getenv("BROWSER_MCP_URL", "http://localhost:3001/sse"),
            "find_job_openings": os.getenv("BROWSER_MCP_URL", "http://localhost:3001/sse"),
            "open_url": os.getenv("BROWSER_MCP_URL", "http://localhost:3001/sse"),
            "extract_all_text": os.getenv("BROWSER_MCP_URL", "http://localhost:3001/sse"),
            
            # Notion Tools
            "add_job": os.getenv("NOTION_MCP_URL", "http://localhost:3002/sse"),
            "list_jobs": os.getenv("NOTION_MCP_URL", "http://localhost:3002/sse"),
            "update_status": os.getenv("NOTION_MCP_URL", "http://localhost:3002/sse"),
            
            # Gmail Tools
            "list_messages": os.getenv("GMAIL_MCP_URL", "http://localhost:3003/sse"),
            "send_message": os.getenv("GMAIL_MCP_URL", "http://localhost:3003/sse"),
            "find_interview_invites": os.getenv("GMAIL_MCP_URL", "http://localhost:3003/sse"),
            
            # Calendar Tools
            "list_upcoming_events": os.getenv("CALENDAR_MCP_URL", "http://localhost:3004/sse"),
            "create_event": os.getenv("CALENDAR_MCP_URL", "http://localhost:3004/sse"),
            "create_training_schedule": os.getenv("CALENDAR_MCP_URL", "http://localhost:3004/sse"),
        }

    def call(self, tool_name: str, arguments: dict = None):
        if arguments is None:
            arguments = {}
            
        url = self.tool_map.get(tool_name)
        if not url:
            raise ValueError(f"No MCP server configured for tool: {tool_name}")
            
        print(f"📡 Connecting to MCP at {url} for tool {tool_name}...")
        
        # Create a temporary client for this specific call
        # (In production, you might want to keep persistent connections)
        with Client(url) as client:
            return client.call(tool_name, arguments=arguments)