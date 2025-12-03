from app.agents.mcp_client import MCPClient
from datetime import datetime, timedelta

class AssistantAgent:
    def __init__(self):
        self.mcp_client = MCPClient()

    def list_upcoming_events(self, days: int = 7):
        """
        Asks Calendar MCP for upcoming events.
        """
        try:
            return self.mcp_client.call(
                tool_name="list_upcoming_events",
                arguments={"days": days}
            )
        except Exception as e:
            return f"Error checking calendar: {str(e)}"

    def schedule_prep_session(self, job_title: str, company: str, interview_date: str):
        """
        Uses Calendar MCP to auto-block time for interview prep.
        """
        try:
            return self.mcp_client.call(
                tool_name="create_training_schedule",
                arguments={
                    "job_title": job_title, 
                    "company": company,
                    "interview_date": interview_date
                }
            )
        except Exception as e:
            return f"Error scheduling prep: {str(e)}"

    def check_emails(self, query: str = "subject:interview"):
        """
        Uses Gmail MCP to find interview invites.
        """
        try:
            return self.mcp_client.call(
                tool_name="list_messages",
                arguments={"query": query, "max_results": 5}
            )
        except Exception as e:
            return f"Error checking Gmail: {str(e)}"