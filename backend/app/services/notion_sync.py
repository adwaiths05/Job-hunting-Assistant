# backend/app/services/notion_sync.py
from notion_client import Client

class NotionSync:
    def __init__(self, notion_token: str, database_id: str):
        self.client = Client(auth=notion_token)
        self.database_id = database_id

    def add_job_application(self, job_title: str, company: str, status: str = "Applied"):
        self.client.pages.create(
            parent={"database_id": self.database_id},
            properties={
                "Job Title": {"title": [{"text": {"content": job_title}}]},
                "Company": {"rich_text": [{"text": {"content": company}}]},
                "Status": {"select": {"name": status}}
            }
        )
