"""
rag_service.py — RAG (Retrieval-Augmented Generation) service.

This is where the LLM lives. The key design decision:
  - Dev (local):  ChatOllama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL)
  - Prod (cloud): ChatGroq(api_key=settings.GROQ_API_KEY, model=settings.GROQ_MODEL)
  - Controlled by: settings.LLM_PROVIDER — set to "ollama" or "groq"

The LLM instance is created ONCE in this file. Every other service imports it.
To swap from Ollama to Groq for Railway deployment, just change LLM_PROVIDER in .env.

Pipeline:
  1. Load FAISS index (created by scripts/ingest_kb.py)
  2. Receive a query + student context
  3. FAISS cosine similarity search → top-4 relevant PDF chunks
  4. Build a LangChain prompt with system instructions + chunks + query
  5. LLM generates a grounded response
  6. Return {answer, sources} where sources cite the original PDFs

TODO Day 6: Implement get_llm(), query_rag(role, message, student_context)
"""


def get_llm():
    """
    Return the LLM instance based on LLM_PROVIDER setting.
    TODO Day 6: implement Ollama/Groq swap logic.
    """
    # TODO Day 6:
    # from app.config import settings
    # if settings.LLM_PROVIDER == "groq":
    #     from langchain_groq import ChatGroq
    #     return ChatGroq(api_key=settings.GROQ_API_KEY, model=settings.GROQ_MODEL)
    # else:
    #     from langchain_community.chat_models import ChatOllama
    #     return ChatOllama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL)
    pass


async def query_rag(role: str, message: str, student_context: dict | None = None) -> dict:
    """Stub — returns a placeholder response. TODO Day 6."""
    # TODO Day 6: implement FAISS search + LLM generation
    return {
        "answer": "RAG service not yet implemented.",
        "sources": [],
    }
