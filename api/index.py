
import os
from flask import Flask, render_template, send_from_directory, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='static')
CORS(app)

# Basic configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-secret-key')

# Admin credentials from environment variables
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@edureach.ai')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123secure')

from services.doubtsolver import worker as doubtsolver_worker
from services.summarynotes import worker as summarynotes_worker
from services.examplanner import worker as examplanner_worker
from services.quiz_routes import quiz_bp
from services.pyq_routes import pyq_bp

WORKERS = {
    'doubt_solver': doubtsolver_worker,
    'short_notes': summarynotes_worker,
    'exam_planner': examplanner_worker
}

app.register_blueprint(quiz_bp)
app.register_blueprint(pyq_bp)

# ─────────────────────────────────────────
# API ROUTES
# ─────────────────────────────────────────

@app.route('/api/chat', methods=['POST'])
def chat_endpoint():
    data = request.get_json()
    query = data.get('query', '')
    page_context = data.get('page_context', '')
    images = data.get('images', [])

    image_data = None
    image_mime_type = "image/jpeg"
    
    if images and len(images) > 0:
        import base64
        first_image = images[0]
        # Format: data:image/png;base64,iVBORw0KGgo...
        if first_image.startswith('data:'):
            header, b64_data = first_image.split(',', 1)
            image_mime_type = header.split(';')[0].split(':')[1]
            image_data = base64.b64decode(b64_data)

    try:
        # Select the appropriate worker based on page_context
        worker = WORKERS.get(page_context)
        if not worker:
            return jsonify({'detail': f'Unknown page context: {page_context}'}), 400
        
        # Pass image data only to workers that support it
        if page_context in ['doubt_solver', 'short_notes', 'exam_planner']:
            response_text, sources = worker.process_query(
                query, 
                page_context, 
                image_data=image_data, 
                image_mime_type=image_mime_type
            )
        else:
            response_text, sources = worker.process_query(query, page_context)
            
        return jsonify({
            "response": response_text,
            "page_context": page_context,
            "sources": sources
        }), 200
    except Exception as e:
        return jsonify({'detail': str(e)}), 500

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Validate admin credentials against .env values.
    This is intentionally NOT stored in Firestore — 
    single hardcoded admin only.
    """
    data = request.get_json()
    email = data.get('email', '')
    password = data.get('password', '')

    if email == ADMIN_EMAIL and password == ADMIN_PASSWORD:
        return jsonify({
            'success': True,
            'message': 'Admin authenticated successfully',
            'role': 'admin'
        }), 200
    else:
        return jsonify({
            'success': False,
            'message': 'Invalid admin credentials'
        }), 401

# ─────────────────────────────────────────
# STATIC FILE SERVING
# ─────────────────────────────────────────

# Serve React static assets explicitly
@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('static/assets', path)

# Catch-all route to serve the React frontend for all paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    # Don't catch API routes
    if path.startswith('api/'):
        return jsonify({'error': 'Not found'}), 404
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5005)
  