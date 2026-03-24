"""
rule_engine.py — Deterministic rule engine for distraction archetype classification.

This is NOT an ML model — it's a hand-crafted priority table that maps
(predicted_cause, risk_score, session_duration, hw_grade) to an archetype.
The archetype then determines which FAISS query to run and what kind
of suggestions the LLM should generate.

CRITICAL: The rule engine's professional_referral decision ALWAYS overrides
the LLM's output. The LLM may hallucinate referral recommendations —
we trust only the deterministic rules.

Priority table (highest priority first — first match wins):
  1. risk > 0.75 AND streak > 7 days       → PERSISTENT_ADHD_RISK, referral=True
  2. fatigue AND risk > 0.5 AND session > 90min → SUSTAINED_FATIGUE_HIGH_RISK
  3. difficulty AND hw_grade < 8            → SUBJECT_DIFFICULTY_STRUGGLE
  4. fatigue AND risk < 0.5                 → SIMPLE_FATIGUE
  5. environment                            → ENVIRONMENTAL_DISTRACTION
  6. difficulty                             → CONTENT_DIFFICULTY
  7. fallback                               → GENERAL_DISTRACTION

TODO Day 5: Implement classify_archetype(student_context) → Archetype dataclass
"""


async def classify_archetype(student_context: dict) -> dict:
    """Stub — returns a placeholder archetype. TODO Day 5."""
    # TODO Day 5: implement the 7-branch priority table above
    return {
        "archetype": "GENERAL_DISTRACTION",
        "professional_referral": False,
        "urgency": "low",
    }
