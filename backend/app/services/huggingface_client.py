from transformers import pipeline

class HuggingFaceClient:
    def __init__(self):
        # Load models once (can be CPU/GPU specific)
        self.cover_letter_model = pipeline(
            "text-generation", 
            model="meta-llama/Llama-2-7b-hf", 
            device=0  # GPU, set -1 for CPU
        )
        self.resume_qa_model = pipeline(
            "question-answering", 
            model="deepset/roberta-base-squad2", 
            device=0
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
        # Flatten the embedding to 1D list if needed
        return emb[0][0]
