from dotenv import load_dotenv
import os
import time
import re
from pathlib import Path
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from google import genai

# Load the ROOT .env (two levels up from services/rag/)
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")
api_key = os.getenv("GEMINI_API_Key") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") 
safe_key = api_key if api_key else "MISSING_API_KEY"

# ── Tuning knobs ──────────────────────────────────────────
MAX_CHUNKS       = 2       # Only retrieve top-2 most relevant chunks (was 5)
MAX_CHUNK_CHARS  = 500     # Truncate each chunk to 500 chars max
MAX_CONTEXT_CHARS = 1200   # Hard cap on total context sent to Gemini
MAX_RESPONSE_TOKENS = 512  # Limit response length to save output tokens
# ──────────────────────────────────────────────────────────

def get_embedding_model():
    return GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-001",
        google_api_key=safe_key
    )

def get_genai_client():
    return genai.Client(api_key=safe_key)

qdrant_host = os.getenv("QDRANT_HOST", "localhost")
qdrant_port = os.getenv("QDRANT_PORT", "6333")
collection_name = os.getenv("COLLECTION_NAME", "antigravity_books")

def get_vector_store():
    return QdrantVectorStore.from_existing_collection(
        embedding=get_embedding_model(),
        url=f"http://{qdrant_host}:{qdrant_port}",
        collection_name=collection_name
    )

def process_query(user_query: str, page_context: str):
    print(f"Processing query: {user_query} for context: {page_context}")
    
    retrieved_context = ""
    sources = []
    
    try:
        vector_store = get_vector_store()
        # Only fetch top MAX_CHUNKS results (fewer = less tokens)
        search_result = vector_store.similarity_search(query=user_query, k=MAX_CHUNKS)
        
        context_parts = []
        for result in search_result:
            source_file = result.metadata.get('source_file') or result.metadata.get('source', 'Unknown.pdf')
            if '/' in source_file:
                source_file = source_file.split('/')[-1]
                
            page_number = result.metadata.get('page_number') or result.metadata.get('page', 'N/A')
            
            src_str = f"{source_file} — Page {page_number}"
            if src_str not in sources:
                sources.append(src_str)
            
            # Truncate each chunk to save tokens
            chunk_text = result.page_content[:MAX_CHUNK_CHARS]
            context_parts.append(f"{chunk_text}\n[Source: {src_str}]")
            
        retrieved_context = "\n\n".join(context_parts)
        # Hard cap on total context
        if len(retrieved_context) > MAX_CONTEXT_CHARS:
            retrieved_context = retrieved_context[:MAX_CONTEXT_CHARS] + "..."
    except Exception as e:
        print(f"Qdrant retrieval failed: {e}. Falling back to general knowledge.")
        retrieved_context = ""

    # Build concise prompts to minimize input tokens
    if page_context == "doubt_solver":
        prompt = f"""You are a helpful tutor. Using ONLY the context below, explain the answer simply with an example. Keep it concise (under 300 words).

Context:
{retrieved_context}

Question: {user_query}"""
    elif page_context == "exam_planner":
        prompt = f"""You are an exam planner. Using the context below, create a brief study plan. Keep it concise.

Context:
{retrieved_context}

Request: {user_query}"""
    elif page_context == "short_notes":
        prompt = f"""Summarize into short bullet-point notes (max 10 points) using the context below.

Context:
{retrieved_context}

Topic: {user_query}"""
    else:
        prompt = f"""Answer concisely using this context:
{retrieved_context}

Question: {user_query}"""

    print(f"  📊 Prompt length: {len(prompt)} chars | Chunks: {len(sources)}")

    text_resp = ""
    
    if safe_key == "MISSING_API_KEY":
        text_resp = "Hey there! I am missing my Gemini API Key. Please add `GEMINI_API_KEY=your_key` to the .env file in the root folder so I can answer your questions properly!"
        return text_resp, sources

    client = get_genai_client()
    
    for attempt in range(2):
        try:
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config={
                    "max_output_tokens": MAX_RESPONSE_TOKENS,
                    "temperature": 0.4,
                }
            )
            text_resp = response.text if response and hasattr(response, 'text') else ""
            if text_resp:
                print(f"\n✅ Response (gemini-2.5-flash, attempt {attempt+1}):")
                print(text_resp[:200])
                return text_resp, sources
        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
                delay_match = re.search(r'retry in ([\d.]+)s', err_str, re.IGNORECASE)
                wait_time = float(delay_match.group(1)) if delay_match else (2 ** attempt * 5)
                wait_time = min(wait_time, 20)
                print(f"  ⏳ Rate limited (attempt {attempt+1}). Waiting {wait_time:.1f}s...")
                time.sleep(wait_time)
                continue
            else:
                print(f"  ❌ Error: {e}")
                break
    
    text_resp = "I'm currently experiencing high demand. Please wait a moment and try again. (API rate limit reached)"
    print("\nAll models exhausted. Returning rate-limit message.")
    return text_resp, sources