import os
import base64
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

class ExamPlannerWorker:
    def __init__(self):
        api_key_raw = os.environ.get('GEMINI_API_Key2') or ""
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
        if not self.llm:
            return "Error: Gemini API key is not configured.", []
        try:
            # Build the human message content
            if image_data:
                # Encode image to base64
                encoded_image = base64.b64encode(image_data).decode("utf-8")

                # If no text query provided alongside image, use a default prompt
                text_part = query.strip() if query.strip() else "Please create a detailed exam preparation roadmap based on the schedule or syllabus shown in this image."

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
                # Text only - provide a default if empty to avoid API error
                human_content = query if query.strip() else "Hi, I need help planning my exams."

            messages = [
                SystemMessage(content="""You are an expert Exam Planner for Class 10 and Class 12 students preparing for their board exams.

YOUR BEHAVIOR:
- When a student says "Hi" or starts the conversation, greet them and ALWAYS ask BOTH of the following before making any plan:
  1. Their exam schedule (which exam on which date — ask them to list all subjects with dates)
  2. Their syllabus or pending topics for each subject (ask them to list what is left to study)
- Do NOT generate any plan until you have received BOTH the schedule AND the syllabus from the student.
- If the student uploads an image, carefully analyze it to extract dates, subjects, or syllabus topics.
- If either schedule or syllabus is missing after analyzing text/images, politely ask for the missing part before proceeding.

PLAN FORMAT (use this exact structure every time):
---
📅 EXAM PREPARATION ROADMAP
Student: [Class 10 / Class 12]
Total Days Available: [X days]

📌 OVERVIEW:
[Brief 2-line strategy based on the schedule]

🗓️ DAY-WISE PLAN:
Day 1 - [Date]: [Subject] — [Specific topics to cover] — [Time allocation]
Day 2 - [Date]: [Subject] — [Specific topics to cover] — [Time allocation]
... (continue for all days)

📚 SUBJECT-WISE PRIORITY ORDER:
1. [Subject] — [Reason: e.g., exam is earliest / most syllabus pending]
2. ...

⚠️ IMPORTANT TIPS:
- [2-3 practical revision tips based on the schedule]
---

STRICT CONSTRAINTS:
- Only help with exam planning for Class 10 and Class 12 board exam preparation.
- If the student asks anything unrelated (e.g., general questions, other topics), politely refuse and say:
  "I'm your Board Exam Planner for Class 10 and 12. Please share your exam schedule and syllabus so I can build your roadmap."
- Always strictly follow the student's given schedule. Never suggest studying a subject on its exam date.
- Distribute topics evenly and realistically — do not overload any single day.
- Think through the schedule and syllabus carefully before generating the roadmap."""),
                HumanMessage(content=human_content)
            ]
            response = self.llm.invoke(messages)
            return response.content, []
        except Exception as e:
            return f"Error: {e}", []

worker = ExamPlannerWorker()