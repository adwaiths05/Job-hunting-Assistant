from notion_client import Client, APIResponseError

class NotionSync:
    def __init__(self, notion_token: str, database_id: str):
        """
        Initializes the Notion client with your integration token and database ID.
        """
        self.database_id = database_id
        self.client = Client(auth=notion_token)

    def add_job_application(self, job_title: str, company: str, status: str = "Applied"):
        """
        Adds a new job application entry to the Notion database.
        """
        try:
            response = self.client.pages.create(
                parent={"database_id": self.database_id},
                properties={
                    "Job Title": {
                        "title": [{"text": {"content": job_title}}],
                    },
                    "Company": {
                        "rich_text": [{"text": {"content": company}}],
                    },
                    "Status": {
                        "select": {"name": status},
                    },
                },
            )
            print(f"✅ Added job '{job_title}' at '{company}' to Notion.")
            return response

        except APIResponseError as e:
            print(f"❌ Notion API error: {e}")
        except Exception as e:
            print(f"⚠️ Unexpected error while syncing with Notion: {e}")
