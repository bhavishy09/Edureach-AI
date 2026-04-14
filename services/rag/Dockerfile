FROM python:3.11-slim

WORKDIR /app

# Install dependencies
RUN pip install fastapi uvicorn pydantic python-dotenv langchain-community langchain-text-splitters langchain-qdrant langchain-google-genai google-genai pypdf qdrant-client

# Copy application files
COPY . .

# Run the API
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
