import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder='static')

# Basic configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default-secret-key')

# Serve React static assets explicitly
@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('static/assets', path)

# Catch-all route to serve the React frontend for all paths
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
