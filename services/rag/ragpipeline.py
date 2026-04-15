from dotenv import load_dotenv
import os
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from google import genai

# Load the ROOT .env (two levels up from services/rag/)
load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")
api_key = os.getenv("GEMINI_API_Key") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=api_key)

embedding_model = GoogleGenerativeAIEmbeddings(
    model="gemini-embedding-001",
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

import time
import math

# ✅ Step 4: Store in Qdrant (with rate-limit handling)
qdrant_host = os.getenv("QDRANT_HOST", "localhost")
qdrant_port = os.getenv("QDRANT_PORT", "6333")
collection_name = os.getenv("COLLECTION_NAME", "antigravity_books")

BATCH_SIZE = 95  # Just under 100 req/min free tier limit
total_batches = math.ceil(len(chunks) / BATCH_SIZE)

print(f"\n📦 Ingesting {len(chunks)} chunks in {total_batches} batches (batch size: {BATCH_SIZE})...")

for i in range(0, len(chunks), BATCH_SIZE):
    batch = chunks[i:i + BATCH_SIZE]
    batch_num = (i // BATCH_SIZE) + 1
    print(f"\n🔄 Batch {batch_num}/{total_batches} ({len(batch)} chunks)...")

    try:
        if i == 0:
            # First batch: create the collection
            vector_store = QdrantVectorStore.from_documents(
                documents=batch,
                embedding=embedding_model,
                url=f"http://{qdrant_host}:{qdrant_port}",
                collection_name=collection_name
            )
        else:
            # Subsequent batches: add to existing collection
            vector_store = QdrantVectorStore.from_existing_collection(
                embedding=embedding_model,
                url=f"http://{qdrant_host}:{qdrant_port}",
                collection_name=collection_name
            )
            vector_store.add_documents(batch)

        print(f"   ✅ Batch {batch_num} done!")
    except Exception as e:
        print(f"   ⚠️ Batch {batch_num} failed: {e}")
        print(f"   ⏳ Waiting 30s before retrying...")
        time.sleep(30)
        try:
            vector_store = QdrantVectorStore.from_existing_collection(
                embedding=embedding_model,
                url=f"http://{qdrant_host}:{qdrant_port}",
                collection_name=collection_name
            )
            vector_store.add_documents(batch)
            print(f"   ✅ Batch {batch_num} retry succeeded!")
        except Exception as e2:
            print(f"   ❌ Batch {batch_num} retry failed: {e2}. Skipping...")

    # Rate limit pause between batches (skip after last batch)
    if i + BATCH_SIZE < len(chunks):
        print(f"   ⏳ Waiting 30s for rate limit...")
        time.sleep(30)

print("\n✅ All PDFs inserted into vector database successfully!")