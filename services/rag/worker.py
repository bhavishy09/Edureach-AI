from dotenv import load_dotenv
import os
from pathlib import Path
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from google import genai

load_dotenv(Path(__file__).parent / ".env")
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    api_key = os.getenv("Gemini_API_Key")
client = genai.Client(api_key=api_key)

embedding_model = GoogleGenerativeAIEmbeddings(
    model="text-embedding-004",
    google_api_key=api_key
)

qdrant_host = os.getenv("QDRANT_HOST", "localhost")
qdrant_port = os.getenv("QDRANT_PORT", "6333")
collection_name = os.getenv("COLLECTION_NAME", "antigravity_books")

def get_vector_store():
    return QdrantVectorStore.from_existing_collection(
        embedding=embedding_model,
        url=f"http://{qdrant_host}:{qdrant_port}",
        collection_name=collection_name
    )

def process_query(user_query: str, page_context: str):
    print(f"Processing query: {user_query} for context: {page_context}")
    
    retrieved_context = ""
    sources = []
    
    try:
        vector_store = get_vector_store()
        search_result = vector_store.similarity_search(query=user_query, k=5)
        
        context_parts = []
        for result in search_result:
            source_file = result.metadata.get('source_file') or result.metadata.get('source', 'Unknown.pdf')
            # Extract filename from path if it's a path
            if '/' in source_file:
                source_file = source_file.split('/')[-1]
                
            page_number = result.metadata.get('page_number') or result.metadata.get('page', 'N/A')
            
            src_str = f"{source_file} — Page {page_number}"
            if src_str not in sources:
                sources.append(src_str)
                
            context_parts.append(f"Content: {result.page_content}\nSource: {src_str}")
            
        retrieved_context = "\n\n".join(context_parts)
    except Exception as e:
        print(f"Qdrant retrieval failed: {e}. Falling back to default Gemini generation.")
        retrieved_context = "No context retrieved. Fallback to general knowledge."

    if page_context == "doubt_solver":
        prompt = f"Act as a Doubt Solver. Explain simply with examples using this context: {retrieved_context}\n\nQuestion: {user_query}"
    elif page_context == "exam_planner":
        prompt = f"Act as an Exam Planner. Create a structured plan using this context: {retrieved_context}\n\nRequest: {user_query}"
    elif page_context == "short_notes":
        prompt = f"Act as a Short Notes Maker. Summarize into bullet points using this context: {retrieved_context}\n\nTopic: {user_query}"
    else:
        prompt = f"Using this context: {retrieved_context}\n\nAnswer the user: {user_query}"

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    print("\nResponse:")
    text_resp = response.text if response and hasattr(response, 'text') else ""
    print(text_resp)
    return text_resp, sources