# EduReach AI - GenAI Education Platform 🎓

A comprehensive AI-powered educational platform designed for Class 10 and 12 students. It leverages Large Language Models (LLMs) and Data Analysis to provide personalized learning assistance, automated study planning, and real-time student performance tracking.

**Live Demo:** [https://edureach-ai-g0p0.onrender.com/](https://edureach-ai-g0p0.onrender.com/)

---

## Features 🚀

*   **Multi-modal Doubt Solver:** Students can ask questions via text or upload images of handwritten/printed problems for step-by-step AI solutions.
*   **AI Notes Summarizer:** Converts long study materials or images of notes into structured summaries, topic trees, and key exam points.
*   **Board Exam Planner:** Generates personalized, day-wise revision roadmaps based on the student's actual exam schedule and pending syllabus.
*   **Dynamic AI Quiz Engine:** Teachers can generate NCERT-aligned quizzes instantly on any topic with mixed question types (MCQ, T/F, Short Answer).
*   **PYQ Analysis:** Data-driven insights into chapter importance and "most repeated" questions from the last 10 years of board papers.
*   **Teacher Dashboard:** Real-time monitoring of class averages, top performers, and individual student progress.

---

## Tech Stack 🛠️

*   **Frontend:** React.js, Lucide-React, Firebase Auth (Google & Email/Password).
*   **Backend:** Python, Flask, LangChain.
*   **AI/LLM:** Google Gemini 1.5 Flash (Multi-modal).
*   **Database:** Firebase Firestore (NoSQL, Real-time).
*   **ML Analysis:** Scikit-learn, Pickle (for historical paper analysis).
*   **Deployment:** Render (Unified Flask + React build).

---

## Project Structure 📂

```text
.
├── app.py                # Flask entry point & API routing
├── api/                  # Vercel serverless functions (if applicable)
├── build.sh              # Unified build script for deployment
├── requirements.txt      # Python dependencies
├── services/             # Core Backend Logic
│   ├── doubtsolver.py    # Multi-modal AI Doubt Solver
│   ├── summarynotes.py   # AI Notes Processing
│   ├── examplanner.py    # AI Roadmap Generation
│   ├── quiz_worker.py    # AI Quiz Generation (JSON Prompting)
│   └── modelclassifier.py # ML Model loader for PYQ data
├── models/               # Pre-trained .pkl files for paper analysis
├── client/               # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/        # Student & Teacher Dashboards
│   │   ├── lib/          # Firebase & Firestore config
│   │   └── utils/        # Activity tracking & helpers
└── static/               # Production build output
```

---

## Installation & Setup ⚙️

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/bhavishy09/Edureach-AI.git
cd Edureach-AI
pip install -r requirements.txt
```

### 2. Setup Frontend
```bash
cd client
npm install
npm run build
cd ..
```

### 3. Environment Variables
Create a `.env` file in the root and add:
```env
GEMINI_API_Key1=your_key_here
VITE_FIREBASE_API_KEY=your_firebase_key
FIREBASE_SERVICE_ACCOUNT={"type": "service_account", ...}
```

### 4. Run Locally
```bash
python app.py
```
The app will be available at `http://localhost:5005`

---

## Database Schema 📊

### Users Collection
*   `uid`: Unique Auth ID
*   `name`: Full Name
*   `role`: "student" or "teacher"
*   `stats`: { `doubts_solved`, `notes_uploaded`, `quiz_avg` }

### Quiz Results Collection
*   `student_id`: Reference to user
*   `score`: Percentage obtained
*   `topic`: Subject/Chapter name
*   `timestamp`: When quiz was submitted

---

## AI Implementation Details 🧠

*   **RAG (Retrieval-Augmented Generation):** Used to ensure AI responses stay strictly within the NCERT syllabus boundaries.
*   **Structured JSON Output:** The Quiz Generator uses advanced prompting techniques to ensure 100% valid JSON responses for seamless UI integration.
*   **Multi-modal Vision:** Utilizes Gemini 1.5 Flash to process images of handwritten notes and math problems directly.
