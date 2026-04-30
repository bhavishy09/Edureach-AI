import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ChatbotWorker:
    def __init__(self):
        # Try both common formats for the Gemini API Key
        api_key_raw = os.environ.get('GEMINI_API_Key3') or ""
        self.api_key = api_key_raw.strip('"').strip("'")
        
        if not self.api_key:
            print("WARNING: GEMINI_API_KEY is not set in the environment.")
        
        # Initialize the LLM
        # Using gemini-3.0-flash as a fast default model
        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=self.api_key,
                temperature=0.7
            )
        else:
            self.llm = None

    def process_query(self, query: str, page_context: str = ""):
        """
        Processes a query and returns a response.
        """
        if not self.llm:
            return "Error: Gemini API key is not configured.", []
            
        try:
            messages = [
                SystemMessage(content=f"You are a helpful AI educational assistant for the EduReach platform. Answer the student's question clearly and concisely. Context of the page they are on: {page_context}"),
                HumanMessage(content=query)
            ]
            
            response = self.llm.invoke(messages)
            
            # Since RAG is removed, we return an empty list for sources
            return response.content, []
            
        except Exception as e:
            print(f"Error calling Gemini: {e}")
            return f"I encountered an error while trying to process your request. Please try again later.", []

# Expose a singleton instance
worker = ChatbotWorker()
