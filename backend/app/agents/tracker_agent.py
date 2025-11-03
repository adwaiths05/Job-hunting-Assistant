from app.services.notion_sync import NotionSync

class TrackerAgent:
    def __init__(self, notion_token: str, database_id: str):
        self.notion = NotionSync(notion_token, database_id)

    def track_application(self, job_title: str, company: str, status: str = "Applied"):
        """
        Adds the job application info to Notion or DB
        """
        self.notion.add_job_application(job_title, company, status)
