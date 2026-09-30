#!/usr/bin/env bash
# exit on error
set -o errexit

# Install python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Ensure static directory exists
mkdir -p static

# Build the React frontend only if BUILD_FRONTEND is explicitly set to true
if [ "$BUILD_FRONTEND" = "true" ]; then
    echo "Building React Frontend..."
    cd client
    npm install
    BUILD_OUT_DIR=../static npm run build
    cd ..
else
    echo "Frontend build skipped on Render (Frontend is hosted on Vercel)."
fi

echo "Build Complete!"
