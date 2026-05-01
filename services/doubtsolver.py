import os
import base64
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

    def process_query(self, query: str, page_context: str = "", image_data: bytes = None, image_mime_type: str = "image/jpeg"):
        """
        Processes a query with optional image input.

        Args:
            query          : The student's text question (can be empty if image is provided)
            page_context   : Context of the current page (optional)
            image_data     : Raw bytes of the uploaded image (optional)
            image_mime_type: MIME type of the image, e.g. "image/jpeg", "image/png" (default: "image/jpeg")
        
        Returns:
            Tuple of (response_text: str, sources: list)
        """
        if not self.llm:
            return "Error: Gemini API key is not configured.", []

        try:
            system_prompt = """You are an expert NCERT teacher and doubt solver for Class 10 and Class 12 students.

SUBJECTS YOU COVER:
- Class 10: Mathematics, Science
- Class 12: Physics, Chemistry, Biology, Mathematics

YOUR BEHAVIOR:
- When a student says "Hi" or starts a conversation, warmly greet them and ask:
  1. Which class they are in (10th or 12th)
  2. Which subject their doubt is from
  3. What their exact doubt or question is
- If the student sends an image, carefully read and understand the question or problem shown in the image first.
- Always solve doubts in a structured, stepwise manner like a teacher explaining on a blackboard.
- Use the following format for every solution:
  Step 1: Understand the problem
  Step 2: Recall the relevant concept/formula
  Step 3: Apply the concept step by step
  Step 4: Final Answer with units (if applicable)
  Step 5: Quick Tip or Common Mistake to avoid

STRICT CONSTRAINTS:
- Only answer doubts related to NCERT syllabus of Class 10 (Maths, Science) and Class 12 (Physics, Chemistry, Biology, Maths).
- If a student asks anything outside this scope (other subjects, general knowledge, coding, etc.), politely refuse and say:
  "I'm your NCERT Doubt Solver for Class 10 and 12 only. Please ask a doubt from Maths, Science, Physics, Chemistry, or Biology."
- Never give one-line answers. Always explain in detail so the student truly understands.
- If a concept needs a formula, always state it clearly before using it.
- Think through the problem step by step before writing the final answer."""

            # Build the human message content
            if image_data:
                # Encode image to base64
                encoded_image = base64.b64encode(image_data).decode("utf-8")

                # If no text query provided alongside image, use a default prompt
                text_part = query.strip() if query.strip() else "Please solve the question shown in the image."

                human_content = [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{image_mime_type};base64,{encoded_image}"
                        }
                    },
                    {
                        "type": "text",
                        "text": text_part
                    }
                ]
            else:
                # Text only — original behaviour preserved
                human_content = query

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=human_content)
            ]

            response = self.llm.invoke(messages)
            return response.content, []

        except Exception as e:
            return f"Error: {e}", []


worker = DoubtSolverWorker()