"""
rag_service.py — FAISS vector store + retrieval service.

Day 5 scope:
  - init_rag()    — load FAISS index at FastAPI startup
  - retrieve()    — cosine similarity search → top-k relevant PDF chunks
  - is_index_loaded() — health check

Day 6 will add:
  - get_llm()     — return ChatOllama or ChatGroq based on LLM_PROVIDER setting
  - query_rag()   — FAISS retrieval + LangChain prompt + LLM generation

Why split retrieval (Day 5) from generation (Day 6)?
  FAISS retrieval is fast, deterministic, and testable without any API keys.
  LLM generation requires Ollama running locally or a Groq API key.
  Splitting lets us validate the retrieval pipeline today before adding the LLM.

LLM provider pattern (for Day 6 reference):
  settings.LLM_PROVIDER = "ollama" → ChatOllama(base_url=OLLAMA_BASE_URL, model=OLLAMA_MODEL)
  settings.LLM_PROVIDER = "groq"   → ChatGroq(api_key=GROQ_API_KEY, model=GROQ_MODEL)
  Swap with a single .env change — no code change needed.
"""
from pathlib import Path
from typing import List, Optional

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings

from app.config import settings

# ── Global state — initialized once at startup ────────────────────────────────
_vectorstore: Optional[FAISS] = None
_embeddings: Optional[HuggingFaceEmbeddings] = None

# Path resolution:
# __file__ = /app/app/services/rag_service.py (inside Docker)
# .parent.parent.parent = /app (container root = ./backend on host)
# faiss_index/ is at ./backend/../faiss_index = project root/faiss_index
# The docker-compose volume mounts ./faiss_index → /app/faiss_index
FAISS_INDEX_PATH = Path(__file__).parent.parent.parent / "faiss_index"

# all-MiniLM-L6-v2: small (22M params), fast, free, runs on CPU, 384-dim embeddings.
# Pre-downloaded into the container image — no internet needed at runtime.
EMBEDDING_MODEL = "all-MiniLM-L6-v2"


# ── Startup ───────────────────────────────────────────────────────────────────

async def init_rag() -> None:
    """
    Load the FAISS index at FastAPI startup.
    Called from main.py lifespan function after init_db() and init_redis().

    Loading the embedding model takes ~3-5 seconds on first run (downloads
    the model weights if not cached). Subsequent startups use the local cache.

    If the index file doesn't exist (e.g. before running ingest_kb.py),
    logs a warning but does NOT crash — the API still starts normally.
    retrieve() will return empty lists until the index is built.
    """
    global _vectorstore, _embeddings

    # Initialize the embedding model — same model used during ingest_kb.py
    # Must match exactly or similarity scores will be meaningless
    _embeddings = HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )

    index_file = FAISS_INDEX_PATH / "index.faiss"
    if index_file.exists():
        # allow_dangerous_deserialization=True is required for FAISS pickle loading.
        # Safe here because we built the index ourselves from known PDFs.
        _vectorstore = FAISS.load_local(
            str(FAISS_INDEX_PATH),
            _embeddings,
            allow_dangerous_deserialization=True,
        )
        print(f"[rag] FAISS index loaded from {FAISS_INDEX_PATH}")
    else:
        print(f"[rag] WARNING: No FAISS index at {FAISS_INDEX_PATH}")
        print("[rag] Run: python scripts/ingest_kb.py to build the index")
        print("[rag] RAG retrieval will return empty results until then")


# ── Retrieval ─────────────────────────────────────────────────────────────────

def retrieve(query: str, k: int = 4) -> List[dict]:
    """
    Search the FAISS index for the top-k most relevant document chunks.

    How FAISS similarity search works:
      1. The query string is embedded into a 384-dim vector using all-MiniLM-L6-v2
      2. FAISS computes cosine similarity between the query vector and all stored vectors
      3. Returns the k documents with highest similarity scores

    Args:
        query: natural language search string (usually the archetype RAG seed)
        k:     number of chunks to return (default 4)

    Returns:
        List of dicts: [{"content": "...", "source": "filename.pdf"}, ...]
        Returns [] if index is not loaded yet — safe to call before ingest.
    """
    if _vectorstore is None:
        print("[rag] WARNING: FAISS index not loaded — returning empty results")
        return []

    docs = _vectorstore.similarity_search(query, k=k)
    return [
        {
            "content": doc.page_content,
            "source":  doc.metadata.get("source", "unknown"),
        }
        for doc in docs
    ]


# ── Health check ──────────────────────────────────────────────────────────────

def is_index_loaded() -> bool:
    """Return True if the FAISS index is loaded and ready for retrieval."""
    return _vectorstore is not None


# ── LLM factory (stub — Day 6) ────────────────────────────────────────────────

def get_llm():
    """
    Return the configured LLM instance.
    Day 6 will implement this — stub kept here so Day 6 can fill it in
    without changing the function signature or import structure.

    Day 6 implementation:
        if settings.LLM_PROVIDER == "groq":
            from langchain_groq import ChatGroq
            return ChatGroq(api_key=settings.GROQ_API_KEY, model=settings.GROQ_MODEL)
        else:
            from langchain_community.chat_models import ChatOllama
            return ChatOllama(base_url=settings.OLLAMA_BASE_URL, model=settings.OLLAMA_MODEL)
    """
    return None


# ── RAG query (stub — Day 6) ──────────────────────────────────────────────────

async def query_rag(role: str, message: str, student_context: dict | None = None) -> dict:
    """
    Retrieve relevant chunks + generate a grounded LLM response.
    Day 6 will implement this using get_llm() + retrieved chunks.
    """
    return {
        "answer": "RAG generation not yet implemented — coming Day 6.",
        "sources": [],
    }
