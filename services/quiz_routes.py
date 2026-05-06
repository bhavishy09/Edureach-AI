import os
from datetime import datetime
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────
# Firebase Admin SDK Initialisation
# ─────────────────────────────────────────
import firebase_admin
from firebase_admin import credentials, firestore as admin_firestore
import os

import json

# Only initialize if not already initialized
if not firebase_admin._apps:
    firebase_json = os.environ.get('FIREBASE_SERVICE_ACCOUNT')
    if firebase_json:
        # For Render deployment
        try:
            cred_dict = json.loads(firebase_json)
            cred = credentials.Certificate(cred_dict)
        except Exception as e:
            print(f"Error parsing FIREBASE_SERVICE_ACCOUNT: {e}")
            # Fallback to file just in case
            cred = credentials.Certificate(
                os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
            )
    else:
        # Local development
        cred = credentials.Certificate(
            os.path.join(os.path.dirname(__file__), 'serviceAccountKey.json')
        )
    firebase_admin.initialize_app(cred)

db = admin_firestore.client()

# ─────────────────────────────────────────
# Quiz Worker
# ─────────────────────────────────────────
from services.quiz_worker import worker as quiz_worker

quiz_bp = Blueprint('quiz', __name__)


# ─────────────────────────────────────────
# Route 1 — Generate Quiz (AI)
# ─────────────────────────────────────────
@quiz_bp.route('/api/quiz/generate', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    topic = data.get('topic', '').strip()
    grade = data.get('grade', 'Class 10').strip()
    difficulty = data.get('difficulty', 'Medium').strip()
    question_types = data.get('question_types', ['mcq'])
    num_questions = int(data.get('num_questions', 10))

    if not topic:
        return jsonify({'error': 'Topic is required'}), 400

    result = quiz_worker.generate_quiz(topic, grade, difficulty, question_types, num_questions)

    if isinstance(result, dict) and 'error' in result:
        return jsonify(result), 500

    return jsonify({'questions': result}), 200


# ─────────────────────────────────────────
# Route 2 — Post Quiz to Firestore
# ─────────────────────────────────────────
@quiz_bp.route('/api/quiz/post', methods=['POST'])
def post_quiz():
    data = request.get_json()
    title = data.get('title', '').strip()
    topic = data.get('topic', '').strip()
    grade = data.get('grade', '').strip()
    difficulty = data.get('difficulty', '').strip()
    questions = data.get('questions', [])
    due_date = data.get('due_date', '')
    posted_by = data.get('posted_by', 'teacher')

    if not title or not questions:
        return jsonify({'error': 'Title and questions are required'}), 400

    doc_ref = db.collection('quizzes').document()
    doc_ref.set({
        'title': title,
        'topic': topic,
        'grade': grade,
        'difficulty': difficulty,
        'questions': questions,
        'due_date': due_date,
        'posted_by': posted_by,
        'status': 'active',
        'created_at': admin_firestore.SERVER_TIMESTAMP
    })

    return jsonify({'quiz_id': doc_ref.id, 'message': 'Quiz posted successfully'}), 200


# ─────────────────────────────────────────
# Route 3 — Submit Quiz (Student)
# ─────────────────────────────────────────
@quiz_bp.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    quiz_id = data.get('quiz_id', '').strip()
    student_id = data.get('student_id', '').strip()
    student_name = data.get('student_name', 'Student').strip()
    answers = data.get('answers', {})  # {question_id: student_answer}

    if not quiz_id or not student_id:
        return jsonify({'error': 'quiz_id and student_id are required'}), 400

    # Fetch the quiz
    quiz_doc = db.collection('quizzes').document(quiz_id).get()
    if not quiz_doc.exists:
        return jsonify({'error': 'Quiz not found'}), 404

    quiz = quiz_doc.to_dict()
    questions = quiz.get('questions', [])
    total = len(questions)
    correct_count = 0
    results = []

    for q in questions:
        q_id = str(q.get('id'))
        student_ans = answers.get(q_id, '').strip().lower()
        correct_ans = q.get('correct_answer', '').strip().lower()
        is_correct = student_ans == correct_ans

        if is_correct:
            correct_count += 1

        results.append({
            'question': q.get('question'),
            'type': q.get('type'),
            'options': q.get('options', []),
            'student_answer': answers.get(q_id, ''),
            'correct_answer': q.get('correct_answer'),
            'explanation': q.get('explanation', ''),
            'is_correct': is_correct
        })

    score = round((correct_count / total * 100), 1) if total > 0 else 0

    # Save result to Firestore
    result_doc = {
        'quiz_id': quiz_id,
        'quiz_title': quiz.get('title', ''),
        'student_id': student_id,
        'student_name': student_name,
        'answers': answers,
        'score': score,
        'total_questions': total,
        'correct_count': correct_count,
        'submitted_at': admin_firestore.SERVER_TIMESTAMP
    }
    db.collection('quiz_results').add(result_doc)

    return jsonify({
        'score': score,
        'total_questions': total,
        'correct_count': correct_count,
        'results': results
    }), 200


# ─────────────────────────────────────────
# Route 3.5 — Get All Quizzes (Teacher view)
# ─────────────────────────────────────────
@quiz_bp.route('/api/quiz/all', methods=['GET'])
def get_all_quizzes():
    quizzes_ref = db.collection('quizzes').order_by('created_at', direction=admin_firestore.Query.DESCENDING)
    docs = quizzes_ref.stream()
    quizzes = []

    for doc in docs:
        q = doc.to_dict()
        quizzes.append({
            'quiz_id': doc.id,
            'title': q.get('title'),
            'topic': q.get('topic'),
            'grade': q.get('grade'),
            'difficulty': q.get('difficulty'),
            'status': q.get('status', 'active'),
            'due_date': q.get('due_date'),
            'posted_by': q.get('posted_by'),
            'question_count': len(q.get('questions', [])),
            'created_at': q.get('created_at')
        })

    return jsonify({'quizzes': quizzes}), 200


# ─────────────────────────────────────────
# Route 4 — Get Assignments (Student view)
# ─────────────────────────────────────────
@quiz_bp.route('/api/quiz/assignments/<student_grade>', methods=['GET'])
def get_assignments(student_grade):
    # Normalise grade string for matching
    grade_clean = student_grade.replace('-', ' ').strip()

    quizzes_ref = db.collection('quizzes') \
        .where('status', '==', 'active') \
        .where('grade', '==', grade_clean)

    docs = quizzes_ref.stream()
    quizzes = []

    for doc in docs:
        q = doc.to_dict()
        # Strip answer + explanation from each question before sending to student
        safe_questions = []
        for question in q.get('questions', []):
            safe_q = {
                'id': question.get('id'),
                'type': question.get('type'),
                'question': question.get('question'),
                'options': question.get('options', [])
            }
            safe_questions.append(safe_q)

        quizzes.append({
            'quiz_id': doc.id,
            'title': q.get('title'),
            'topic': q.get('topic'),
            'grade': q.get('grade'),
            'difficulty': q.get('difficulty'),
            'due_date': q.get('due_date'),
            'posted_by': q.get('posted_by'),
            'question_count': len(safe_questions),
            'questions': safe_questions
        })

    return jsonify({'quizzes': quizzes}), 200


# ─────────────────────────────────────────
# Route 5 — Get Student Results
# ─────────────────────────────────────────
@quiz_bp.route('/api/quiz/result/<student_id>', methods=['GET'])
def get_student_results(student_id):
    results_ref = db.collection('quiz_results') \
        .where('student_id', '==', student_id) \
        .order_by('submitted_at', direction=admin_firestore.Query.DESCENDING)

    docs = results_ref.stream()
    results = []

    for doc in docs:
        r = doc.to_dict()
        submitted_at = r.get('submitted_at')
        results.append({
            'result_id': doc.id,
            'quiz_id': r.get('quiz_id'),
            'quiz_title': r.get('quiz_title', ''),
            'score': r.get('score'),
            'total_questions': r.get('total_questions'),
            'correct_count': r.get('correct_count'),
            'submitted_at': submitted_at.isoformat() if hasattr(submitted_at, 'isoformat') else str(submitted_at)
        })

    return jsonify({'results': results}), 200
