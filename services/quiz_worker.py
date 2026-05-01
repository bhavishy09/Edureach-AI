import os
import json
import re
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()


class QuizWorker:
    def __init__(self):
        api_key_raw = os.environ.get('GEMINI_API_Key4') or ""
        self.api_key = api_key_raw.strip('"').strip("'")
        if self.api_key:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=self.api_key,
                temperature=0.7
            )
        else:
            self.llm = None

    def generate_quiz(self, topic: str, grade: str, difficulty: str, question_types: list, num_questions: int = 10):
        """
        Generates a quiz using Gemini AI.

        Args:
            topic          : The subject topic (e.g., "Photosynthesis")
            grade          : The class level (e.g., "Class 10")
            difficulty     : "Easy", "Medium", "Hard", or "Mixed (Adaptive)"
            question_types : List of types e.g. ["mcq", "true_false", "short_answer"]
            num_questions  : Number of questions to generate (default 10)

        Returns:
            list of question dicts, or dict with "error" key on failure.
        """
        if not self.llm:
            return {"error": "Gemini API key (GEMINI_API_Key4) is not configured."}

        types_str = ", ".join(question_types) if question_types else "mcq"

        system_prompt = """You are an expert teacher and quiz creator for CBSE Indian school students.

Generate a quiz strictly based on the given topic, grade, and difficulty.
Output ONLY a valid JSON array. No explanation, no markdown, no extra text.

Each question object must follow this exact format:
{
  "id": 1,
  "type": "mcq" | "true_false" | "short_answer" | "fill_blank",
  "question": "Question text here",
  "options": ["A", "B", "C", "D"],
  "correct_answer": "correct option or answer text",
  "explanation": "brief explanation of why this is correct"
}

Rules:
- Generate exactly [NUM_QUESTIONS] questions
- Mix question types as requested: [TYPES]
- Match difficulty: Easy = direct facts, Medium = application, Hard = analysis and reasoning
- All content must be strictly from NCERT CBSE syllabus
- correct_answer for MCQ must exactly match one of the options
- For true_false, options must always be ["True", "False"]
- For short_answer and fill_blank, omit the "options" field entirely
- Return ONLY the JSON array, nothing else""".replace(
            "[NUM_QUESTIONS]", str(num_questions)
        ).replace(
            "[TYPES]", types_str
        )

        user_prompt = (
            f"Topic: {topic}\n"
            f"Grade: {grade}\n"
            f"Difficulty: {difficulty}\n"
            f"Question Types: {types_str}\n"
            f"Number of Questions: {num_questions}\n\n"
            f"Generate the quiz now. Return only the JSON array."
        )

        try:
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt)
            ]
            response = self.llm.invoke(messages)
            raw = response.content
            if isinstance(raw, list):
                raw = raw[0].get("text", "") if isinstance(raw[0], dict) else str(raw[0])
            raw = raw.strip()

            # Strip markdown code fences if model adds them
            if raw.startswith("```"):
                raw = re.sub(r"^```[a-zA-Z]*\n?", "", raw)
                raw = re.sub(r"\n?```$", "", raw)
                raw = raw.strip()

            questions = json.loads(raw)
            if not isinstance(questions, list):
                return {"error": "Gemini returned invalid format — expected a JSON array."}

            return questions

        except json.JSONDecodeError as e:
            return {"error": f"Failed to parse quiz JSON: {str(e)}"}
        except Exception as e:
            return {"error": str(e)}


worker = QuizWorker()
