from flask import Blueprint, request, jsonify
from services.modelclassifier import model_classifier

pyq_bp = Blueprint('pyq_bp', __name__)

@pyq_bp.route('/api/pyq/results', methods=['GET'])
def pyq_results():
    class_level = request.args.get('class_level')
    subject = request.args.get('subject')

    if not class_level or not subject:
        return jsonify({"error": "Missing class_level or subject"}), 400

    try:
        result = model_classifier.get_results(class_level, subject)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@pyq_bp.route('/api/pyq/available-subjects', methods=['GET'])
def pyq_available_subjects():
    subjects = [
        {"class_level": "10", "subject": "Science", "available": True},
        {"class_level": "10", "subject": "Math", "available": True},
        {"class_level": "12", "subject": "Physics", "available": True},
        {"class_level": "12", "subject": "Chemistry", "available": True}
    ]
    return jsonify(subjects), 200
