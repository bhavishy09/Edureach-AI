from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import worker

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    query: str
    page_context: str

@app.post("/chat")
def chat_endpoint(req: ChatRequest):
    try:
        response_text, sources = worker.process_query(req.query, req.page_context)
        return {
            "response": response_text,
            "page_context": req.page_context,
            "sources": sources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
