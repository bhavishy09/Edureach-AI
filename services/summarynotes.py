import os
import base64
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

class ChatbotWorker:
    def __init__(self):
        api_key_raw = os.environ.get('GEMINI_API_Key3') or ""
        self.api_key = api_key_raw.strip('"').strip("'")

        if not self.api_key:
            print("WARNING: GEMINI_API_KEY is not set in the environment.")

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
        Processes notes with optional image input.

        Args:
            query          : The student's typed notes or text (can be empty if image is provided)
            page_context   : Context of the current page (optional)
            image_data     : Raw bytes of the uploaded image of handwritten/printed notes (optional)
            image_mime_type: MIME type of the image, e.g. "image/jpeg", "image/png" (default: "image/jpeg")

        Returns:
            Tuple of (response_text: str, sources: list)
        """
        if not self.llm:
            return "Error: Gemini API key is not configured.", []

        try:
            system_prompt = """You are an expert Study Notes Summarizer for Class 10 and Class 12 students.

YOUR BEHAVIOR:
- When the student pastes or types their notes, immediately analyze and respond in the following fixed format — no exceptions.
- If the student uploads an image of handwritten or printed notes, carefully read all the text visible in the image first, then summarize it using the same fixed format.
- Do NOT engage in general conversation. Only process and summarize notes.

OUTPUT FORMAT (always follow this exact structure):

---
📝 SHORT SUMMARY NOTES
[Write a concise, clear summary of the entire content in simple language. Use bullet points. Max 8-10 lines.]

---
🌳 TOPIC-WISE TREE SUMMARY
[Break the content into main topics and subtopics in a tree structure like below:]

Topic 1: [Main Topic Name]
  ├── Subtopic 1.1: [brief point]
  ├── Subtopic 1.2: [brief point]
  └── Subtopic 1.3: [brief point]

Topic 2: [Main Topic Name]
  ├── Subtopic 2.1: [brief point]
  └── Subtopic 2.2: [brief point]

(continue for all topics found in the notes)

---
🔑 KEY POINTS & PATTERNS
- [Most important fact or formula]
- [Recurring pattern or concept]
- [Common exam-relevant point]
- [Any definition, law, or theorem that must be remembered]
(List 5-8 key points)

---

STRICT CONSTRAINTS:
- Only process academic notes related to Class 10 or Class 12 subjects (Maths, Science, Physics, Chemistry, Biology).
- If the student sends anything other than notes (e.g., casual chat, unrelated topics, blank image), politely refuse and say:
  "I'm your Notes Summarizer. Please paste your study notes or upload an image of your notes and I'll create a structured summary for you."
- Never skip any section of the output format. Always produce all 3 sections.
- Keep language simple and student-friendly.
- Do not add extra commentary outside the 3 sections."""

            # Build the human message content
            if image_data:
                # Encode image to base64
                encoded_image = base64.b64encode(image_data).decode("utf-8")

                # If no text provided alongside image, use a default prompt
                text_part = query.strip() if query.strip() else "Please read and summarize the notes shown in the image."

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
            print(f"Error calling Gemini: {e}")
            return f"I encountered an error while trying to process your request. Please try again later.", []


worker = ChatbotWorker()