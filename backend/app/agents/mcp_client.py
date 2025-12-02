import os
from mcp import Client

class MCPClient:
    def __init__(self):
        self.client = Client(os.getenv("MCP_SERVER_URL", "http://localhost:9000"))

    def call(self, tool_name: str, **kwargs):
        return self.client.call(tool_name, **kwargs)
