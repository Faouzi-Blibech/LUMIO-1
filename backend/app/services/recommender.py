"""
recommender.py — Full suggestion generation pipeline.

This service orchestrates the entire flow from distraction detection
to actionable, clinically-grounded suggestions for each role.

The 9-step pipeline:
  Step 1: rule_engine.classify_archetype() → archetype
  Step 2: FAISS cosine search with archetype seed → top-4 chunks
  Step 3: Build LangChain prompt (SYSTEM + student_context + RAG chunks)
  Step 4: LLM call (Ollama local or Groq cloud depending on LLM_PROVIDER)
  Step 5: Pydantic validation of JSON output
  Step 6: Grounding check — keyword overlap suggestion vs chunks
  Step 7: Diagnosis filter — regex: ADHD|disorder|diagnosis|condition|autism
          If found → regenerate with stricter prompt (max 2 retries)
  Step 8: professional_referral = rule_engine value (LLM value DISCARDED)
  Step 9: Store in adhd_risk_profiles.suggested_actions

CRITICAL SAFETY RULES:
  - Parent API NEVER receives risk_score
  - LLM NEVER sets professional_referral — only the rule engine can
  - Diagnosis language is always filtered out of suggestions

TODO Day 7: Implement generate_suggestions(student_id) → SuggestedActions
"""


async def generate_suggestions(student_id: str) -> dict:
    """Stub — returns a placeholder. TODO Day 7."""
    # TODO Day 7: implement the full 9-step pipeline above
    return {
        "for_teacher": [],
        "for_student": [],
        "for_parent": [],
        "sources": [],
        "urgency": "low",
    }
