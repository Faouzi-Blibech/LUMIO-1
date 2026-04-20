"""
rag_service.py — FAISS vector store + retrieval + Groq LLM generation.

Day 5: init_rag(), retrieve(), is_index_loaded()
Day 6: get_llm(), query_rag() — FAISS → Groq → grounded JSON response

Why split retrieval (Day 5) from generation (Day 6)?
  FAISS retrieval is deterministic and testable without any API keys.
  Adding LLM generation on top is a separate concern with its own failure modes.
"""
from pathlib import Path
from typing import List, Optional
import json
import re

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage, SystemMessage

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


# ── Diagnosis safety filter ───────────────────────────────────────────────────
# The LLM must never use clinical labels — these words trigger a regeneration.
DIAGNOSIS_BLACKLIST = re.compile(
    r"\b(ADHD|disorder|diagnosis|condition|autism)\b", re.IGNORECASE
)

# ── Audience-specific system prompts ─────────────────────────────────────────
_SHARED_RULES = (
    "Never state or imply a clinical diagnosis. Do not use the words: ADHD, disorder, "
    "diagnosis, condition, autism. Describe observable patterns instead (e.g. 'difficulty "
    "sustaining attention', 'challenges with focus'). "
    "If the question is vague, you may ask a clarifying follow-up question inside the summary. "
    "When retrieved context is relevant, weave it in naturally (e.g. 'based on current "
    "learning-support guidelines...'). If the provided context does not cover the question, "
    "still answer from general evidence-based knowledge rather than refusing. "
    "Tone: warm, professional, supportive — never robotic or clinical. "
    "The `summary` field should be a rich, well-structured answer (multi-paragraph when warranted); "
    "use short paragraphs, and bullet points via '- ' when listing steps. "
    "Output valid JSON only — no markdown fences, no prose outside the JSON."
)

SYSTEM_PROMPTS = {
    "teacher": (
        "You are a knowledgeable pedagogical assistant supporting teachers of students with "
        "attention and learning difficulties. Provide detailed, actionable guidance on classroom "
        "strategies, accommodations, interpreting student data, and intervention planning. "
        "Elaborate thoroughly when the question warrants depth — multi-paragraph answers are welcome. "
        + _SHARED_RULES
    ),
    "parent": (
        "You are a warm, experienced advisor helping parents support a child who struggles with "
        "focus and learning. Cover home routines, communication with the school, and ways to "
        "understand the child's patterns. Use accessible language — avoid jargon, and when a "
        "technical term is unavoidable, explain it briefly. Elaborate when the parent needs depth. "
        + _SHARED_RULES
    ),
    "student": (
        "You are an encouraging learning companion for a student aged 10-18. Share study tips, "
        "focus strategies, and self-regulation techniques in an age-appropriate, motivating tone. "
        "Keep answers concise but complete — enough to actually help, without overwhelming. "
        + _SHARED_RULES
    ),
}

# Per-audience generation budget (Groq max_tokens for the response).
MAX_TOKENS_BY_AUDIENCE = {
    "teacher": 2048,
    "parent":  2048,
    "student": 1024,
}

OUTPUT_SCHEMA = """{
  "summary": "A thorough, well-structured answer to the user's question. May span multiple paragraphs and use '- ' bullet points where helpful.",
  "for_teacher": ["concrete classroom strategy", "..."],
  "for_student": ["practical tip for the student", "..."],
  "for_parent": ["practical guidance for the parent", "..."],
  "sources": ["source filename 1", "..."],
  "urgency": "low|medium|high",
  "professional_referral": false
}"""

# Served when the LLM fails twice — always safe, never empty.
STATIC_FALLBACK = {
    "summary": "Student needs support — please check in with them.",
    "for_teacher": [
        "Check in with the student privately.",
        "Break the current task into smaller steps.",
        "Consider a short break.",
    ],
    "for_student": [
        "Take a short break and drink some water.",
        "Try focusing on one small task at a time.",
    ],
    "for_parent": [
        "Ask your child how their day went.",
        "Ensure they have a quiet space for homework.",
    ],
    "sources": [],
    "urgency": "low",
    "professional_referral": False,
}


# ── LLM factory ───────────────────────────────────────────────────────────────

def get_llm(max_tokens: int = 1024) -> ChatGroq:
    """
    Return a Groq LLM instance.
    Raises ValueError if the API key is missing so the developer gets a clear message.
    """
    if not settings.GROQ_API_KEY:
        raise ValueError(
            "GROQ_API_KEY is not set. "
            "Get a free key at https://console.groq.com then add it to .env"
        )
    return ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model=settings.GROQ_MODEL,
        temperature=0.7,
        max_tokens=max_tokens,
    )


def _parse_llm_json(raw: str) -> dict:
    """Strip markdown fences (```json ... ```) then parse JSON."""
    raw = re.sub(r"```json|```", "", raw).strip()
    return json.loads(raw)


# ── RAG query ─────────────────────────────────────────────────────────────────

async def query_rag(
    archetype: str,
    rag_query_seed: str,
    student_context: dict,
    professional_referral_override: bool,
    audience: str = "teacher",
    user_question: str | None = None,
) -> dict:
    """
    Full RAG pipeline: FAISS retrieval → Groq LLM → validated JSON.

    Two-strike loop:
      Strike 1: blacklisted word found → remind the LLM and retry once.
      Strike 2: any failure (parse error, blacklist again) → serve STATIC_FALLBACK.

    The professional_referral_override from the rule engine always wins — the
    LLM value is discarded. This is a hard safety requirement.
    """
    effective_question = (user_question or "").strip() or rag_query_seed
    retrieval_query = f"{effective_question}\n{rag_query_seed}".strip()
    chunks = retrieve(retrieval_query, k=4)
    context_text = "\n\n".join(
        f"[{c['source']}]\n{c['content']}" for c in chunks
    ) if chunks else "No specific context available."

    student_info = (
        f"Student: {student_context.get('full_name', 'Unknown')}, "
        f"avg focus (7d): {student_context.get('avg_focus_7d', 'N/A')}, "
        f"distraction cause: {student_context.get('distraction_cause', archetype)}"
    )

    user_message = (
        f"Question: {effective_question}\n\n"
        f"Archetype: {archetype}\n"
        f"Student info: {student_info}\n\n"
        f"Context:\n{context_text}\n\n"
        f"Answer the question above directly and specifically. "
        f"Output JSON matching this schema exactly:\n{OUTPUT_SCHEMA}"
    )

    llm = get_llm(max_tokens=MAX_TOKENS_BY_AUDIENCE.get(audience, 1024))
    strikes = 0
    result = None

    while strikes < 2:
        try:
            response = await llm.ainvoke([
                SystemMessage(content=SYSTEM_PROMPTS.get(audience, SYSTEM_PROMPTS["teacher"])),
                HumanMessage(content=user_message),
            ])
            parsed = _parse_llm_json(response.content)

            if DIAGNOSIS_BLACKLIST.search(json.dumps(parsed)):
                strikes += 1
                user_message += "\nReminder: Do NOT use ADHD, disorder, diagnosis, condition, or autism."
                continue

            result = parsed
            break

        except Exception as e:
            print(f"[rag] LLM call failed (strike {strikes + 1}): {e}")
            strikes += 1

    if result is None:
        result = STATIC_FALLBACK.copy()

    # Rule engine value always wins — LLM cannot override this
    result["professional_referral"] = professional_referral_override
    return result


# ── Index maintenance ─────────────────────────────────────────────────────────

def add_texts_to_index(chunks: list[str], source: str) -> int:
    """
    Add new text chunks to the live FAISS index and persist to disk.

    If the index isn't loaded yet (no index.faiss on disk), build a fresh one
    from the provided chunks using the already-initialized embeddings.
    """
    global _vectorstore, _embeddings

    if _embeddings is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name=EMBEDDING_MODEL,
            model_kwargs={"device": "cpu"},
            encode_kwargs={"normalize_embeddings": True},
        )

    metadatas = [{"source": source} for _ in chunks]

    if _vectorstore is None:
        _vectorstore = FAISS.from_texts(chunks, _embeddings, metadatas=metadatas)
    else:
        _vectorstore.add_texts(chunks, metadatas=metadatas)

    FAISS_INDEX_PATH.mkdir(parents=True, exist_ok=True)
    _vectorstore.save_local(str(FAISS_INDEX_PATH))
    return len(chunks)
