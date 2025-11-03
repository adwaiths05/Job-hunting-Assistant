from transformers import pipeline

class HuggingFaceClient:
    def __init__(self):
        self.cover_letter_model = pipeline(
            "text-generation",
            model="gpt2",  # small, open model for testing
            device=-1       # CPU
        )
        self.resume_qa_model = pipeline(
            "question-answering",
            model="distilbert-base-cased-distilled-squad",
            device=-1
        )
        self.embedding_model = pipeline(
            "feature-extraction",
            model="sentence-transformers/all-MiniLM-L6-v2"
        )

    def generate_cover_letter(self, prompt: str, max_length: int = 300):
        result = self.cover_letter_model(prompt, max_length=max_length, do_sample=True)
        return result[0]['generated_text']

    def extract_skills(self, context: str, question: str):
        result = self.resume_qa_model(question=question, context=context)
        return result['answer']

    def get_embedding(self, text: str):
        emb = self.embedding_model(text)
        return emb[0][0]
