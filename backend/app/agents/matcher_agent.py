from backend.app.services.matcher import Matcher

class MatcherAgent:
    def __init__(self):
        self.matcher = Matcher()

    def get_best_matches(self, resume_text: str, top_k: int = 10):
        """
        Returns a list of top K job matches from Weaviate for a given resume
        """
        matched_jobs = self.matcher.match_jobs_to_resume(resume_text, top_k)
        return matched_jobs
