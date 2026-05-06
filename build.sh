#!/usr/bin/env bash
# exit on error
set -o errexit

# Install python dependencies
pip install -r requirements.txt

# Build the React frontend
echo "Building React Frontend..."
cd client
npm install
npm run build
cd ..

# Ensure static directory exists (where Flask serves from)
# Note: In your vite.config.js, the build.outDir should be ../static
echo "Build Complete!"
