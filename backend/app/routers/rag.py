"""
rag.py — RAG (Retrieval-Augmented Generation) router.

Each role gets their own endpoint because the system prompt, context,
and safety filters differ:
  - Teacher: sees risk_score, clinical detail, referral recommendations
  - Parent: sees child-friendly suggestions, NEVER risk_score
  - Student: sees study tips, motivational content

The LLM (Ollama local or Groq cloud) generates responses grounded
in clinical PDF chunks retrieved via FAISS similarity search.

TODO Day 6:
  POST /teacher  — {message, student_id?} → FAISS + Ollama/Groq → {answer, sources}
  POST /parent   — {message, student_id}  → FAISS + Ollama/Groq → {answer, sources}
  POST /student  — {message}              → FAISS + Ollama/Groq → {answer, sources}
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"message": "rag router working"}
