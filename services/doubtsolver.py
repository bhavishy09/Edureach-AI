import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

class DoubtSolverWorker:
    def __init__(self):
        api_key_raw = os.environ.get('GEMINI_API_Key1') or ""
        self.api_key = api_key_raw.strip('"').strip("'")
        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=self.api_key,
                temperature=0.7
            )
        else:
            self.llm = None

    def process_query(self, query: str, page_context: str = ""):
        if not self.llm:
            return "Error: Gemini API key is not configured.", []
        try:
            messages = [
                SystemMessage(content="You are a helpful AI Doubt Solver for students. Provide instant step-by-step solutions for math and science doubts."),
                HumanMessage(content=query)
            ]
            response = self.llm.invoke(messages)
            return response.content, []
        except Exception as e:
            return f"Error: {e}", []

worker = DoubtSolverWorker()
