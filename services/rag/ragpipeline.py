from dotenv import load_dotenv
import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from google import genai

load_dotenv(Path(__file__).parent / ".env")
# Read from correct variable based on prompt or usual standard, fallback to 'GEMINI_API_KEY'
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    api_key = os.getenv("Gemini_API_Key")
client = genai.Client(api_key=api_key)

embedding_model = GoogleGenerativeAIEmbeddings(
    model="text-embedding-004",
    google_api_key=api_key
)

# ✅ Step 1: Automatically load ALL PDFs from the pdfs folder
pdf_folder = Path(__file__).parent / "pdfs"
pdf_files = list(pdf_folder.glob("*.pdf"))

print(f"Found {len(pdf_files)} PDFs: {[f.name for f in pdf_files]}")

# ✅ Step 2: Load all PDFs and collect docs
all_docs = []
for pdf_path in pdf_files:
    loader = PyPDFLoader(file_path=str(pdf_path))
    docs = loader.load()
    # Ensure metadata has source_file and page_number
    for doc in docs:
        doc.metadata["source_file"] = pdf_path.name
        doc.metadata["page_number"] = doc.metadata.get("page", 0) + 1 # PyPDF page is 0-indexed usually, but maybe not. Let's rely on standard
    all_docs.extend(docs)
    print(f"Loaded: {pdf_path.name} → {len(docs)} pages")

print(f"\nTotal pages loaded: {len(all_docs)}")

# ✅ Step 3: Chunking
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = text_splitter.split_documents(documents=all_docs)

# Add chunk_index
for i, chunk in enumerate(chunks):
    chunk.metadata["chunk_index"] = i

print(f"Total chunks created: {len(chunks)}")

# ✅ Step 4: Store in Qdrant
qdrant_host = os.getenv("QDRANT_HOST", "localhost")
qdrant_port = os.getenv("QDRANT_PORT", "6333")
collection_name = os.getenv("COLLECTION_NAME", "antigravity_books")

vector_store = QdrantVectorStore.from_documents(
    documents=chunks,
    embedding=embedding_model,
    url=f"http://{qdrant_host}:{qdrant_port}",
    collection_name=collection_name
)

print("\n✅ All PDFs inserted into vector database successfully!")